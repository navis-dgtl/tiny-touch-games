import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BubblePop from "./pages/games/BubblePop";
import ColorMatch from "./pages/games/ColorMatch";
import ShapeCollector from "./pages/games/ShapeCollector";
import FruitCatch from "./pages/games/FruitCatch";
import AnimalSounds from "./pages/games/AnimalSounds";
import CountingFun from "./pages/games/CountingFun";
import SizeSorting from "./pages/games/SizeSorting";
import MemoryMatch from "./pages/games/MemoryMatch";
import MusicalInstruments from "./pages/games/MusicalInstruments";
import RainbowPaint from "./pages/games/RainbowPaint";
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
          <Route path="/games/bubble-pop" element={<BubblePop />} />
          <Route path="/games/color-match" element={<ColorMatch />} />
          <Route path="/games/shape-collector" element={<ShapeCollector />} />
          <Route path="/games/fruit-catch" element={<FruitCatch />} />
          <Route path="/games/animal-sounds" element={<AnimalSounds />} />
          <Route path="/games/counting-fun" element={<CountingFun />} />
          <Route path="/games/size-sorting" element={<SizeSorting />} />
          <Route path="/games/memory-match" element={<MemoryMatch />} />
          <Route path="/games/musical-instruments" element={<MusicalInstruments />} />
          <Route path="/games/rainbow-paint" element={<RainbowPaint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
