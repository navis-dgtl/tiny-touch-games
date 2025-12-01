import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = [
  { name: "Red", value: "#f08080", class: "bg-coral" },
  { name: "Green", value: "#98d8c8", class: "bg-mint" },
  { name: "Yellow", value: "#f6e05e", class: "bg-sunny" },
  { name: "Blue", value: "#93c5fd", class: "bg-sky" },
  { name: "Orange", value: "#fed7aa", class: "bg-peach" },
  { name: "Purple", value: "#ddd6fe", class: "bg-lavender" },
];

const RainbowPaint = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState(0);
  const [playArea, setPlayArea] = useState({ width: 0, height: 0 });
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Calculate safe play area and resize canvas
  useEffect(() => {
    const updatePlayArea = () => {
      if (containerRef.current && canvasRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setPlayArea({ width, height });

        // Update canvas size
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };

    updatePlayArea();
    window.addEventListener('resize', updatePlayArea);
    return () => window.removeEventListener('resize', updatePlayArea);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      drawPoint(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      drawPoint(e.clientX - rect.left, e.clientY - rect.top);

      // Add sparkles while drawing
      if (Math.random() > 0.7) {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
        };
        setSparkles((prev) => [...prev.slice(-5), newSparkle]);
      }
    }
  };

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStrokes((prev) => prev + 1);
    }
  };

  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = selectedColor.value;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Add a gradient glow effect
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    gradient.addColorStop(0, selectedColor.value);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes(0);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-background overflow-hidden">
      {/* Canvas - z-5 */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 touch-none cursor-crosshair"
        style={{ touchAction: "none", zIndex: 5 }}
      />

      {/* Header Zone - z-50 */}
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="p-4 flex justify-between items-start">
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl pointer-events-auto border-4 border-white/50"
          >
            <Home className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </motion.button>

          <motion.div
            animate={{ scale: strokes > 0 && strokes % 10 === 0 ? [1, 1.15, 1] : 1 }}
            className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-2xl pointer-events-auto border-4 border-white/50"
          >
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-star fill-star" />
            <span className="text-2xl sm:text-3xl font-bold text-foreground min-w-[2ch]">{strokes}</span>
          </motion.div>

          <motion.button
            onClick={clearCanvas}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl pointer-events-auto border-4 border-white/50"
          >
            <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" />
          </motion.button>
        </div>
      </div>

      {/* Instructions - z-45 */}
      <AnimatePresence>
        {strokes === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 45 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white/50">
              <p className="text-xl sm:text-2xl font-bold text-foreground text-center">
                Draw with your finger! 🎨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Message - z-40 */}
      <AnimatePresence>
        {strokes > 0 && strokes % 20 === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 40 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 sm:px-10 py-4 sm:py-6 shadow-2xl border-8 border-white/70">
              <p className="text-3xl sm:text-4xl font-bold text-primary text-center">
                Beautiful art! 🎨✨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkles Animation - z-30 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ opacity: 1, scale: 0, rotate: 0 }}
              animate={{ opacity: 0, scale: 2, rotate: 180 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute text-2xl sm:text-3xl"
              style={{ left: sparkle.x, top: sparkle.y }}
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Current Color Indicator - z-15 */}
      <motion.div
        className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 15 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border-4 border-white/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${selectedColor.class} border-2 border-white drop-shadow-lg`} />
            <span className="text-lg sm:text-xl font-bold text-foreground">{selectedColor.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Color Palette - z-10 */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2"
        style={{ zIndex: 10 }}
      >
        <div className="flex gap-2 sm:gap-3 bg-white/95 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-2xl border-4 border-white/50">
          {colors.map((color, index) => (
            <motion.button
              key={color.name}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.4 + index * 0.08,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(color)}
              className={`
                w-12 h-12 sm:w-16 sm:h-16 rounded-full ${color.class} shadow-xl
                border-4 transition-all duration-200
                ${selectedColor.name === color.name ? "border-primary scale-110 shadow-2xl" : "border-white"}
              `}
            />
          ))}
        </div>
      </motion.div>

      {/* Background Floating Decorations - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-5xl opacity-4"
            initial={{
              x: (i * playArea.width) / 6,
              y: playArea.height + 100,
            }}
            animate={{
              y: -150,
              rotate: 360,
            }}
            transition={{
              duration: 25 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          >
            {['🎨', '🖌️', '✨', '🌈', '⭐', '💫'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RainbowPaint;
