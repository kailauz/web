import { Head, Html, Main, NextScript } from 'next/document';

export default function Document({ __NEXT_DATA__: data }) {
  const page = data?.page;
  const locale = page === '/en' || page?.startsWith('/en/') || data?.props?.pageProps?.lang === 'en' ? 'en' : 'ru';
  return (
    <Html lang={locale}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
