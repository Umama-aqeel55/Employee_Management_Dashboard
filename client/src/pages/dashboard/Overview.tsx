import { useApp } from "@/lib/mock-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock, Loader2, LogOut } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Overview() {
  const { users, attendance, leaves, loading, currentUser, checkIn, checkOut } = useApp();

  if (loading || !currentUser) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'manager';

  // --- Admin Data ---
  const totalEmployees = users.length;
  const presentToday = attendance.filter(a => a.date === format(new Date(), 'yyyy-MM-dd') && a.status === 'present').length;
  const onLeave = leaves.filter(l => l.status === 'approved').length;
  const lateArrivals = attendance.filter(a => a.status === 'late').length;

  // --- Employee Data ---
  const myAttendance = attendance.filter(a => a.userId === currentUser.id);
  const todayRecord = myAttendance.find(a => a.date === format(new Date(), 'yyyy-MM-dd'));
  const isCheckedIn = todayRecord && !todayRecord.checkOut;

  const weeklyData = [
    { name: "Mon", present: 45 },
    { name: "Tue", present: 48 },
    { name: "Wed", present: 47 },
    { name: "Thu", present: 46 },
    { name: "Fri", present: 44 },
  ];

  if (!isAdmin) {
    return (
      <div className="space-y-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Hello, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Ready for another productive day at <span className="text-primary font-semibold">NexusHR</span>?
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!isCheckedIn ? (
              <Button 
                onClick={() => checkIn(currentUser.id)}
                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition-all hover:scale-105 gap-2"
              >
                <Clock className="w-5 h-5" /> Check In Now
              </Button>
            ) : (
              <Button 
                onClick={() => checkOut(currentUser.id)}
                className="h-14 px-8 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(244,63,94,0.2)] transition-all hover:scale-105 gap-2"
              >
                <LogOut className="w-5 h-5" /> Check Out
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">My Attendance Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayRecord ? (todayRecord.status === 'present' ? 'Present' : 'Late') : 'Not Checked In'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {todayRecord?.checkIn ? `Started at ${format(new Date(todayRecord.checkIn), 'hh:mm a')}` : 'Action required'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Working Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142.5 hrs</div>
              <p className="text-xs text-emerald-400 mt-1">92% of target reached</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8 Days</div>
              <p className="text-xs text-amber-400 mt-1">2 requests pending approval</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="font-display">My Activity History</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {myAttendance.slice(0, 5).map((record, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                       {format(new Date(record.date), 'dd')}
                     </div>
                     <div>
                       <p className="text-sm font-semibold">{format(new Date(record.date), 'EEEE, MMM do')}</p>
                       <p className="text-xs text-muted-foreground">{record.hours} hours logged</p>
                     </div>
                   </div>
                   <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 capitalize">
                     {record.status}
                   </Badge>
                 </div>
               ))}
               {myAttendance.length === 0 && (
                 <p className="text-center text-muted-foreground italic py-8">No attendance records found yet.</p>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Admin/Manager View ---
  const stats = [
    { 
      title: "Total Employees", 
      value: totalEmployees, 
      icon: Users, 
      color: "from-blue-500/20 to-blue-600/20", 
      textColor: "text-blue-400",
      border: "border-blue-500/30"
    },
    { 
      title: "Present Today", 
      value: presentToday, 
      icon: UserCheck, 
      color: "from-emerald-500/20 to-emerald-600/20", 
      textColor: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    { 
      title: "On Leave", 
      value: onLeave, 
      icon: UserX, 
      color: "from-rose-500/20 to-rose-600/20", 
      textColor: "text-rose-400",
      border: "border-rose-500/30"
    },
    { 
      title: "Late Arrivals", 
      value: lateArrivals, 
      icon: Clock, 
      color: "from-amber-500/20 to-amber-600/20", 
      textColor: "text-amber-400",
      border: "border-amber-500/30"
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, here's what's happening at <span className="text-primary font-semibold">NexusHR</span> today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-time System Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white/5 border-white/10 ${stat.border} border-l-4`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1 text-[10px] uppercase tracking-wider font-bold opacity-60">
                Updated just now
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="font-display">Weekly Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff40" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis
                    stroke="#ffffff40"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '12px',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPresent)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display">Departmental Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {[
                { name: 'Engineering', value: 85, color: 'bg-blue-500' },
                { name: 'Product Design', value: 72, color: 'bg-emerald-500' },
                { name: 'Growth & Marketing', value: 64, color: 'bg-rose-500' },
                { name: 'Global Management', value: 91, color: 'bg-amber-500' }
              ].map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">{dept.name}</span>
                    <span className="font-bold">{dept.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${dept.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${dept.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-primary font-bold">Insight:</span> Engineering attendance is up by 4% compared to last week. Keep it up!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

