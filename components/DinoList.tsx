'use client';

import { Dispatch, SetStateAction } from 'react';

type DinoIndexItem = {
  name: string;
  displayName: string;
  id: string;
};

interface DinoListProps {
  dinoIndex: DinoIndexItem[];
  activeDinoId: string;
  onSelectDino: (dinoId: string) => void;
  isSummaryOpen: boolean;
  setIsSummaryOpen: Dispatch<SetStateAction<boolean>>;
}

export function DinoList({
  dinoIndex,
  activeDinoId,
  onSelectDino,
  isSummaryOpen,
  setIsSummaryOpen,
}: DinoListProps) {
  return (
    <>
      {/* Modal para mobile */}
      {isSummaryOpen && (
        <div
          onClick={() => setIsSummaryOpen(false)}
          className="summary-modal-overlay"
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
                Dinos List
              </strong>
              <button
                type="button"
                onClick={() => setIsSummaryOpen(false)}
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
                maxHeight: 'calc(100vh - 110px)',
                overflowY: 'auto',
              }}
            >
              {dinoIndex.map((dino) => (
                <button
                  key={dino.id}
                  type="button"
                  onClick={() => {
                    onSelectDino(dino.id);
                    setIsSummaryOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 14,
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.82)',
                  }}
                >
                  {dino.displayName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside
        className="sidebar-aside"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 18,
          padding: 14,
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          pointerEvents: 'auto',
        }}
      >
        <strong style={{ color: '#f5f5f7', fontSize: 15 }}>Dinos List</strong>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            pointerEvents: 'auto',
            marginTop: 12,
          }}
        >
          {dinoIndex.map((dino) => {
            const isActive = activeDinoId === dino.id;
            return (
              <button
                key={dino.id}
                type="button"
                onClick={() => onSelectDino(dino.id)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
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
                  transition:
                    'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                }}
              >
                {dino.displayName}
              </button>
            );
          })}
        </nav>
      </aside>

      <style jsx>{`
        .summary-modal-overlay {
          display: none !important;
        }

        .sidebar-aside {
          display: flex !important;
          flex-direction: column;
          gap: 12px;
          position: sticky;
          top: 76px;
        }

        @media (max-width: 960px) {
          .sidebar-aside {
            display: none !important;
            position: static !important;
            top: auto;
            max-height: auto;
            overflow-y: visible;
          }

          .summary-modal-overlay {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
