import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Dog, Cat, Bird, Fish, Rabbit, Squirrel, Bug, Turtle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const animals = [
  { name: "Dog", Icon: Dog, sound: "Woof!", emoji: "🐕", color: "bg-peach" },
  { name: "Cat", Icon: Cat, sound: "Meow!", emoji: "🐈", color: "bg-coral" },
  { name: "Bird", Icon: Bird, sound: "Tweet!", emoji: "🐦", color: "bg-sky" },
  { name: "Fish", Icon: Fish, sound: "Blub!", emoji: "🐠", color: "bg-sky" },
  { name: "Bunny", Icon: Rabbit, sound: "Hop!", emoji: "🐰", color: "bg-mint" },
  { name: "Squirrel", Icon: Squirrel, sound: "Squeak!", emoji: "🐿️", color: "bg-peach" },
  { name: "Bug", Icon: Bug, sound: "Buzz!", emoji: "🐛", color: "bg-mint" },
  { name: "Turtle", Icon: Turtle, sound: "Slow!", emoji: "🐢", color: "bg-sunny" },
];

const AnimalSounds = () => {
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState<typeof animals[0] | null>(null);
  const [score, setScore] = useState(0);

  const handleAnimalTap = (animal: typeof animals[0]) => {
    setSelectedAnimal(animal);
    setScore((prev) => prev + 1);

    setTimeout(() => {
      setSelectedAnimal(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-mint/40 via-background to-sky/40 overflow-hidden">
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
          animate={{ scale: selectedAnimal ? [1, 1.2, 1] : 1 }}
        >
          <Star className="w-8 h-8 text-star fill-star" />
          <span className="text-3xl font-bold text-foreground">{score}</span>
        </motion.div>
      </div>

      {/* Instructions */}
      {score === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-28 left-1/2 -translate-x-1/2 text-center bg-white/90 rounded-3xl px-8 py-4 shadow-lg"
        >
          <p className="text-2xl font-bold text-foreground">Tap the animals! 🐾</p>
        </motion.div>
      )}

      {/* Animal Grid */}
      <div className="absolute inset-0 flex items-center justify-center pt-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl px-4">
          {animals.map((animal, index) => (
            <motion.button
              key={animal.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnimalTap(animal)}
              className={`${animal.color} rounded-3xl p-6 sm:p-8 shadow-2xl border-6 border-white min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center gap-3`}
            >
              <animal.Icon className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={2.5} />
              <span className="text-xl sm:text-2xl font-bold text-white">{animal.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Animal Display Animation */}
      <AnimatePresence>
        {selectedAnimal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 bg-black/30"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-12 sm:p-16 shadow-2xl flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-9xl"
              >
                {selectedAnimal.emoji}
              </motion.div>
              <div className="text-center">
                <h2 className="text-5xl sm:text-6xl font-bold text-primary mb-3">
                  {selectedAnimal.name}!
                </h2>
                <p className="text-4xl sm:text-5xl font-bold text-foreground">
                  {selectedAnimal.sound}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration confetti */}
      {selectedAnimal && (
        <>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl pointer-events-none"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 500,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 500,
                scale: 1,
                opacity: 0,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {['⭐', '✨', '🌟', '💫', '🎉'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </>
      )}

      {/* Floating animal emojis decoration */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl pointer-events-none opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
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
          {animals[Math.floor(Math.random() * animals.length)].emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimalSounds;
