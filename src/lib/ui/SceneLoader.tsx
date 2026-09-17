import { useProgress } from '@react-three/drei';

export function SceneLoader() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading the brain model"
      className="absolute inset-0 grid place-items-center text-slate-300"
    >
      Loading the brain… {Math.round(progress)}%
    </div>
  );
}
