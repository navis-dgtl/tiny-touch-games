import { useState, useEffect, useRef } from "react";
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

  const handleAnimalTap = (animal: typeof animals[0]) => {
    setSelectedAnimal(animal);
    setScore((prev) => prev + 1);

    setTimeout(() => {
      setSelectedAnimal(null);
    }, 1500);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-mint/40 via-background to-sky/40 overflow-hidden">
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
            animate={{ scale: selectedAnimal ? [1, 1.15, 1] : 1 }}
            className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-2xl pointer-events-auto border-4 border-white/50"
          >
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-star fill-star" />
            <span className="text-2xl sm:text-3xl font-bold text-foreground min-w-[2ch]">{score}</span>
          </motion.div>
        </div>

        {/* Instructions - below header */}
        <AnimatePresence>
          {score === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 mx-4 text-center"
            >
              <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  Tap the animals! 🐾
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animal Grid - z-10 */}
      <div className="absolute inset-0 flex items-center justify-center pt-24 pb-4" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl px-4">
          {animals.map((animal, index) => (
            <motion.button
              key={animal.name}
              initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleAnimalTap(animal)}
              className={`
                ${animal.color} rounded-3xl p-4 sm:p-6 shadow-2xl
                border-6 border-white min-h-[120px] sm:min-h-[140px]
                flex flex-col items-center justify-center gap-2 sm:gap-3
                transition-all duration-200
              `}
            >
              <animal.Icon
                className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg"
                strokeWidth={2.5}
              />
              <span className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                {animal.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Animal Display Overlay - z-40 */}
      <AnimatePresence>
        {selectedAnimal && (
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
                  rotate: [0, -8, 8, -8, 0],
                }}
                transition={{ duration: 0.6, repeat: 2, ease: "easeInOut" }}
                className="text-7xl sm:text-9xl"
              >
                {selectedAnimal.emoji}
              </motion.div>
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-2 sm:mb-3">
                  {selectedAnimal.name}!
                </h2>
                <motion.p
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-3xl sm:text-4xl font-bold text-foreground"
                >
                  {selectedAnimal.sound}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Confetti - z-35 */}
      <AnimatePresence>
        {selectedAnimal && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
            {[...Array(16)].map((_, i) => (
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
                  x: playArea.width / 2 + (Math.random() - 0.5) * 500,
                  y: playArea.height / 2 + (Math.random() - 0.5) * 500,
                  scale: 1,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ left: 0, top: 0 }}
              >
                {['⭐', '✨', '🌟', '💫', '🎉'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Milestone Celebration - z-30 */}
      <AnimatePresence>
        {score > 0 && score % 5 === 0 && !selectedAnimal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 30 }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-10 py-3 sm:py-6 shadow-2xl border-4 border-white/50">
              <p className="text-2xl sm:text-3xl font-bold text-primary whitespace-nowrap">
                {score} animals! Amazing! 🎉
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Floating Decorations - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-5xl opacity-8"
            initial={{
              x: (i * playArea.width) / 8,
              y: playArea.height + 100,
            }}
            animate={{
              y: -150,
              x: (i * playArea.width) / 8 + Math.sin(Date.now() / 1000 + i) * 40,
            }}
            transition={{
              duration: 20 + i * 2.5,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
          >
            {animals[i % animals.length].emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimalSounds;
