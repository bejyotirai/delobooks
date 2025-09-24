
'use client';

import { Input } from '@/components/ui/input';
import { useQueryState } from 'nuqs';

export function SearchBar() {
  const [search, setSearch] = useQueryState('q', { defaultValue: '', shallow: false });

  return (
    <Input
      placeholder="Search eBooks..."
      value={search}
      onChange={(e) => setSearch(e.target.value || null)}
      className="max-w-md"
    />
  );
}