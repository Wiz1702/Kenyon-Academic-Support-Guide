
import { Router } from 'express';
import { prisma } from '../services/prisma.js';

const router = Router();

router.get('/search', async (req, res) => {
  const { location, company, mentorsOnly, gradYearMin, gradYearMax } = req.query;
  const items = await prisma.alumni.findMany({
    where: {
      location: location ? { contains: String(location), mode: 'insensitive' } : undefined,
      grad_year: gradYearMin || gradYearMax ? {
        gte: gradYearMin ? Number(gradYearMin) : undefined,
        lte: gradYearMax ? Number(gradYearMax) : undefined
      } : undefined,
      mentorship_available: mentorsOnly === 'true' ? true : undefined
    },
    take: 50
  });

  const withPositions = await Promise.all(items.map(async (a) => {
    const pos = await prisma.alumni_positions.findFirst({ where: { alumni_id: a.id, is_current: true } });
    const matchCompany = company ? (pos?.company?.toLowerCase().includes(String(company).toLowerCase()) ?? false) : true;
    return matchCompany ? {
      alumniId: a.id,
      name: a.full_name,
      gradYear: a.grad_year,
      currentRole: pos?.title || null,
      company: pos?.company || null,
      location: a.location,
      mentorshipAvailable: a.mentorship_available,
      contact: a.privacy_level !== 'restricted' ? { email: a.email } : null,
      linkedinUrl: a.linkedin_url,
      progression: pos ? [{ title: pos.title, company: pos.company, from: pos.start_date, to: null }] : [],
      relevance: 0.7,
      confidence: 0.6,
      explanationId: null
    } : null;
  }));

  res.json({ items: withPositions.filter(Boolean) });
});

export default router;
