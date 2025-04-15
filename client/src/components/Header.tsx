import { useState } from "react";
import { Link } from "wouter";

const Header = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="bg-[#1a4480] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/8/8b/US-CustomsBorderProtection-Seal.svg" 
                  alt="CBP Logo" 
                  className="h-10 w-10 mr-3"
                />
                <div>
                  <h1 className="font-['Public_Sans'] font-bold text-xl md:text-2xl leading-tight">CBP Relocation Resources</h1>
                  <p className="text-xs text-white/80">U.S. Customs and Border Protection</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setIsHelpOpen(!isHelpOpen)} 
                className="flex items-center space-x-1 py-1 px-3 rounded hover:bg-[#2d5999]"
              >
                <span className="material-icons text-sm">help</span>
                <span className="hidden md:inline">Help</span>
              </button>
              {isHelpOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white text-neutral-800 rounded shadow-lg z-50"
                  onClick={() => setIsHelpOpen(false)}
                >
                  <div className="p-3 text-sm">
                    <a href="#" className="block py-1 hover:text-[#005ea2]">User Guide</a>
                    <a href="#" className="block py-1 hover:text-[#005ea2]">FAQ</a>
                    <a href="#" className="block py-1 hover:text-[#005ea2]">Contact Support</a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)} 
                className="flex items-center space-x-1 py-1 px-3 rounded hover:bg-[#2d5999]"
              >
                <span className="material-icons text-sm">person</span>
                <span className="hidden md:inline">Account</span>
              </button>
              {isAccountOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white text-neutral-800 rounded shadow-lg z-50"
                  onClick={() => setIsAccountOpen(false)}
                >
                  <div className="p-3 text-sm">
                    <a href="#" className="block py-1 hover:text-[#005ea2]">My Profile</a>
                    <a href="#" className="block py-1 hover:text-[#005ea2]">Saved Locations</a>
                    <a href="#" className="block py-1 hover:text-[#005ea2]">Sign Out</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
