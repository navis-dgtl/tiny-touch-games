import { useState, useEffect, useRef } from "react";
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
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-sunny/30 via-background to-coral/30 overflow-hidden">
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
                  Count and tap! 🔢
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Counting Display - z-20 */}
      <div className="absolute inset-0 flex items-center justify-center pb-32" style={{ zIndex: 20 }}>
        <motion.div
          key={`${currentObject.emoji}-${targetNumber}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center px-4 max-w-2xl"
        >
          <motion.p
            animate={{ scale: showSuccess ? [1, 1.05, 1] : 1 }}
            className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8"
          >
            How many {currentObject.name}s?
          </motion.p>

          {/* Display objects to count */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <AnimatePresence>
              {displayedObjects.map((index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                  }}
                  className="text-6xl sm:text-7xl drop-shadow-xl"
                >
                  {currentObject.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Number Options - z-10 */}
      <div className="absolute bottom-0 left-0 right-0 pb-6 sm:pb-8" style={{ zIndex: 10 }}>
        <div className="px-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {[1, 2, 3, 4, 5].map((number, index) => {
              const isCorrect = selectedCount === number && number === targetNumber;
              const isWrong = selectedCount === number && number !== targetNumber;

              return (
                <motion.button
                  key={number}
                  initial={{ opacity: 0, y: 50, scale: 0.3 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isWrong ? [1, 0.85, 1] : 1,
                    rotate: isWrong ? [0, -12, 12, -12, 0] : 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNumberTap(number)}
                  disabled={selectedCount !== null}
                  className={`
                    ${currentObject.color} rounded-2xl sm:rounded-3xl p-4 sm:p-6
                    shadow-2xl border-4 sm:border-6 transition-all duration-200
                    min-h-[80px] sm:min-h-[100px] flex items-center justify-center
                    ${isWrong ? 'border-red-500 shadow-red-500/50' : 'border-white'}
                    ${isCorrect ? 'border-green-500 shadow-green-500/50' : ''}
                    ${selectedCount !== null ? 'opacity-75' : ''}
                  `}
                >
                  <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                    {number}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wrong Answer Feedback - z-45 */}
      <AnimatePresence>
        {selectedCount !== null && selectedCount !== targetNumber && (
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
                transition={{ duration: 0.5, repeat: 3, ease: "easeInOut" }}
                className="text-7xl sm:text-9xl"
              >
                {currentObject.emoji}
              </motion.div>
              <div className="text-center">
                <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-2">
                  {numberWords[targetNumber]}!
                </h2>
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  Great counting! 🎉
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
            {[...Array(20)].map((_, i) => (
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
                  x: playArea.width / 2 + (Math.random() - 0.5) * 600,
                  y: playArea.height / 2 + (Math.random() - 0.5) * 600,
                  scale: 1,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ left: 0, top: 0 }}
              >
                {['⭐', '✨', '🌟', '💫', '🎉', '🎈'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Milestone Celebration - z-30 */}
      <AnimatePresence>
        {score > 0 && score % 5 === 0 && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 30 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-10 py-3 sm:py-6 shadow-2xl border-4 border-white/50">
              <p className="text-2xl sm:text-3xl font-bold text-primary whitespace-nowrap">
                {score} correct! Amazing! 🎉
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
            className="absolute text-4xl sm:text-5xl opacity-5"
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
            {['🔢', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountingFun;
