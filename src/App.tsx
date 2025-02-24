
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import SubmitRFQ from "@/pages/submit-rfq";
import Index from "@/pages/Index";
import Signup from "@/pages/signup";
import { supabase } from "./integrations/supabase/client";
import { AccountSettings } from "./pages/account-settings";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Index />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-rfq"
          element={
            <ProtectedRoute>
              <SubmitRFQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotes"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
