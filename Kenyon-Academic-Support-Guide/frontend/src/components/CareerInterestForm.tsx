
'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/src/lib/api';

export default function CareerInterestForm({ onSelected }:{ onSelected:(id?:string)=>void }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<{id:string,label:string}[]>([]);
  const [custom, setCustom] = useState('');
  const [selected, setSelected] = useState<string|undefined>(undefined);

  useEffect(()=> {
    let active = true;
    api.searchCareerOptions(query).then(data => { if(active) setOptions(data) });
    return ()=> { active = false };
  }, [query]);

  const show = useMemo(()=> options.slice(0,8), [options]);

  async function save() {
    await api.submitInterest(selected ?? null, custom || undefined);
    onSelected(selected);
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">Career Interest</h2>
      <label className="block text-sm">Search options</label>
      <input value={query} onChange={e=> setQuery(e.target.value)}
             placeholder="e.g., Data Science" className="mt-1 w-full rounded border px-3 py-2" />
      {show.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {show.map(opt => (
            <button key={opt.id}
              onClick={()=> { setSelected(opt.id); onSelected(opt.id); }}
              className={`rounded border px-3 py-2 text-left ${selected===opt.id?'border-blue-600 bg-blue-50':'hover:bg-gray-50'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3">
        <label className="block text-sm">Or type your own</label>
        <input value={custom} onChange={e=> setCustom(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div className="mt-3">
        <button onClick={save} className="rounded bg-blue-600 px-4 py-2 text-white">Save</button>
      </div>
    </div>
  );
}
