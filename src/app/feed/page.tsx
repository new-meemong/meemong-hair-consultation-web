import { MOCK_FEEDS } from '@/widgets/feed/model/mock-data';
import { FeedList } from '@/widgets/feed/ui/feed-list';

export default function FeedPage() {
  return (
    <main className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold ml-4 mt-4 mb-6">피드</h1>
      <FeedList feeds={MOCK_FEEDS} />
    </main>
  );
}
