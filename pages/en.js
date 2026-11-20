import { Literata, Onest } from 'next/font/google';
import Landing from '../components/Landing';

const onest = Onest({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-onest', display: 'swap' });
const literata = Literata({ subsets: ['latin'], weight: '400', variable: '--font-literata', display: 'swap' });

export default function HomeEnglish() {
  return <Landing lang="en" fonts={`${onest.variable} ${literata.variable}`} />;
}
