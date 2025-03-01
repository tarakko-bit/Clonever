import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/dashboard/Navbar";
import Home from "@/pages/home";
import Referrals from "@/pages/referrals";
import Convert from "@/pages/convert";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/referrals" component={Referrals} />
          <Route path="/convert" component={Convert} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;