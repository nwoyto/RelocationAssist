import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import LocationDetail from "@/pages/LocationDetail";
import CompareView from "@/pages/CompareView";
import MapView from "@/pages/MapView";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { LocationProvider } from "@/hooks/useLocations";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/location/:id" component={LocationDetail} />
              <Route path="/compare" component={CompareView} />
              <Route path="/map/:id?" component={MapView} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Footer />
        </div>
      </LocationProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
