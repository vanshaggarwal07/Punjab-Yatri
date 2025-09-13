import { Bus, MapPin, Clock, AlertCircle, UserCog, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Bus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Punjab Yatra</h1>
            <p className="text-xs text-muted-foreground">Smart Public Transport</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link to="/map">
              <Clock className="h-4 w-4" />
              Live Tracking
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              // Trigger the SOS functionality
              const event = new CustomEvent('triggerSOS');
              window.dispatchEvent(event);
            }}
          >
            <AlertCircle className="h-4 w-4" />
            Emergency SOS
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/driver-portal" className="gap-1">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Driver Portal</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/municipal-portal" className="gap-1">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Municipal Portal</span>
            </Link>
          </Button>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}