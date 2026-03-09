export type Price = {
  'egg-pair': number;
  'egg-m-or-f': number;
  'baby-pair': number;
  'baby-m-or-f': number;
  'clone-m-or-f': number;
  'clone-pair': number;
};

export type Variant = {
  variant: string;
  fotos: string;
};

export type BuildData = {
  description: string;
  isEgg: boolean;
  diet: string;
  price: Price;
  variantes: Variant[];
};

export type Dino = {
  dino: string;
  capa?: string;
  builds: Record<string, BuildData>;
};

export type ExpandedImage = {
  src: string;
  alt: string;
};

export type DietFilter = 'all' | 'c' | 'h' | 'o' | 'e';
