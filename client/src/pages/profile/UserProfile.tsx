import { useApp } from "@/lib/mock-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Mail, Building, User, Save } from "lucide-react";

export default function UserProfile() {
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Accessing secure user profile...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
       <div>
        <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Account Identification
        </h1>
        <p className="text-muted-foreground mt-2">View and maintain your organizational credentials.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar Card */}
        <Card className="lg:col-span-4 bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden h-fit">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-transparent" />
          <CardContent className="pt-16 flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Avatar className="w-32 h-32 border-4 border-white/10 shadow-2xl relative z-10">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-display text-white/90">{currentUser.name}</h2>
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
                <Shield className="w-3 h-3" />
                {currentUser.role}
              </div>
            </div>

            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-6 py-1.5 rounded-full font-bold tracking-widest text-[10px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              {currentUser.status}
            </Badge>

            <div className="w-full pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-mono text-white/70">{currentUser.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Joined Date</span>
                <span className="text-white/70">April 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-8 bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="border-b border-white/5 pb-8">
            <CardTitle className="font-display text-2xl">Profile Specifications</CardTitle>
            <CardDescription className="text-muted-foreground/60">Configure your official identity parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-70 flex items-center gap-2">
                  <User className="w-3 h-3 text-primary" /> Full Name
                </Label>
                <Input 
                  className="bg-white/5 border-white/10 h-12 focus:border-primary/50 text-white/90"
                  defaultValue={currentUser.name} 
                />
              </div>
              
              <div className="grid gap-3">
                <Label className="text-xs uppercase tracking-widest font-bold opacity-70 flex items-center gap-2">
                  <Mail className="w-3 h-3 text-primary" /> Official Email
                </Label>
                <Input 
                  className="bg-white/5 border-white/10 h-12 opacity-60 cursor-not-allowed"
                  defaultValue={currentUser.email} 
                  disabled 
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label className="text-xs uppercase tracking-widest font-bold opacity-70 flex items-center gap-2">
                    <Building className="w-3 h-3 text-primary" /> Org. Department
                  </Label>
                  <Input 
                    className="bg-white/5 border-white/10 h-12 opacity-60 cursor-not-allowed"
                    defaultValue={currentUser.department} 
                    disabled 
                  />
                </div>
                <div className="grid gap-3">
                  <Label className="text-xs uppercase tracking-widest font-bold opacity-70 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-primary" /> Clearance Level
                  </Label>
                  <Input 
                    className="bg-white/5 border-white/10 h-12 opacity-60 cursor-not-allowed capitalize"
                    defaultValue={currentUser.role} 
                    disabled 
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex justify-end">
              <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 gap-2">
                <Save className="w-4 h-4" /> Synchronize Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

