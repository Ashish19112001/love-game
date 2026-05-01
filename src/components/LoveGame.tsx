import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { FloatingHearts } from "./FloatingHearts";

type Stage =
  | "welcome"
  | "question1"
  | "angry"
  | "question2"
  | "question3"
  | "question4"
  | "question5"
  | "final";

const angryEmojis = ["😡", "🤬", "💢", "😤", "👊", "💔", "😠", "🔥"];

function AngryExplosion({ onDone }: { onDone: () => void }) {
  const [emojis] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: angryEmojis[Math.floor(Math.random() * angryEmojis.length)],
      x: Math.random() * 300 - 150,
      y: Math.random() * -400 - 50,
      rotate: Math.random() * 720 - 360,
      scale: 0.5 + Math.random() * 1.5,
    }))
  );

  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {emojis.map((e) => (
        <motion.div
          key={e.id}
          className="absolute text-4xl"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: e.x,
            y: e.y,
            scale: e.scale,
            opacity: 0,
            rotate: e.rotate,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {e.emoji}
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 3, 0] }}
        transition={{ duration: 1.5 }}
        className="text-8xl"
      >
        😡
      </motion.div>
    </div>
  );
}

function RunawayButton({
  onClick,
  children,
  runCount,
}: {
  onClick: () => void;
  children: React.ReactNode;
  runCount: number;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [escapes, setEscapes] = useState(0);
  const [message, setMessage] = useState("");

  const messages = [
    "Haha! Pakad ke dikhao 😜",
    "Itni jaldi nahi! 🏃‍♀️",
    "No nahi bol sakte! 😤",
    "Kahan ja rahe ho? 😂",
    "Abhi bhi try kar rahe ho? 🤭",
    "Haar maan lo! 💕",
    "Yes daba do na! 🥺",
    "Main nahi milunga! 👻",
    "Sochoo... Yes hi sahi hai 😏",
    "Button bhag gaya! 🏃💨",
  ];

  const handleEvade = useCallback(() => {
    // Keep button visible on screen, constrain to ±150px range
    const rangeX = Math.min(150, window.innerWidth / 3);
    const rangeY = Math.min(200, window.innerHeight / 4);
    const newX = Math.random() * rangeX * 2 - rangeX;
    const newY = Math.random() * rangeY * 2 - rangeY;
    setPos({ x: newX, y: newY });
    setEscapes((e) => e + 1);
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const buttonSize = Math.max(20, 100 - escapes * 8);
  const fontSize = Math.max(8, 14 - escapes);

  return (
    <>
      <AnimatePresence>
        {message && (
          <motion.p
            key={message + escapes}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-love-deep font-bold text-sm sm:text-base mt-2 min-h-[24px]"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        ref={btnRef}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onHoverStart={handleEvade}
        onTouchStart={handleEvade}
        onClick={onClick}
        style={{
          width: buttonSize,
          fontSize: fontSize,
        }}
        className="bg-destructive text-destructive-foreground py-2 rounded-full font-bold shadow-lg transition-all whitespace-nowrap"
      >
        No 😢
      </motion.button>
    </>
  );
}

export function LoveGame() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [showAngry, setShowAngry] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [lovePercentage, setLovePercentage] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const finalMessage =
    "Aww Aap Kinne Acche ho😘. I love you infinity se bhi zyada! 💕🌹✨";

  // Typewriter effect for final message
  useEffect(() => {
    if (stage !== "final") return;
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (i < finalMessage.length) {
        setTypedText(finalMessage.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    const cursorInterval = setInterval(() => setShowCursor((c) => !c), 500);
    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [stage]);

  // Love meter animation
  useEffect(() => {
    if (stage !== "question5") return;
    let val = 0;
    const interval = setInterval(() => {
      val += 2;
      setLovePercentage(Math.min(val, 100));
      if (val >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStage("final");
          fireConfetti();
        }, 800);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [stage]);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#ff69b4", "#ff1493", "#ff6b81", "#ffd700", "#ff4757", "#ff85a2"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleNo = () => {
    setNoCount((c) => c + 1);
    setShakeScreen(true);
    setShowAngry(true);
    setTimeout(() => setShakeScreen(false), 500);
  };

  const handleYes = (nextStage: Stage) => {
    setYesScale((s) => s + 0.15);
    setStage(nextStage);
  };

  const resetGame = () => {
    setStage("welcome");
    setNoCount(0);
    setYesScale(1);
    setLovePercentage(0);
    setTypedText("");
  };

  const trickQuestions: {
    stage: Stage;
    next: Stage;
    emoji: string;
    question: string;
    yesText: string;
  }[] = [
    {
      stage: "question1",
      next: "question2",
      emoji: "🥺",
      question: "Do you love me?",
      yesText: "Yes, of course! 💖",
    },
    {
      stage: "question2",
      next: "question3",
      emoji: "😍",
      question: "Will you be mine forever?",
      yesText: "yes!🫣💍",
    },
    {
      stage: "question3",
      next: "question4",
      emoji: "🌙",
      question: "Mujhe hug & Kiss Karne dogi🫣?",
      yesText: "Why Not Baby💝",
    },
    {
      stage: "question4",
      next: "question5",
      emoji: "💋",
      question: "Promise karo kabhi chhodogi nahi?",
      yesText: "Pakka Promise! 🤞💕",
    },
  ];

  return (
    <motion.div
      animate={shakeScreen ? { x: [-5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center bg-love-blush relative overflow-hidden px-4"
    >
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* WELCOME */}
          {stage === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl sm:text-8xl mb-6"
              >
                💌
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold text-love-deep mb-2">
                Hey Jaan! 🌹
              </h1>
              <p className="text-love-rose text-lg mb-2">
                Ek chota sa game hai Aapke liye Bby...
              </p>
              <p className="text-muted-foreground text-sm mb-8">
                ⚠️ Warning: Isme cheating nahi chalegi 😏
              </p>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage("question1")}
                className="bg-primary text-primary-foreground px-10 py-4 rounded-full text-lg font-bold shadow-xl shadow-primary/40"
              >
                Chalo Shuru Karte Hain 💖
              </motion.button>
            </motion.div>
          )}

          {/* TRICK QUESTIONS */}
          {trickQuestions.map(
            (tq) =>
              stage === tq.stage && (
                <motion.div
                  key={tq.stage}
                  initial={{ opacity: 0, y: 80, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -80, rotate: 5 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-center"
                >
                  <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-border relative overflow-visible">
                    {/* Progress hearts */}
                    <div className="flex justify-center gap-2 mb-6">
                      {trickQuestions.map((_, i) => (
                        <motion.span
                          key={i}
                          animate={
                            i <=
                            trickQuestions.findIndex((t) => t.stage === stage)
                              ? { scale: [1, 1.3, 1] }
                              : {}
                          }
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="text-2xl"
                        >
                          {i <=
                          trickQuestions.findIndex((t) => t.stage === stage)
                            ? "❤️"
                            : "🤍"}
                        </motion.span>
                      ))}
                    </div>

                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-6xl sm:text-7xl mb-4"
                    >
                      {tq.emoji}
                    </motion.div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 leading-snug">
                      {tq.question}
                    </h2>

                    <div className="flex flex-col items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ scale: yesScale }}
                        onClick={() => handleYes(tq.next)}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-base sm:text-lg shadow-lg shadow-primary/30"
                      >
                        {tq.yesText}
                      </motion.button>

                      <RunawayButton onClick={handleNo} runCount={noCount}>
                        No 😢
                      </RunawayButton>
                    </div>

                    {noCount > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-destructive text-xs mt-4 font-medium"
                      >
                        No dabane ki koshish: {noCount} baar 😤
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )
          )}

          {/* LOVE METER */}
          {stage === "question5" && (
            <motion.div
              key="lovemeter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-border">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-5xl mb-4"
                >
                  💗
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
                  Calculating Love... 💕
                </h2>

                <div className="w-full bg-muted rounded-full h-6 mb-4 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-love-pink via-primary to-love-deep"
                    style={{ width: `${lovePercentage}%` }}
                  />
                </div>

                <motion.p
                  className="text-3xl font-bold text-love-deep"
                  animate={{ scale: lovePercentage === 100 ? [1, 1.3, 1] : 1 }}
                >
                  {lovePercentage}%
                </motion.p>

                {lovePercentage < 100 && (
                  <p className="text-muted-foreground text-sm mt-2">
                    {lovePercentage < 30
                      ? "Loading pyaar... 🫣"
                      : lovePercentage < 60
                        ? "Bohut saara pyaar aa raha hai... 💕"
                        : lovePercentage < 90
                          ? "Almost there... 🥰"
                          : "OVERFLOW! 💥"}
                  </p>
                )}

                {lovePercentage === 100 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-love-deep font-bold text-lg mt-2"
                  >
                    Error: INFINITE LOVE detected! ♾️💖
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* FINAL MESSAGE */}
          {stage === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="text-center"
            >
              <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-border">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl sm:text-7xl mb-4"
                >
                  💝
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-bold text-love-deep mb-4">
                  I Love You! 💖
                </h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-love-blush rounded-2xl p-5 sm:p-6 mb-6 min-h-[120px] text-left"
                >
                  <p className="text-love-deep text-base sm:text-lg leading-relaxed font-medium italic">
                    "{typedText}
                    {showCursor && typedText.length < finalMessage.length && (
                      <span className="text-primary">|</span>
                    )}
                    "
                  </p>
                </motion.div>

                {noCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-destructive/10 rounded-xl p-3 mb-4"
                  >
                    <p className="text-destructive text-sm font-medium">
                      Tumne {noCount} baar No dabane ki koshish ki thi 😤
                      <br />
                      At the End Ashish Ke Pyaar me Pad hi Gai 🥰🫣💕
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="space-y-3"
                >
                  <p className="text-2xl">🥰 Forever & Always 🥰</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/30 mt-2"
                  >
                    Phir Se Khelo 💖
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Angry explosion overlay */}
      {showAngry && <AngryExplosion onDone={() => setShowAngry(false)} />}
    </motion.div>
  );
}