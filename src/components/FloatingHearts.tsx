import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [screenHeight, setScreenHeight] = useState(900);

  useEffect(() => {
    const updateHeight = () => setScreenHeight(window.innerHeight || 900);
    updateHeight();
    window.addEventListener("resize", updateHeight);

    const emojis = ["❤️", "💕", "💖", "💗", "💘", "💝", "🌹", "✨"];
    const generated: Heart[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 16 + Math.random() * 24,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setHearts(generated);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute drop-shadow-sm"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            bottom: -50,
          }}
          animate={{
            y: [0, -screenHeight - 100],
            x: [0, Math.sin(heart.id) * 60],
            opacity: [0, 1, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
}
