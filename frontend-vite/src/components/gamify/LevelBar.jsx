import React from "react";

function LevelBar({ xp, level }) {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000];

  const prevThreshold = thresholds[level - 1] || 0;
  const nextThreshold = thresholds[level] || 4000;

  const progress = Math.max(
    0,
    Math.min(
      100,
      ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100,
    ),
  );

  const remainingXP = Math.max(0, nextThreshold - xp);

  const getLevelTitle = (level) => {
    if (level >= 20) return "Master";
    if (level >= 15) return "Expert";
    if (level >= 10) return "Builder";
    if (level >= 5) return "Explorer";
    return "Newbie";
  };

  return (
    <div className="space-y-2">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">
            Progress
          </p>

          <h3 className="mt-1 text-sm font-semibold text-white">
            Level {level}
          </h3>
        </div>

        <div
          className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-[#C08A5D]/30
          bg-[#C08A5D]/10
          px-4
          py-1.5
    "
        >
          <span className="text-base">🏆</span>

          <div className="leading-tight">
            <p className="text-xs font-semibold text-[#D9A06A]">
              {getLevelTitle(level)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}

      <div
        className="
          relative
          h-3
          w-full
          overflow-hidden
          rounded-full
          bg-white/5
          ring-1
          ring-white/10
        "
      >
        <div
          className="
            relative
            h-full
            rounded-full
            transition-all
            duration-700
            ease-out
          "
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg,#C08A5D 0%,#D9A06A 100%)",
          }}
        >
          {/* Shine Effect */}

          <div
            className="
              absolute
              inset-0
              opacity-40
            "
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)",
            }}
          />
        </div>
      </div>

      {/* XP Information */}

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-white">{xp.toLocaleString()} XP</span>

        <span className="text-white/60">
          {nextThreshold.toLocaleString()} XP
        </span>
      </div>

      {/* Bottom Text */}

      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">
          {xp - prevThreshold} / {nextThreshold - prevThreshold} XP Progress
        </span>

        <span className="text-xs font-medium text-[#D9A06A]">
          {remainingXP.toLocaleString()} XP left
        </span>
      </div>
    </div>
  );
}

export default LevelBar;
