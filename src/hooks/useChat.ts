import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setLoading } from '../store/chatSlice';
import { chatService } from '../services/chat-optimized';
import { useEffect } from 'react';

export const useChat = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state: any) => state.chat);

  // Initialize chat service on mount
  useEffect(() => {
    chatService.initialize();

    return () => {
      chatService.disconnect();
    };
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    console.log('[useChat] Sending:', text.substring(0, 50));

    // Add user message immediately
    dispatch(addMessage({ role: 'user', text }));
    dispatch(setLoading(true));

    try {
      // Send via optimized service (WebSocket + cache)
      const reply = await chatService.sendMessage(text, (chunk) => {
        // Stream chunks if available
        console.log('[useChat] Streaming chunk...');
      });

      if (reply) {
        dispatch(addMessage({ role: 'bot', text: reply }));
      } else {
        dispatch(
          addMessage({
            role: 'bot',
            text: 'Sorry, I could not generate a response. Please try again.',
          })
        );
      }
    } catch (error) {
      console.error('[useChat] Error:', error);
      dispatch(
        addMessage({
          role: 'bot',
          text: 'Something went wrong. Please check your connection and try again.',
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { messages, loading, handleSend };
};