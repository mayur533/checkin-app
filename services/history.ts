import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = '@scan_history';

/**
 * Save a scan result to history
 */
export const saveScanHistory = async (item: Omit<ScanHistoryItem, 'id' | 'timestamp'>): Promise<void> => {
  try {
    const history = await getScanHistory();
    const newItem: ScanHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    // Add to beginning of array (most recent first)
    const updatedHistory = [newItem, ...history];
    
    // Keep only last 100 scans
    const limitedHistory = updatedHistory.slice(0, 100);
    
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving scan history:', error);
  }
};

/**
 * Get all scan history
 */
export const getScanHistory = async (): Promise<ScanHistoryItem[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting scan history:', error);
    return [];
  }
};

/**
 * Clear all scan history
 */
export const clearScanHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing scan history:', error);
  }
};


