import Navbar from './components/Navbar/Navbar';
import HomeHero from './components/HomeHero/HomeHero';

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <HomeHero />
      </main>
    </>
  );
}
