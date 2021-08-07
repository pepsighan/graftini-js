import { FeedbackFish as ReactFeedbackFish } from '@feedback-fish/react';
import { useAuthUser } from 'store/auth';

export default function FeedbackFish({ children }) {
  const { user } = useAuthUser();
  return (
    <ReactFeedbackFish projectId="0cfacd08fe9961" userId={user?.email}>
      {children}
    </ReactFeedbackFish>
  );
}
