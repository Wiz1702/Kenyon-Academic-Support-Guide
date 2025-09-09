
import { Router } from 'express';
import { prisma } from '../services/prisma.js';
import { scoreCourse, confidenceForCourse } from '../services/scoring.js';
import { prereqsForCourse, missingPrereqs } from '../services/prereq.js';

const router = Router();

router.get('/courses', async (req, res) => {
  const careerId = String(req.query.careerId || '');
  const term = String(req.query.term || '');
  const max = Number(req.query.max || 20);

  const user = await prisma.users.findFirst();
  const profile = await prisma.student_profiles.findUnique({ where: { user_id: user!.id } });
  const completed = new Set((profile?.completed_course_ids || []) as string[]);

  const mapped = await prisma.interest_course_map.findMany({
    where: careerId ? { career_option_id: careerId } : {},
    take: 200
  });

  const items = await Promise.all(mapped.map(async (m) => {
    const course = await prisma.courses.findUnique({ where: { id: m.course_id }});
    const prereqList = await prereqsForCourse(m.course_id);
    const missing = missingPrereqs(prereqList, completed);
    const relevance = scoreCourse({ mappingScore: Number(m.relevance_score) || 0.5 });
    const confidence = confidenceForCourse({ missingCount: missing.length, dataFreshnessDays: 7 });
    return {
      course: {
        id: course!.id,
        subject: course!.subject,
        catalog: course!.catalog_nbr,
        title: course!.title,
        description: course!.description,
        credits: course!.credits,
        offerings: term ? await prisma.course_offerings.findMany({ where: { course_id: course!.id, term_code: term } }) : []
      },
      prereqStatus: { missing, canTake: missing.length === 0, suggestedSequence: [] },
      relevance, confidence,
      explanationId: null
    };
  }));

  items.sort((a,b)=> b.relevance - a.relevance);
  res.json({ items: items.slice(0, max) });
});

export default router;
