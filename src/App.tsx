
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { I18nProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import Inventory from "@/pages/Inventory";
import Marketplace from "@/pages/Marketplace";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/inventory" replace />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
          <SonnerToaster position="bottom-right" />
        </Router>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
