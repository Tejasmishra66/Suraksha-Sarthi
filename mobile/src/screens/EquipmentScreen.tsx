import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, useTheme, Chip, FAB, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import QRCode from 'react-native-qrcode-svg';
import { api } from '../api';

export default function EquipmentScreen({ navigation }: any) {
  const theme = useTheme();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  
  // Add Equipment State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // QR View State
  const [createdEq, setCreatedEq] = useState<any>(null);

  const fetchResources = async () => {
    try {
      const response = await api.get('/equipment');
      setResources(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResources();
  };

  const handleAddEquipment = async () => {
    if (!name || !category) return;
    setSubmitting(true);
    try {
      const res = await api.post('/equipment', { name, category, department, quantity: 1, status: 'available' });
      setCreatedEq({ id: res.data.id, name });
      fetchResources();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'available') return '#4caf50';
    if (status === 'in_use' || status === 'deployed') return theme.colors.primary;
    if (status === 'in_transit') return '#ff9800';
    return '#757575';
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No equipment found.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated" elevation={1}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Title style={{ fontSize: 18 }}>{item.name}</Title>
                  <Chip textStyle={{ color: 'white' }} style={{ backgroundColor: getStatusColor(item.status) }}>
                    {item.status?.toUpperCase().replace('_', ' ') || 'UNKNOWN'}
                  </Chip>
                </View>
                <Paragraph style={styles.desc}>Category: {item.category}</Paragraph>
                <Paragraph style={styles.desc}>Department: {item.department || 'N/A'}</Paragraph>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <FAB.Group
        open={fabOpen}
        visible
        icon={fabOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'qrcode-scan',
            label: 'Scan QR (Track)',
            onPress: () => navigation.navigate('Scanner'),
          },
          {
            icon: 'truck-plus',
            label: 'Add Equipment',
            onPress: () => setShowAddModal(true),
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        onPress={() => {
          if (fabOpen) {
            // do something if the speed dial is open
          }
        }}
      />

      <Portal>
        {/* ADD EQUIPMENT MODAL */}
        <Dialog visible={showAddModal && !createdEq} onDismiss={() => setShowAddModal(false)}>
          <Dialog.Title>Add New Equipment</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Equipment Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
            <TextInput label="Category (e.g. Vehicle, Medical)" value={category} onChangeText={setCategory} mode="outlined" style={styles.input} />
            <TextInput label="Department (Optional)" value={department} onChangeText={setDepartment} mode="outlined" style={styles.input} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddModal(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleAddEquipment} loading={submitting} disabled={submitting || !name || !category}>
              Create & Generate QR
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* QR GENERATED MODAL */}
        <Dialog visible={!!createdEq} onDismiss={() => { setCreatedEq(null); setShowAddModal(false); }}>
          <Dialog.Title>QR Code Generated!</Dialog.Title>
          <Dialog.Content style={{ alignItems: 'center' }}>
            <Text style={{ marginBottom: 20, textAlign: 'center' }}>
              Print and attach this QR code to: {createdEq?.name}
            </Text>
            {createdEq && (
              <View style={styles.qrWrapper}>
                <QRCode
                  value={JSON.stringify({ type: 'EQUIPMENT', id: createdEq.id })}
                  size={200}
                />
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => { setCreatedEq(null); setShowAddModal(false); }}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  listContent: { padding: 15, paddingBottom: 100 },
  card: { marginBottom: 12, backgroundColor: 'white' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  desc: { color: '#555', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
  input: { marginBottom: 10 },
  qrWrapper: { padding: 20, backgroundColor: 'white', elevation: 4, borderRadius: 10 }
});
