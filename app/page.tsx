'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
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

type ExpandedImage = {
  src: string;
  alt: string;
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
  const [activeDinoId, setActiveDinoId] = useState('');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<ExpandedImage | null>(
    null
  );
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

  useEffect(() => {
    if (!expandedImage && !isSummaryOpen) {
      document.body.style.overflow = '';
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (expandedImage) {
          setExpandedImage(null);
        }

        if (isSummaryOpen) {
          setIsSummaryOpen(false);
        }
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expandedImage, isSummaryOpen]);

  useEffect(() => {
    if (dinoIndex.length === 0) {
      return;
    }

    setActiveDinoId((currentId) => currentId || dinoIndex[0].id);

    const sections = dinoIndex
      .map((dino) => document.getElementById(dino.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveDinoId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-120px 0px -55% 0px',
        threshold: [0.15, 0.3, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [dinoIndex]);

  function scrollToDino(targetId: string) {
    const el = document.getElementById(targetId);
    if (!el) return;

    const headerOffset = 90;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY - headerOffset;

    setActiveDinoId(targetId);
    setIsSummaryOpen(false);
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
      {isSummaryOpen && (
        <div
          className="summary-modal-overlay"
          onClick={() => setIsSummaryOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 95,
            background: 'rgba(0,0,0,0.78)',
            padding: 16,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 'min(420px, 100%)',
              maxHeight: 'calc(100vh - 32px)',
              margin: '0 auto',
              background: 'rgba(18,18,22,0.98)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <strong style={{ color: '#f5f5f7', fontSize: 16 }}>
                Dinos List
              </strong>

              <button
                type="button"
                aria-label="Fechar sumario"
                onClick={() => setIsSummaryOpen(false)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontSize: 26,
                  lineHeight: 1,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                maxHeight: 'calc(100vh - 110px)',
                overflowY: 'auto',
              }}
            >
              {dinoIndex.map((dino) => {
                const isActive = activeDinoId === dino.id;

                return (
                  <button
                    key={dino.id}
                    type="button"
                    onClick={() => scrollToDino(dino.id)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: isActive
                        ? '1px solid rgba(255,255,255,0.28)'
                        : '1px solid rgba(255,255,255,0.10)',
                      background: isActive
                        ? 'rgba(255,255,255,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.82)',
                    }}
                  >
                    {dino.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.86)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <button
            type="button"
            aria-label="Fechar imagem"
            onClick={() => setExpandedImage(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: 28,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>

          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(1100px, 100%)',
              height: 'min(80vh, 800px)',
            }}
          >
            <Image
              src={expandedImage.src}
              alt={expandedImage.alt}
              fill
              priority
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>
      )}

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
            maxWidth: 1360,
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

          <button
            type="button"
            onClick={() => setIsSummaryOpen(true)}
            className="summary-mobile-trigger"
          >
            Dinos List
          </button>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div
        className="page-shell"
        style={{
          padding: '18px 16px',
          maxWidth: 1360,
          margin: '0 auto',
          minHeight: '100vh',
        }}
      >
        <aside
          className="dino-summary"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 18,
            padding: 14,
          }}
        >
          <strong
            style={{
              display: 'block',
              color: '#f5f5f7',
              fontSize: 15,
              marginBottom: 12,
            }}
          >
            Dinos List
          </strong>

          <nav className="dino-summary-nav">
            {dinoIndex.map((dino) => {
              const isActive = activeDinoId === dino.id;

              return (
                <button
                  key={dino.id}
                  type="button"
                  onClick={() => scrollToDino(dino.id)}
                  className="summary-button"
                  style={{
                    border: isActive
                      ? '1px solid rgba(255,255,255,0.28)'
                      : '1px solid rgba(255,255,255,0.10)',
                    background: isActive
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.78)',
                    boxShadow: isActive
                      ? 'inset 0 0 0 1px rgba(255,255,255,0.06)'
                      : 'none',
                  }}
                >
                  {dino.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <main
          style={{
            background: '#0e0e10',
            color: '#f5f5f7',
            minWidth: 0,
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
      </div>

      <style jsx>{`
        .page-shell {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .dino-summary {
          position: sticky;
          top: 86px;
          max-height: calc(100vh - 106px);
          overflow-y: auto;
        }

        .summary-mobile-trigger {
          display: none;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: #f5f5f7;
          text-align: left;
          cursor: pointer;
        }

        .dino-summary-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .summary-button {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        @media (max-width: 960px) {
          .page-shell {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .dino-summary {
            display: none;
          }

          .summary-mobile-trigger {
            display: block;
            flex: 1 1 100%;
          }
        }
      `}</style>
    </>
  );
}
