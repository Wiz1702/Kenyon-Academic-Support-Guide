
const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api/v1';

export const api = {
  searchCareerOptions: async (query: string) => {
    const r = await fetch(`${base}/interests/options?query=${encodeURIComponent(query)}`);
    return r.json();
  },
  submitInterest: async (primaryOptionId: string|null, customText?: string) => {
    const r = await fetch(`${base}/interests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ primaryOptionId, customText })
    });
    return r.json();
  },
  courseRecs: async (careerId?: string) => {
    const url = new URL(`${base}/recommendations/courses`);
    if (careerId) url.searchParams.set('careerId', careerId);
    const r = await fetch(url);
    return r.json();
  },
  alumniSearch: async (params: Record<string,string>) => {
    const url = new URL(`${base}/alumni/search`);
    Object.entries(params).forEach(([k,v])=> url.searchParams.set(k,v));
    const r = await fetch(url);
    return r.json();
  },
  orgRecs: async (careerId?: string) => {
    const url = new URL(`${base}/recommendations/organizations`);
    if (careerId) url.searchParams.set('careerId', careerId);
    const r = await fetch(url);
    return r.json();
  }
};
