import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const objects = [
  { emoji: "🎈", name: "balloon", color: "bg-coral" },
  { emoji: "⭐", name: "star", color: "bg-star" },
  { emoji: "🍎", name: "apple", color: "bg-coral" },
  { emoji: "🌸", name: "flower", color: "bg-peach" },
  { emoji: "🦋", name: "butterfly", color: "bg-lavender" },
  { emoji: "🍪", name: "cookie", color: "bg-peach" },
  { emoji: "🎁", name: "present", color: "bg-mint" },
  { emoji: "🌈", name: "rainbow", color: "bg-sky" },
];

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five"];

const CountingFun = () => {
  const navigate = useNavigate();
  const [targetNumber, setTargetNumber] = useState(1);
  const [currentObject, setCurrentObject] = useState(objects[0]);
  const [displayedObjects, setDisplayedObjects] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);

  useEffect(() => {
    pickNewRound();
  }, []);

  const pickNewRound = () => {
    const newNumber = Math.floor(Math.random() * 5) + 1; // 1-5
    const newObject = objects[Math.floor(Math.random() * objects.length)];
    setTargetNumber(newNumber);
    setCurrentObject(newObject);
    setDisplayedObjects(Array.from({ length: newNumber }, (_, i) => i));
    setSelectedCount(null);
  };

  const handleNumberTap = (number: number) => {
    setSelectedCount(number);

    if (number === targetNumber) {
      setScore((prev) => prev + 1);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        pickNewRound();
      }, 2000);
    } else {
      setTimeout(() => {
        setSelectedCount(null);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-sunny/30 via-background to-coral/30 overflow-hidden">
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
          className="absolute top-28 left-1/2 -translate-x-1/2 text-center bg-white/90 rounded-3xl px-8 py-4 shadow-lg max-w-md"
        >
          <p className="text-2xl font-bold text-foreground">Count and tap! 🔢</p>
        </motion.div>
      )}

      {/* Counting Display */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <motion.div
          key={`${currentObject.emoji}-${targetNumber}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <p className="text-3xl font-bold text-foreground mb-6">
            How many {currentObject.name}s?
          </p>

          {/* Display objects to count */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <AnimatePresence>
              {displayedObjects.map((index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="text-7xl sm:text-8xl"
                >
                  {currentObject.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Number Options */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((number, index) => {
            const isCorrect = selectedCount === number && number === targetNumber;
            const isWrong = selectedCount === number && number !== targetNumber;

            return (
              <motion.button
                key={number}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isWrong ? [1, 0.8, 1] : 1,
                  rotate: isWrong ? [0, -10, 10, -10, 0] : 0,
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumberTap(number)}
                disabled={selectedCount !== null}
                className={`${currentObject.color} rounded-3xl p-6 sm:p-8 shadow-2xl border-6 border-white min-h-[100px] flex flex-col items-center justify-center ${
                  isWrong ? 'border-red-500' : ''
                } ${isCorrect ? 'border-green-500' : ''}`}
              >
                <span className="text-5xl sm:text-6xl font-bold text-white">{number}</span>
              </motion.button>
            );
          })}
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
              transition={{ duration: 0.5, repeat: 3 }}
              className="bg-white rounded-3xl p-12 sm:p-16 shadow-2xl flex flex-col items-center gap-6"
            >
              <div className="text-9xl">{currentObject.emoji}</div>
              <h2 className="text-6xl sm:text-7xl font-bold text-primary">
                {numberWords[targetNumber]}!
              </h2>
              <p className="text-4xl font-bold text-foreground">
                Great counting! 🎉
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success confetti */}
      {showSuccess && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl pointer-events-none"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 600,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 600,
                scale: 1,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {['⭐', '✨', '🌟', '💫', '🎉', '🎈'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </>
      )}

      {/* Wrong answer feedback */}
      {selectedCount !== null && selectedCount !== targetNumber && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl pointer-events-none z-20"
        >
          ❌
        </motion.div>
      )}
    </div>
  );
};

export default CountingFun;
