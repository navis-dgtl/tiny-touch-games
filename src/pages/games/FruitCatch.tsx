import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Apple, Cherry, Grape, Banana, Circle, Triangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FallingObject = {
  id: number;
  x: number;
  y: number;
  type: "apple" | "cherry" | "grape" | "banana" | "strawberry" | "lemon";
  speed: number;
};

const fruits = [
  { type: "apple" as const, Icon: Apple, color: "text-coral", emoji: "🍎", name: "Apple" },
  { type: "cherry" as const, Icon: Cherry, color: "text-destructive", emoji: "🍒", name: "Cherry" },
  { type: "grape" as const, Icon: Grape, color: "text-lavender", emoji: "🍇", name: "Grape" },
  { type: "banana" as const, Icon: Banana, color: "text-sunny", emoji: "🍌", name: "Banana" },
  { type: "strawberry" as const, Icon: Circle, color: "text-coral", emoji: "🍓", name: "Strawberry" },
  { type: "lemon" as const, Icon: Triangle, color: "text-sunny", emoji: "🍋", name: "Lemon" },
];

const encouragingMessages = [
  "Yummy! 🎉",
  "Delicious! ⭐",
  "Great catch! 🌟",
  "Tasty! 🎈",
];

const FruitCatch = () => {
  const navigate = useNavigate();
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState("");
  const [catchAnimation, setCatchAnimation] = useState<{ x: number; y: number; emoji: string } | null>(null);

  const spawnObject = useCallback(() => {
    const fruit = fruits[Math.floor(Math.random() * fruits.length)];

    const newObject: FallingObject = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 100) + 20,
      y: -50,
      type: fruit.type,
      speed: 2 + Math.random() * 1.5,
    };

    setFallingObjects((prev) => [...prev, newObject]);
  }, []);

  useEffect(() => {
    const spawnInterval = setInterval(spawnObject, 1000);
    return () => clearInterval(spawnInterval);
  }, [spawnObject]);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setFallingObjects((prev) => {
        return prev
          .map((obj) => ({ ...obj, y: obj.y + obj.speed }))
          .filter((obj) => obj.y < window.innerHeight + 50);
      });
    }, 16);

    return () => clearInterval(animationFrame);
  }, []);

  const handleTap = (obj: FallingObject) => {
    const fruitInfo = fruits.find((f) => f.type === obj.type)!;

    setScore((prev) => {
      const newScore = prev + 1;

      // Show encouraging message every 5 catches
      if (newScore % 5 === 0) {
        const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        setShowMessage(message);
        setTimeout(() => setShowMessage(""), 1500);
      }

      return newScore;
    });

    // Show catch animation
    setCatchAnimation({ x: obj.x, y: obj.y, emoji: fruitInfo.emoji });
    setTimeout(() => setCatchAnimation(null), 800);

    setFallingObjects((prev) => prev.filter((o) => o.id !== obj.id));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky via-background to-mint/50 overflow-hidden">
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
          animate={{ scale: score > 0 && score % 5 === 0 ? [1, 1.2, 1] : 1 }}
        >
          <Star className="w-8 h-8 text-star fill-star" />
          <span className="text-3xl font-bold text-foreground">{score}</span>
        </motion.div>
      </div>

      {/* Instructions */}
      {score === 0 && fallingObjects.length < 2 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-28 left-1/2 -translate-x-1/2 text-center bg-white/90 rounded-3xl px-8 py-4 shadow-lg"
        >
          <p className="text-2xl font-bold text-foreground">Catch the yummy fruits! 🍎</p>
        </motion.div>
      )}

      {/* Encouraging Messages */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div className="bg-white/95 rounded-3xl px-12 py-8 shadow-2xl">
              <p className="text-5xl font-bold text-primary">{showMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Falling Objects */}
      <AnimatePresence>
        {fallingObjects.map((obj) => {
          const fruitInfo = fruits.find((f) => f.type === obj.type)!;
          return (
            <motion.button
              key={obj.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                x: obj.x,
                y: obj.y,
                rotate: 0,
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleTap(obj)}
              className="absolute w-20 h-20 touch-manipulation"
              style={{
                left: 0,
                top: 0,
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <fruitInfo.Icon
                  className={`w-full h-full ${fruitInfo.color} drop-shadow-lg`}
                  strokeWidth={2}
                  fill="currentColor"
                />
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Catch Animation */}
      <AnimatePresence>
        {catchAnimation && (
          <motion.div
            initial={{ scale: 1, x: catchAnimation.x, y: catchAnimation.y, opacity: 1 }}
            animate={{ scale: 2.5, y: catchAnimation.y - 100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute text-6xl pointer-events-none z-20"
            style={{ left: 0, top: 0 }}
          >
            {catchAnimation.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star particles floating up */}
      {catchAnimation && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl pointer-events-none"
              initial={{
                x: catchAnimation.x + 40,
                y: catchAnimation.y + 40,
                scale: 0,
              }}
              animate={{
                x: catchAnimation.x + 40 + (Math.random() - 0.5) * 100,
                y: catchAnimation.y - 80,
                scale: 1,
                opacity: 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              ⭐
            </motion.div>
          ))}
        </>
      )}

      {/* Floating decoration fruits */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl pointer-events-none opacity-20"
          initial={{
            x: (i * window.innerWidth) / 4,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            x: (i * window.innerWidth) / 4 + Math.sin(Date.now() / 1000 + i) * 50,
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
        >
          {fruits[i % fruits.length].emoji}
        </motion.div>
      ))}

      {/* Milestone celebration */}
      {score > 0 && score % 10 === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/95 rounded-3xl px-10 py-6 shadow-2xl z-20"
        >
          <p className="text-3xl font-bold text-primary">
            {score} fruits! Amazing! 🎉
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FruitCatch;
