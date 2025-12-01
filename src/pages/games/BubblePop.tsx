import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Bubble = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  wobble: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
};

const bubbleColors = [
  { bg: "bg-coral", glow: "rgba(240, 128, 128, 0.4)" },
  { bg: "bg-mint", glow: "rgba(152, 216, 200, 0.4)" },
  { bg: "bg-sunny", glow: "rgba(246, 224, 94, 0.4)" },
  { bg: "bg-sky", glow: "rgba(147, 197, 253, 0.4)" },
  { bg: "bg-peach", glow: "rgba(254, 215, 170, 0.4)" },
  { bg: "bg-lavender", glow: "rgba(221, 214, 254, 0.4)" },
];

const encouragingMessages = [
  { text: "Amazing!", emoji: "🌟" },
  { text: "Great job!", emoji: "⭐" },
  { text: "Wonderful!", emoji: "🎉" },
  { text: "You're a star!", emoji: "✨" },
  { text: "Fantastic!", emoji: "🎈" },
  { text: "Keep going!", emoji: "💫" },
];

const BubblePop = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState<{ text: string; emoji: string } | null>(null);
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

  const spawnBubble = useCallback(() => {
    if (playArea.width === 0) return;

    const bubbleSize = 60 + Math.random() * 40; // 60-100px
    const safeMargin = 20;
    const maxX = playArea.width - bubbleSize - safeMargin * 2;

    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: safeMargin + Math.random() * maxX,
      y: -bubbleSize - 20,
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)].bg,
      size: bubbleSize,
      wobble: Math.random() * 20 - 10, // -10 to 10
    };
    setBubbles((prev) => [...prev.slice(-15), newBubble]); // Limit to 16 bubbles
  }, [playArea.width]);

  useEffect(() => {
    if (playArea.width === 0) return;
    const spawnInterval = setInterval(spawnBubble, 900);
    return () => clearInterval(spawnInterval);
  }, [spawnBubble, playArea.width]);

  useEffect(() => {
    if (playArea.height === 0) return;
    const animationFrame = requestAnimationFrame(function animate() {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({ ...bubble, y: bubble.y + 1.5 }))
          .filter((bubble) => bubble.y < playArea.height + 100)
      );
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [playArea.height]);

  const handleBubblePop = (bubble: Bubble) => {
    setScore((prev) => {
      const newScore = prev + 1;

      // Show encouraging message every 5 pops
      if (newScore % 5 === 0) {
        const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
        setShowMessage(message);
        setTimeout(() => setShowMessage(null), 2000);
      }

      return newScore;
    });

    // Create particle explosion effect
    const newParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Date.now() + Math.random() + i,
        x: bubble.x + bubble.size / 2,
        y: bubble.y + bubble.size / 2,
        color: bubble.color,
        angle: (i / 12) * Math.PI * 2,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 800);

    setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-b from-sky/80 via-background to-mint/60 overflow-hidden">
      {/* Safe Header Zone - z-50 */}
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

        {/* Instructions - appears below header */}
        <AnimatePresence>
          {score === 0 && bubbles.length < 2 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 mx-4 text-center"
            >
              <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  Pop the bubbles! 🫧
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Play Area for Bubbles - z-10 */}
      <div className="absolute inset-0 pt-28 pb-4" style={{ zIndex: 10 }}>
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
                x: bubble.x + Math.sin(bubble.y / 50) * bubble.wobble,
                y: bubble.y,
              }}
              exit={{ scale: 0, rotate: 180 }}
              whileTap={{ scale: 0.7 }}
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
                className={`relative w-full h-full rounded-full ${bubble.color} border-4 border-white shadow-2xl flex items-center justify-center`}
                style={{
                  boxShadow: `
                    0 12px 40px rgba(0,0,0,0.15),
                    inset 0 -10px 20px rgba(0,0,0,0.1),
                    inset 0 10px 20px rgba(255,255,255,0.7)
                  `,
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                <Sparkles className="w-1/3 h-1/3 text-white relative z-10" strokeWidth={2.5} />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Particle Effects - z-30 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ scale: 1, x: particle.x, y: particle.y, opacity: 1 }}
              animate={{
                scale: 0,
                x: particle.x + Math.cos(particle.angle) * 80,
                y: particle.y + Math.sin(particle.angle) * 80,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full ${particle.color} shadow-lg`}
              style={{ left: 0, top: 0 }}
            />
          ))}
        </AnimatePresence>
      </div>

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

      {/* Background Decorative Elements - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl sm:text-5xl opacity-10"
            initial={{
              x: (i * playArea.width) / 8,
              y: playArea.height + 100,
            }}
            animate={{
              y: -150,
              x: (i * playArea.width) / 8 + Math.sin(Date.now() / 1000 + i) * 40,
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {['⭐', '✨', '💫', '🌟'][i % 4]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BubblePop;
