import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Text, Button, ActivityIndicator, Portal, Dialog, useTheme } from 'react-native-paper';
import { api } from '../api';

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

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'EQUIPMENT' && parsed.id) {
        setScannedEq(parsed);
        setShowDialog(true);
      } else {
        Alert.alert('Invalid QR Code', 'This QR code is not recognized as SDRF equipment.', [
          { text: 'OK', onPress: () => setScanned(false) }
        ]);
      }
    } catch (e) {
      Alert.alert('Scan Failed', 'Unrecognized QR Format.', [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      await api.patch(`/equipment/${scannedEq.id}/status`, { status: newStatus });
      Alert.alert('Success', `Equipment marked as ${newStatus}`);
      setShowDialog(false);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update equipment status');
      setShowDialog(false);
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20 }}>No access to camera</Text>
        <Button mode="contained" onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.scanText}>Point camera at the Equipment QR Code</Text>
      </View>

      {scanned && !showDialog && (
        <Button mode="contained" onPress={() => setScanned(false)} style={styles.rescanBtn}>
          Tap to Scan Again
        </Button>
      )}

      <Portal>
        <Dialog visible={showDialog} onDismiss={() => { setShowDialog(false); setScanned(false); }}>
          <Dialog.Title>Update Tracking Status</Dialog.Title>
          <Dialog.Content>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Text>Update the tracking status for Equipment ID #{scannedEq?.id}?</Text>
            )}
          </Dialog.Content>
          <Dialog.Actions style={{ flexDirection: 'column', gap: 10 }}>
            <Button 
              mode="contained" 
              buttonColor={theme.colors.error} 
              style={{ width: '100%' }}
              onPress={() => updateStatus('in_transit')}
              disabled={loading}
            >
              Mark as IN TRANSIT (Departure)
            </Button>
            <Button 
              mode="contained" 
              buttonColor="#4caf50" 
              style={{ width: '100%' }}
              onPress={() => updateStatus('deployed')}
              disabled={loading}
            >
              Mark as DEPLOYED (Arrival)
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
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4caf50',
    backgroundColor: 'transparent'
  },
  scanText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rescanBtn: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  }
});
