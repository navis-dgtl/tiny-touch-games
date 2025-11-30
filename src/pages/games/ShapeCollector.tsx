import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Circle, Square, Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const shapes = [
  { name: "circle", Icon: Circle, color: "bg-coral" },
  { name: "square", Icon: Square, color: "bg-mint" },
  { name: "triangle", Icon: Triangle, color: "bg-sunny" },
];

type ShapeType = typeof shapes[0];

const ShapeCollector = () => {
  const navigate = useNavigate();
  const [targetShape, setTargetShape] = useState<ShapeType>(shapes[0]);
  const [score, setScore] = useState(0);
  const [displayedShapes, setDisplayedShapes] = useState<(ShapeType & { id: number })[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickNewShape = () => {
    const newShape = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(newShape);
  };

  useEffect(() => {
    pickNewShape();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      setDisplayedShapes((prev) => [
        ...prev,
        { ...randomShape, id: Date.now() + Math.random() },
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setDisplayedShapes((prev) => prev.slice(-8));
    }, 3000);

    return () => clearInterval(cleanup);
  }, []);

  const handleShapeTap = (shape: ShapeType & { id: number }) => {
    if (shape.name === targetShape.name) {
      setScore((prev) => prev + 1);
      setShowSuccess(true);
      setDisplayedShapes((prev) => prev.filter((s) => s.id !== shape.id));
      setTimeout(() => {
        setShowSuccess(false);
        pickNewShape();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/")}
          className="bg-white rounded-full p-3 shadow-lg"
        >
          <Home className="w-6 h-6 text-primary" />
        </button>
        
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
          <Star className="w-6 h-6 text-star fill-star" />
          <span className="text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>

      {/* Target Shape */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center">
        <p className="text-2xl font-bold text-foreground mb-4">Tap all the</p>
        <motion.div
          key={targetShape.name}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className={`${targetShape.color} rounded-3xl shadow-xl border-4 border-white p-6 inline-block`}
        >
          <targetShape.Icon className="w-16 h-16 text-white" strokeWidth={3} />
        </motion.div>
      </div>

      {/* Shapes */}
      <AnimatePresence>
        {displayedShapes.map((shape) => {
          const randomX = Math.random() * (window.innerWidth - 100);
          const randomY = 300 + Math.random() * (window.innerHeight - 400);
          
          return (
            <motion.button
              key={shape.id}
              initial={{ scale: 0, x: randomX, y: randomY, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleShapeTap(shape)}
              className={`absolute ${shape.color} rounded-3xl shadow-xl border-4 border-white p-4`}
              style={{ left: 0, top: 0 }}
            >
              <shape.Icon className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-8xl">⭐</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeCollector;
