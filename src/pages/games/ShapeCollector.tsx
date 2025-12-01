import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Circle, Square, Triangle, Heart, Hexagon } from "lucide-react";
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
type DisplayedShape = ShapeType & { id: number; x: number; y: number };

const ShapeCollector = () => {
  const navigate = useNavigate();
  const [targetShape, setTargetShape] = useState<ShapeType>(shapes[0]);
  const [score, setScore] = useState(0);
  const [displayedShapes, setDisplayedShapes] = useState<DisplayedShape[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [availableShapes, setAvailableShapes] = useState(shapes.slice(0, 3));
  const containerRef = useRef<HTMLDivElement>(null);
  const [playArea, setPlayArea] = useState({ width: 0, height: 0 });

  // Calculate safe play area
  useEffect(() => {
    const updatePlayArea = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setPlayArea({ width, height });
      }
    };

    updatePlayArea();
    window.addEventListener('resize', updatePlayArea);
    return () => window.removeEventListener('resize', updatePlayArea);
  }, []);

  const pickNewShape = useCallback(() => {
    const newShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    setTargetShape(newShape);
  }, [availableShapes]);

  useEffect(() => {
    pickNewShape();
  }, [pickNewShape]);

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

  // Spawn shapes in play area
  useEffect(() => {
    if (playArea.width === 0 || playArea.height === 0) return;

    const interval = setInterval(() => {
      const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];

      const shapeSize = 96; // 80px + padding
      const safeMargin = 20;
      const topMargin = 280; // Account for header + target display
      const bottomMargin = 40;

      // Calculate available play area
      const availableWidth = playArea.width - shapeSize - safeMargin * 2;
      const availableHeight = playArea.height - topMargin - bottomMargin - shapeSize;

      // Generate position within safe bounds
      const x = safeMargin + Math.random() * availableWidth;
      const y = topMargin + Math.random() * availableHeight;

      setDisplayedShapes((prev) => {
        if (prev.length >= 8) return prev; // Limit total shapes

        return [
          ...prev,
          {
            ...randomShape,
            id: Date.now() + Math.random(),
            x,
            y,
          },
        ];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [availableShapes, playArea]);

  // Clean up old shapes
  useEffect(() => {
    const cleanup = setInterval(() => {
      setDisplayedShapes((prev) => {
        if (prev.length > 10) {
          return prev.slice(-8);
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  const handleShapeTap = (shape: DisplayedShape) => {
    if (shape.name === targetShape.name) {
      setScore((prev) => prev + 1);
      setComboCount((prev) => prev + 1);
      setShowSuccess(true);
      setDisplayedShapes((prev) => prev.filter((s) => s.id !== shape.id));

      setTimeout(() => {
        setShowSuccess(false);
        pickNewShape();
      }, 800);
    } else {
      setComboCount(0);
      // Gentle visual feedback for wrong choice - shape will shake via animation
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-mint/20 via-background to-sunny/20 overflow-hidden">
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
            animate={{ scale: showSuccess ? [1, 1.15, 1] : 1 }}
            className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-2xl pointer-events-auto border-4 border-white/50"
          >
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-star fill-star" />
            <span className="text-2xl sm:text-3xl font-bold text-foreground min-w-[2ch]">{score}</span>
          </motion.div>
        </div>
      </div>

      {/* Target Shape Display - z-40 */}
      <div className="absolute top-20 left-0 right-0 z-40 pointer-events-none">
        <motion.div
          className="text-center px-4"
          animate={{ scale: showSuccess ? [1, 0.95, 1.05, 1] : 1 }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Find all the
          </p>

          <motion.div
            key={targetShape.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="inline-block"
          >
            <div className={`${targetShape.color} rounded-3xl shadow-2xl border-8 border-white p-4 sm:p-6`}>
              <targetShape.Icon className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={3} />
            </div>
          </motion.div>

          <p className="text-xl sm:text-2xl font-bold text-foreground mt-2 sm:mt-3">
            {targetShape.name}s! {targetShape.emoji}
          </p>
        </motion.div>
      </div>

      {/* Play Area for Shapes - z-10 */}
      <div className="absolute inset-0 pt-64 pb-4" style={{ zIndex: 10 }}>
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
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className={`absolute ${shape.color} rounded-3xl shadow-2xl border-6 border-white p-4 sm:p-5 touch-manipulation`}
              style={{ left: 0, top: 0 }}
            >
              <shape.Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={3} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Success Overlay - z-45 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ zIndex: 45 }}
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.3, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-8xl sm:text-9xl mb-4"
            >
              {targetShape.emoji}
            </motion.div>

            {comboCount >= 3 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-2xl border-4 border-white/50"
              >
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  Great job! 🎉
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Particles - z-35 */}
      {showSuccess && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl sm:text-5xl"
              initial={{
                x: playArea.width / 2,
                y: playArea.height / 2,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: playArea.width / 2 + (Math.random() - 0.5) * 400,
                y: playArea.height / 2 + (Math.random() - 0.5) * 400,
                scale: 1,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Level Up Indicator - z-30 */}
      <AnimatePresence>
        {score > 0 && score % 5 === 0 && displayedShapes.length === 0 && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-2xl border-4 border-white/50">
              <p className="text-xl sm:text-2xl font-bold text-primary whitespace-nowrap">
                Level {Math.floor(score / 5) + 1}! 🎯
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decoration - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl sm:text-5xl opacity-5"
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
            }}
          >
            {shapes[i % shapes.length].emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShapeCollector;
