import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CartPage from "./components/ui/Cart";
import LoginPage from "./components/ui/Login";
import SignUpPage from "./components/ui/Signup";
import Checkout from "./components/ui/Checkout";
import Header from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GalleryDashboard from "./components/ui/GalleryDashboard";
import CustomDashboard from "./components/ui/CustomDashboard";
import ExpressDashboard from "./components/ui/ExpressDashboard";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* <Route path="/home" element={<Header />} /> */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/customize" element={<CustomDashboard/>} />
          <Route path="/ExpressDashboard" element={<ExpressDashboard/>} />
          <Route path="/gallery" element={<GalleryDashboard/>} />
         {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
