import { useState, useEffect, useCallback, useRef } from "react";
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
  { text: "Yummy!", emoji: "🎉" },
  { text: "Delicious!", emoji: "⭐" },
  { text: "Great catch!", emoji: "🌟" },
  { text: "Tasty!", emoji: "🎈" },
];

const FruitCatch = () => {
  const navigate = useNavigate();
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState<{ text: string; emoji: string } | null>(null);
  const [catchAnimation, setCatchAnimation] = useState<{ x: number; y: number; emoji: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playArea, setPlayArea] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>();

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

  const spawnObject = useCallback(() => {
    if (playArea.width === 0) return;

    const fruit = fruits[Math.floor(Math.random() * fruits.length)];
    const fruitSize = 80;
    const safeMargin = 20;
    const maxX = playArea.width - fruitSize - safeMargin * 2;

    const newObject: FallingObject = {
      id: Date.now() + Math.random(),
      x: safeMargin + Math.random() * maxX,
      y: -fruitSize - 20,
      type: fruit.type,
      speed: 2 + Math.random() * 1.2,
    };

    setFallingObjects((prev) => [...prev.slice(-9), newObject]); // Limit to 10 fruits
  }, [playArea.width]);

  useEffect(() => {
    if (playArea.width === 0) return;
    const spawnInterval = setInterval(spawnObject, 1100);
    return () => clearInterval(spawnInterval);
  }, [spawnObject, playArea.width]);

  // Use requestAnimationFrame for smooth animation
  useEffect(() => {
    if (playArea.height === 0) return;

    const animate = () => {
      setFallingObjects((prev) =>
        prev
          .map((obj) => ({ ...obj, y: obj.y + obj.speed }))
          .filter((obj) => obj.y < playArea.height + 100)
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playArea.height]);

  const handleTap = (obj: FallingObject) => {
    const fruitInfo = fruits.find((f) => f.type === obj.type)!;

    setScore((prev) => {
      const newScore = prev + 1;

      // Show encouraging message every 5 catches
      if (newScore % 5 === 0) {
        const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        setShowMessage(message);
        setTimeout(() => setShowMessage(null), 2000);
      }

      return newScore;
    });

    // Show catch animation
    setCatchAnimation({ x: obj.x, y: obj.y, emoji: fruitInfo.emoji });
    setTimeout(() => setCatchAnimation(null), 900);

    setFallingObjects((prev) => prev.filter((o) => o.id !== obj.id));
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-b from-sky/70 via-background to-mint/40 overflow-hidden">
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
            animate={{ scale: showMessage ? [1, 1.15, 1] : 1 }}
            className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-2xl pointer-events-auto border-4 border-white/50"
          >
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-star fill-star" />
            <span className="text-2xl sm:text-3xl font-bold text-foreground min-w-[2ch]">{score}</span>
          </motion.div>
        </div>

        {/* Instructions - below header */}
        <AnimatePresence>
          {score === 0 && fallingObjects.length < 2 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 mx-4 text-center"
            >
              <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  Catch the yummy fruits! 🍎
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play Area for Falling Fruits - z-10 */}
      <div className="absolute inset-0 pt-24 pb-4" style={{ zIndex: 10 }}>
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
                  rotate: obj.y / 5, // Gentle rotation as it falls
                }}
                exit={{ scale: 0, rotate: 180 }}
                whileTap={{ scale: 0.75 }}
                onClick={() => handleTap(obj)}
                className="absolute w-20 h-20 touch-manipulation"
                style={{
                  left: 0,
                  top: 0,
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <fruitInfo.Icon
                    className={`w-full h-full ${fruitInfo.color} drop-shadow-2xl`}
                    strokeWidth={2}
                    fill="currentColor"
                  />
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Catch Animation - z-30 */}
      <AnimatePresence>
        {catchAnimation && (
          <motion.div
            initial={{ scale: 1, x: catchAnimation.x, y: catchAnimation.y, opacity: 1 }}
            animate={{ scale: 3, y: catchAnimation.y - 120, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute text-5xl sm:text-6xl pointer-events-none"
            style={{ left: 0, top: 0, zIndex: 30 }}
          >
            {catchAnimation.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star Particles - z-25 */}
      {catchAnimation && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl sm:text-3xl"
              initial={{
                x: catchAnimation.x + 40,
                y: catchAnimation.y + 40,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: catchAnimation.x + 40 + (Math.random() - 0.5) * 120,
                y: catchAnimation.y - 100,
                scale: 1,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              ⭐
            </motion.div>
          ))}
        </div>
      )}

      {/* Encouraging Messages Overlay - z-40 */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 40 }}
          >
            <motion.div
              animate={{
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.1, 1.05, 1.1, 1],
              }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="bg-white rounded-3xl px-8 sm:px-16 py-6 sm:py-10 shadow-2xl border-8 border-white/70"
            >
              <p className="text-4xl sm:text-6xl font-bold text-primary text-center mb-2">
                {showMessage.text}
              </p>
              <p className="text-5xl sm:text-7xl text-center">{showMessage.emoji}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Celebration - z-35 */}
      <AnimatePresence>
        {score > 0 && score % 10 === 0 && !showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 35 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-10 py-3 sm:py-6 shadow-2xl border-4 border-white/50">
              <p className="text-2xl sm:text-3xl font-bold text-primary whitespace-nowrap">
                {score} fruits! Amazing! 🎉
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorative Fruits - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-5xl opacity-8"
            initial={{
              x: (i * playArea.width) / 5,
              y: playArea.height + 100,
            }}
            animate={{
              y: -150,
              x: (i * playArea.width) / 5 + Math.sin(Date.now() / 1000 + i) * 30,
            }}
            transition={{
              duration: 22 + i * 3,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            {fruits[i % fruits.length].emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FruitCatch;
