import { Optimized } from '@/lib/context/optimizedContext';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <Optimized />
      </body>
    </Html>
  );
}
