'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { dinos } from '@/public/images';
import { Header } from '@/components/Header';
import { DinoList } from '@/components/DinoList';
import { DinoContent } from '@/components/DinoContent';
import { Footer } from '@/components/Footer';
import { Dino, ExpandedImage, DietFilter } from '@/components/types';

const typedDinos = dinos as unknown as Dino[];

function toId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

function getDinoDisplayName(dinoName: string): string {
  return dinoName.replace(/\s*\[[tfch\-oe]+\]\s*$/, '').trim();
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [activeDinoId, setActiveDinoId] = useState('');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<ExpandedImage | null>(
    null
  );
  const headerRef = useRef<HTMLElement | null>(null);

  const filteredDinos = useMemo(() => {
    if (dietFilter === 'all') {
      return typedDinos;
    }

    return typedDinos.filter((dino) =>
      Object.values(dino.builds).some((build) => build.diet === dietFilter)
    );
  }, [dietFilter]);

  const dinoIndex = useMemo(
    () =>
      filteredDinos.map((d) => ({
        name: d.dino,
        displayName: getDinoDisplayName(d.dino),
        id: toId(d.dino),
      })),
    [filteredDinos]
  );

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
      setActiveDinoId('');
      return;
    }

    setActiveDinoId((currentId) => {
      if (!currentId) return dinoIndex[0].id;
      const stillExists = dinoIndex.some((dino) => dino.id === currentId);
      return stillExists ? currentId : dinoIndex[0].id;
    });

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
        rootMargin: '-80px 0px -55% 0px',
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

    const headerHeight =
      headerRef.current?.getBoundingClientRect().height ?? 60;
    const headerOffset = headerHeight + 16;
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY - headerOffset;

    setActiveDinoId(targetId);
    setIsSummaryOpen(false);
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  return (
    <>
      {/* Expanded Image Modal */}
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
            aria-label="Close image"
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
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>
      )}

      <Header
        ref={headerRef}
        query={query}
        setQuery={setQuery}
        dietFilter={dietFilter}
        setDietFilter={setDietFilter}
        dinoIndex={dinoIndex}
        onSelectDino={scrollToDino}
        setIsSummaryOpen={setIsSummaryOpen}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px minmax(0, 1fr)',
          gap: 24,
          alignItems: 'start',
          padding: '18px 16px',
          maxWidth: 1360,
          margin: '0 auto',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <DinoList
          dinoIndex={dinoIndex}
          activeDinoId={activeDinoId}
          onSelectDino={scrollToDino}
          isSummaryOpen={isSummaryOpen}
          setIsSummaryOpen={setIsSummaryOpen}
        />

        <DinoContent
          dinos={filteredDinos}
          setExpandedImage={setExpandedImage}
        />
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 960px) {
          div:has(aside) {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          aside {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
