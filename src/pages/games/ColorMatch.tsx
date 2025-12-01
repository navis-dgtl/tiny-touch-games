import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = [
  { name: "Red", class: "bg-coral", hsl: "hsl(var(--coral))", emoji: "❤️" },
  { name: "Green", class: "bg-mint", hsl: "hsl(var(--mint))", emoji: "💚" },
  { name: "Yellow", class: "bg-sunny", hsl: "hsl(var(--sunny))", emoji: "💛" },
  { name: "Orange", class: "bg-peach", hsl: "hsl(var(--peach))", emoji: "🧡" },
  { name: "Purple", class: "bg-lavender", hsl: "hsl(var(--lavender))", emoji: "💜" },
  { name: "Blue", class: "bg-sky", hsl: "hsl(var(--sky))", emoji: "💙" },
];

const ColorMatch = () => {
  const navigate = useNavigate();
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [availableColors, setAvailableColors] = useState(colors.slice(0, 3));
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [comboCount, setComboCount] = useState(0);

  const pickNewColor = () => {
    const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setTargetColor(newColor);
  };

  useEffect(() => {
    pickNewColor();
  }, [availableColors]);

  // Gradually increase difficulty
  useEffect(() => {
    if (score === 5 && availableColors.length < 4) {
      setAvailableColors(colors.slice(0, 4));
    } else if (score === 10 && availableColors.length < 5) {
      setAvailableColors(colors.slice(0, 5));
    } else if (score === 15 && availableColors.length < 6) {
      setAvailableColors(colors.slice(0, 6));
    }
  }, [score]);

  const handleColorTap = (color: typeof colors[0]) => {
    if (color.name === targetColor.name) {
      setScore((prev) => prev + 1);
      setComboCount((prev) => prev + 1);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        pickNewColor();
      }, 800);
    } else {
      setWrongChoice(color.name);
      setComboCount(0);
      setTimeout(() => {
        setWrongChoice(null);
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-sky/20 to-background overflow-hidden">
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

      {/* Target Color with Name */}
      <motion.div
        className="absolute top-28 left-1/2 -translate-x-1/2 text-center"
        animate={{ scale: showSuccess ? [1, 0.9, 1.1, 1] : 1 }}
      >
        <motion.p
          className="text-3xl font-bold text-foreground mb-6"
          animate={{ y: showSuccess ? [0, -10, 0] : 0 }}
        >
          Tap {targetColor.name}! {targetColor.emoji}
        </motion.p>
        <motion.div
          key={targetColor.name}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`w-32 h-32 ${targetColor.class} rounded-3xl shadow-2xl border-8 border-white mx-auto`}
        />
      </motion.div>

      {/* Color Options */}
      <div className="absolute inset-0 flex items-center justify-center pt-32">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 max-w-2xl">
          {availableColors.map((color, index) => {
            const isWrong = wrongChoice === color.name;
            const isTarget = color.name === targetColor.name;

            return (
              <motion.button
                key={color.name}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: isWrong ? [1, 0.8, 1] : 1,
                  rotate: isWrong ? [0, -10, 10, -10, 0] : 0,
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleColorTap(color)}
                className={`relative w-36 h-36 sm:w-44 sm:h-44 ${color.class} rounded-3xl shadow-2xl border-8 border-white transition-all ${
                  isWrong ? 'border-red-500' : ''
                }`}
              >
                {isWrong && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    className="absolute inset-0 flex items-center justify-center text-6xl"
                  >
                    ❌
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20"
          >
            <div className="text-9xl mb-4">⭐</div>
            {comboCount >= 3 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-primary"
              >
                Amazing! 🎉
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti on success */}
      {showSuccess && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl pointer-events-none"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 400,
                scale: 1,
                opacity: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {['🎈', '⭐', '✨', '🌟'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </>
      )}

      {/* Progress indicator */}
      {score > 0 && score % 5 === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
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

export default ColorMatch;
