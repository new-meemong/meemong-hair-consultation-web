import { MOCK_FEEDS } from '@/widgets/feed/model/mock-data';
import { FeedList } from '@/widgets/feed/ui/feed-list';

export default function FeedPage() {
  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">피드</h1>
      <FeedList feeds={MOCK_FEEDS} />
    </main>
  );
}
