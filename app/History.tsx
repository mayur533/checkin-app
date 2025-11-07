import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList, ScanHistoryItem } from '../types';
import { getScanHistory, clearScanHistory } from '../services/history';
import { Alert } from 'react-native';

export default function History() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const scanHistory = await getScanHistory();
      setHistory(scanHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearScanHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <MaterialIcons name="delete-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No scan history yet</Text>
            <Text style={styles.emptySubText}>
              Your scanned QR codes will appear here
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{history.length}</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statSuccess]}>
                  {history.filter((h) => h.success).length}
                </Text>
                <Text style={styles.statLabel}>Successful</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statFailed]}>
                  {history.filter((h) => !h.success).length}
                </Text>
                <Text style={styles.statLabel}>Failed</Text>
              </View>
            </View>

            {history.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.historyItem,
                  item.success ? styles.historyItemSuccess : styles.historyItemFailed,
                ]}
              >
                <View style={styles.historyItemHeader}>
                  <View style={styles.historyItemIcon}>
                    <MaterialIcons
                      name={item.success ? 'check-circle' : 'error'}
                      size={24}
                      color={item.success ? '#10b981' : '#ef4444'}
                    />
                  </View>
                  <View style={styles.historyItemContent}>
                    <Text
                      style={[
                        styles.historyItemStatus,
                        item.success
                          ? styles.historyItemStatusSuccess
                          : styles.historyItemStatusFailed,
                      ]}
                    >
                      {item.success ? 'Success' : 'Failed'}
                    </Text>
                    <Text style={styles.historyItemTime}>
                      {formatDate(item.timestamp)}
                    </Text>
                  </View>
                </View>

                <View style={styles.historyItemDetails}>
                  <Text style={styles.historyItemMessage}>{item.message}</Text>
                  {item.attendedAt && (
                    <Text style={styles.historyItemAttended}>
                      Attended: {formatDate(item.attendedAt)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#111827',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statSuccess: {
    color: '#10b981',
  },
  statFailed: {
    color: '#ef4444',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  historyItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  historyItemSuccess: {
    borderLeftColor: '#10b981',
  },
  historyItemFailed: {
    borderLeftColor: '#ef4444',
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyItemIcon: {
    marginRight: 12,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemStatus: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  historyItemStatusSuccess: {
    color: '#10b981',
  },
  historyItemStatusFailed: {
    color: '#ef4444',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  historyItemDetails: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  historyItemMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  historyItemAttended: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 4,
  },
});

