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

export function Sidebar() {
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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-2 text-primary">
          <Hexagon className="w-8 h-8 fill-primary/20" strokeWidth={1.5} />
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
            <Link key={item.href} href={item.href}>
              <a className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground"
                )} />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-3 p-2 mb-2 rounded-lg bg-sidebar-accent/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
