
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.upsert({
    where: { email: 'student@example.edu' },
    update: {},
    create: {
      campus_user_id: 'S123456',
      email: 'student@example.edu',
      first_name: 'Demo',
      last_name: 'Student',
      role: 'student'
    }
  });

  const careers = ['Data Science','Software Engineering','Investment Banking','Product Management','UX Design'];
  const careerRows = await Promise.all(careers.map(label => prisma.career_options.upsert({
    where: { label },
    update: {},
    create: { label, synonyms: [] }
  })));

  const cs201 = await prisma.courses.upsert({
    where: { subject_catalog_nbr: { subject: 'CS', catalog_nbr: '201' } },
    update: {},
    create: { subject: 'CS', catalog_nbr: '201', title: 'Data Structures', description: 'Core CS', level: 'Undergrad' }
  });
  const cs341 = await prisma.courses.upsert({
    where: { subject_catalog_nbr: { subject: 'CS', catalog_nbr: '341' } },
    update: {},
    create: { subject: 'CS', catalog_nbr: '341', title: 'Machine Learning', description: 'Intro to ML', level: 'Undergrad' }
  });

  await prisma.course_prereqs.upsert({
    where: { id: 'cs341->cs201' },
    update: {},
    create: { id: 'cs341->cs201', course_id: cs341.id, prereq_course_id: cs201.id, co_requisite: false }
  });

  await prisma.interest_course_map.createMany({
    data: [
      { career_option_id: careerRows[0].id, course_id: cs201.id, relevance_score: 0.6 },
      { career_option_id: careerRows[0].id, course_id: cs341.id, relevance_score: 0.9 },
      { career_option_id: careerRows[1].id, course_id: cs201.id, relevance_score: 0.8 }
    ],
    skipDuplicates: true
  });

  const acm = await prisma.organizations.upsert({
    where: { name: 'ACM Student Chapter' },
    update: {},
    create: { name: 'ACM Student Chapter', category: 'Tech', description: 'CS community', contact_email: 'acm@example.edu' }
  });
  await prisma.interest_org_map.create({
    data: { career_option_id: careerRows[0].id, organization_id: acm.id, relevance_score: 0.7 }
  });

  const alum = await prisma.alumni.create({
    data: { full_name: 'Alex Patel', grad_year: 2019, location: 'New York, NY', mentorship_available: true, privacy_level: 'students_only', linkedin_url: 'https://linkedin.com/in/example' }
  });
  await prisma.alumni_positions.create({
    data: { alumni_id: alum.id, company: 'BlackRock', title: 'Data Scientist', is_current: true, start_date: new Date('2022-01-10') }
  });

  console.log('Seed complete.');
}

main().catch(e=>{console.error(e); process.exit(1);}).finally(()=> prisma.$disconnect());
