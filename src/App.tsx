
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import { useEffect, useState } from 'react';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./integrations/supabase/client";

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
      </Routes>
      <Toaster />
    </Router>
  );
}
