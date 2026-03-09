/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'images.js');
const METADATA_FILE = path.join(PUBLIC_DIR, 'images-metadata.json');
const COVER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

if (!fs.existsSync(ASSETS_DIR)) {
  console.error('Pasta não encontrada:', ASSETS_DIR);
  process.exit(1);
}

const allDinos = {};
let existingDinos = [];
let editableMetadata = {};

function getDefaultPrice() {
  return {
    'egg-pair': 0,
    'egg-m-or-f': 0,
    'baby-pair': 0,
    'baby-m-or-f': 0,
    'clone-m-or-f': 0,
    'clone-pair': 0,
  };
}

function normalizeBuildMeta(meta = {}) {
  return {
    description: typeof meta.description === 'string' ? meta.description : '',
    isEgg: Boolean(meta.isEgg),
    diet: typeof meta.diet === 'string' ? meta.diet : 'c',
    price: {
      ...getDefaultPrice(),
      ...(meta.price || {}),
    },
  };
}

// Carrega dados existentes se o arquivo já existe
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    const fileContent = fs.readFileSync(OUTPUT_FILE, 'utf-8');
    const match = fileContent.match(/export const dinos = (\[.*\]);/s);
    if (match) {
      existingDinos = JSON.parse(match[1]);
    }
  } catch (error) {
    console.warn('Aviso: Não foi possível ler dados existentes');
  }
}

if (fs.existsSync(METADATA_FILE)) {
  try {
    editableMetadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
  } catch (error) {
    console.warn('Aviso: Não foi possível ler images-metadata.json');
  }
}

function parseDinoFolderSuffix(folderName) {
  // Extrai [t-c] do nome da pasta como "dino name [t-c]"
  const match = folderName.match(/\[([tf])-([choe])\]$/);
  if (match) {
    const isEgg = match[1].toLowerCase() === 't';
    const diet = match[2].toLowerCase();
    return { isEgg, diet };
  }
  return null;
}

function parseFileName(fileName) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  const lastUnderscore = base.lastIndexOf('_');
  const before = lastUnderscore >= 0 ? base.slice(0, lastUnderscore) : null;
  const after = lastUnderscore >= 0 ? base.slice(lastUnderscore + 1) : base;

  const variantMatch = after.match(/\[([^\]]+)\]/);
  const variant = variantMatch ? variantMatch[1] : null;

  // Novo formato simples: [XX].png ou [XX].jpg
  // Não temos mais isEgg/diet no nome do arquivo
  const newFileName = `${after.toLowerCase()}${ext}`;

  return { before, after, variant, newFileName };
}

