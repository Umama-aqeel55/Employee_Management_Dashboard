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
import { Check, X } from "lucide-react";

export default function LeaveManagement() {
  const { currentUser, leaves, requestLeave, updateLeaveStatus } = useApp();
  const [newLeave, setNewLeave] = useState({ type: 'sick', startDate: '', endDate: '', reason: '' });

  const myLeaves = leaves.filter(l => l.userId === currentUser?.id);
  const pendingLeaves = leaves.filter(l => l.status === 'pending'); // Admin view all pending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    requestLeave({
      userId: currentUser.id,
      type: newLeave.type as any,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      reason: newLeave.reason
    });
    setNewLeave({ type: 'sick', startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Leave Management</h1>
        <p className="text-muted-foreground mt-2">Apply for leave or manage employee requests.</p>
      </div>

      <Tabs defaultValue="apply" className="space-y-6">
        <TabsList>
          <TabsTrigger value="apply">My Leaves</TabsTrigger>
          {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
            <TabsTrigger value="manage">Manage Requests</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="apply" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Apply for Leave</CardTitle>
                <CardDescription>Submit a new leave request for approval.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Leave Type</Label>
                    <Select 
                      value={newLeave.type} 
                      onValueChange={(val) => setNewLeave({...newLeave, type: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="casual">Casual Leave</SelectItem>
                        <SelectItem value="annual">Annual Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input 
                        type="date" 
                        value={newLeave.startDate}
                        onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input 
                        type="date" 
                        value={newLeave.endDate}
                        onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Textarea 
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                      placeholder="Please briefly describe why you need leave..."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Request</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My History</CardTitle>
                <CardDescription>Past leave applications and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myLeaves.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No leave history found.</p>
                  )}
                  {myLeaves.map(leave => (
                    <div key={leave.id} className="p-4 rounded-lg border border-border bg-secondary/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium capitalize">{leave.type} Leave</div>
                        <Badge variant={
                          leave.status === 'approved' ? 'default' : 
                          leave.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {leave.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {leave.startDate} to {leave.endDate}
                      </div>
                      <div className="text-sm border-t border-border/50 pt-2 mt-2">
                        "{leave.reason}"
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Review and approve employee leave requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLeaves.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No pending requests.</p>
                )}
                {pendingLeaves.map(leave => (
                  <div key={leave.id} className="flex items-start justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/10 transition-colors">
                    <div className="space-y-1">
                      <div className="font-medium">User ID: {leave.userId}</div>
                      <div className="text-sm text-muted-foreground">
                        Requested <span className="font-medium text-foreground capitalize">{leave.type} Leave</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {leave.startDate} — {leave.endDate}
                      </div>
                      <div className="text-sm bg-secondary/50 p-2 rounded mt-2">
                        "{leave.reason}"
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => updateLeaveStatus(leave.id, 'rejected')}>
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => updateLeaveStatus(leave.id, 'approved')}>
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
