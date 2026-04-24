import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useApp } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hexagon, Loader2, Mail, Lock, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional().or(z.literal("")),
  role: z.enum(["admin", "manager", "employee"]),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register, loginWithGoogle, currentUser, loading: appLoading } = useApp();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("employee");

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && !appLoading) {
      setLocation("/");
    }
  }, [currentUser, appLoading, setLocation]);

  // Force login mode if role is not employee
  useEffect(() => {
    if (selectedRole !== "employee" && isRegister) {
      setIsRegister(false);
    }
  }, [selectedRole, isRegister]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "employee",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Login form submitted:", values);
    setIsLoggingIn(true);
    try {
      if (isRegister) {
        await register(values.email, values.password, values.name || "New Employee", values.role);
        toast({
          title: "Registration Successful",
          description: "Your account has been created and logged in.",
        });
      } else {
        await login(values.email, values.password);
        toast({
          title: "Login Successful",
          description: "Welcome back to NexusHR.",
        });
      }
      setLocation("/");
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = "User does not exist or invalid credentials. Please register first.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please sign in.";
      } else if (error.message) {
        // Fallback to Firebase's message but clean it up
        errorMessage = error.message.replace('Firebase: ', '').replace(/\\(.*\\)\\./, '');
      }

      toast({
        variant: "destructive",
        title: isRegister ? "Registration Failed" : "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full opacity-50 animate-pulse pointer-events-none" />
      
      <div className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(0,212,204,0.15)] mb-6">
            <Hexagon className="w-10 h-10 fill-primary/10" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            NexusHR Portal
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Enterprise Human Resource Management</p>
        </div>

        <Card className="border-white/5 bg-white/5 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">{isRegister ? "Create Account" : "Authentication"}</CardTitle>
            <CardDescription className="text-muted-foreground/60">
              {isRegister ? "Fill in the details to join NexusHR" : "Enter your credentials to access the dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))} className="space-y-5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Identify Your Role</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          setSelectedRole(val);
                          field.onChange(val);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 h-11">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-sidebar/95 backdrop-blur-xl border-white/10">
                          <SelectItem value="admin">System Administrator</SelectItem>
                          <SelectItem value="manager">Department Manager</SelectItem>
                          <SelectItem value="employee">Staff Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {isRegister && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input 
                              placeholder="John Doe" 
                              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input 
                            placeholder="Email address" 
                            className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Security Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input 
                            type="password" 
                            placeholder="Password" 
                            autoComplete="off"
                            className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                
                {/* Role selection is handled via the custom selector above */}

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all hover:shadow-[0_0_20px_rgba(0,212,204,0.3)]"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isRegister ? "Registering..." : "Verifying..."}
                      </>
                    ) : (
                      isRegister ? "Create Account" : "Authorize Access"
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0f172a] px-2 text-muted-foreground font-semibold">Or</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline"
                  onClick={async () => {
                    setIsLoggingIn(true);
                    try {
                      await loginWithGoogle();
                      toast({
                        title: "Authentication Successful",
                        description: "Welcome to NexusHR.",
                      });
                      setLocation("/");
                    } catch (error: any) {
                      toast({
                        variant: "destructive",
                        title: "Authentication Failed",
                        description: error.message || "Could not sign in with Google.",
                      });
                    } finally {
                      setIsLoggingIn(false);
                    }
                  }}
                  className="w-full h-11 bg-white/5 border-white/10 hover:bg-white/10 font-medium transition-all"
                  disabled={isLoggingIn}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Continue with Google
                </Button>

                {selectedRole === "employee" && (
                  <div className="text-center text-sm mt-4">
                    <span className="text-muted-foreground">
                      {isRegister ? "Already have an account?" : "Don't have an account?"}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setIsRegister(!isRegister)}
                      className="ml-2 text-primary font-bold hover:underline"
                    >
                      {isRegister ? "Sign In" : "Register Now"}
                    </button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-xs text-muted-foreground/40 font-medium">
          &copy; 2026 NexusHR Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}

