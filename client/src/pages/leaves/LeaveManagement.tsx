import { useState } from "react";
import { useApp } from "@/lib/mock-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Check, X, Calendar, ClipboardList, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LeaveManagement() {
  const { currentUser, users, leaves, requestLeave, updateLeaveStatus, loading } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLeave, setNewLeave] = useState({ type: 'sick', startDate: '', endDate: '', reason: '' });

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Retrieving leave management protocols...</p>
      </div>
    );
  }

  const myLeaves = leaves.filter(l => l.userId === currentUser?.id);
  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      await requestLeave({
        userId: currentUser.id,
        type: newLeave.type as any,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        reason: newLeave.reason
      });
      toast({ title: "Request Submitted", description: "Your leave application is now pending review." });
      setNewLeave({ type: 'sick', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to submit request." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Leave Management
        </h1>
        <p className="text-muted-foreground mt-2">Manage absences and organizational availability.</p>
      </div>

      <Tabs defaultValue="apply" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-12">
          <TabsTrigger value="apply" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
            Personal Leave
          </TabsTrigger>
          {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
            <TabsTrigger value="manage" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
              Administrative Panel
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="apply" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display">New Application</CardTitle>
                    <CardDescription className="text-muted-foreground/60">Submit a formal request for time off.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Category</Label>
                    <Select 
                      value={newLeave.type} 
                      onValueChange={(val) => setNewLeave({...newLeave, type: val})}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar/95 backdrop-blur-xl border-white/10">
                        <SelectItem value="sick">Sick / Medical Leave</SelectItem>
                        <SelectItem value="casual">Casual / Personal Time</SelectItem>
                        <SelectItem value="annual">Annual / Vacation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Commencement</Label>
                      <Input 
                        type="date" 
                        className="bg-white/5 border-white/10 h-11 focus:border-primary/50"
                        value={newLeave.startDate}
                        onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Conclusion</Label>
                      <Input 
                        type="date" 
                        className="bg-white/5 border-white/10 h-11 focus:border-primary/50"
                        value={newLeave.endDate}
                        onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest font-bold opacity-70">Justification</Label>
                    <Textarea 
                      className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[120px] resize-none"
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                      placeholder="Detail the requirement for leave..."
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-[0_0_20px_rgba(0,212,204,0.1)]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Transmit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display">Application History</CardTitle>
                    <CardDescription className="text-muted-foreground/60">Review your past submissions and status.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myLeaves.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed border-white/5 rounded-2xl">
                      No prior leave records identified.
                    </div>
                  ) : (
                    myLeaves.map(leave => (
                      <div key={leave.id} className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold text-white/90 capitalize flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full" />
                            {leave.type} Leave
                          </div>
                          <Badge 
                            variant="outline"
                            className={
                              leave.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              leave.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                              'bg-white/5 text-muted-foreground border-white/10'
                            }
                          >
                            {leave.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          {leave.startDate} <span className="opacity-50">—</span> {leave.endDate}
                        </div>
                        <div className="text-sm text-muted-foreground italic mt-3 p-3 bg-black/20 rounded-xl group-hover:bg-black/40 transition-colors">
                          "{leave.reason}"
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="font-display">Administrative Queue</CardTitle>
              <CardDescription>Authorize or decline pending personnel leave requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLeaves.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground italic border-2 border-dashed border-white/5 rounded-2xl">
                    All clear! No pending authorizations required.
                  </div>
                ) : (
                  pendingLeaves.map(leave => {
                    const employee = users.find(u => u.id === leave.userId);
                    return (
                      <div key={leave.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            {employee?.avatar ? (
                              <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-xl bg-white/10 border border-white/20" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                                {employee?.name?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div>
                              <div className="text-base font-bold text-white/90">{employee?.name || 'Unknown Employee'}</div>
                              <div className="flex items-center gap-2 mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                <span className="text-primary">{leave.type} Leave</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span>{employee?.department || 'General'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 pl-[64px]">
                            <Calendar className="w-3.5 h-3.5" />
                            {leave.startDate} <span className="opacity-50">—</span> {leave.endDate}
                          </div>
                          <div className="text-sm bg-black/20 p-4 rounded-xl max-w-xl italic ml-[64px]">
                            "{leave.reason}"
                          </div>
                        </div>
                      <div className="flex gap-3 mt-4 md:mt-0">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-rose-400 hover:bg-rose-400/10 hover:text-rose-400" 
                          onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-2" /> Decline
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => updateLeaveStatus(leave.id, 'approved')}
                        >
                          <Check className="w-4 h-4 mr-2" /> Authorize
                        </Button>
                      </div>
                    </div>
                  );
                })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

