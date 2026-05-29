import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyReservations from "./pages/MyReservations";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/admin/Dashboard";
import AdminRooms from "./pages/admin/Rooms";
import AdminReservations from "./pages/admin/Reservations";
import AdminCalendar from "./pages/admin/Calendar";
import AdminReports from "./pages/admin/Reports";
import AdminUsers from "./pages/admin/Users";
import AdminInventory from "./pages/admin/Inventory";
import AdminCheckInOut from "./pages/admin/CheckInOut";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/reservations" component={AdminReservations} />
            <Route path="/calendar" component={AdminCalendar} />
            <Route path="/rooms" component={AdminRooms} />
            <Route path="/checkinout" component={AdminCheckInOut} />
            <Route path="/inventory" component={AdminInventory} />
            <Route path="/reports" component={AdminReports} />
            <Route path="/users" component={AdminUsers} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      <Route path="/" nest>
        <MainLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/rooms/:id" component={RoomDetail} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/my-reservations" component={MyReservations} />
            <Route path="/profile" component={Profile} />
            <Route path="/services" component={Services} />
            <Route path="/gallery" component={Gallery} />
            <Route path="/contact" component={Contact} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
