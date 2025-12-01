import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Circle, Square, Triangle, Heart, Hexagon, Pentagon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const shapes = [
  { name: "Circle", Icon: Circle, color: "bg-coral", emoji: "⭕" },
  { name: "Square", Icon: Square, color: "bg-mint", emoji: "🟩" },
  { name: "Triangle", Icon: Triangle, color: "bg-sunny", emoji: "🔺" },
  { name: "Heart", Icon: Heart, color: "bg-destructive", emoji: "❤️" },
  { name: "Star", Icon: Star, color: "bg-star", emoji: "⭐" },
  { name: "Hexagon", Icon: Hexagon, color: "bg-lavender", emoji: "⬡" },
];

type ShapeType = typeof shapes[0];

const ShapeCollector = () => {
  const navigate = useNavigate();
  const [targetShape, setTargetShape] = useState<ShapeType>(shapes[0]);
  const [score, setScore] = useState(0);
  const [displayedShapes, setDisplayedShapes] = useState<(ShapeType & { id: number; x: number; y: number })[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [availableShapes, setAvailableShapes] = useState(shapes.slice(0, 3));

  const pickNewShape = () => {
    const newShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    setTargetShape(newShape);
  };

  useEffect(() => {
    pickNewShape();
  }, [availableShapes]);

  // Gradually add more shapes
  useEffect(() => {
    if (score === 5 && availableShapes.length < 4) {
      setAvailableShapes(shapes.slice(0, 4));
    } else if (score === 10 && availableShapes.length < 5) {
      setAvailableShapes(shapes.slice(0, 5));
    } else if (score === 15 && availableShapes.length < 6) {
      setAvailableShapes(shapes.slice(0, 6));
    }
  }, [score]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];

      // Better positioned shapes - in a grid-like pattern with some randomness
      const column = Math.floor(Math.random() * 3);
      const row = Math.floor(Math.random() * 2);
      const baseX = 20 + column * (window.innerWidth - 140) / 2;
      const baseY = 300 + row * 150;
      const randomOffsetX = (Math.random() - 0.5) * 80;
      const randomOffsetY = (Math.random() - 0.5) * 80;

      setDisplayedShapes((prev) => {
        if (prev.length >= 8) return prev; // Limit total shapes

        return [
          ...prev,
          {
            ...randomShape,
            id: Date.now() + Math.random(),
            x: baseX + randomOffsetX,
            y: baseY + randomOffsetY,
          },
        ];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [availableShapes]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setDisplayedShapes((prev) => {
        if (prev.length > 10) {
          return prev.slice(-8);
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(cleanup);
  }, []);

  const handleShapeTap = (shape: ShapeType & { id: number; x: number; y: number }) => {
    if (shape.name === targetShape.name) {
      setScore((prev) => prev + 1);
      setComboCount((prev) => prev + 1);
      setShowSuccess(true);
      setDisplayedShapes((prev) => prev.filter((s) => s.id !== shape.id));
      setTimeout(() => {
        setShowSuccess(false);
        pickNewShape();
      }, 700);
    } else {
      // Gentle shake for wrong choice
      setComboCount(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-mint/30 via-background to-sunny/30 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/")}
          className="bg-white/90 rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        >
          <Home className="w-8 h-8 text-primary" />
        </button>

        <motion.div
          className="flex items-center gap-3 bg-white/90 rounded-full px-6 py-3 shadow-lg"
          animate={{ scale: showSuccess ? [1, 1.2, 1] : 1 }}
        >
          <Star className="w-8 h-8 text-star fill-star" />
          <span className="text-3xl font-bold text-foreground">{score}</span>
        </motion.div>
      </div>

      {/* Target Shape */}
      <motion.div
        className="absolute top-24 left-1/2 -translate-x-1/2 text-center"
        animate={{ scale: showSuccess ? [1, 0.9, 1.1, 1] : 1 }}
      >
        <p className="text-3xl font-bold text-foreground mb-4">Find all the</p>
        <motion.div
          key={targetShape.name}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`${targetShape.color} rounded-3xl shadow-2xl border-8 border-white p-6 inline-block`}
        >
          <targetShape.Icon className="w-20 h-20 text-white" strokeWidth={3} />
        </motion.div>
        <p className="text-2xl font-bold text-foreground mt-3">
          {targetShape.name}s! {targetShape.emoji}
        </p>
      </motion.div>

      {/* Shapes */}
      <AnimatePresence>
        {displayedShapes.map((shape) => (
          <motion.button
            key={shape.id}
            initial={{ scale: 0, x: shape.x, y: shape.y, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleShapeTap(shape)}
            className={`absolute ${shape.color} rounded-3xl shadow-xl border-6 border-white p-5`}
            style={{ left: 0, top: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <shape.Icon className="w-16 h-16 text-white" strokeWidth={3} />
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
          >
            <div className="text-9xl mb-4">{targetShape.emoji}</div>
            {comboCount >= 3 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-primary"
              >
                Great job! 🎉
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti particles */}
      {showSuccess && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl pointer-events-none"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 300,
                scale: 1,
                opacity: 0,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </>
      )}

      {/* Level indicator */}
      {score > 0 && score % 5 === 0 && displayedShapes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-8 py-4 shadow-lg"
        >
          <p className="text-2xl font-bold text-primary">
            Level {Math.floor(score / 5) + 1}! 🎯
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ShapeCollector;
