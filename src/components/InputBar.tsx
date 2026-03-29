import { Audio } from 'expo-av';
import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { ActivityIndicator, Animated, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ENV } from '../config/env';

const InputBar = forwardRef(({ onSend, onRecordingStateChange }, ref) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const insets = useSafeAreaInsets();
  const permissionRef = useRef(false);

  // Expose stopRecording to parent via ref
  useImperativeHandle(ref, () => ({
    startRecording,
    stopRecording,
    isRecording,
  }));

  // Notify parent when recording state changes
  useEffect(() => {
    onRecordingStateChange?.(isRecording);
  }, [isRecording, onRecordingStateChange]);
  
  // Animation refs for waveform
  const animValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Animate waveform while recording
  useEffect(() => {
    if (isRecording) {
      const animations = animValues.map(anim =>
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );

      const loopAnimations = Animated.stagger(100, animations.map(anim =>
        Animated.loop(anim)
      ));

      loopAnimations.start();

      // Update recording time
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      return () => {
        loopAnimations.stop();
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      };
    }
  }, [isRecording, animValues]);

  const requestMicPermission = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      permissionRef.current = permission.granted;
      return permission.granted;
    } catch (error) {
      console.error('[MIC] Permission error:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      console.log('[MIC] Starting recording...');
      setRecordingTime(0);
      
      // Check permission
      if (!permissionRef.current) {
        const hasPermission = await requestMicPermission();
        if (!hasPermission) {
          console.error('[MIC] Permission denied');
          alert('Microphone permission is required');
          return;
        }
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false,
      });

      const recording = new Audio.Recording();
      const settings = Audio.RecordingOptionsPresets.HIGH_QUALITY;

      await recording.prepareToRecordAsync(settings);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      console.log('[MIC] Recording started successfully');
    } catch (error) {
      console.error('[MIC] Error starting recording:', error);
      alert('Failed to start recording: ' + String(error));
    }
  };

  const stopRecording = async () => {
    try {
      console.log('[MIC] Stopping recording...');
      if (!recordingRef?.current) {
        console.log('[MIC] No recording to stop');
        setIsRecording(false);
        return;
      }

      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (stopError) {
        console.warn('[MIC] Error during stopAndUnload:', stopError);
      }
      
      const uri = recordingRef.current?.getURI?.();
      console.log('[MIC] Recording stopped. URI:', uri);
      console.log('[MIC] Recording duration:', recordingTime, 'seconds');
      recordingRef.current = null;
      setIsRecording(false);
      setRecordingTime(0);

      if (uri && recordingTime > 0) {
        console.log('[MIC] Starting transcription...');
        await transcribeAudio(uri);
      } else {
        console.warn('[MIC] Recording too short or no URI');
      }
    } catch (error) {
      console.error('[MIC] Error stopping recording:', error);
      setIsRecording(false);
      // Don't show alert on ref errors, silently continue
      if (!String(error).includes('Cannot read property')) {
        alert('Failed to stop recording: ' + String(error));
      }
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      console.log('[TRANSCRIBE] Starting transcription for:', uri);
      setIsTranscribing(true);

      const formData = new FormData();
      
      // Create file object for upload - handle URI format
      let fileUri = uri;
      if (Platform.OS === 'ios' && uri.startsWith('file://')) {
        fileUri = uri;
      } else if (Platform.OS === 'android') {
        fileUri = uri.startsWith('file://') ? uri : `file://${uri}`;
      }

      const file = {
        uri: fileUri,
        type: 'audio/m4a',
        name: `audio-${Date.now()}.m4a`,
      };

      console.log('[TRANSCRIBE] File object:', file);
      formData.append('file', file as any);

      const apiUrl = `${ENV.apiBaseUrl}/transcribe`;
      console.log('[TRANSCRIBE] Sending to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
      });

      console.log('[TRANSCRIBE] Response status:', response.status);
      const data = await response.json();
      console.log('[TRANSCRIBE] Response data:', data);
      
      if (data.text && !data.text.toLowerCase().includes('error')) {
        console.log('[TRANSCRIBE] Success! Text:', data.text);
        setText(data.text);
      } else {
        console.error('[TRANSCRIBE] Transcription failed:', data);
        alert('Transcription error: ' + (data.text || 'Unknown error'));
      }
    } catch (error) {
      console.error('[TRANSCRIBE] Error:', error);
      alert('Failed to transcribe: ' + String(error));
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicPressIn = () => {
    startRecording();
  };

  const handleMicPressOut = () => {
    stopRecording();
  };

  // Waveform bar component
  const WaveformBar = ({ index }: { index: number }) => {
    const height = animValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [2, 20],
    });

    return (
      <Animated.View
        style={{
          height,
          width: 3,
          backgroundColor: '#FF6B6B',
          borderRadius: 2,
        }}
      />
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        paddingBottom: insets.bottom || 10,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
      }}
    >
      {/* Recording indicator */}
      {isRecording && (
        <View
          style={{
            marginBottom: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: '#FFE6E6',
            borderRadius: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Animated waveform */}
            <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
              {[0, 1, 2, 3, 4].map(i => (
                <WaveformBar key={i} index={i} />
              ))}
            </View>
            <Text style={{ color: '#FF6B6B', fontWeight: 'bold', fontSize: 12 }}>
              {recordingTime}s
            </Text>
          </View>
          <Text style={{ color: '#FF6B6B', fontSize: 11 }}>
            🎤 Listening...
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={isRecording ? 'Listening...' : 'Ask anything or hold 🎤'}
          placeholderTextColor={isRecording ? '#FF6B6B' : '#999'}
          editable={!isRecording && !isTranscribing}
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: isRecording ? '#FF6B6B' : isTranscribing ? '#FFC107' : '#ddd',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 14,
            minHeight: 44,
          }}
        />

        <TouchableOpacity
          onPressIn={handleMicPressIn}
          onPressOut={handleMicPressOut}
          disabled={isTranscribing || (!isRecording && text.length > 0)}
          activeOpacity={0.7}
          style={{
            backgroundColor: isRecording ? '#FF6B6B' : isTranscribing ? '#FFC107' : '#2196F3',
            borderRadius: 22,
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: (isTranscribing || (!isRecording && text.length > 0)) ? 0.5 : 1,
          }}
        >
          {isTranscribing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 18 }}>
              {isRecording ? '🔴' : '🎤'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!text) return;
            onSend(text);
            setText('');
          }}
          disabled={!text || isRecording || isTranscribing}
          style={{
            backgroundColor: text && !isRecording && !isTranscribing ? '#4CAF50' : '#ccc',
            borderRadius: 22,
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

InputBar.displayName = 'InputBar';

export default InputBar;