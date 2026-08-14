import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Alert, TouchableOpacity, StatusBar, Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Text, Button, ActivityIndicator, Portal, Dialog, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '../api';

const NAVY = '#0F2942';
const BLUE = '#1D4ED8';
const GREEN = '#059669';
const RED = '#DC2626';
const ORANGE = '#FF6600';

export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [scannedEq, setScannedEq] = useState<any>(null);
  const theme = useTheme();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    try {
      let parsed: any = null;
      if (data.startsWith('{')) {
        parsed = JSON.parse(data);
      } else {
        // Simple QR format like EQ-1234 or plain ID
        parsed = { type: 'EQUIPMENT', id: data, qr_code: data, name: `Equipment ${data}` };
      }

      if (parsed && (parsed.type === 'EQUIPMENT' || parsed.id || parsed.qr_code)) {
        setScannedEq(parsed);
        setShowDialog(true);
      } else {
        Alert.alert(
          'Unrecognized QR Code',
          `Scanned Data: "${data}"\n\nThis QR code is not formatted as SDRF equipment.`,
          [{ text: 'Scan Again', onPress: () => setScanned(false) }]
        );
      }
    } catch (e) {
      Alert.alert('Scan Failed', `Scanned Data: "${data}"`, [
        { text: 'Scan Again', onPress: () => setScanned(false) },
      ]);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!scannedEq) return;
    setLoading(true);
    try {
      const targetId = scannedEq.id || scannedEq.qr_code;
      await api.patch(`/equipment/${targetId}/status`, { status: newStatus });
      Alert.alert(
        '✅ Status Updated',
        `Equipment ${scannedEq.name || `#${targetId}`} marked as ${newStatus.toUpperCase().replace('_', ' ')}`
      );
      setShowDialog(false);
      setScanned(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to update equipment status');
      setShowDialog(false);
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BLUE} />
        <Text style={{ marginTop: 12, color: '#64748B' }}>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="camera-off" size={48} color="#94A3B8" style={{ marginBottom: 14 }} />
        <Text style={{ fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 6 }}>Camera Access Required</Text>
        <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginHorizontal: 30, marginBottom: 20 }}>
          Suraksha Sarthi needs camera access to scan equipment QR tags and update asset logs.
        </Text>
        <Button mode="contained" buttonColor={BLUE} onPress={requestPermission}>
          Grant Camera Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ── Top Header Overlay ─────────────────────────────────── */}
      <View style={styles.topOverlay}>
        <TouchableOpacity
          style={styles.catalogBtn}
          onPress={() => navigation.navigate('Resources')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="tools" size={18} color="white" />
          <Text style={styles.catalogBtnText}>View Equipment List</Text>
        </TouchableOpacity>
      </View>

      {/* ── Scanner Frame Target ───────────────────────────────── */}
      <View style={styles.overlay}>
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.scanText}>Point camera at Equipment QR Tag</Text>
      </View>

      {/* ── Bottom Floating Actions ─────────────────────────────── */}
      <View style={styles.bottomOverlay}>
        {scanned && !showDialog && (
          <Button mode="contained" buttonColor={BLUE} onPress={() => setScanned(false)} style={styles.rescanBtn}>
            Tap to Scan Again
          </Button>
        )}

        <TouchableOpacity
          style={styles.addEquipmentFloatingBtn}
          onPress={() => navigation.navigate('Resources')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus-circle" size={20} color="white" />
          <Text style={styles.addFloatingBtnText}>Add / Manage Equipment</Text>
        </TouchableOpacity>
      </View>

      {/* ── Dialog on QR Scan ──────────────────────────────────── */}
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => { setShowDialog(false); setScanned(false); }} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Equipment Asset Scanned</Dialog.Title>
          <Dialog.Content>
            {loading ? (
              <ActivityIndicator size="large" color={BLUE} />
            ) : (
              <View>
                <Text style={styles.scannedName}>
                  {scannedEq?.name || `Equipment #${scannedEq?.id || scannedEq?.qr_code}`}
                </Text>
                <Text style={styles.scannedTag}>Tag: {scannedEq?.qr_code || scannedEq?.id}</Text>

                <Text style={styles.statusPrompt}>Select action to log asset tracking status:</Text>
              </View>
            )}
          </Dialog.Content>

          <Dialog.Actions style={{ flexDirection: 'column', gap: 8 }}>
            <Button
              mode="contained"
              buttonColor={GREEN}
              style={{ width: '100%', borderRadius: 8 }}
              onPress={() => updateStatus('available')}
              disabled={loading}
            >
              🟢 Mark as AVAILABLE (Base Camp)
            </Button>
            <Button
              mode="contained"
              buttonColor={BLUE}
              style={{ width: '100%', borderRadius: 8 }}
              onPress={() => updateStatus('deployed')}
              disabled={loading}
            >
              🔵 Mark as DEPLOYED (Field Operation)
            </Button>
            <Button
              mode="contained"
              buttonColor={ORANGE}
              style={{ width: '100%', borderRadius: 8 }}
              onPress={() => updateStatus('in_transit')}
              disabled={loading}
            >
              🟠 Mark as IN TRANSIT (Departure)
            </Button>
            <Button
              mode="contained"
              buttonColor="#7C3AED"
              style={{ width: '100%', borderRadius: 8 }}
              onPress={() => updateStatus('in_maintenance')}
              disabled={loading}
            >
              🔧 Mark as UNDER MAINTENANCE (Repair)
            </Button>
            <Button onPress={() => { setShowDialog(false); setScanned(false); }} disabled={loading}>
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6FB', padding: 20 },

  topOverlay: {
    position: 'absolute', top: Platform.OS === 'android' ? 44 : 54, left: 20, right: 20,
    zIndex: 10, alignItems: 'center',
  },
  catalogBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(15,23,42,0.85)', paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  catalogBtnText: { color: 'white', fontWeight: '800', fontSize: 13 },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  scanBox: {
    width: 240, height: 240,
    position: 'relative',
  },
  corner: {
    position: 'absolute', width: 30, height: 30, borderColor: '#4ADE80',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },

  scanText: {
    color: 'white', marginTop: 24, fontSize: 14, fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12,
  },

  bottomOverlay: {
    position: 'absolute', bottom: 30, left: 20, right: 20,
    zIndex: 10, alignItems: 'center', gap: 12,
  },
  rescanBtn: { borderRadius: 12 },
  addEquipmentFloatingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: ORANGE, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 24, elevation: 4,
  },
  addFloatingBtnText: { color: 'white', fontWeight: '900', fontSize: 13 },

  dialog: { backgroundColor: 'white', borderRadius: 16 },
  dialogTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  scannedName: { fontSize: 18, fontWeight: '900', color: NAVY, marginBottom: 2 },
  scannedTag: { fontSize: 12, color: BLUE, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 12 },
  statusPrompt: { fontSize: 12, color: '#64748B', marginBottom: 10 },
});
