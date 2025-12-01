import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const objects = [
  { emoji: "🎈", name: "balloon" },
  { emoji: "⭐", name: "star" },
  { emoji: "🍎", name: "apple" },
  { emoji: "🌸", name: "flower" },
  { emoji: "🦋", name: "butterfly" },
  { emoji: "🍪", name: "cookie" },
  { emoji: "⚽", name: "ball" },
  { emoji: "🎁", name: "present" },
  { emoji: "🚗", name: "car" },
  { emoji: "🏠", name: "house" },
];

type SizeType = "big" | "small";

const SizeSorting = () => {
  const navigate = useNavigate();
  const [targetSize, setTargetSize] = useState<SizeType>("big");
  const [currentObject, setCurrentObject] = useState(objects[0]);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongChoice, setWrongChoice] = useState(false);
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

  useEffect(() => {
    pickNewRound();
  }, []);

  const pickNewRound = () => {
    const newSize: SizeType = Math.random() > 0.5 ? "big" : "small";
    const newObject = objects[Math.floor(Math.random() * objects.length)];
    setTargetSize(newSize);
    setCurrentObject(newObject);
  };

  const handleSizeTap = (size: SizeType) => {
    if (size === targetSize) {
      setScore((prev) => prev + 1);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        pickNewRound();
      }, 1500);
    } else {
      setWrongChoice(true);
      setTimeout(() => {
        setWrongChoice(false);
      }, 600);
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-lavender/30 via-background to-mint/30 overflow-hidden">
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

        {/* Instructions - below header */}
        <AnimatePresence>
          {score === 0 && !showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 mx-4 text-center"
            >
              <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  Tap the BIG or SMALL! 📏
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Target Size Instruction - z-30 */}
      <div className="absolute top-20 sm:top-24 left-0 right-0" style={{ zIndex: 30 }}>
        <motion.div
          key={`${targetSize}-${currentObject.emoji}`}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center px-4"
        >
          <p className="text-3xl sm:text-4xl font-bold text-foreground">
            Tap the{" "}
            <span className={targetSize === "big" ? "text-coral" : "text-sky"}>
              {targetSize.toUpperCase()}
            </span>{" "}
            one!
          </p>
        </motion.div>
      </div>

      {/* Size Options - z-10 */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-16" style={{ zIndex: 10 }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20">
          {/* Small Option */}
          <motion.button
            key={`small-${currentObject.emoji}`}
            initial={{ opacity: 0, x: -100, scale: 0.3, rotate: -45 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: wrongChoice && targetSize === "small" ? [1, 0.85, 1] : 1,
              rotate: wrongChoice && targetSize === "small" ? [0, -12, 12, -12, 0] : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSizeTap("small")}
            className={`
              bg-sky rounded-3xl p-6 sm:p-8 shadow-2xl
              border-6 sm:border-8 transition-all duration-200
              ${wrongChoice && targetSize === "small" ? 'border-red-500 shadow-red-500/50' : 'border-white'}
              flex flex-col items-center justify-center gap-3 sm:gap-4
              min-w-[160px] sm:min-w-[180px]
            `}
          >
            <div className="text-5xl sm:text-6xl drop-shadow-lg">{currentObject.emoji}</div>
            <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">SMALL</span>
          </motion.button>

          {/* Big Option */}
          <motion.button
            key={`big-${currentObject.emoji}`}
            initial={{ opacity: 0, x: 100, scale: 0.3, rotate: 45 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: wrongChoice && targetSize === "big" ? [1, 0.85, 1] : 1,
              rotate: wrongChoice && targetSize === "big" ? [0, -12, 12, -12, 0] : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSizeTap("big")}
            className={`
              bg-coral rounded-3xl p-8 sm:p-12 shadow-2xl
              border-6 sm:border-8 transition-all duration-200
              ${wrongChoice && targetSize === "big" ? 'border-red-500 shadow-red-500/50' : 'border-white'}
              flex flex-col items-center justify-center gap-4 sm:gap-6
              min-w-[200px] sm:min-w-[240px]
            `}
          >
            <div className="text-8xl sm:text-9xl drop-shadow-lg">{currentObject.emoji}</div>
            <span className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">BIG</span>
          </motion.button>
        </div>
      </div>

      {/* Wrong Answer Feedback - z-45 */}
      <AnimatePresence>
        {wrongChoice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
            animate={{ scale: [0.3, 1.3, 1], rotate: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ zIndex: 45 }}
          >
            <div className="text-7xl sm:text-8xl">❌</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay - z-40 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/30 backdrop-blur-sm"
            style={{ zIndex: 40 }}
          >
            <motion.div
              initial={{ scale: 0.3, y: 50, rotate: -15 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.3, y: 50, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center gap-4 sm:gap-6 border-8 border-white/70"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1.05, 1.15, 1],
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{ duration: 0.5, repeat: 2, ease: "easeInOut" }}
                className={targetSize === "big" ? "text-8xl sm:text-9xl" : "text-6xl sm:text-7xl"}
              >
                {currentObject.emoji}
              </motion.div>
              <div className="text-center">
                <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-2">
                  {targetSize === "big" ? "BIG! 🎉" : "SMALL! ⭐"}
                </h2>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  Perfect!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Confetti - z-35 */}
      <AnimatePresence>
        {showSuccess && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl sm:text-4xl"
                initial={{
                  x: playArea.width / 2,
                  y: playArea.height / 2,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: playArea.width / 2 + (Math.random() - 0.5) * 500,
                  y: playArea.height / 2 + (Math.random() - 0.5) * 500,
                  scale: 1,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ left: 0, top: 0 }}
              >
                {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Milestone Celebration - z-25 */}
      <AnimatePresence>
        {score > 0 && score % 5 === 0 && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 25 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-10 py-3 sm:py-6 shadow-2xl border-4 border-white/50">
              <p className="text-2xl sm:text-3xl font-bold text-primary whitespace-nowrap">
                {score} correct! Amazing! 🎉
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Floating Decorations - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-5xl opacity-8"
            initial={{
              x: (i * playArea.width) / 6,
              y: playArea.height + 100,
            }}
            animate={{
              y: -150,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          >
            {objects[i % objects.length].emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SizeSorting;
