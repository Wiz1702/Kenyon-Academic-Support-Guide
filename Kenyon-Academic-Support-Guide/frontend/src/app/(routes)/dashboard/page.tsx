
'use client';
import { useEffect, useState } from 'react';
import CareerInterestForm from '@/src/components/CareerInterestForm';
import RecommendationSummary from '@/src/components/RecommendationSummary';

export default function Dashboard() {
  const [careerId, setCareerId] = useState<string|undefined>(undefined);
  useEffect(() => {}, []);
  return (
    <div className="grid grid-cols-1 gap-6">
      <CareerInterestForm onSelected={(id)=> setCareerId(id)} />
      <RecommendationSummary careerId={careerId} />
    </div>
  );
}
