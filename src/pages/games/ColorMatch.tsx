import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = [
  { name: "Red", class: "bg-coral", emoji: "❤️" },
  { name: "Green", class: "bg-mint", emoji: "💚" },
  { name: "Yellow", class: "bg-sunny", emoji: "💛" },
  { name: "Orange", class: "bg-peach", emoji: "🧡" },
  { name: "Purple", class: "bg-lavender", emoji: "💜" },
  { name: "Blue", class: "bg-sky", emoji: "💙" },
];

const ColorMatch = () => {
  const navigate = useNavigate();
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [availableColors, setAvailableColors] = useState(colors.slice(0, 3));
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pickNewColor = () => {
    const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setTargetColor(newColor);
  };

  useEffect(() => {
    pickNewColor();
  }, []);

  // Gradually increase difficulty
  useEffect(() => {
    if (score === 5 && availableColors.length < 4) {
      setAvailableColors(colors.slice(0, 4));
      pickNewColor();
    } else if (score === 10 && availableColors.length < 5) {
      setAvailableColors(colors.slice(0, 5));
      pickNewColor();
    } else if (score === 15 && availableColors.length < 6) {
      setAvailableColors(colors.slice(0, 6));
      pickNewColor();
    }
  }, [score]);

  const handleColorTap = (color: typeof colors[0]) => {
    if (isTransitioning) return;

    if (color.name === targetColor.name) {
      setIsTransitioning(true);
      setScore((prev) => prev + 1);
      setComboCount((prev) => prev + 1);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        pickNewColor();
        setIsTransitioning(false);
      }, 1000);
    } else {
      setWrongChoice(color.name);
      setComboCount(0);
      setTimeout(() => {
        setWrongChoice(null);
      }, 600);
    }
  };

  // Determine grid layout based on number of colors
  const getGridCols = () => {
    if (availableColors.length <= 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-background via-sky/10 to-mint/10 overflow-hidden">
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

      {/* Target Color Display - z-30 */}
      <div className="absolute top-20 left-0 right-0 z-30 pointer-events-none">
        <motion.div
          className="text-center px-4"
          animate={{ scale: showSuccess ? [1, 0.95, 1.05, 1] : 1 }}
        >
          <motion.p
            className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6"
            animate={{ y: showSuccess ? [0, -8, 0] : 0 }}
          >
            Tap {targetColor.name}! {targetColor.emoji}
          </motion.p>

          <motion.div
            key={targetColor.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="inline-block"
          >
            <div className={`w-28 h-28 sm:w-36 sm:h-36 ${targetColor.class} rounded-3xl shadow-2xl border-8 border-white`} />
          </motion.div>
        </motion.div>
      </div>

      {/* Color Options Grid - z-10 */}
      <div className="absolute inset-0 flex items-center justify-center pt-32 sm:pt-40 pb-20" style={{ zIndex: 10 }}>
        <div className={`grid ${getGridCols()} gap-4 sm:gap-6 max-w-2xl px-4`}>
          <AnimatePresence mode="popLayout">
            {availableColors.map((color, index) => {
              const isWrong = wrongChoice === color.name;
              const isTarget = color.name === targetColor.name;

              return (
                <motion.button
                  key={color.name}
                  layout
                  initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
                  animate={{
                    opacity: 1,
                    scale: isWrong ? [1, 0.85, 1] : 1,
                    rotate: isWrong ? [0, -15, 15, -15, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.3, rotate: 180 }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { delay: index * 0.05 },
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleColorTap(color)}
                  disabled={isTransitioning}
                  className={`
                    relative w-full aspect-square ${color.class} rounded-3xl shadow-2xl
                    border-8 transition-all duration-200
                    ${isWrong ? 'border-red-500 shadow-red-500/50' : 'border-white'}
                    ${isTransitioning ? 'opacity-75' : ''}
                    min-h-[100px] sm:min-h-[120px]
                  `}
                >
                  {isWrong && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: [0, 1.3, 1], rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl"
                    >
                      ❌
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Success Overlay - z-40 */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ zIndex: 40 }}
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.3, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-8xl sm:text-9xl mb-4"
            >
              ⭐
            </motion.div>

            {comboCount >= 3 && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-2xl border-4 border-white/50"
              >
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  Amazing! 🎉
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Particles - z-35 */}
      {showSuccess && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl sm:text-5xl"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 500,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 500,
                scale: 1,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {['🎈', '⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Level Up Indicator - z-30 */}
      <AnimatePresence>
        {score > 0 && score % 5 === 0 && !showSuccess && (
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
              x: (i * window.innerWidth) / 6,
              y: window.innerHeight + 100,
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
            {['❤️', '💚', '💛', '🧡', '💜', '💙'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ColorMatch;
