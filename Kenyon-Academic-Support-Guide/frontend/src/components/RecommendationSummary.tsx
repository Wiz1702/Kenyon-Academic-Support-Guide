
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/src/lib/api';

export default function RecommendationSummary({ careerId }:{ careerId?:string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);

  useEffect(()=> {
    api.courseRecs(careerId).then(d => setCourses(d.items||[]));
    api.orgRecs(careerId).then(d => setOrgs(d.items||[]));
    api.alumniSearch({ mentorsOnly: 'true' }).then(d => setAlumni(d.items||[]));
  }, [careerId]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card title="Courses" items={courses} render={(c:any) => (
        <div>
          <div className="font-semibold">{c.course.subject} {c.course.catalog}: {c.course.title}</div>
          <div className="text-sm text-gray-600 line-clamp-2">{c.course.description}</div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Pill ok={c.prereqStatus.canTake} text={c.prereqStatus.canTake?'Ready':'Prereqs needed'} />
            <span>Relevance: {(c.relevance*100).toFixed(0)}%</span>
          </div>
        </div>
      )} />
      <Card title="Alumni" items={alumni} render={(a:any)=> (
        <div>
          <div className="font-semibold">{a.name}</div>
          <div className="text-sm">{a.currentRole} @ {a.company}</div>
          <div className="text-xs text-gray-600">{a.location}</div>
          {a.mentorshipAvailable && <span className="mt-2 inline-block rounded bg-emerald-100 px-2 py-1 text-emerald-700 text-xs">Mentor</span>}
        </div>
      )} />
      <Card title="Student Orgs" items={orgs} render={(o:any)=> (
        <div>
          <div className="font-semibold">{o.name}</div>
          <div className="text-sm text-gray-700">{o.category}</div>
          <div className="text-sm text-gray-600 line-clamp-2">{o.description}</div>
        </div>
      )} />
    </div>
  );
}

function Card({ title, items, render }:{ title:string, items:any[], render:(x:any)=>React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {items.length===0 && <div className="text-sm text-gray-500">No items yet.</div>}
        {items.map((it, i)=> (
          <div key={i} className="rounded border p-3">{render(it)}</div>
        ))}
      </div>
    </div>
  );
}

function Pill({ ok, text }:{ ok:boolean, text:string }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs ${ok?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-800'}`}>{text}</span>
  );
}
