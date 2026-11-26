import { Head, Html, Main, NextScript } from 'next/document';

export default function Document({ __NEXT_DATA__: data }) {
  const page = data?.page;
  const locale = page === '/en' || page?.startsWith('/en/') || data?.props?.pageProps?.lang === 'en' ? 'en' : 'ru';
  return (
    <Html lang={locale}>
      <Head>
        <meta name="mitgo-verification" content="24d16c14-ace6-4e7b-a2db-8a61881d23cf" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
