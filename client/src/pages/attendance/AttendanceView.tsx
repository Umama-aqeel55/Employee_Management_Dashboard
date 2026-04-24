import { useApp } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Play, Square, Clock, Calendar, Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AttendanceView() {
  const { currentUser, attendance, checkIn, checkOut, loading } = useApp();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Synchronizing attendance records...</p>
      </div>
    );
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const todaysRecord = attendance.find(a => a.userId === currentUser?.id && a.date === today);
  const isCheckedIn = !!todaysRecord?.checkIn && !todaysRecord?.checkOut;
  const hasCheckedOut = !!todaysRecord?.checkOut;

  const handleAction = async () => {
    if (!currentUser) return;
    setIsProcessing(true);
    try {
      if (isCheckedIn) {
        await checkOut(currentUser.id);
        toast({ title: "Checked Out", description: "Your work session has ended. Have a great day!" });
      } else if (!hasCheckedOut) {
        await checkIn(currentUser.id);
        toast({ title: "Checked In", description: "Welcome! Your session has started." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update attendance status." });
    } finally {
      setIsProcessing(false);
    }
  };

  const userHistory = attendance
    .filter(a => a.userId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Attendance Tracker
        </h1>
        <p className="text-muted-foreground mt-2">Precision timekeeping for <span className="text-primary font-semibold">NexusHR</span> professionals.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Check In/Out Card */}
        <Card className="lg:col-span-5 bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-2xl">Daily Session</CardTitle>
                <CardDescription className="text-muted-foreground/60">{format(new Date(), 'EEEE, MMMM do, yyyy')}</CardDescription>
              </div>
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Zap className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            <div className="flex items-center justify-center py-12 relative">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <div className="text-center space-y-3 relative">
                <div className="text-6xl font-mono font-bold tracking-[0.2em] text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {format(new Date(), 'HH:mm')}
                </div>
                <div className="text-xs text-primary font-bold uppercase tracking-[0.3em]">Current System Time</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center backdrop-blur-sm transition-all group-hover:bg-white/10">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Punch In</div>
                <div className="font-mono text-lg font-bold text-emerald-400">
                  {todaysRecord?.checkIn ? format(new Date(todaysRecord.checkIn), 'HH:mm') : '--:--'}
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center backdrop-blur-sm transition-all group-hover:bg-white/10">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Punch Out</div>
                <div className="font-mono text-lg font-bold text-rose-400">
                  {todaysRecord?.checkOut ? format(new Date(todaysRecord.checkOut), 'HH:mm') : '--:--'}
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className={`w-full text-lg h-16 font-bold transition-all duration-500 shadow-2xl ${
                hasCheckedOut 
                  ? 'bg-white/10 text-muted-foreground cursor-not-allowed' 
                  : isCheckedIn 
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
              }`}
              onClick={handleAction}
              disabled={hasCheckedOut || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : hasCheckedOut ? (
                "Duty Completed"
              ) : isCheckedIn ? (
                <><Square className="mr-3 h-5 w-5 fill-current" /> End Session</>
              ) : (
                <><Play className="mr-3 h-5 w-5 fill-current" /> Start Session</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Stats & History */}
        <div className="lg:col-span-7 space-y-8">
           <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-display">Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center p-6 bg-white/5 border border-white/5 rounded-2xl group hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
                  <div className="p-3 rounded-xl bg-primary/10 mb-4 transition-transform group-hover:scale-110">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-3xl font-bold">142.5h</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Production Time</span>
                </div>
                <div className="flex flex-col items-center p-6 bg-white/5 border border-white/5 rounded-2xl group hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
                  <div className="p-3 rounded-xl bg-primary/10 mb-4 transition-transform group-hover:scale-110">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-3xl font-bold">18</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Active Days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm flex-1">
            <CardHeader>
              <CardTitle className="font-display">Recent Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground italic">No recent activity records found.</div>
              ) : (
                userHistory.slice(0, 4).map(record => (
                  <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {format(new Date(record.date), 'dd')}
                      </div>
                      <div>
                        <div className="font-semibold text-white/90">{format(new Date(record.date), 'MMMM yyyy')}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'present' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{record.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-primary">{record.hours}h</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Duration</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

