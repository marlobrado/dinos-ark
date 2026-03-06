'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { dinos } from '@/public/images';

type Price = {
  'egg-pair': number;
  'egg-m-or-f': number;
  'baby-pair': number;
  'baby-m-or-f': number;
  'clone-m-or-f': number;
  'clone-pair': number;
};

type Variant = {
  variant: string;
  fotos: string;
};

type BuildData = {
  description: string;
  isEgg: boolean;
  price: Price;
  variantes: Variant[];
};

type Dino = {
  dino: string;
  capa?: string;
  builds: Record<string, BuildData>;
};

const typedDinos = dinos as unknown as Dino[];

/* ===============================
   Helpers
================================ */

// Safe DOM id
function toId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

// USD formatter ($7.00)
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Price labels (Egg vs Embryo)
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

// Stable price order
const priceOrder = [
  'egg-pair',
  'egg-m-or-f',
  'baby-pair',
  'baby-m-or-f',
  'clone-m-or-f',
  'clone-pair',
] as const;

/* ===============================
   Component
================================ */

export default function Home() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dinoIndex = useMemo(
    () =>
      typedDinos.map((d) => ({
        name: d.dino,
        id: toId(d.dino),
      })),
    []
  );

  const matches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return dinoIndex
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, dinoIndex]);

  function scrollToDino(targetId: string) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const headerOffset = 90;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY - headerOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (matches.length > 0) {
      scrollToDino(matches[0].id);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(11, 11, 15, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '12px 16px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <strong style={{ color: '#f5f5f7', fontSize: 18 }}>
            Dino Builds
          </strong>

          <form
            onSubmit={handleSubmit}
            style={{
              flex: '1 1 280px',
              minWidth: 240,
              position: 'relative',
            }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Search dino... (Enter to jump)"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.06)',
                color: '#f5f5f7',
                outline: 'none',
              }}
            />

            {isFocused && matches.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: 'rgba(18,18,22,0.98)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.55)',
                }}
              >
                {matches.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      scrollToDino(m.id);
                      setIsFocused(false);
                      inputRef.current?.blur();
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#f5f5f7',
                    }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main
        style={{
          padding: '18px 16px',
          maxWidth: 1100,
          margin: '0 auto',
          background: '#0e0e10',
          color: '#f5f5f7',
          minHeight: '100vh',
        }}
      >
        {typedDinos.map((dino) => {
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
                }}
              >
                {dino.dino}
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
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: 320,
                      borderRadius: 14,
                      overflow: 'hidden',
                      background: 'rgba(0,0,0,0.35)',
                      marginBottom: 18,
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
                      <h3 style={{ textTransform: 'capitalize' }}>
                        <strong>{buildKey}</strong>
                      </h3>

                      {/* Description */}
                      {buildData.description && (
                        <p
                          style={{
                            marginTop: 8,
                            color: '#c7c7cf',
                            fontSize: 14,
                          }}
                        >
                          <b className="font-bold">Description:</b>{' '}
                          {buildData.description}
                        </p>
                      )}

                      {/* Prices */}
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

                      {/* Variants */}
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
                              style={{
                                position: 'relative',
                                width: '100%',
                                height: 230,
                                borderRadius: 12,
                                overflow: 'hidden',
                                background: 'rgba(0,0,0,0.35)',
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
    </>
  );
}
