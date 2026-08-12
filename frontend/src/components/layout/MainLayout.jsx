import Navbar from '../shared/Navbar';
import { useTheme } from '../../hooks/useTheme';

function MainLayout({ children }) {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Navbar />
        <main className={`${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
