import { useApp } from "@/lib/mock-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function UserProfile() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{currentUser.role}</p>
            </div>
            <Badge variant="outline" className="capitalize px-4 py-1">
              {currentUser.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input defaultValue={currentUser.name} />
            </div>
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <Input defaultValue={currentUser.email} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Department</Label>
                <Input defaultValue={currentUser.department} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Input defaultValue={currentUser.role} disabled className="capitalize" />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
