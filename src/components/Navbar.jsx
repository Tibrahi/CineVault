import { Link } from 'react-router-dom';
import { LogoText } from './Logo';

function Navbar() {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <LogoText />
          </Link>
          <div className="flex space-x-1 sm:space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;