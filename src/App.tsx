
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgot-password";
import Dashboard from "./pages/dashboard";
import SubmitRFQ from "./pages/submit-rfq";
import ViewQuotes from "./pages/view-quotes";
import ViewOrders from "./pages/view-orders";
import OrderDetails from "./pages/order-details";
import AccountSettings from "./pages/account-settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/submit-rfq" element={<SubmitRFQ />} />
              <Route path="/view-quotes" element={<ViewQuotes />} />
              <Route path="/quotes" element={<Navigate to="/view-quotes" replace />} />
              <Route path="/orders" element={<ViewOrders />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/settings" element={<Navigate to="/account-settings" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
