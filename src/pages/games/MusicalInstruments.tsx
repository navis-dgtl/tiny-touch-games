import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Music, Music2, Music3, Music4 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const instruments = [
  { name: "Piano", emoji: "🎹", sound: "Ding!", color: "bg-lavender", icon: Music },
  { name: "Guitar", emoji: "🎸", sound: "Strum!", color: "bg-coral", icon: Music2 },
  { name: "Drums", emoji: "🥁", sound: "Boom!", color: "bg-peach", icon: Music3 },
  { name: "Trumpet", emoji: "🎺", sound: "Toot!", color: "bg-sunny", icon: Music4 },
  { name: "Violin", emoji: "🎻", sound: "Bow!", color: "bg-mint", icon: Music },
  { name: "Saxophone", emoji: "🎷", sound: "Jazz!", color: "bg-sky", icon: Music2 },
];

const musicalNotes = ["🎵", "🎶", "🎼", "♪", "♫", "♬"];

type PlayingInstrument = {
  instrument: typeof instruments[0];
  id: number;
};

const MusicalInstruments = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [playingInstrument, setPlayingInstrument] = useState<PlayingInstrument | null>(null);
  const [notes, setNotes] = useState<{ id: number; x: number; y: number; note: string }[]>([]);
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

  const handleInstrumentTap = (instrument: typeof instruments[0]) => {
    setScore((prev) => prev + 1);
    setPlayingInstrument({ instrument, id: Date.now() });

    // Create musical notes animation
    const newNotes = [];
    for (let i = 0; i < 6; i++) {
      newNotes.push({
        id: Date.now() + i,
        x: playArea.width / 2 + (Math.random() - 0.5) * 200,
        y: playArea.height / 2,
        note: musicalNotes[Math.floor(Math.random() * musicalNotes.length)],
      });
    }
    setNotes((prev) => [...prev, ...newNotes]);

    setTimeout(() => {
      setPlayingInstrument(null);
    }, 1000);

    // Clean up old notes
    setTimeout(() => {
      setNotes((prev) => prev.filter((note) => Date.now() - note.id < 2000));
    }, 2000);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-lavender/40 via-background to-peach/40 overflow-hidden">
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
            animate={{ scale: playingInstrument ? [1, 1.15, 1] : 1 }}
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
                  Play the instruments! 🎵
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instruments Grid - z-10 */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-24 pb-4" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl">
          {instruments.map((instrument, index) => (
            <motion.button
              key={instrument.name}
              initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.92, rotate: -3 }}
              onClick={() => handleInstrumentTap(instrument)}
              className={`
                ${instrument.color} rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl
                border-4 sm:border-6 border-white min-h-[140px] sm:min-h-[160px]
                flex flex-col items-center justify-center gap-3 sm:gap-4
                transition-all duration-200
              `}
            >
              <motion.div
                animate={{
                  scale: playingInstrument?.instrument.name === instrument.name ? [1, 1.2, 1] : 1,
                  rotate:
                    playingInstrument?.instrument.name === instrument.name
                      ? [0, -15, 15, -15, 0]
                      : 0,
                }}
                className="text-6xl sm:text-7xl drop-shadow-lg"
              >
                {instrument.emoji}
              </motion.div>
              <span className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                {instrument.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Playing Instrument Display - z-40 */}
      <AnimatePresence>
        {playingInstrument && (
          <motion.div
            key={playingInstrument.id}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 40 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1.05, 1.15, 1],
                rotate: [0, -8, 8, -8, 0],
              }}
              transition={{ duration: 0.5, repeat: 1, ease: "easeInOut" }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 sm:px-12 py-6 sm:py-8 shadow-2xl flex flex-col items-center gap-3 sm:gap-4 border-8 border-white/70"
            >
              <div className="text-7xl sm:text-8xl">{playingInstrument.instrument.emoji}</div>
              <p className="text-4xl sm:text-5xl font-bold text-primary">
                {playingInstrument.instrument.sound}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Musical Notes Animation - z-35 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ x: note.x, y: note.y, opacity: 1, scale: 0, rotate: 0 }}
              animate={{
                y: note.y - 200,
                x: note.x + (Math.random() - 0.5) * 150,
                opacity: 0,
                scale: 2,
                rotate: Math.random() * 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute text-4xl sm:text-5xl"
              style={{ left: 0, top: 0 }}
            >
              {note.note}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Milestone Celebration - z-30 */}
      <AnimatePresence>
        {score > 0 && score % 10 === 0 && !playingInstrument && (
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
                Musical Star! 🎵🌟
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Floating Musical Notes - z-0 */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-5xl opacity-12"
            initial={{
              x: (i * playArea.width) / 8,
              y: playArea.height + 100,
            }}
            animate={{
              y: -150,
              x: (i * playArea.width) / 8 + Math.sin(Date.now() / 1000 + i) * 60,
              rotate: 360,
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5,
            }}
          >
            {musicalNotes[i % musicalNotes.length]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MusicalInstruments;
