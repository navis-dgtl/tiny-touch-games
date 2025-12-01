import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const emojis = ["🎈", "⭐", "🍎", "🌸", "🦋", "🍪", "🎁", "🌈", "🐱", "🐶"];

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const MemoryMatch = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
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

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Pick 3 random emojis for toddler-friendly 2x3 grid (6 cards)
    const selectedEmojis = [...emojis]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Create pairs
    const cardPairs = [...selectedEmojis, ...selectedEmojis];

    // Shuffle
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    const card = cards.find((c) => c.id === cardId);

    // Don't allow clicking if card is already flipped or matched, or if 2 cards are already flipped
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found!
        setScore((prev) => prev + 1);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);

          // Check if game is won
          const allMatched = cards.every(
            (c) => c.isMatched || c.id === firstId || c.id === secondId
          );
          if (allMatched) {
            setTimeout(() => setGameWon(true), 500);
          }
        }, 800);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-peach/30 via-background to-lavender/30 overflow-hidden">
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
            animate={{ scale: gameWon ? [1, 1.15, 1] : 1 }}
            className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-2xl pointer-events-auto border-4 border-white/50"
          >
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-star fill-star" />
            <span className="text-2xl sm:text-3xl font-bold text-foreground min-w-[2ch]">{score}</span>
          </motion.div>
        </div>

        {/* Instructions - below header */}
        <AnimatePresence>
          {moves === 0 && !gameWon && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 mx-4 text-center"
            >
              <div className="inline-block bg-white/95 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-3 sm:py-4 shadow-lg border-4 border-white/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">
                  Find the matching pairs! 🎴
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cards Grid - z-10 */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-24 pb-4" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-2xl">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, scale: 0, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className="relative w-20 h-28 sm:w-28 sm:h-36 lg:w-32 lg:h-40"
              disabled={card.isMatched}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-coral to-lavender rounded-2xl shadow-2xl border-4 border-white flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                  }}
                >
                  <div className="text-4xl sm:text-5xl drop-shadow-lg">?</div>
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 ${
                    card.isMatched ? 'bg-mint' : 'bg-sunny'
                  } rounded-2xl shadow-2xl border-4 border-white flex items-center justify-center`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <motion.div
                    animate={{
                      scale: card.isMatched ? [1, 1.25, 1] : 1,
                      rotate: card.isMatched ? [0, -10, 10, 0] : 0,
                    }}
                    className="text-5xl sm:text-6xl lg:text-7xl drop-shadow-lg"
                  >
                    {card.emoji}
                  </motion.div>
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Won Overlay - z-40 */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm"
            style={{ zIndex: 40 }}
          >
            <motion.div
              initial={{ scale: 0.3, y: 50, rotate: -15 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.3, y: 50, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center gap-4 sm:gap-6 border-8 border-white/70 max-w-md mx-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-7xl sm:text-9xl"
              >
                🎉
              </motion.div>
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                  You did it!
                </h2>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {moves} moves!
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeGame}
                className="bg-primary text-white text-xl sm:text-2xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg mt-2 pointer-events-auto"
              >
                Play Again! 🎴
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Confetti - z-35 */}
      <AnimatePresence>
        {gameWon && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
            {[...Array(25)].map((_, i) => (
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
                  x: playArea.width / 2 + (Math.random() - 0.5) * 700,
                  y: playArea.height / 2 + (Math.random() - 0.5) * 700,
                  scale: 1,
                  opacity: 0,
                  rotate: Math.random() * 720,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  delay: Math.random() * 0.3,
                }}
                style={{ left: 0, top: 0 }}
              >
                {['⭐', '✨', '🌟', '💫', '🎉', '🎈'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Background Floating Decorations - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-5xl opacity-6"
            initial={{
              x: (i * playArea.width) / 6,
              y: playArea.height + 100,
            }}
            animate={{
              y: -150,
              rotate: 360,
            }}
            transition={{
              duration: 22 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          >
            {emojis[i % emojis.length]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MemoryMatch;
