'use client';

import { FaWhatsapp, FaTelegram, FaFacebook } from 'react-icons/fa';

export function Footer() {
  const contacts = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      url: 'https://wa.me/5562981540735',
    },
    {
      name: 'Telegram',
      icon: <FaTelegram />,
      url: 'https://t.me/seunometelegram',
    },
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      url: 'https://facebook.com/seuperfil',
    },
  ];

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(11, 11, 15, 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <div
        style={{
          maxWidth: 1360,
          margin: '0 auto',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          minHeight: '60px',
        }}
      >
        <div>
          <p style={{ color: '#f5f5f7', fontSize: 13, margin: 0 }}>
            <strong>DinoLand</strong> © 2026
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {contacts.map((contact) => (
            <a
              key={contact.name}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              title={contact.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.08)',
                color: '#f5f5f7',
                fontSize: 20,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.16)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(255,255,255,0.08)';
              }}
            >
              {contact.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
