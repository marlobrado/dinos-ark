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

          <div
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
            Menu
          </button>
        </div>

        <style jsx>{`
          @media (max-width: 960px) {
            button:last-child {
              display: block !important;
            }
          }
        `}</style>
      </header>
    );
  }
);

Header.displayName = 'Header';
