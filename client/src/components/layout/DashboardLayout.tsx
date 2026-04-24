import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer */}
      <div className={`
        fixed inset-y-0 left-0 w-72 bg-sidebar z-[70] lg:hidden transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isMobileMenuOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full'}
      `}>
        <div className="h-full relative">
          <Sidebar onNavClick={() => setIsMobileMenuOpen(false)} />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white/50 hover:text-white hover:bg-white/10 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out lg:ml-64">
        <Header>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </Header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

