import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Map, Settings, Home as HomeIcon } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.includes('admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isHome ? 'bg-transparent text-white -mb-20' : 'bg-emerald-900 text-white shadow-md'}`}>
        <div className={`container mx-auto px-4 py-4 flex justify-between items-center ${isHome ? 'bg-black/30 backdrop-blur-sm rounded-b-xl mt-0' : ''}`}>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Map size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Asir Explorer</h1>
              <p className="text-xs opacity-80">Kingdom of Saudi Arabia</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Home"
            >
              <HomeIcon size={20} />
            </Link>
            <Link 
              to="/admin" 
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isAdmin ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <Settings size={16} />
              <span>Admin Panel</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} Asir Tourism Portal.</p>
          <p className="text-sm">Powered by React, Tailwind & Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;