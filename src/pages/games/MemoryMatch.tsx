import { useState, useEffect } from "react";
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
    <div className="fixed inset-0 bg-gradient-to-br from-peach/30 via-background to-lavender/30 overflow-hidden">
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
          animate={{ scale: gameWon ? [1, 1.2, 1] : 1 }}
        >
          <Star className="w-8 h-8 text-star fill-star" />
          <span className="text-3xl font-bold text-foreground">{score}</span>
        </motion.div>
      </div>

      {/* Instructions */}
      {moves === 0 && !gameWon && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-28 left-1/2 -translate-x-1/2 text-center bg-white/90 rounded-3xl px-8 py-4 shadow-lg"
        >
          <p className="text-2xl font-bold text-foreground">Find the matching pairs! 🎴</p>
        </motion.div>
      )}

      {/* Cards Grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl p-4">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, scale: 0, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className="relative w-24 h-32 sm:w-32 sm:h-40"
              disabled={card.isMatched}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Card Back */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-coral to-lavender rounded-2xl shadow-xl border-4 border-white flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                  }}
                >
                  <div className="text-5xl">?</div>
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 ${
                    card.isMatched ? 'bg-mint' : 'bg-sunny'
                  } rounded-2xl shadow-xl border-4 border-white flex items-center justify-center`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <motion.div
                    animate={{
                      scale: card.isMatched ? [1, 1.3, 1] : 1,
                      rotate: card.isMatched ? [0, -10, 10, 0] : 0,
                    }}
                    className="text-6xl sm:text-7xl"
                  >
                    {card.emoji}
                  </motion.div>
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Won Animation */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-20"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-12 sm:p-16 shadow-2xl flex flex-col items-center gap-6 max-w-md mx-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-9xl"
              >
                🎉
              </motion.div>
              <h2 className="text-5xl sm:text-6xl font-bold text-primary text-center">
                You did it!
              </h2>
              <p className="text-3xl font-bold text-foreground">
                {moves} moves!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeGame}
                className="bg-primary text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow-lg mt-4"
              >
                Play Again! 🎴
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration confetti */}
      {gameWon && (
        <>
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl pointer-events-none"
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
              }}
              animate={{
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 700,
                y: window.innerHeight / 2 + (Math.random() - 0.5) * 700,
                scale: 1,
                opacity: 0,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                delay: Math.random() * 0.3,
              }}
            >
              {['⭐', '✨', '🌟', '💫', '🎉', '🎈'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
};

export default MemoryMatch;
