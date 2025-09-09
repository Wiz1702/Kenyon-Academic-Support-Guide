
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>Start by telling us your career interest.</p>
      <div className="space-x-2">
        <Link href="/(routes)/dashboard" className="rounded bg-blue-600 px-4 py-2 text-white">Open Dashboard</Link>
      </div>
    </div>
  );
}
