import { useDispatch, useSelector } from 'react-redux';
import {
  setPro,
  setPlan,
  incrementMessageCount,
  resetMessageCount,
  checkAndResetIfNeeded,
} from '../store/subscriptionSlice';

export const useSubscription = () => {
  const dispatch = useDispatch();
  const { isPro, plan, messageCount } = useSelector(
    (state: any) => state.subscription
  );

  const upgradeToPro = (selectedPlan: 'pro' | 'annual') => {
    dispatch(setPlan(selectedPlan));
  };

  const downgradeToFree = () => {
    dispatch(setPlan('free'));
  };

  const trackMessage = () => {
    dispatch(checkAndResetIfNeeded());
    if (!isPro) {
      dispatch(incrementMessageCount());
    }
  };

  const remainingMessages =
    !isPro && messageCount >= 10 ? 0 : !isPro ? 10 - messageCount : null;

  const hasReachedLimit = !isPro && messageCount >= 10;

  return {
    isPro,
    plan,
    messageCount,
    remainingMessages,
    hasReachedLimit,
    upgradeToPro,
    downgradeToFree,
    trackMessage,
  };
};
