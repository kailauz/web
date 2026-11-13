import { Head, Html, Main, NextScript } from 'next/document';

/** The page language for search engines and screen readers: /en is English, every other page Russian. */
export default function Document({ __NEXT_DATA__: data }) {
  return (
    <Html lang={data?.page === '/en' ? 'en' : 'ru'}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
