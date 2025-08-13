import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateProject from "./pages/CreateProject";
import ProjectView from "./pages/ProjectView";
import ProjectApply from "./pages/ProjectApply";
import ProjectExport from "./pages/ProjectExport";
import ProjectExport3D from "./pages/ProjectExport3D";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectView />} />
          <Route path="/project/:id/edit" element={<CreateProject />} />
          <Route path="/project/:id/apply" element={<ProjectApply />} />
          <Route path="/project/:id/export" element={<ProjectExport />} />
          <Route path="/project/:id/export-3d" element={<ProjectExport3D />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
