import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import SubmitRFQ from "@/pages/submit-rfq";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./integrations/supabase/client";
import { AccountSettings } from "./pages/AccountSettings";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <div className="flex justify-center items-center h-screen bg-gray-100">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
              />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="flex justify-center items-center h-screen bg-gray-100">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                redirectTo="http://localhost:5173/dashboard"
              />
            </div>
          }
        />
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
      </Routes>
      <Toaster />
    </Router>
  );
}
