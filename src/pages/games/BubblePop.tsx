import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Bubble = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
};

const bubbleColors = [
  "bg-coral",
  "bg-mint",
  "bg-sunny",
  "bg-sky",
  "bg-peach",
  "bg-lavender",
];

const encouragingMessages = [
  "Amazing! 🌟",
  "Great job! ⭐",
  "Wonderful! 🎉",
  "You're a star! ✨",
  "Fantastic! 🎈",
  "Keep going! 💫",
];

const BubblePop = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState("");

  const spawnBubble = useCallback(() => {
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 120) + 20,
      y: -100,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
      size: 70 + Math.random() * 30,
    };
    setBubbles((prev) => [...prev, newBubble]);
  }, []);

  useEffect(() => {
    const spawnInterval = setInterval(spawnBubble, 800);
    return () => clearInterval(spawnInterval);
  }, [spawnBubble]);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({ ...bubble, y: bubble.y + 2 }))
          .filter((bubble) => bubble.y < window.innerHeight + 100)
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, []);

  useEffect(() => {
    const cleanupParticles = setInterval(() => {
      setParticles([]);
    }, 1000);

    return () => clearInterval(cleanupParticles);
  }, []);

  const handleBubblePop = (bubble: Bubble) => {
    setScore((prev) => {
      const newScore = prev + 1;

      // Show encouraging message every 5 pops
      if (newScore % 5 === 0) {
        const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        setShowMessage(message);
        setTimeout(() => setShowMessage(""), 1500);
      }

      return newScore;
    });

    // Create particle explosion effect
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        x: bubble.x + bubble.size / 2,
        y: bubble.y + bubble.size / 2,
        color: bubble.color,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);

    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky via-background to-mint overflow-hidden">
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
      {score === 0 && bubbles.length < 2 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-28 left-1/2 -translate-x-1/2 text-center bg-white/90 rounded-3xl px-8 py-4 shadow-lg"
        >
          <p className="text-2xl font-bold text-foreground">Pop the bubbles! 🫧</p>
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

      {/* Bubbles */}
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.button
            key={bubble.id}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              x: bubble.x,
              y: bubble.y,
            }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => handleBubblePop(bubble)}
            className="absolute touch-manipulation"
            style={{
              left: 0,
              top: 0,
              width: bubble.size,
              height: bubble.size,
            }}
          >
            <div
              className={`w-full h-full rounded-full ${bubble.color} border-4 border-white/50 shadow-xl flex items-center justify-center`}
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 -8px 16px rgba(255,255,255,0.5)',
              }}
            >
              <Sparkles className="w-1/3 h-1/3 text-white/70" />
            </div>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            initial={{ scale: 1, x: particle.x, y: particle.y, opacity: 1 }}
            animate={{
              scale: 0,
              x: particle.x + Math.cos((index / 8) * Math.PI * 2) * 60,
              y: particle.y + Math.sin((index / 8) * Math.PI * 2) * 60,
              opacity: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`absolute w-6 h-6 rounded-full ${particle.color} pointer-events-none`}
            style={{ left: 0, top: 0 }}
          />
        ))}
      </AnimatePresence>

      {/* Floating sparkles decoration */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl pointer-events-none"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            opacity: 0.3,
          }}
          animate={{
            y: -100,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
};

export default BubblePop;