function isCoverImageFile(fileName) {
  return COVER_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function processFolder(
  folderPath,
  relativePath = '',
  topLevelDino = '',
  buildType = '',
  metadataAccumulator = {},
  dinoFolderName = ''
) {
  const items = fs.readdirSync(folderPath);
  const isDinoRootFolder = relativePath === topLevelDino && buildType === '';

  // Separa arquivos e pastas em um único passe de statSync
  const dirItems = items.map((item) => {
    const itemPath = path.join(folderPath, item);
    const stats = fs.statSync(itemPath);
    return { item, path: itemPath, isDir: stats.isDirectory() };
  });

  const coverFiles = dirItems.filter(
    (di) => !di.isDir && isCoverImageFile(di.item)
  );

  const pngFiles = dirItems.filter(
    (di) => !di.isDir && di.item.toLowerCase().endsWith('.png')
  );

  if (isDinoRootFolder && coverFiles.length > 0) {
    const sortedCoverFiles = [...coverFiles].sort((a, b) =>
      a.item.localeCompare(b.item)
    );
    const selectedCover = sortedCoverFiles[0];
    const coverPath = `/assets/${relativePath}/${selectedCover.item}`;

    if (!allDinos[topLevelDino]) {
      allDinos[topLevelDino] = {
        dino: topLevelDino,
        capa: coverPath,
        builds: {},
      };
    } else {
      allDinos[topLevelDino].capa = coverPath;
    }

    if (sortedCoverFiles.length > 1) {
      console.warn(
        `Aviso: Mais de uma capa encontrada em ${relativePath}. Usando ${selectedCover.item}.`
      );
    }

    console.log(`✓ ${relativePath} (capa: ${selectedCover.item})`);
  }

  // Processa arquivos PNG e renomeia
  const fileInfos = [];

  pngFiles
    .filter(() => !isDinoRootFolder)
    .forEach((di) => {
      const { before, variant, newFileName } = parseFileName(di.item);
      const newPath = path.join(folderPath, newFileName);

      if (di.item !== newFileName) {
        fs.renameSync(di.path, newPath);
      }

      fileInfos.push({
        before,
        variant,
        finalName: newFileName,
      });
    });

  // Agrupa imagens se houver
  if (fileInfos.length > 0) {
    const pathPrefix = relativePath ? `/assets/${relativePath}` : '/assets';

    const imagesArray = fileInfos
      .map((info) => ({
        variant: info.variant || '',
        fotos: `${pathPrefix}/${info.finalName}`,
      }))
      .sort((a, b) => a.fotos.localeCompare(b.fotos));

    // Inicializa o dinossauro se não existe
    if (!allDinos[topLevelDino]) {
      allDinos[topLevelDino] = {
        dino: topLevelDino,
        capa: undefined,
        builds: {},
      };
    }

    // Extrai isEgg e diet do nome da pasta do dino
    const dinoSuffix = parseDinoFolderSuffix(dinoFolderName);
    const isEggFromFolder = dinoSuffix?.isEgg ?? true;
    const dietFromFolder = dinoSuffix?.diet || 'c';

    // Adiciona o build com as imagens
    const existingDino = existingDinos.find((d) => d.dino === topLevelDino);
    const existingBuild = existingDino?.builds?.[buildType];
    const metadataBuild = editableMetadata?.[topLevelDino]?.[buildType];
    const fallbackBuild = normalizeBuildMeta({
      description: existingBuild?.description || '',
      isEgg: existingBuild?.isEgg,
      price: existingBuild?.price,
    });
    const currentBuildMeta = normalizeBuildMeta({
      ...fallbackBuild,
      ...metadataBuild,
      // Usa valores da pasta do dino
      isEgg:
        metadataBuild?.isEgg !== undefined
          ? metadataBuild.isEgg
          : isEggFromFolder,
      price: {
        ...fallbackBuild.price,
        ...(metadataBuild?.price || {}),
      },
      diet: dietFromFolder,
    });

    if (!metadataAccumulator[topLevelDino]) {
      metadataAccumulator[topLevelDino] = {};
    }
    metadataAccumulator[topLevelDino][buildType] = currentBuildMeta;

    allDinos[topLevelDino].builds[buildType] = {
      description: currentBuildMeta.description,
      isEgg: currentBuildMeta.isEgg,
      diet: currentBuildMeta.diet,
      price: currentBuildMeta.price,
      variantes: imagesArray,
    };

    console.log(
      `✓ ${relativePath} (${imagesArray.length} imagens no build "${buildType}", diet: ${dietFromFolder})`
    );
  }

  // Processa subpastas
  dirItems
    .filter((di) => di.isDir)
    .forEach((di) => {
      const newRelativePath = relativePath
        ? `${relativePath}/${di.item}`
        : di.item;
      const newBuildType = di.item;
      processFolder(
        di.path,
        newRelativePath,
        topLevelDino,
        newBuildType,
        metadataAccumulator,
        dinoFolderName
      );
    });
}

console.log('Iniciando renomeação e geração de arrays...\n');

const topFolders = fs.readdirSync(ASSETS_DIR);
const nextMetadata = {};

topFolders.forEach((folder) => {
  const folderPath = path.join(ASSETS_DIR, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    processFolder(folderPath, folder, folder, '', nextMetadata, folder);
  }
});

// Gera um único arquivo com todos os dinossauros organizados
const dinosArray = Object.values(allDinos);
const exportsContent = `export const dinos = ${JSON.stringify(dinosArray, null, 2)};`;

fs.writeFileSync(OUTPUT_FILE, exportsContent);
fs.writeFileSync(METADATA_FILE, `${JSON.stringify(nextMetadata, null, 2)}\n`);

console.log(`\n✓ Arquivo centralizado gerado: public/images.js`);
console.log(`✓ Metadados editáveis gerados: public/images-metadata.json`);
console.log(`✓ Concluído!`);
