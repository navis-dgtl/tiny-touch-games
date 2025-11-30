import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Circle, Square, Apple } from "lucide-react";

const games = [
  {
    id: "bubble-pop",
    name: "Bubble Pop",
    icon: Sparkles,
    color: "bg-sky",
    description: "Pop the bubbles!",
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
    description: "Tap shapes!",
  },
  {
    id: "fruit-catch",
    name: "Fruit Catch",
    icon: Apple,
    color: "bg-sunny",
    description: "Catch fruits!",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-4xl sm:text-6xl font-bold text-primary mb-2 sm:mb-4">
          Fun Games! 🎈
        </h1>
        <p className="text-xl sm:text-2xl text-foreground/70">
          Tap a game to play
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/games/${game.id}`)}
            className={`${game.color} rounded-3xl p-8 sm:p-12 shadow-lg border-4 border-white/50 min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-center gap-4`}
          >
            <game.icon className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={2} />
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                {game.name}
              </h2>
              <p className="text-base sm:text-lg text-white/90">{game.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Index;
