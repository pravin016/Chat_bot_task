import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import ChatBubble from '../components/ChatBubble';
import InputBar from '../components/InputBar';
import { InteractiveSuggestionCard } from '../components/InteractiveSuggestionCard';
import Loader from '../components/Loader';
import PaywallModal from '../components/PaywallModal';
import { useAppTheme } from '../hooks/useAppTheme';
import { useChat } from '../hooks/useChat';
import { useRevenueCatInit } from '../hooks/useRevenueCatInit';
import { useSubscription } from '../hooks/useSubscription';

const SUGGESTION_POOL = [
  'How does photosynthesis work?',
  'Explain quantum computing',
  'What is machine learning?',
  'Tell me about artificial intelligence',
  'How does DNA work?',
  'What is blockchain technology?',
  'How do black holes form?',
  'Explain climate change',
  'What is cryptocurrency?',
  'How does the internet work?',
  'Tell me about renewable energy',
  'What is nanotechnology?',
  'How does the brain work?',
  'Explain protein folding',
  'What is the future of technology?',
  'How do vaccines work?',
  'Tell me about space exploration',
  'What is cybersecurity?',
  'How does photosynthesis convert light?',
  'Explain neuroplasticity'
];

const DAILY_MESSAGE_LIMIT_FREE = 10;

const getRandomSuggestions = (count: number = 3): string[] => {
  const shuffled = [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const ChatScreen = () => {
  const { messages, loading, handleSend } = useChat();
  const { isPro, trackMessage } = useSubscription();
  const { isInitializing } = useRevenueCatInit();
  const theme = useAppTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const inputBarRef = useRef<any>(null);

  // Load new suggestions when component mounts or when chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      setLoadingSuggestions(true);
      setTimeout(() => {
        setSuggestions(getRandomSuggestions(3));
        setLoadingSuggestions(false);
      }, 800);
    }
  }, [messages.length]);

  // Auto-start voice recording when screen loads
  useEffect(() => {
    const autoStartVoice = async () => {
      // Small delay to ensure component is ready
      setTimeout(() => {
        if (inputBarRef.current?.startRecording) {
          console.log('[ChatScreen] Auto-starting voice recording');
          inputBarRef.current.startRecording();
        }
      }, 500);
    };

    if (messages.length === 0) {
      autoStartVoice();
    }
  }, []);

  // Track message count for free users
  useEffect(() => {
    if (!isPro) {
      setMessageCount(messages.filter(m => m.role === 'user').length);
    }
  }, [messages, isPro]);

  const handleSuggestClick = (text: string) => {
    // Check limits for free users
    if (!isPro && messageCount >= DAILY_MESSAGE_LIMIT_FREE) {
      setShowPaywall(true);
      return;
    }
    trackMessage();
    handleSend(text);
    setShowSuggestions(false);
  };

  const handleSendMessage = (text: string) => {
    // Check limits for free users
    if (!isPro && messageCount >= DAILY_MESSAGE_LIMIT_FREE) {
      setShowPaywall(true);
      return;
    }
    trackMessage();
    handleSend(text);
  };

  const remainingMessages = !isPro ? Math.max(0, DAILY_MESSAGE_LIMIT_FREE - messageCount) : null;
  const showLimitWarning = !isPro && remainingMessages !== null && remainingMessages <= 2;

  const handlePlanSelect = (planId: string) => {
    if (planId !== 'free') {
      setShowPaywall(false);
    }
  };

  // Show loading while initializing RevenueCat
  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Loader />
        <Text style={{ marginTop: 12, color: theme.colors.icon }}>Initializing...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Voice Recording Header */}
      {isRecording && (
        <SafeAreaView style={{ backgroundColor: '#FF6B6B' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: '#FF6B6B',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
              🎤 Recording...
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log('[ChatScreen] Stop button pressed');
                if (inputBarRef.current?.stopRecording) {
                  inputBarRef.current.stopRecording();
                }
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>
                STOP
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={tabBarHeight}
      >
        {messages.length === 0 && showSuggestions && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <InteractiveSuggestionCard 
              suggestions={suggestions}
              onSelect={handleSuggestClick}
              isLoading={loadingSuggestions}
            />
          </View>
        )}

        {messages.length > 0 && (
          <FlatList
            data={messages}
            inverted
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <ChatBubble message={item} />
            )}
            ListFooterComponent={loading ? <Loader /> : null}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
          />
        )}

        {/* Message Limit Warning */}
        {showLimitWarning && (
          <View
            style={{
              marginHorizontal: 12,
              marginBottom: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#FFF3E0',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#FF9800',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#E65100', fontWeight: 'bold' }}>
                ⚠️ {remainingMessages} messages left today
              </Text>
              <Text style={{ fontSize: 11, color: '#F57C00', marginTop: 2 }}>
                Upgrade to Pro for unlimited access
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowPaywall(true)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: '#FF9800',
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                Upgrade
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <InputBar 
          ref={inputBarRef} 
          onSend={handleSendMessage}
          onRecordingStateChange={setIsRecording}
        />
      </KeyboardAvoidingView>

      {/* Paywall Modal - RevenueCat Integration */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSelectPlan={handlePlanSelect}
      />
    </>
  );
};

export default ChatScreen;