import { Analytics } from '@vercel/analytics/react';
import { useCallback, useState } from 'react';
import { ContactFooterSection } from './components/ContactFooterSection';
import { EditorialCursor } from './components/EditorialCursor';
import { GlassNav } from './components/GlassNav';
import { HeroSection } from './components/HeroSection';
import { PreloaderCurtain } from './components/PreloaderCurtain';
import { ProfileSection } from './components/ProfileSection';
import { QuoteBand } from './components/QuoteBand';
import { WorksSection } from './components/WorksSection';
import { useTheme } from './hooks/useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [heroEntered, setHeroEntered] = useState(false);

  const handleRevealStart = useCallback(() => {
    setHeroEntered(true);
  }, []);

  return (
    <>
      <EditorialCursor />
      <PreloaderCurtain onRevealStart={handleRevealStart} />

      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>

      <GlassNav theme={theme} onToggleTheme={toggleTheme} />

      <main id="main-content" tabIndex={-1}>
        <HeroSection entered={heroEntered} theme={theme} />
        <ProfileSection theme={theme} />
        <WorksSection />
        <QuoteBand />
      </main>

      <ContactFooterSection />
      <Analytics />
    </>
  );
}

export default App;
