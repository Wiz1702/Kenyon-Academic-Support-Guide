
import { prisma } from './prisma.js';

export async function prereqsForCourse(courseId: string) {
  const edges = await prisma.course_prereqs.findMany({ where: { course_id: courseId } });
  return edges.map(e => e.prereq_course_id);
}

export function missingPrereqs(prereqIds: string[], completed: Set<string>) {
  return prereqIds.filter(id => !completed.has(id));
}
