import type { ValueOf } from '@/shared/type/types';
import Tab from '@/shared/ui/tab';
import { useState } from 'react';
import { POST_TAB_VALUES, POST_TABS } from '../constants/post-tabs';

export default function PostTab() {
  const [selectedTab, setSelectedTab] = useState<ValueOf<typeof POST_TAB_VALUES>>(
    POST_TABS[0].value,
  );

  return <Tab options={POST_TABS} value={selectedTab} onChange={setSelectedTab} />;
}
