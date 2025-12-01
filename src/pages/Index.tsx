import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Circle, Square, Apple, Music, Dog, Hash, Maximize, Brain, Palette } from "lucide-react";

const games = [
  {
    id: "bubble-pop",
    name: "Bubble Pop",
    icon: Sparkles,
    color: "bg-sky",
    description: "Pop bubbles!",
  },
  {
    id: "color-match",
    name: "Color Match",
    icon: Circle,
    color: "bg-coral",
    description: "Match colors!",
  },
  {
    id: "shape-collector",
    name: "Shape Fun",
    icon: Square,
    color: "bg-mint",
    description: "Find shapes!",
  },
  {
    id: "fruit-catch",
    name: "Fruit Catch",
    icon: Apple,
    color: "bg-sunny",
    description: "Catch fruits!",
  },
  {
    id: "animal-sounds",
    name: "Animals",
    icon: Dog,
    color: "bg-peach",
    description: "Meet animals!",
  },
  {
    id: "counting-fun",
    name: "Counting",
    icon: Hash,
    color: "bg-lavender",
    description: "Count things!",
  },
  {
    id: "size-sorting",
    name: "Big & Small",
    icon: Maximize,
    color: "bg-mint",
    description: "Sort sizes!",
  },
  {
    id: "memory-match",
    name: "Memory",
    icon: Brain,
    color: "bg-coral",
    description: "Match pairs!",
  },
  {
    id: "musical-instruments",
    name: "Music",
    icon: Music,
    color: "bg-lavender",
    description: "Play music!",
  },
  {
    id: "rainbow-paint",
    name: "Paint",
    icon: Palette,
    color: "bg-sunny",
    description: "Draw art!",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sky/20 to-mint/20 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <motion.h1
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-5xl sm:text-7xl font-bold text-primary mb-4"
        >
          Fun Games! 🎈
        </motion.h1>
        <p className="text-2xl sm:text-3xl text-foreground/70 font-bold">
          Tap a game to play!
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              delay: index * 0.08,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.92, rotate: -3 }}
            onClick={() => navigate(`/games/${game.id}`)}
            className={`${game.color} rounded-3xl p-6 sm:p-8 shadow-xl border-6 border-white min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center gap-3 sm:gap-4 hover:shadow-2xl transition-shadow`}
          >
            <game.icon className="w-14 h-14 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {game.name}
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-semibold">
                {game.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Floating decorative elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl pointer-events-none opacity-20"
          initial={{
            x: (i * window.innerWidth) / 6,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            x: (i * window.innerWidth) / 6 + Math.sin(Date.now() / 1000 + i) * 50,
            rotate: 360,
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
        >
          {["🎈", "⭐", "🎨", "🎵", "🎉", "✨"][i]}
        </motion.div>
      ))}
    </div>
  );
};

export default Index;
