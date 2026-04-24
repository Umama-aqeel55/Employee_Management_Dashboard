import { useState } from "react";
import { useApp } from "@/lib/mock-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, MoreHorizontal, Shield, Loader2, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EmployeeList() {
  const { users, addUser, loading } = useApp();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "employee", department: "" });

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading employee directory...</p>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = async () => {
    await addUser({ ...newEmployee, status: 'active' } as any);
    setIsDialogOpen(false);
    setNewEmployee({ name: "", email: "", role: "employee", department: "" });
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Employee Directory
          </h1>
          <p className="text-muted-foreground mt-2">
            Oversee team performance and manage organizational roles.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,212,204,0.2)]">
              <Plus className="w-4 h-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-sidebar/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">New Team Member</DialogTitle>
              <DialogDescription>
                Create a formal employee profile. Security credentials will be generated automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold opacity-70">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Johnathan Doe"
                  className="bg-white/5 border-white/10 focus:border-primary/50 h-11"
                  value={newEmployee.name} 
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold opacity-70">Official Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="j.doe@company.com"
                  className="bg-white/5 border-white/10 focus:border-primary/50 h-11"
                  value={newEmployee.email} 
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department" className="text-xs uppercase tracking-widest font-bold opacity-70">Department</Label>
                <Input 
                  id="department" 
                  placeholder="e.g. Engineering"
                  className="bg-white/5 border-white/10 focus:border-primary/50 h-11"
                  value={newEmployee.department} 
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser} className="bg-primary text-primary-foreground">Register Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="relative flex-1 w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            className="pl-10 bg-white/5 border-white/5 focus:border-primary/50 focus:bg-white/10 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/5">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground py-5 pl-6">Employee Info</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground py-5">Designation</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground py-5">Org. Department</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground py-5">Current Status</TableHead>
              <TableHead className="text-xs uppercase tracking-widest font-bold text-muted-foreground py-5 text-right pr-6">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  No personnel found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-white/5 border-white/5 transition-all duration-300">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11 border-2 border-primary/20 ring-4 ring-primary/5 shadow-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white/90">{user.name}</div>
                        <div className="text-xs text-muted-foreground/60 font-mono tracking-tight">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="capitalize text-sm font-medium tracking-tight">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground font-medium">{user.department}</span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={user.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}
                    >
                      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/10 rounded-xl">
                          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-sidebar/95 backdrop-blur-xl border-white/10 w-48">
                        <DropdownMenuLabel className="font-display">Personnel Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem className="cursor-pointer">Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Track Performance</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">View Activity Logs</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem className="text-rose-400 focus:text-rose-400 cursor-pointer">Deactivate Personnel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

