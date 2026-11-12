import Link from 'next/link';
import { getAllUnits } from '@/lib/content';
import { HomeClientView } from './HomeClientView';

export default function HomePage() {
  const units = getAllUnits();

  return <HomeClientView units={units} />;
}
