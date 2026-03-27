import { Star } from 'lucide-react';

export default function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(rating) ? 'text-accent-500 fill-accent-500' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}
