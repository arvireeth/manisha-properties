import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Videos } from './pages/Videos';
import { About } from './pages/About';
import type { Page } from './types/youtube';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'videos' && <Videos />}
        {currentPage === 'about' && <About />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
