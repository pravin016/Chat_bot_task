import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from '../../utils/responsive';
import * as Updates from 'expo-updates';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorStr: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorStr: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorStr: error.toString() };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = async () => {
    try {
      if (!__DEV__) {
        await Updates.reloadAsync();
      } else {
        this.setState({ hasError: false, errorStr: '' });
      }
    } catch (e) {
      console.log('Cannot reload', e);
      this.setState({ hasError: false, errorStr: '' });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="warning-outline" size={60} color="#DC2626" style={{ marginBottom: 20 }} />
          <Text style={styles.title}>Oops! Something went wrong.</Text>
          <Text style={styles.subtitle}>
            We encountered an unexpected error. Our team has been notified.
          </Text>
          {__DEV__ && (
            <Text style={styles.devErrorText} numberOfLines={4}>
              {this.state.errorStr}
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleReload}>
            <Text style={styles.buttonText}>Restart App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FCFAF4',
  },
  title: {
    fontSize: RFValue(22),
    color: '#1E1F21',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: RFValue(15),
    color: '#687076',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: RFValue(22),
  },
  devErrorText: {
    fontSize: RFValue(12),
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#4CB77B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: RFValue(16),
  },
});
