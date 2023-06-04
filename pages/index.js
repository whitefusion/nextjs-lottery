import { Inter } from 'next/font/google'
import { Header } from '../components/Header';
import { LotteryEntrance } from '../components/LotteryEntrance';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-24 ${inter.className}`}
    >
      {/* <ManualHeader /> */}
      <Header />
      <LotteryEntrance />
    </main>
  )
}
