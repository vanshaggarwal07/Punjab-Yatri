import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, Navigation, Bus, Ticket, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/punjab-bus-hero.jpg';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Punjab Public Bus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80" />
      </div>

      {/* Content */}
      <div className="relative container py-24 md:py-32">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Smart Travel
              </span>
              <span className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-md -z-10"></span>
            </span>
            <span className="block mt-2 relative">
              <span className="relative z-10 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Across Punjab
              </span>
              <span className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-md -z-10"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg -z-20"></span>
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in">
            Real-time bus tracking, accurate ETAs, and complete route information 
            for Punjab's public transport system.
          </p>

          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 animate-fade-in">
            <Tabs defaultValue="route" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-4">
                <TabsTrigger value="route" className="text-white data-[state=active]:bg-primary/30 data-[state=active]:text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Route
                </TabsTrigger>
                <TabsTrigger value="pnr" className="text-white data-[state=active]:bg-primary/30 data-[state=active]:text-white">
                  <Ticket className="h-4 w-4 mr-2" />
                  PNR Status
                </TabsTrigger>
                <TabsTrigger value="bus" className="text-white data-[state=active]:bg-primary/30 data-[state=active]:text-white">
                  <Bus className="h-4 w-4 mr-2" />
                  Bus Number
                </TabsTrigger>
              </TabsList>

              {/* Route Search */}
              <TabsContent value="route" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input 
                      placeholder="From (e.g., Amritsar)" 
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input 
                      placeholder="To (e.g., Ludhiana)" 
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                </div>
                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 gap-2" asChild>
                  <Link to="/map">
                    <Search className="h-4 w-4" />
                    View Live Map
                  </Link>
                </Button>
              </TabsContent>

              {/* PNR Search */}
              <TabsContent value="pnr" className="space-y-4">
                <div className="relative">
                  <Ticket className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                  <Input 
                    type="number"
                    placeholder="Enter 10-digit PNR Number" 
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 gap-2">
                  <Search className="h-4 w-4" />
                  Check PNR Status
                </Button>
              </TabsContent>

              {/* Bus Number Search */}
              <TabsContent value="bus" className="space-y-4">
                <div className="relative">
                  <Bus className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                  <Input 
                    placeholder="Enter Bus Number (e.g., PB08AB1234)" 
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input 
                      type="date"
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                  </div>
                  <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 gap-2">
                    <Search className="h-4 w-4" />
                    Track Bus
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center animate-fade-in">
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/80">Routes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Live Tracking</div>
            </div>
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-white/80">On-Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}