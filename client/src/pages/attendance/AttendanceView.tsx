import { useApp } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Play, Square, Clock, Calendar } from "lucide-react";

export default function AttendanceView() {
  const { currentUser, attendance, checkIn, checkOut } = useApp();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todaysRecord = attendance.find(a => a.userId === currentUser?.id && a.date === today);
  const isCheckedIn = !!todaysRecord?.checkIn && !todaysRecord?.checkOut;
  const hasCheckedOut = !!todaysRecord?.checkOut;

  const handleAction = () => {
    if (!currentUser) return;
    if (isCheckedIn) {
      checkOut(currentUser.id);
    } else if (!hasCheckedOut) {
      checkIn(currentUser.id);
    }
  };

  const userHistory = attendance
    .filter(a => a.userId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Attendance</h1>
        <p className="text-muted-foreground mt-2">Track your daily work hours and history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Check In/Out Card */}
        <Card className="border-l-4 border-l-primary h-fit">
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
            <CardDescription>{format(new Date(), 'EEEE, MMMM do, yyyy')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <div className="text-5xl font-mono font-bold tracking-widest">
                  {format(new Date(), 'HH:mm')}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest">Current Time</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg text-center">
                <div className="text-xs text-muted-foreground uppercase mb-1">Check In</div>
                <div className="font-mono font-medium">
                  {todaysRecord?.checkIn ? format(new Date(todaysRecord.checkIn), 'HH:mm') : '--:--'}
                </div>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg text-center">
                <div className="text-xs text-muted-foreground uppercase mb-1">Check Out</div>
                <div className="font-mono font-medium">
                  {todaysRecord?.checkOut ? format(new Date(todaysRecord.checkOut), 'HH:mm') : '--:--'}
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className={`w-full text-lg h-14 ${isCheckedIn ? 'bg-destructive hover:bg-destructive/90' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              onClick={handleAction}
              disabled={hasCheckedOut}
            >
              {hasCheckedOut ? (
                <>Day Completed</>
              ) : isCheckedIn ? (
                <><Square className="mr-2 h-5 w-5 fill-current" /> Check Out</>
              ) : (
                <><Play className="mr-2 h-5 w-5 fill-current" /> Check In</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-xl">
                  <Clock className="w-8 h-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">142h</span>
                  <span className="text-xs text-muted-foreground">Total Hours</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-xl">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <span className="text-2xl font-bold">18</span>
                  <span className="text-xs text-muted-foreground">Days Present</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Recent History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userHistory.slice(0, 3).map(record => (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {format(new Date(record.date), 'dd')}
                    </div>
                    <div>
                      <div className="font-medium">{format(new Date(record.date), 'MMMM yyyy')}</div>
                      <div className="text-xs text-muted-foreground capitalize">{record.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{record.hours}h</div>
                    <div className="text-xs text-muted-foreground">Work Time</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
