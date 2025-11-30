import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GameObject = {
  id: number;
  x: number;
  y: number;
  type: "bubble" | "cloud" | "leaf";
  speed: number;
};

const BubblePop = () => {
  const navigate = useNavigate();
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [stars, setStars] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState<{ id: number; x: number; y: number }[]>([]);

  const spawnObject = useCallback(() => {
    const random = Math.random();
    const type: GameObject["type"] = 
      random < 0.7 ? "bubble" : random < 0.85 ? "cloud" : "leaf";
    
    const newObject: GameObject = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 80),
      y: window.innerHeight + 50,
      type,
      speed: type === "bubble" ? 2 + Math.random() : 1.5 + Math.random() * 0.5,
    };

    setGameObjects((prev) => [...prev, newObject]);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const spawnInterval = setInterval(spawnObject, 1000);
    return () => clearInterval(spawnInterval);
  }, [spawnObject, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const animationFrame = setInterval(() => {
      setGameObjects((prev) =>
        prev
          .map((obj) => ({ ...obj, y: obj.y - obj.speed }))
          .filter((obj) => obj.y > -100)
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, [gameOver]);

  const handleTap = (obj: GameObject) => {
    if (obj.type === "bubble") {
      setPoppedBubbles((prev) => [...prev, { id: obj.id, x: obj.x, y: obj.y }]);
      setStars((prev) => prev + 1);
      setGameObjects((prev) => prev.filter((o) => o.id !== obj.id));
      
      setTimeout(() => {
        setPoppedBubbles((prev) => prev.filter((p) => p.id !== obj.id));
      }, 1000);
    } else {
      setStrikes((prev) => {
        const newStrikes = prev + 1;
        if (newStrikes >= 3) {
          setGameOver(true);
        }
        return newStrikes;
      });
      setGameObjects((prev) => prev.filter((o) => o.id !== obj.id));
    }
  };

  const resetGame = () => {
    setGameObjects([]);
    setStars(0);
    setStrikes(0);
    setGameOver(false);
    setPoppedBubbles([]);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky to-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/")}
          className="bg-white/90 rounded-full p-3 shadow-lg"
        >
          <Home className="w-6 h-6 text-primary" />
        </button>
        
        <div className="flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 shadow-lg">
          <Star className="w-6 h-6 text-star fill-star" />
          <span className="text-2xl font-bold text-foreground">{stars}</span>
        </div>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full border-4 border-white ${
                i < strikes ? "bg-destructive" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Game Objects */}
      <AnimatePresence>
        {gameObjects.map((obj) => (
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
            {obj.type === "bubble" && (
              <div className="w-full h-full rounded-full bg-bubble border-4 border-white/50 shadow-lg" />
            )}
            {obj.type === "cloud" && (
              <div className="w-full h-12 rounded-full bg-cloud shadow-md" />
            )}
            {obj.type === "leaf" && (
              <div className="w-12 h-16 bg-leaf rounded-full shadow-md transform rotate-45" />
            )}
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Popped Bubble Stars */}
      <AnimatePresence>
        {poppedBubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ scale: 1, y: bubble.y, x: bubble.x, opacity: 1 }}
            animate={{ scale: 2, y: bubble.y - 100, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute pointer-events-none"
          >
            <Star className="w-8 h-8 text-star fill-star" />
          </motion.div>
        ))}
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
                <span className="text-5xl font-bold text-foreground">{stars}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="bg-primary text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-lg w-full"
              >
                Play Again! 🎈
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BubblePop;
