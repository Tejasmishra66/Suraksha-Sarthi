import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getOfflineQueue, flushOfflineQueue } from '../utils/offlineQueue';

export default function OfflineQueueBanner() {
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing]       = useState(false);

  useEffect(() => {
    checkQueue();
    const interval = setInterval(checkQueue, 4000); // Poll queue count every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const checkQueue = async () => {
    const q = await getOfflineQueue();
    setQueueCount(q.length);
  };

  const handleSyncNow = async () => {
    if (queueCount === 0) return;
    setSyncing(true);
    try {
      const res = await flushOfflineQueue();
      Alert.alert(
        '✅ Network Sync Complete!',
        `Successfully dispatched ${res.syncedCount} offline emergency SITREP(s) to SDRF Control Room over network connection.`
      );
      await checkQueue();
    } catch (err: any) {
      Alert.alert(
        '📡 2G Signal / Offline Alert',
        'Unable to reach server yet. Your emergency SITREPs are safe in device queue and will retry automatically.'
      );
    } finally {
      setSyncing(false);
    }
  };

  if (queueCount === 0) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.bannerLeft}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="cloud-off-outline" size={20} color="#B45309" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.bannerTitle}>OFFLINE QUEUE ACTIVE</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{queueCount} QUEUED</Text>
            </View>
          </View>
          <Text style={styles.bannerSub}>
            Emergency SITREPs saved locally. Auto-syncs on 2G / 3G signal.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.syncBtn, syncing && { opacity: 0.7 }]}
        onPress={handleSyncNow}
        disabled={syncing}
        activeOpacity={0.8}
      >
        {syncing ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <MaterialCommunityIcons name="sync" size={16} color="white" />
        )}
        <Text style={styles.syncBtnText}>{syncing ? 'SYNCING…' : 'SYNC NOW'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  bannerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10, marginRight: 8 },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FCD34D',
    justifyContent: 'center', alignItems: 'center',
  },
  bannerTitle: { fontSize: 11, fontWeight: '900', color: '#92400E', letterSpacing: 0.5 },
  bannerSub: { fontSize: 10, color: '#B45309', marginTop: 2, lineHeight: 14 },
  countBadge: { backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 1.5, borderRadius: 6 },
  countBadgeText: { color: 'white', fontSize: 9, fontWeight: '900' },
  syncBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#D97706', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
  },
  syncBtnText: { color: 'white', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
});
