
export function scoreCourse({ mappingScore = 0.5, keywordScore = 0.2, availabilityBoost = 0.1, levelPenalty = 0 }: {
  mappingScore?: number,
  keywordScore?: number,
  availabilityBoost?: number,
  levelPenalty?: number
}) {
  let s = 0;
  s += 0.5 * clamp(mappingScore);
  s += 0.3 * clamp(keywordScore);
  s += 0.1 * clamp(availabilityBoost);
  s -= 0.1 * clamp(levelPenalty);
  return clamp(s);
}

export function confidenceForCourse({ missingCount, dataFreshnessDays }: { missingCount: number, dataFreshnessDays: number }) {
  const evidence = 2 - Math.min(missingCount, 2) * 0.5;
  const freshness = Math.max(0, 1 - dataFreshnessDays/30);
  const x = 1.2*evidence + 0.8*freshness;
  return clamp(1/(1+Math.exp(-x)) * 0.9);
}

function clamp(n: number) { return Math.max(0, Math.min(1, n)); }
