import { Header } from '../components/Header';
import { LotteryEntrance } from '../components/LotteryEntrance';

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-24`}
    >
      <Header />
      <LotteryEntrance />
    </main>
  )
}
