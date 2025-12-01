import { useState, useEffect } from "react";
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
    <div className="fixed inset-0 bg-gradient-to-br from-lavender/30 via-background to-mint/30 overflow-hidden">
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

      {/* Instructions */}
      {score === 0 && !showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-28 left-1/2 -translate-x-1/2 text-center bg-white/90 rounded-3xl px-8 py-4 shadow-lg"
        >
          <p className="text-2xl font-bold text-foreground">Tap the BIG or SMALL! 📏</p>
        </motion.div>
      )}

      {/* Target size instruction */}
      <motion.div
        key={`${targetSize}-${currentObject.emoji}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-36 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="text-4xl font-bold text-foreground mb-4">
          Tap the{" "}
          <span className={targetSize === "big" ? "text-coral" : "text-sky"}>
            {targetSize.toUpperCase()}
          </span>{" "}
          one!
        </p>
      </motion.div>

      {/* Size Options */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20">
          {/* Small Option */}
          <motion.button
            key={`small-${currentObject.emoji}`}
            initial={{ opacity: 0, x: -100, scale: 0.5 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: wrongChoice && targetSize === "small" ? [1, 0.8, 1] : 1,
              rotate: wrongChoice && targetSize === "small" ? [0, -10, 10, -10, 0] : 0,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSizeTap("small")}
            className={`bg-sky rounded-3xl p-8 shadow-2xl border-8 ${
              wrongChoice && targetSize === "small" ? 'border-red-500' : 'border-white'
            } flex flex-col items-center justify-center gap-4 min-w-[180px]`}
          >
            <div className="text-6xl">{currentObject.emoji}</div>
            <span className="text-3xl font-bold text-white">SMALL</span>
          </motion.button>

          {/* Big Option */}
          <motion.button
            key={`big-${currentObject.emoji}`}
            initial={{ opacity: 0, x: 100, scale: 0.5 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: wrongChoice && targetSize === "big" ? [1, 0.8, 1] : 1,
              rotate: wrongChoice && targetSize === "big" ? [0, -10, 10, -10, 0] : 0,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSizeTap("big")}
            className={`bg-coral rounded-3xl p-12 shadow-2xl border-8 ${
              wrongChoice && targetSize === "big" ? 'border-red-500' : 'border-white'
            } flex flex-col items-center justify-center gap-6 min-w-[240px]`}
          >
            <div className="text-9xl">{currentObject.emoji}</div>
            <span className="text-4xl font-bold text-white">BIG</span>
          </motion.button>
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 bg-black/20"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="bg-white rounded-3xl p-12 sm:p-16 shadow-2xl flex flex-col items-center gap-6"
            >
              <div className={targetSize === "big" ? "text-9xl" : "text-7xl"}>
                {currentObject.emoji}
              </div>
              <h2 className="text-6xl font-bold text-primary">
                {targetSize === "big" ? "BIG! 🎉" : "SMALL! ⭐"}
              </h2>
              <p className="text-3xl font-bold text-foreground">Perfect!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success confetti */}
      {showSuccess && (
        <>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl pointer-events-none"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
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
              {['⭐', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </>
      )}

      {/* Wrong answer feedback */}
      {wrongChoice && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl pointer-events-none z-20"
        >
          ❌
        </motion.div>
      )}

      {/* Floating decoration */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl pointer-events-none opacity-15"
          initial={{
            x: (i * window.innerWidth) / 5,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            delay: i * 2,
          }}
        >
          {objects[i % objects.length].emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default SizeSorting;
