import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rf = (a, b) => a + Math.random() * (b - a);

function FloatingEmojis() {
  const sprites = useMemo(() => {
    const EMOJIS = ["❤️", "💗", "💖", "🍌", "🍬", "💝", "💞"];
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: rf(0, 100),
      size: rf(18, 44),
      duration: rf(12, 24),
      delay: rf(0, 10),
      opacity: rf(0.12, 0.35),
      rotate: rf(-15, 15),
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sprites.map((s) => (
        <motion.span
          key={s.id}
          initial={{ y: "105%", rotate: s.rotate, opacity: 0 }}
          animate={{ y: "-10%", opacity: s.opacity }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, repeatType: "loop", ease: "linear" }}
          style={{ left: `${s.left}%`, fontSize: s.size }}
          className="absolute select-none"
        >
          {s.emoji}
        </motion.span>
      ))}
    </div>
  );
}

function GlassCard({ children }) {
  return (
    <div className="backdrop-blur-md bg-white/50 shadow-xl rounded-3xl p-6 sm:p-8 border border-white/60">
      {children}
    </div>
  );
}

export default function ConfessionApp() {
  const [stage, setStage] = useState("gate");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [clicks, setClicks] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().toLowerCase() === "kana") {
      setError("");
      setStage("transition");
      setTimeout(() => setStage("heart"), 900);
    } else {
      setError("Your not her!");
    }
  };

  const handleHeartClick = () => {
    setClicks((c) => Math.min(c + 1, 10));
  };

  const unlocked = clicks >= 10;

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4" style={{
      background: "linear-gradient(180deg, #FFE9F2 0%, #FFD9E8 35%, #FFEAF2 100%)",
    }}>
      <FloatingEmojis />
      <div className="pointer-events-none absolute inset-0 rounded-none" style={{
        boxShadow: "inset 0 0 200px rgba(255, 105, 180, 0.15)",
      }} />

      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {stage === "gate" && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.45 }}
            >
              <GlassCard>
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold text-rose-600">
                    hi there ♡
                  </h1>
                  <p className="mt-2 text-rose-700/90">Quick check before we start.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <label className="block text-sm font-medium text-rose-700">
                    What's your name?
                  </label>
                  <div className="bg-white/70 border border-rose-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-rose-300">
                    <input
                      type="text"
                      placeholder="type here..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent outline-none px-3 py-3 rounded-xl text-rose-800 placeholder-rose-400"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
                  <button
                    type="submit"
                    className="w-full rounded-2xl px-4 py-3 bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-semibold shadow-md transition"
                  >
                    Continue
                  </button>
                </form>
                <p className="mt-4 text-center text-xs text-rose-600/80">
                  (psst… only the real one can enter)
                </p>
              </GlassCard>
            </motion.div>
          )}

          {stage === "transition" && (
            <motion.div
              key="transition"
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -4, opacity: 0 }}
                animate={{ scale: 1.05, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="text-5xl"
              >
                💗
              </motion.div>
            </motion.div>
          )}

          {stage === "heart" && (
            <motion.div
              key="heart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard>
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-rose-600">Tap to unlock</h2>
                  <p className="mt-1 text-rose-700/90">Tap the heart 10 times to open it.</p>
                </div>
                <div className="mt-6 flex flex-col items-center justify-center">
                  <motion.button
                    onClick={unlocked ? undefined : handleHeartClick}
                    disabled={unlocked}
                    whileTap={{ scale: unlocked ? 1 : 0.9 }}
                    animate={{ scale: unlocked ? [1, 1.06, 1] : [1, 1.03, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror" }}
                    className={`relative select-none transition focus:outline-none`}
                  >
                    <span className="text-[120px] sm:text-[160px] drop-shadow-[0_8px_24px_rgba(244,63,94,0.45)]">
                      {unlocked ? "💖" : "❤️"}
                    </span>
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-rose-700/90 font-semibold bg-white/70 backdrop-blur px-3 py-1 rounded-full border border-rose-200">
                          {clicks} / 10
                        </span>
                      </div>
                    )}
                  </motion.button>
                </div>
                <div className="mt-6 text-center text-sm text-rose-700/80">
                  {unlocked ? (
                    <button
                      onClick={() => setStage("open")}
                      className="rounded-xl px-4 py-2 bg-rose-500 text-white font-semibold shadow hover:bg-rose-600"
                    >
                      Open 💌
                    </button>
                  ) : (
                    <p>keep going… it’s shy</p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {stage === "open" && (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mx-auto max-w-xl overflow-y-auto h-[90vh] flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative mx-auto w-full aspect-square"
                >
                  <svg viewBox="0 0 500 450" className="w-full h-full drop-shadow-xl">
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff7aa8" />
                        <stop offset="100%" stopColor="#ff4d88" />
                      </linearGradient>
                      <clipPath id="heart-clip">
                        <path d="M250 420 L60 230 C-40 120 60 10 170 60 C220 80 250 120 250 120 C250 120 280 80 330 60 C440 10 540 120 440 230 Z" />
                      </clipPath>
                    </defs>
                    <path d="M250 420 L60 230 C-40 120 60 10 170 60 C220 80 250 120 250 120 C250 120 280 80 330 60 C440 10 540 120 440 230 Z" fill="url(#g)" stroke="#ff8fb6" strokeWidth="10" />
                    <foreignObject x="55" y="20" width="390" height="410" clipPath="url(#heart-clip)">
                      <div xmlns="http://www.w3.org/1999/xhtml" className="h-full w-full overflow-y-auto flex items-start justify-center pt-28 pb-32">
                        <div className="text-center px-5 text-white/95 max-w-[320px] sm:max-w-[340px]">
                          <div aria-hidden="true" className="h-6" />
                          <h3 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow">for kana ♡</h3>
                          <p className="mt-3 leading-relaxed text-sm sm:text-base">
                            I’ve liked you for years now. Every small thing you do — the way you smile, the way you talk, the little things you say — it all makes my heart skip a beat. You’ve always had that soft warmth that makes everything around you brighter.
                          </p>
                          <p className="mt-3 leading-relaxed text-sm sm:text-base">
                            I tried hiding it before, pretending it was just admiration. But the more I got to know you, the harder it became. You’re not just someone I like — you’re someone who makes ordinary days feel special. You make me want to be a better version of myself.
                          </p>
                          <p className="mt-3 leading-relaxed text-sm sm:text-base">
                            So, here it is — my little confession wrapped in a pink heart. I don’t expect anything grand, just that you know how I feel. Even if all I get is your smile after this, that’s more than enough for me.
                          </p>
                          <p className="mt-4 text-xl sm:text-2xl font-extrabold drop-shadow">I love you</p>
                          <div aria-hidden="true" className="h-8" />
                        </div>
                      </div>
                    </foreignObject>
                  </svg>
                </motion.div>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setClicks(0);
                      setStage("heart");
                    }}
                    className="rounded-2xl px-4 py-2 bg-white/70 border border-rose-200 text-rose-700 font-semibold backdrop-blur hover:bg-white"
                  >
                    Replay the heart
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute top-4 left-4 text-rose-700/70 text-sm font-semibold select-none">banana • kandy • kana</div>
      <div className="absolute bottom-4 right-4 text-rose-700/60 text-xs select-none">made with ♡</div>
    </div>
  );
}
