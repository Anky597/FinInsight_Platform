import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Calculator, PieChart, Star, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">FinInsight Platform</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <Link to="/loan-checker" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
                <Calculator className="w-4 h-4 mr-1" />
                Loan Checker
              </Link>
              <Link to="/segmentation-analysis" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
                <PieChart className="w-4 h-4 mr-1" />
                Segmentation Analysis
              </Link>
              <Link to="/coming-soon" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900">
                <Star className="w-4 h-4 mr-1" />
                Coming Soon
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-900"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
          <Link
            to="/loan-checker"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            <Calculator className="w-4 h-4 mr-2" />
            Loan Checker
          </Link>
          <Link
            to="/segmentation-analysis"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Segmentation Analysis
          </Link>
          <Link
            to="/coming-soon"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            <Star className="w-4 h-4 mr-2" />
            Coming Soon
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center px-3 py-2 text-base font-medium text-gray-900 w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;