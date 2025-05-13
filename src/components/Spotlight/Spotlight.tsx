import { useEffect, useRef, useState } from "react";
import styles from "./Spotlight.module.css";

interface SpotlightStep {
  selector: string;
  content: string;
}

interface SpotlightProps {
  onFinish?: () => void;
}

const steps: SpotlightStep[] = [
  {
    selector: ".player-controls",
    content: "These are your main playback controls.",
  },
  {
    selector: ".music-panel",
    content: "Features like Shuffle, Fav., YTLink, Loop, Repeat .",
  },
  {
    selector: ".hamburger-menu",
    content: "Click to view currently playing tracks.",
  },
  {
    selector: ".theme-toggle",
    content: "Toggle between light and dark themes.",
  },
  {
    selector: ".dashboard-library",
    content: "Click to open the music dashboard.",
  }
];

interface RectData {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
}

export default function Spotlight({ onFinish }: SpotlightProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<RectData | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (!currentStep) return;

    const interval = setInterval(() => {
      const el = document.querySelector(
        currentStep.selector
      ) as HTMLElement | null;
      if (!el) return;

      let parent = el;
      let hasShimmerParent = false;
      while (parent) {
        if (parent.classList.contains("shimmer")) {
          hasShimmerParent = true;
          break;
        }
        parent = parent.parentElement!;
      }

      if (!hasShimmerParent) {
        const rect = el.getBoundingClientRect();
        const paddedRect = {
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          bottom: rect.top - 8 + rect.height + 16,
        };
        setTargetRect(paddedRect);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [stepIndex, currentStep]);

  // Adjust tooltip position based on space
  useEffect(() => {
    if (!targetRect || !boxRef.current) return;

    const padding = 10;
    const tooltipHeight = boxRef.current.offsetHeight;
    const tooltipWidth = boxRef.current.offsetWidth;

    const showBelow =
      window.innerHeight - targetRect.bottom > tooltipHeight + padding;
    const top = showBelow
      ? targetRect.bottom + padding
      : targetRect.top - tooltipHeight - padding;

    const left = Math.min(
      Math.max(10, targetRect.left),
      window.innerWidth - tooltipWidth - 10
    );

    setTooltipPos({ top, left });
  }, [targetRect]);

  const next = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onFinish?.();
    }
  };

  const prev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const skip = () => onFinish?.();

  if (!targetRect) return null;

  return (
    <>
      <div className={styles.overlay}></div>

      <div
        className={styles.tooltip}
        ref={boxRef}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
        }}
      >
        <p>{currentStep.content}</p>
        <div className={styles.buttons}>
          <button onClick={prev} disabled={stepIndex === 0}>
            Back
          </button>
          <button onClick={next}>
            {stepIndex === steps.length - 1 ? "Finish" : "Next"}
          </button>
          <button onClick={skip}>Skip</button>
        </div>
      </div>

      <div
        className={styles.highlight}
        style={{
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
        }}
      />
    </>
  );
}
