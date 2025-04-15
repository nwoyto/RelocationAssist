import cbpLogo from "../assets/cbp-logo.svg";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/8b/US-CustomsBorderProtection-Seal.svg" 
                alt="CBP Logo" 
                className="h-10 w-10 mr-3"
              />
              <div>
                <h3 className="font-['Public_Sans'] font-bold text-lg">CBP Relocation Resources</h3>
                <p className="text-xs text-white/70">U.S. Customs and Border Protection</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/70 max-w-md">
              Helping CBP employees and prospective employees evaluate and plan relocations to CBP duty locations across the United States.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Relocation Guide</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">CBP Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact HR</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Regions</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Southwest Border</a></li>
                <li><a href="#" className="hover:text-white">Northern Border</a></li>
                <li><a href="#" className="hover:text-white">Coastal Regions</a></li>
                <li><a href="#" className="hover:text-white">View All Locations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white">Accessibility</a></li>
                <li><a href="#" className="hover:text-white">FOIA</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-white/60 mb-4 md:mb-0">
            © {new Date().getFullYear()} U.S. Customs and Border Protection. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-white/60 hover:text-white">
              <span className="material-icons">facebook</span>
            </a>
            <a href="#" className="text-white/60 hover:text-white">
              <span className="material-icons">chat</span>
            </a>
            <a href="#" className="text-white/60 hover:text-white">
              <span className="material-icons">email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
