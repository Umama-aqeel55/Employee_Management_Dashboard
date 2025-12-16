import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/lib/mock-store";

import Login from "@/pages/auth/Login";
import Overview from "@/pages/dashboard/Overview";
import EmployeeList from "@/pages/employees/EmployeeList";
import AttendanceView from "@/pages/attendance/AttendanceView";
import LeaveManagement from "@/pages/leaves/LeaveManagement";
import UserProfile from "@/pages/profile/UserProfile";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NotFound from "@/pages/not-found";

// Protected Route Wrapper
function ProtectedRoute({ component: Component, roles = [] }: { component: any, roles?: string[] }) {
  const { currentUser } = useApp();

  if (!currentUser) return <Redirect to="/login" />;
  if (roles.length > 0 && !roles.includes(currentUser.role)) return <Redirect to="/" />;

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Protected Routes */}
      <Route path="/">
        {() => <ProtectedRoute component={Overview} />}
      </Route>
      <Route path="/employees">
        {() => <ProtectedRoute component={EmployeeList} roles={['admin', 'manager']} />}
      </Route>
      <Route path="/attendance">
        {() => <ProtectedRoute component={AttendanceView} />}
      </Route>
      <Route path="/leaves">
        {() => <ProtectedRoute component={LeaveManagement} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={UserProfile} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
