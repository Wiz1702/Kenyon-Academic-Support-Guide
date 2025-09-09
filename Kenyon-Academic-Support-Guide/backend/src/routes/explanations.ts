
import { Router } from 'express';
const router = Router();

router.get('/:id', async (_req, res) => {
  res.json({
    entityType: "course",
    entityId: "placeholder",
    reasons: [
      { type: "mapping", detail: "Curated mapping DS ↔ CS 341" },
      { type: "keyword_match", detail: "Keywords: 'machine learning', 'supervised'" }
    ],
    confidence: 0.75
  });
});

export default router;
