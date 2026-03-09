'use client';

import {
  useRef,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  forwardRef,
} from 'react';
import { DietFilter } from './types';

type DinoIndexItem = {
  name: string;
  displayName: string;
  id: string;
};

const dietFilters: Array<{ id: DietFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'c', label: 'Carnivore' },
  { id: 'h', label: 'Herbivore' },
  { id: 'o', label: 'Omnivore' },
  { id: 'e', label: 'Special' },
];

interface HeaderProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  dietFilter: DietFilter;
  setDietFilter: Dispatch<SetStateAction<DietFilter>>;
  dinoIndex: DinoIndexItem[];
  onSelectDino: (dinoId: string) => void;
  setIsSummaryOpen: Dispatch<SetStateAction<boolean>>;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      query,
      setQuery,
      dietFilter,
      setDietFilter,
      dinoIndex,
      onSelectDino,
      setIsSummaryOpen,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const matches = useMemo(() => {
      const q = query.toLowerCase().trim();
      if (!q) return [];
      return dinoIndex
        .filter((d) => d.name.toLowerCase().includes(q))
        .slice(0, 8);
    }, [query, dinoIndex]);

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (matches.length > 0) {
        onSelectDino(matches[0].id);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }

    function handleSelectFilter(filterId: DietFilter) {
      setDietFilter(filterId);
      setIsFiltersOpen(false);
    }

    return (
      <header
        ref={ref}
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
        {/* Modal de filtros - mobile */}
        {isFiltersOpen && (
          <div
            onClick={() => setIsFiltersOpen(false)}
            className="filters-modal-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 95,
              background: 'rgba(0,0,0,0.78)',
              padding: 16,
              display: 'none',
            }}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                width: 'min(280px, 100%)',
                background: 'rgba(18,18,22,0.98)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                overflow: 'hidden',
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
                  Diet Filter
                </strong>
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(false)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.16)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontSize: 26,
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
                }}
              >
                {dietFilters.map((filter) => {
                  const isActive = dietFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleSelectFilter(filter.id)}
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
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            maxWidth: 1360,
            margin: '0 auto',
            padding: '10px 16px',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <strong
            style={{ color: '#f5f5f7', fontSize: 18, whiteSpace: 'nowrap' }}
          >
            DinoLand
          </strong>

          {/* Botão hamburger - mobile */}
          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className="hamburger-btn"
            style={{
              display: 'none',
              padding: '8px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#f5f5f7',
              cursor: 'pointer',
              fontSize: 18,
              width: 40,
              height: 40,
            }}
          >
            ☰
          </button>

          {/* Filtros de dieta - desktop */}
          <div
            className="diet-filters-desktop"
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {dietFilters.map((filter) => {
              const isActive = dietFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setDietFilter(filter.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: isActive
                      ? '1px solid rgba(255,255,255,0.30)'
                      : '1px solid rgba(255,255,255,0.12)',
                    background: isActive
                      ? 'rgba(255,255,255,0.14)'
                      : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.82)',
                    transition:
                      'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="search-form"
            style={{
              flex: '1 1 240px',
              marginLeft: 'auto',
              position: 'relative',
            }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Search..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.06)',
                color: '#f5f5f7',
                fontSize: 14,
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
                      onSelectDino(m.id);
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
                      fontSize: 14,
                    }}
                  >
                    {m.displayName}
                  </button>
                ))}
              </div>
            )}
          </form>

          <button
            type="button"
            onClick={() => setIsSummaryOpen(true)}
            className="dinos-list-btn"
            style={{
              display: 'none',
              padding: '8px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#f5f5f7',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Dinos List
          </button>
        </div>

        {/* Full width "Dinos List" button - mobile */}
        <button
          type="button"
          onClick={() => setIsSummaryOpen(true)}
          className="dinos-list-mobile"
          style={{
            display: 'none',
            width: '100%',
            padding: '8px 12px',
            borderRadius: 0,
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.10)',
            background: 'transparent',
            color: '#f5f5f7',
            cursor: 'pointer',
            fontSize: 14,
            margin: '10px 0 0 0',
          }}
        >
          Dinos List
        </button>

        <style jsx>{`
          .filters-modal-overlay {
            display: none;
          }

          .hamburger-btn {
            display: none !important;
          }

          .diet-filters-desktop {
            display: flex !important;
          }

          .dinos-list-btn {
            display: none !important;
          }

          .dinos-list-mobile {
            display: none !important;
          }

          @media (max-width: 960px) {
            .hamburger-btn {
              display: block !important;
              margin-left: 0;
            }

            .diet-filters-desktop {
              display: none !important;
            }

            .search-form {
              flex: 1 1 auto !important;
              margin-left: auto !important;
            }

            .dinos-list-btn {
              display: none !important;
            }

            .dinos-list-mobile {
              display: block !important;
            }

            .filters-modal-overlay {
              display: flex !important;
              align-items: flex-start;
              justify-content: flex-start;
              padding-top: 100px;
            }
          }
        `}</style>
      </header>
    );
  }
);

Header.displayName = 'Header';
