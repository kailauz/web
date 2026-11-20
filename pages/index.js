import { Literata, Onest } from 'next/font/google';
import Landing from '../components/Landing';

const onest = Onest({ subsets: ['latin', 'cyrillic'], weight: ['400', '500', '600', '700'], variable: '--font-onest', display: 'swap' });
const literata = Literata({ subsets: ['latin', 'cyrillic'], weight: '400', variable: '--font-literata', display: 'swap' });

export default function Home() {
  return <Landing lang="ru" fonts={`${onest.variable} ${literata.variable}`} />;
}
