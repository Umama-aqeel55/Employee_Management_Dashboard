import { Link, useLocation } from "wouter";
import { useApp } from "@/lib/mock-store";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CalendarDays, 
  User, 
  LogOut, 
  Hexagon 
} from "lucide-react";

export function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const [location] = useLocation();
  const { currentUser, logout } = useApp();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/", roles: ['admin', 'manager', 'employee'] },
    { label: "Employees", icon: Users, href: "/employees", roles: ['admin', 'manager'] },
    { label: "Attendance", icon: CalendarCheck, href: "/attendance", roles: ['admin', 'manager', 'employee'] },
    { label: "Leaves", icon: CalendarDays, href: "/leaves", roles: ['admin', 'manager', 'employee'] },
    { label: "Profile", icon: User, href: "/profile", roles: ['admin', 'manager', 'employee'] },
  ];

  const filteredNav = navItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <aside className="h-full w-full lg:w-64 bg-sidebar/40 backdrop-blur-xl border-r border-sidebar-border flex flex-col z-50">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border/20">
        <div className="flex items-center gap-2 text-primary">
          <Hexagon className="w-8 h-8 fill-primary/20 animate-pulse" strokeWidth={1.5} />
          <span className="text-xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            NexusHR
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,212,204,0.1)]" 
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-accent-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-accent-foreground"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sidebar-border/20 bg-black/20">
        <div className="flex items-center gap-3 p-2.5 mb-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 shadow-[0_0_10px_rgba(0,212,204,0.1)]">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{currentUser?.role}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            logout();
            onNavClick?.();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
