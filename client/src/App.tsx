import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Security from "./pages/Security";
import ServiceAreas from "./pages/ServiceAreas";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import OwnerDashboard from "./pages/OwnerDashboard";
import LineSettings from "./pages/LineSettings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/security"} component={Security} />
      <Route path={"/service-areas"} component={ServiceAreas} />
      <Route path={"/booking"} component={Booking} />
      <Route path={"/booking-history"} component={BookingHistory} />
      <Route path={"/owner-dashboard"} component={OwnerDashboard} />
      <Route path={"/line-settings"} component={LineSettings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
