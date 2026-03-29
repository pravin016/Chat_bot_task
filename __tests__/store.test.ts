import appReducer, { setUserName, incrementChatCount, toggleSubscription } from '../src/store/slices/appSlice';

describe('App Redux Slice Tests', () => {
  const initialState = {
    userName: '',
    isSubscribed: false,
    freeChatCount: 0,
    userAvatar: null,
  };

  it('should return initial state', () => {
    expect(appReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUserName properly', () => {
    const nextState = appReducer(initialState, setUserName('John Doe'));
    expect(nextState.userName).toEqual('John Doe');
  });

  it('should increment chat counter accurately', () => {
    const nextState = appReducer(initialState, incrementChatCount());
    expect(nextState.freeChatCount).toEqual(1);
    
    const secondState = appReducer(nextState, incrementChatCount());
    expect(secondState.freeChatCount).toEqual(2);
  });

  it('should toggle premium subscription flag seamlessly', () => {
    const nextState = appReducer(initialState, toggleSubscription());
    expect(nextState.isSubscribed).toEqual(true);
  });
});
