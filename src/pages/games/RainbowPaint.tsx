import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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

type PaintStroke = {
  x: number;
  y: number;
  color: string;
  size: number;
};

const RainbowPaint = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawPoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    drawPoint(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setStrokes((prev) => prev + 1);
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
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 touch-none cursor-crosshair"
        style={{ touchAction: "none" }}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
        <button
          onClick={() => navigate("/")}
          className="bg-white/90 rounded-full p-4 shadow-lg hover:scale-110 transition-transform pointer-events-auto"
        >
          <Home className="w-8 h-8 text-primary" />
        </button>

        <motion.div
          className="flex items-center gap-3 bg-white/90 rounded-full px-6 py-3 shadow-lg"
          animate={{ scale: strokes > 0 && strokes % 10 === 0 ? [1, 1.2, 1] : 1 }}
        >
          <Star className="w-8 h-8 text-star fill-star" />
          <span className="text-3xl font-bold text-foreground">{strokes}</span>
        </motion.div>

        <button
          onClick={clearCanvas}
          className="bg-white/90 rounded-full p-4 shadow-lg hover:scale-110 transition-transform pointer-events-auto"
        >
          <Trash2 className="w-8 h-8 text-destructive" />
        </button>
      </div>

      {/* Instructions */}
      {strokes === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-28 left-1/2 -translate-x-1/2 text-center bg-white/90 rounded-3xl px-8 py-4 shadow-lg pointer-events-none z-10"
        >
          <p className="text-2xl font-bold text-foreground">Draw with your finger! 🎨</p>
        </motion.div>
      )}

      {/* Color Palette */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 bg-white/90 rounded-full p-4 shadow-2xl z-10"
      >
        {colors.map((color, index) => (
          <motion.button
            key={color.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedColor(color)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${color.class} shadow-xl border-4 ${
              selectedColor.name === color.name ? "border-primary scale-110" : "border-white"
            } transition-all`}
          />
        ))}
      </motion.div>

      {/* Current Color Indicator */}
      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-6 py-3 shadow-lg pointer-events-none z-10"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${selectedColor.class} border-2 border-white`} />
          <span className="text-xl font-bold text-foreground">{selectedColor.name}</span>
        </div>
      </motion.div>

      {/* Milestone messages */}
      {strokes > 0 && strokes % 20 === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-white/95 rounded-3xl px-10 py-6 shadow-2xl z-20 pointer-events-none"
        >
          <p className="text-4xl font-bold text-primary text-center">
            Beautiful art! 🎨✨
          </p>
        </motion.div>
      )}

      {/* Sparkles when drawing */}
      {isDrawing && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`sparkle-${Date.now()}-${i}`}
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.6 }}
              className="absolute text-3xl pointer-events-none"
              style={{
                left: Math.random() * window.innerWidth,
                top: Math.random() * window.innerHeight,
              }}
            >
              ✨
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default RainbowPaint;
