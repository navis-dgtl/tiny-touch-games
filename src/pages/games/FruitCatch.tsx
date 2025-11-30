import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Apple, Cherry, Grape, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FallingObject = {
  id: number;
  x: number;
  y: number;
  type: "apple" | "cherry" | "grape" | "cloud";
  speed: number;
};

const objects = [
  { type: "apple" as const, Icon: Apple, color: "text-coral" },
  { type: "cherry" as const, Icon: Cherry, color: "text-destructive" },
  { type: "grape" as const, Icon: Grape, color: "text-lavender" },
  { type: "cloud" as const, Icon: Cloud, color: "text-cloud" },
];

const FruitCatch = () => {
  const navigate = useNavigate();
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const spawnObject = useCallback(() => {
    const random = Math.random();
    const objectType = random < 0.8 
      ? objects[Math.floor(Math.random() * 3)]
      : objects[3];
    
    const newObject: FallingObject = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 80),
      y: -50,
      type: objectType.type,
      speed: 3 + Math.random() * 2,
    };

    setFallingObjects((prev) => [...prev, newObject]);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(spawnObject, 1200);
    return () => clearInterval(spawnInterval);
  }, [spawnObject, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const animationFrame = setInterval(() => {
      setFallingObjects((prev) => {
        const updated = prev
          .map((obj) => ({ ...obj, y: obj.y + obj.speed }))
          .filter((obj) => {
            if (obj.y > window.innerHeight) {
              if (obj.type !== "cloud") {
                setGameOver(true);
              }
              return false;
            }
            return true;
          });
        return updated;
      });
    }, 16);

    return () => clearInterval(animationFrame);
  }, [gameOver]);

  const handleTap = (obj: FallingObject) => {
    if (obj.type === "cloud") {
      setGameOver(true);
    } else {
      setScore((prev) => prev + 1);
    }
    setFallingObjects((prev) => prev.filter((o) => o.id !== obj.id));
  };

  const resetGame = () => {
    setFallingObjects([]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky to-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/")}
          className="bg-white rounded-full p-3 shadow-lg"
        >
          <Home className="w-6 h-6 text-primary" />
        </button>
        
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
          <Star className="w-6 h-6 text-star fill-star" />
          <span className="text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>

      {/* Instructions */}
      {!gameOver && fallingObjects.length < 3 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center bg-white rounded-2xl p-4 shadow-lg">
          <p className="text-xl font-bold text-foreground">Catch fruits!</p>
          <p className="text-lg text-foreground/70">Don't tap clouds! ☁️</p>
        </div>
      )}

      {/* Falling Objects */}
      <AnimatePresence>
        {fallingObjects.map((obj) => {
          const objectInfo = objects.find((o) => o.type === obj.type)!;
          return (
            <motion.button
              key={obj.id}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                x: obj.x,
                y: obj.y,
              }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleTap(obj)}
              className="absolute w-16 h-16 touch-manipulation"
              style={{
                left: 0,
                top: 0,
              }}
            >
              <objectInfo.Icon 
                className={`w-full h-full ${objectInfo.color}`}
                strokeWidth={2}
                fill="currentColor"
              />
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center max-w-md mx-4"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
                Great Job! 🎉
              </h2>
              <div className="flex items-center justify-center gap-3 mb-8">
                <Star className="w-12 h-12 text-star fill-star" />
                <span className="text-5xl font-bold text-foreground">{score}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="bg-primary text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-lg w-full"
              >
                Play Again! 🍎
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FruitCatch;
