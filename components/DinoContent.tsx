'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { Dino, ExpandedImage } from './types';

const priceOrder = [
  'egg-pair',
  'egg-m-or-f',
  'baby-pair',
  'baby-m-or-f',
  'clone-m-or-f',
  'clone-pair',
] as const;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function getPriceLabels(mode: 'Egg' | 'Embryo'): Record<string, string> {
  return {
    'egg-pair': `${mode} pair`,
    'egg-m-or-f': `${mode} M or F`,
    'baby-pair': 'Baby pair',
    'baby-m-or-f': 'Baby M or F',
    'clone-m-or-f': 'Clone M or F',
    'clone-pair': 'Clone pair',
  };
}

function getDinoDisplayName(dinoName: string): string {
  return dinoName.replace(/\s*\[[tfch\-oe]+\]\s*$/, '').trim();
}

function toId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

interface DinoContentProps {
  dinos: Dino[];
  setExpandedImage: Dispatch<SetStateAction<ExpandedImage | null>>;
}

export function DinoContent({ dinos, setExpandedImage }: DinoContentProps) {
  return (
    <main
      style={{
        background: '#0e0e10',
        color: '#f5f5f7',
        minWidth: 0,
      }}
    >
      {dinos.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
          No dinos found for this category.
        </p>
      )}

      {dinos.map((dino) => {
        const dinoId = toId(dino.dino);

        return (
          <section
            key={dino.dino}
            id={dinoId}
            style={{
              marginBottom: 36,
              paddingBottom: 20,
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h2
              style={{
                textTransform: 'capitalize',
                fontSize: 26,
                marginBottom: 10,
                fontFamily: 'var(--font-big-shoulders-stencil)',
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {getDinoDisplayName(dino.dino)}
            </h2>

            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 18,
                padding: 12,
              }}
            >
              {dino.capa && (
                <div
                  onClick={() =>
                    setExpandedImage({
                      src: dino.capa!,
                      alt: `${dino.dino} capa`,
                    })
                  }
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 320,
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.35)',
                    marginBottom: 18,
                    cursor: 'zoom-in',
                  }}
                >
                  <Image
                    src={dino.capa}
                    alt={`${dino.dino} capa`}
                    fill
                    style={{
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                </div>
              )}

              {Object.entries(dino.builds).map(([buildKey, buildData]) => {
                const labels = getPriceLabels(
                  buildData.isEgg ? 'Egg' : 'Embryo'
                );

                const pricedItems = priceOrder
                  .map((key) => [key, buildData.price[key]] as const)
                  .filter(([, value]) => value > 0);

                return (
                  <div
                    key={buildKey}
                    style={{
                      marginTop: 18,
                      paddingLeft: 14,
                      borderLeft: '3px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <h3
                      style={{
                        textTransform: 'capitalize',
                        fontFamily: 'var(--font-big-shoulders)',
                      }}
                    >
                      <strong>{buildKey}</strong>
                    </h3>

                    {buildData.description && (
                      <p
                        style={{
                          marginTop: 8,
                          color: '#c7c7cf',
                          fontSize: 14,
                        }}
                      >
                        <b>Description:</b> {buildData.description}
                      </p>
                    )}

                    {pricedItems.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <strong>Prices:</strong>
                        <ul style={{ marginTop: 6, color: '#c7c7cf' }}>
                          {pricedItems.map(([priceKey, priceValue]) => (
                            <li key={priceKey}>
                              {labels[priceKey]}:{' '}
                              <strong>{usd.format(priceValue)}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 14,
                        marginTop: 14,
                      }}
                    >
                      {buildData.variantes.map((variant) => (
                        <figure
                          key={`${buildKey}-${variant.variant}`}
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            borderRadius: 16,
                            padding: 10,
                          }}
                        >
                          <div
                            onClick={() =>
                              setExpandedImage({
                                src: variant.fotos,
                                alt: `${dino.dino} ${buildKey} ${variant.variant}`,
                              })
                            }
                            style={{
                              position: 'relative',
                              width: '100%',
                              height: 230,
                              borderRadius: 12,
                              overflow: 'hidden',
                              background: 'rgba(0,0,0,0.35)',
                              cursor: 'zoom-in',
                            }}
                          >
                            <Image
                              src={variant.fotos}
                              alt={`${dino.dino} ${buildKey} ${variant.variant}`}
                              fill
                              style={{
                                objectFit: 'contain',
                                objectPosition: 'center',
                              }}
                            />
                          </div>

                          <figcaption
                            style={{
                              textAlign: 'center',
                              marginTop: 8,
                              fontSize: 13,
                              color: 'rgba(255,255,255,0.70)',
                            }}
                          >
                            Variant: {variant.variant}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
