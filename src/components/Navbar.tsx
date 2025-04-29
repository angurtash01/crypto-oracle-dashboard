
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gain to-accent flex items-center justify-center">
            <span className="text-black font-bold">C</span>
          </div>
          <span className="text-xl font-bold">CryptoOracle</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search coins..." 
              className="pl-9 pr-4 py-2 rounded-lg bg-secondary text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-accent w-64"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/mcp" className="text-sm font-medium py-1.5 px-3 rounded-md bg-accent text-accent-foreground hover:bg-accent/90">
                  MCP
                </Link>
                <Link to="/profile" className="p-1.5 rounded-md hover:bg-secondary">
                  <User className="h-5 w-5" />
                </Link>
                <button 
                  onClick={logout} 
                  className="text-sm font-medium py-1.5 px-3 rounded-md hover:bg-secondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm font-medium py-1.5 px-3 rounded-md hover:bg-secondary">
                  Login
                </Link>
                <Link to="/signup" className="text-sm font-medium py-1.5 px-3 rounded-md bg-accent text-accent-foreground hover:bg-accent/90">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
