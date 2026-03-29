import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useConnectionStatus } from '../hooks/useConnectionStatus';

interface ConnectionStatusBannerProps {
  showDetails?: boolean;
}

export const ConnectionStatusBanner: React.FC<ConnectionStatusBannerProps> = ({
  showDetails = false,
}) => {
  const { status, isConnected, summary, latency } = useConnectionStatus(true);
  const [expanded, setExpanded] = React.useState(false);

  if (!status) {
    return (
      <View style={[styles.banner, styles.checking]}>
        <Text style={styles.text}>🔄 Checking connection...</Text>
      </View>
    );
  }

  if (isConnected) {
    return (
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        style={[styles.banner, styles.connected]}
      >
        <View style={styles.row}>
          <Text style={styles.text}>✓ Connected ({latency}ms)</Text>
          <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
        </View>

        {expanded && showDetails && (
          <View style={styles.details}>
            <DetailRow
              label="Frontend"
              status={status.frontendOk}
            />
            <DetailRow
              label="Backend"
              status={status.backendOk}
            />
            <DetailRow
              label="Chat Ready"
              status={status.chatReady}
            />
            <DetailRow
              label="Gemini"
              status={status.geminiConfigured}
            />
            <DetailRow
              label="Supabase"
              status={status.supabaseConnected}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      style={[styles.banner, styles.disconnected]}
    >
      <View style={styles.row}>
        <Text style={styles.errorText}>✗ Connection Failed</Text>
        <Text style={styles.chevron}>{expanded ? '▼' : '▶'}</Text>
      </View>

      {expanded && (
        <View style={styles.details}>
          <DetailRow
            label="Frontend"
            status={status.frontendOk}
          />
          <DetailRow
            label="Backend"
            status={status.backendOk}
          />
          <DetailRow
            label="Chat Ready"
            status={status.chatReady}
          />
          {status.errors.length > 0 && (
            <View style={styles.errorSection}>
              <Text style={styles.errorLabel}>Errors:</Text>
              {status.errors.map((error, idx) => (
                <Text
                  key={idx}
                  style={styles.errorDetail}
                >
                  • {error}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

interface DetailRowProps {
  label: string;
  status: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, status }) => (
  <Text
    style={[
      styles.detailText,
      status ? styles.detailOk : styles.detailError,
    ]}
  >
    {status ? '✓' : '✗'} {label}
  </Text>
);

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  checking: {
    backgroundColor: '#FFF9E6',
    borderBottomColor: '#FFE082',
  },
  connected: {
    backgroundColor: '#E8F5E9',
    borderBottomColor: '#C8E6C9',
  },
  disconnected: {
    backgroundColor: '#FFEBEE',
    borderBottomColor: '#FFCDD2',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C62828',
  },
  chevron: {
    fontSize: 10,
    color: '#999',
  },
  details: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  detailText: {
    fontSize: 11,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
  detailOk: {
    color: '#2E7D32',
  },
  detailError: {
    color: '#C62828',
  },
  errorSection: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  errorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C62828',
    marginBottom: 2,
  },
  errorDetail: {
    fontSize: 10,
    color: '#C62828',
    marginVertical: 1,
  },
});

export default ConnectionStatusBanner;
