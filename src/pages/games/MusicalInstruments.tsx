import { useState } from "react";
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

  const handleInstrumentTap = (instrument: typeof instruments[0]) => {
    setScore((prev) => prev + 1);
    setPlayingInstrument({ instrument, id: Date.now() });

    // Create musical notes animation
    const newNotes = [];
    for (let i = 0; i < 6; i++) {
      newNotes.push({
        id: Date.now() + i,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2,
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
    <div className="fixed inset-0 bg-gradient-to-br from-lavender/40 via-background to-peach/40 overflow-hidden">
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
          animate={{ scale: playingInstrument ? [1, 1.2, 1] : 1 }}
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
          <p className="text-2xl font-bold text-foreground">Play the instruments! 🎵</p>
        </motion.div>
      )}

      {/* Instruments Grid */}
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl px-4">
          {instruments.map((instrument, index) => (
            <motion.button
              key={instrument.name}
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              onClick={() => handleInstrumentTap(instrument)}
              className={`${instrument.color} rounded-3xl p-6 sm:p-8 shadow-2xl border-6 border-white min-h-[160px] flex flex-col items-center justify-center gap-4`}
            >
              <motion.div
                animate={{
                  scale: playingInstrument?.instrument.name === instrument.name ? [1, 1.2, 1] : 1,
                  rotate:
                    playingInstrument?.instrument.name === instrument.name
                      ? [0, -15, 15, -15, 0]
                      : 0,
                }}
                className="text-7xl"
              >
                {instrument.emoji}
              </motion.div>
              <span className="text-xl sm:text-2xl font-bold text-white">
                {instrument.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Playing Instrument Display */}
      <AnimatePresence>
        {playingInstrument && (
          <motion.div
            key={playingInstrument.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ duration: 0.5, repeat: 1 }}
              className="bg-white/95 rounded-3xl px-12 py-8 shadow-2xl flex flex-col items-center gap-4"
            >
              <div className="text-8xl">{playingInstrument.instrument.emoji}</div>
              <p className="text-5xl font-bold text-primary">
                {playingInstrument.instrument.sound}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Musical Notes Animation */}
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ x: note.x, y: note.y, opacity: 1, scale: 0 }}
            animate={{
              y: note.y - 200,
              x: note.x + (Math.random() - 0.5) * 150,
              opacity: 0,
              scale: 2,
              rotate: Math.random() * 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-5xl pointer-events-none"
            style={{ left: 0, top: 0 }}
          >
            {note.note}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating musical notes decoration */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl pointer-events-none opacity-20"
          initial={{
            x: (i * window.innerWidth) / 8,
            y: window.innerHeight + 100,
          }}
          animate={{
            y: -100,
            x: (i * window.innerWidth) / 8 + Math.sin(Date.now() / 1000 + i) * 80,
            rotate: 360,
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
        >
          {musicalNotes[i % musicalNotes.length]}
        </motion.div>
      ))}

      {/* Milestone celebration */}
      {score > 0 && score % 10 === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/95 rounded-3xl px-10 py-6 shadow-2xl z-20"
        >
          <p className="text-3xl font-bold text-primary">Musical Star! 🎵🌟</p>
        </motion.div>
      )}

      {/* Rainbow wave effect when playing */}
      {playingInstrument && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 3, opacity: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${playingInstrument.instrument.color.replace('bg-', 'hsl(var(--')})) 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
};

export default MusicalInstruments;
