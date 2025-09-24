'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryState } from 'nuqs';

interface FilterProps {
  categories: string[];
}

export function Filter({ categories }: FilterProps) {
  const [category, setCategory] = useQueryState('category', { defaultValue: '', shallow: false });

  return (
    <Select 
      value={category === '' ? 'all' : category} 
      onValueChange={(val) => setCategory(val === 'all' ? null : val)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {cat}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}