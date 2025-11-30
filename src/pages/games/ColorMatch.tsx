import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = [
  { name: "coral", class: "bg-coral", hsl: "hsl(var(--coral))" },
  { name: "mint", class: "bg-mint", hsl: "hsl(var(--mint))" },
  { name: "sunny", class: "bg-sunny", hsl: "hsl(var(--sunny))" },
  { name: "peach", class: "bg-peach", hsl: "hsl(var(--peach))" },
];

const ColorMatch = () => {
  const navigate = useNavigate();
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickNewColor = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(newColor);
  };

  useEffect(() => {
    pickNewColor();
  }, []);

  const handleColorTap = (color: typeof colors[0]) => {
    if (color.name === targetColor.name) {
      setScore((prev) => prev + 1);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        pickNewColor();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <button
          onClick={() => navigate("/")}
          className="bg-white rounded-full p-3 shadow-lg"
        >
          <Home className="w-6 h-6 text-primary" />
        </button>
        
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
          <Star className="w-6 h-6 text-star fill-star" />
          <span className="text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>

      {/* Target Color */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center">
        <p className="text-2xl font-bold text-foreground mb-4">Tap this color!</p>
        <motion.div
          key={targetColor.name}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-24 h-24 ${targetColor.class} rounded-3xl shadow-xl border-4 border-white mx-auto`}
        />
      </div>

      {/* Color Options */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          {colors.map((color, index) => (
            <motion.button
              key={color.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleColorTap(color)}
              className={`w-32 h-32 sm:w-40 sm:h-40 ${color.class} rounded-3xl shadow-xl border-4 border-white`}
            />
          ))}
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-8xl">⭐</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorMatch;
