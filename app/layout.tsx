import type { Metadata } from 'next';
import {
  Big_Shoulders_Text,
  Big_Shoulders_Stencil_Text,
  Lora,
} from 'next/font/google';
import './globals.css';

const bigShoulders = Big_Shoulders_Text({
  subsets: ['latin'],
  variable: '--font-big-shoulders',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const bigShouldersStencil = Big_Shoulders_Stencil_Text({
  subsets: ['latin'],
  variable: '--font-big-shoulders-stencil',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['500'],
});

export const metadata: Metadata = {
  title: 'DinoLand - Ark Survival Ascended',
  description: 'Dinos from Ark Survival Ascended',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bigShoulders.variable} ${bigShouldersStencil.variable} ${lora.variable} antialiased`}
        style={{ fontFamily: 'var(--font-lora)' }}
      >
        {children}
      </body>
    </html>
  );
}
