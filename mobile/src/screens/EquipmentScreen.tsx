import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, StyleSheet, FlatList, RefreshControl, TouchableOpacity,
  ScrollView, StatusBar, Platform, Alert, Dimensions, Share,
} from 'react-native';
import {
  Text, Surface, ActivityIndicator, useTheme, Chip, Portal, Dialog,
  TextInput, Button, IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { api } from '../api';

const { width } = Dimensions.get('window');

const NAVY = '#0F2942';
const BLUE = '#1D4ED8';
const DARK_BLUE = '#0F172A';
const ORANGE = '#FF6600';
const GREEN = '#059669';
const RED = '#DC2626';
const PURPLE = '#7C3AED';

const HQS = [
  'All HQs',
  'Shimla HQ',
  'Mandi HQ',
  'Kangra HQ',
];

const CATEGORIES = [
  'All',
  'Rescue Gear',
  'Medical',
  'Vehicles',
  'Communication',
  'Power & Light',
];

const QUICK_MAINTENANCE_REASONS = [
  'Routine Annual Servicing & Overhaul',
  'Engine / Mechanical Motor Repair',
  'Hydraulic Seal / Cutter Blade Repair',
  'Battery & Electrical Charging Defect',
  'Calibrations & Safety Inspection',
];

export default function EquipmentScreen({ navigation }: any) {
  const theme = useTheme();
  const qrSvgRef = useRef<any>(null);

  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHq, setSelectedHq] = useState('All HQs');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Equipment Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Rescue Gear');
  const [department, setDepartment] = useState('SDRF Shimla HQ');
  const [quantity, setQuantity] = useState('1');
  const [place, setPlace] = useState('Shimla HQ');
  const [submitting, setSubmitting] = useState(false);

  // Dispatch / Transfer Modal state
  const [dispatchItem, setDispatchItem] = useState<any>(null);
  const [targetHq, setTargetHq] = useState('Mandi HQ');
  const [dispatching, setDispatching] = useState(false);

  // Receive Modal state
  const [receiveItem, setReceiveItem] = useState<any>(null);
  const [receiving, setReceiving] = useState(false);

  // Maintenance Modal state
  const [maintItem, setMaintItem] = useState<any>(null);
  const [maintReason, setMaintReason] = useState('Routine Annual Servicing & Overhaul');
  const [customReason, setCustomReason] = useState('');
  const [maintSubmitting, setMaintSubmitting] = useState(false);

  // QR Code Viewer Modal state
  const [selectedEqForQR, setSelectedEqForQR] = useState<any>(null);

  const fetchResources = useCallback(async () => {
    try {
      const response = await api.get('/equipment');
      const data = response.data?.data || response.data || [];
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch equipment', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResources();
  };

  const handleAddEquipment = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter equipment name');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/equipment', {
        name: name.trim(),
        category: category || 'Rescue Gear',
        department: department.trim() || `SDRF ${place}`,
        quantity: quantity ? parseInt(quantity) : 1,
        place: place.trim() || 'Shimla HQ',
        status: 'available',
      });

      const newEq = res.data?.equipment || {
        id: res.data?.id,
        qr_code: res.data?.qr_code,
        name,
        category,
        department,
        quantity,
        place,
        status: 'available',
      };

      setName('');
      setShowAddModal(false);

      setSelectedEqForQR(newEq);
      fetchResources();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed to add equipment');
    } finally {
      setSubmitting(false);
    }
  };

  // Dispatch Inter-HQ Transfer
  const handleDispatch = async () => {
    if (!dispatchItem || !targetHq) return;
    setDispatching(true);
    try {
      const fromHq = dispatchItem.place || 'Shimla HQ';
      await api.post('/equipment/dispatch', {
        equipment_id: dispatchItem.id || dispatchItem.qr_code,
        sender_hq: fromHq,
        receiver_hq: targetHq,
      });

      Alert.alert(
        '🚚 Dispatched Successfully!',
        `Equipment "${dispatchItem.name}" is now IN TRANSIT from ${fromHq} to ${targetHq}.`
      );
      setDispatchItem(null);
      fetchResources();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to dispatch equipment');
    } finally {
      setDispatching(false);
    }
  };

  // Receive Equipment at Destination HQ
  const handleReceive = async () => {
    if (!receiveItem) return;
    setReceiving(true);
    try {
      const destHq = targetHq || 'Mandi HQ';
      await api.post('/equipment/receive', {
        equipment_id: receiveItem.id || receiveItem.qr_code,
        receiver_hq: destHq,
      });

      Alert.alert(
        '📥 Equipment Received!',
        `Equipment "${receiveItem.name}" has arrived and is now AVAILABLE at ${destHq}.`
      );
      setReceiveItem(null);
      fetchResources();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to confirm equipment receipt');
    } finally {
      setReceiving(false);
    }
  };

  // Send for Maintenance
  const handleSendMaintenance = async () => {
    if (!maintItem) return;
    setMaintSubmitting(true);
    try {
      const finalReason = customReason.trim() || maintReason;
      await api.post('/equipment/maintenance', {
        equipment_id: maintItem.id || maintItem.qr_code,
        action: 'send',
        reason: finalReason,
      });

      Alert.alert(
        '🔧 Sent for Maintenance',
        `Equipment "${maintItem.name}" status updated to UNDER MAINTENANCE.\nReason: ${finalReason}`
      );
      setMaintItem(null);
      setCustomReason('');
      fetchResources();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to send equipment for maintenance');
    } finally {
      setMaintSubmitting(false);
    }
  };

  // Return from Maintenance
  const handleReturnMaintenance = async (item: any) => {
    Alert.alert(
      'Return from Maintenance',
      `Mark "${item.name}" as fully repaired & AVAILABLE at ${item.place || 'HQ Base'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return to Available',
          onPress: async () => {
            try {
              await api.post('/equipment/maintenance', {
                equipment_id: item.id || item.qr_code,
                action: 'return',
              });
              Alert.alert('✅ Equipment Ready!', `"${item.name}" is now Available for SDRF dispatch.`);
              fetchResources();
            } catch (err) {
              Alert.alert('Error', 'Failed to return equipment from maintenance');
            }
          },
        },
      ]
    );
  };

  // Download / Share QR Code
  const handleDownloadQR = () => {
    if (!selectedEqForQR) return;
    if (qrSvgRef.current) {
      qrSvgRef.current.toDataURL((dataURL: string) => {
        const shareMessage = `SDRF Equipment QR Tag:\nName: ${selectedEqForQR.name}\nTag ID: ${selectedEqForQR.qr_code || selectedEqForQR.id}\nHQ Location: ${selectedEqForQR.place || 'HP SDRF'}`;
        Share.share({
          message: shareMessage,
          url: `data:image/png;base64,${dataURL}`,
          title: `QR Code - ${selectedEqForQR.name}`,
        }).catch(() => {
          Alert.alert('QR Code Tag', shareMessage);
        });
      });
    } else {
      Alert.alert('QR Tag Info', `Equipment: ${selectedEqForQR.name}\nTag Code: ${selectedEqForQR.qr_code}`);
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'available') return { color: GREEN, bg: '#ECFDF5', border: '#A7F3D0', label: 'AVAILABLE' };
    if (s === 'deployed' || s === 'in_use') return { color: BLUE, bg: '#EFF6FF', border: '#BFDBFE', label: 'DEPLOYED' };
    if (s === 'in_transit') return { color: ORANGE, bg: '#FFFBEB', border: '#FDE68A', label: 'IN TRANSIT' };
    if (s === 'in_maintenance' || s === 'maintenance') return { color: PURPLE, bg: '#F5F3FF', border: '#DDD6FE', label: 'UNDER MAINTENANCE' };
    return { color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1', label: (status || 'UNKNOWN').toUpperCase() };
  };

  // Filtered equipment by HQ & Category
  const filteredResources = resources.filter(r => {
    const matchHq = selectedHq === 'All HQs' || (r.place || '').toLowerCase().includes(selectedHq.toLowerCase().replace(' hq', ''));
    const matchCat = selectedCategory === 'All' || (r.category || '').toLowerCase() === selectedCategory.toLowerCase();
    return matchHq && matchCat;
  });

  // Stats counts
  const totalCount = resources.length;
  const availableCount = resources.filter(r => (r.status || '').toLowerCase() === 'available').length;
  const inTransitCount = resources.filter(r => (r.status || '').toLowerCase() === 'in_transit').length;
  const maintenanceCount = resources.filter(r => ['in_maintenance', 'maintenance'].includes((r.status || '').toLowerCase())).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_BLUE} />

      {/* ── Top Header ────────────────────────────────────────── */}
      <LinearGradient colors={[DARK_BLUE, NAVY]} style={styles.header}>
        <View style={styles.govBanner}>
          <MaterialCommunityIcons name="shield-star" size={16} color={ORANGE} />
          <Text style={styles.govBannerText}>HIMACHAL PRADESH SDRF · 3 HQ DISPATCH NETWORK</Text>
          <MaterialCommunityIcons name="shield-star" size={16} color={ORANGE} />
        </View>

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Equipment Catalog</Text>
            <Text style={styles.headerSub}>Shimla HQ · Mandi HQ · Kangra HQ</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerBtnScan}
              onPress={() => navigation.navigate('Scanner')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={16} color="white" />
              <Text style={styles.headerBtnText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerBtnAdd}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus" size={16} color="white" />
              <Text style={styles.headerBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: 'white' }]}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Assets</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: '#4ADE80' }]}>{availableCount}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: '#FBBF24' }]}>{inTransitCount}</Text>
            <Text style={styles.statLabel}>In Transit</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statPill}>
            <Text style={[styles.statValue, { color: '#C084FC' }]}>{maintenanceCount}</Text>
            <Text style={styles.statLabel}>Maintenance</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Headquarters Selector Bar ────────────────────────── */}
      <View style={styles.hqBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hqScroll}>
          {HQS.map(hq => (
            <TouchableOpacity
              key={hq}
              style={[styles.hqChip, selectedHq === hq && styles.hqChipActive]}
              onPress={() => setSelectedHq(hq)}
            >
              <MaterialCommunityIcons
                name={hq === 'All HQs' ? 'domain' : 'office-building'}
                size={14}
                color={selectedHq === hq ? 'white' : '#64748B'}
              />
              <Text style={[styles.hqChipText, selectedHq === hq && styles.hqChipTextActive]}>
                {hq}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Category Filter Bar ──────────────────────────────── */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Equipment List ───────────────────────────────────── */}
      {loading ? (
        <View style={styles.centerLoad}>
          <ActivityIndicator animating size="large" color={BLUE} />
          <Text style={styles.loadText}>Loading HQ Equipment Inventory…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredResources}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="tools" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Equipment Found</Text>
              <Text style={styles.emptySub}>
                No assets registered for {selectedHq} under {selectedCategory}.
              </Text>
              <Button mode="contained" buttonColor={BLUE} onPress={() => setShowAddModal(true)} style={{ marginTop: 16 }}>
                + Add Equipment to {selectedHq === 'All HQs' ? 'Shimla HQ' : selectedHq}
              </Button>
            </View>
          }
          renderItem={({ item }) => {
            const sc = getStatusColor(item.status);
            const isTransit = (item.status || '').toLowerCase() === 'in_transit';
            const isMaintenance = ['in_maintenance', 'maintenance'].includes((item.status || '').toLowerCase());

            return (
              <Surface style={styles.eqCard} elevation={1}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.eqTitle}>{item.name}</Text>
                      {item.qr_code && (
                        <View style={styles.qrTag}>
                          <MaterialCommunityIcons name="qrcode" size={12} color={BLUE} />
                          <Text style={styles.qrTagText}>{item.qr_code}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.categoryBadge}>{(item.category || 'General').toUpperCase()}</Text>
                      {item.quantity && <Text style={styles.qtyBadge}>Qty: {item.quantity}</Text>}
                    </View>
                  </View>

                  {/* Status chip */}
                  <View style={[styles.statusChip, { backgroundColor: sc.bg, borderColor: sc.border }]}>
                    <Text style={[styles.statusChipText, { color: sc.color }]}>{sc.label}</Text>
                  </View>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="domain" size={14} color={BLUE} />
                    <Text style={styles.detailText}>{item.department || 'SDRF Himachal'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons name="map-marker" size={14} color={isMaintenance ? PURPLE : isTransit ? ORANGE : GREEN} />
                    <Text style={[styles.detailText, (isTransit || isMaintenance) && { color: isMaintenance ? PURPLE : ORANGE, fontWeight: '800' }]}>
                      {item.place || 'HQ Base'}
                    </Text>
                  </View>
                </View>

                {/* Maintenance reason note if under maintenance */}
                {isMaintenance && item.maintenance_reason && (
                  <View style={styles.maintNoteBox}>
                    <MaterialCommunityIcons name="wrench-clock" size={14} color={PURPLE} />
                    <Text style={styles.maintNoteText} numberOfLines={1}>
                      Defect: {item.maintenance_reason}
                    </Text>
                  </View>
                )}

                {/* Card Action Buttons */}
                <View style={styles.cardActions}>
                  {/* View / Download QR Code button */}
                  <TouchableOpacity
                    style={styles.qrViewBtn}
                    onPress={() => setSelectedEqForQR(item)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="qrcode" size={16} color={BLUE} />
                    <Text style={styles.qrViewBtnText}>QR</Text>
                  </TouchableOpacity>

                  {/* Inter-HQ Dispatch or Receive Button */}
                  {isTransit ? (
                    <TouchableOpacity
                      style={styles.receiveBtn}
                      onPress={() => {
                        setReceiveItem(item);
                        setTargetHq(item.place?.includes('Mandi') ? 'Mandi HQ' : item.place?.includes('Kangra') ? 'Kangra HQ' : 'Shimla HQ');
                      }}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons name="package-down" size={16} color="white" />
                      <Text style={styles.receiveBtnText}>Receive</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.dispatchBtn}
                      onPress={() => {
                        setDispatchItem(item);
                        const current = item.place || 'Shimla HQ';
                        setTargetHq(current.includes('Shimla') ? 'Mandi HQ' : current.includes('Mandi') ? 'Kangra HQ' : 'Shimla HQ');
                      }}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons name="truck-fast" size={16} color="white" />
                      <Text style={styles.dispatchBtnText}>Transfer</Text>
                    </TouchableOpacity>
                  )}

                  {/* Maintenance Action Button */}
                  {isMaintenance ? (
                    <TouchableOpacity
                      style={styles.maintReturnBtn}
                      onPress={() => handleReturnMaintenance(item)}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons name="wrench-check" size={16} color="white" />
                      <Text style={styles.maintBtnText}>Return Ready</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.maintSendBtn}
                      onPress={() => {
                        setMaintItem(item);
                        setMaintReason('Routine Annual Servicing & Overhaul');
                        setCustomReason('');
                      }}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons name="wrench" size={16} color={PURPLE} />
                      <Text style={styles.maintSendBtnText}>Service</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Surface>
            );
          }}
        />
      )}

      {/* ── Dialog Modals ───────────────────────────────────── */}
      <Portal>
        {/* ADD EQUIPMENT MODAL */}
        <Dialog visible={showAddModal} onDismiss={() => setShowAddModal(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Add Equipment to Headquarters</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogNote}>Register new emergency equipment to generate its printable QR tag.</Text>

            <TextInput
              label="Equipment Name *"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="e.g. Inflatable Boat, Chainsaw, Satellite Phone"
            />

            <Text style={styles.fieldLabel}>Select Headquarters Base *</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
              {['Shimla HQ', 'Mandi HQ', 'Kangra HQ'].map(hq => (
                <TouchableOpacity
                  key={hq}
                  style={[styles.hqChip, place === hq && styles.hqChipActive, { flex: 1, justifyContent: 'center' }]}
                  onPress={() => { setPlace(hq); setDepartment(`SDRF ${hq}`); }}
                >
                  <Text style={[styles.hqChipText, place === hq && styles.hqChipTextActive, { textAlign: 'center' }]}>{hq}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {['Rescue Gear', 'Medical', 'Vehicles', 'Communication', 'Power & Light'].map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.catChip, category === c && styles.catChipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              label="Quantity"
              value={quantity}
              onChangeText={t => setQuantity(t.replace(/\D/g, ''))}
              keyboardType="number-pad"
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddModal(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={handleAddEquipment}
              loading={submitting}
              disabled={submitting || !name.trim()}
              buttonColor={BLUE}
            >
              Create & Generate QR
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* SEND TO MAINTENANCE MODAL */}
        <Dialog visible={!!maintItem} onDismiss={() => setMaintItem(null)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Send for Maintenance & Repair</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogNote}>
              Send <Text style={{ fontWeight: '800', color: NAVY }}>{maintItem?.name}</Text> ({maintItem?.qr_code}) for servicing or defect repair.
            </Text>

            <Text style={styles.fieldLabel}>Select Maintenance Defect / Reason:</Text>
            <View style={{ gap: 6, marginBottom: 12 }}>
              {QUICK_MAINTENANCE_REASONS.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.targetHqOption, maintReason === r && styles.targetHqOptionActive]}
                  onPress={() => { setMaintReason(r); setCustomReason(''); }}
                >
                  <MaterialCommunityIcons name="wrench" size={18} color={maintReason === r ? PURPLE : '#64748B'} />
                  <Text style={[styles.targetHqTitle, { fontSize: 12 }, maintReason === r && { color: PURPLE }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              label="Custom Defect Description (Optional)"
              value={customReason}
              onChangeText={setCustomReason}
              mode="outlined"
              style={styles.dialogInput}
              placeholder="e.g. Broken recoil starter, hydraulic leak"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setMaintItem(null)}>Cancel</Button>
            <Button
              mode="contained"
              buttonColor={PURPLE}
              onPress={handleSendMaintenance}
              loading={maintSubmitting}
              disabled={maintSubmitting}
            >
              🔧 Send to Maintenance
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* DISPATCH TO HQ MODAL */}
        <Dialog visible={!!dispatchItem} onDismiss={() => setDispatchItem(null)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Inter-HQ Dispatch</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogNote}>
              Transfer <Text style={{ fontWeight: '800', color: NAVY }}>{dispatchItem?.name}</Text> ({dispatchItem?.qr_code}) to another SDRF Battalion HQ.
            </Text>

            <Text style={styles.fieldLabel}>Current Headquarters Base:</Text>
            <Surface style={styles.hqBox} elevation={0}>
              <MaterialCommunityIcons name="domain" size={20} color={BLUE} />
              <Text style={{ fontWeight: '800', color: NAVY, fontSize: 14 }}>{dispatchItem?.place || 'Shimla HQ'}</Text>
            </Surface>

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Select Destination Headquarters:</Text>
            <View style={{ gap: 8 }}>
              {['Shimla HQ', 'Mandi HQ', 'Kangra HQ']
                .filter(hq => hq !== (dispatchItem?.place || 'Shimla HQ'))
                .map(hq => (
                  <TouchableOpacity
                    key={hq}
                    style={[styles.targetHqOption, targetHq === hq && styles.targetHqOptionActive]}
                    onPress={() => setTargetHq(hq)}
                  >
                    <MaterialCommunityIcons name="truck-fast" size={20} color={targetHq === hq ? BLUE : '#64748B'} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.targetHqTitle, targetHq === hq && { color: BLUE }]}>{hq}</Text>
                      <Text style={styles.targetHqSub}>
                        {hq === 'Shimla HQ' ? 'South Battalion HQ' : hq === 'Mandi HQ' ? 'Central Battalion HQ' : 'North Battalion HQ (Dharamshala)'}
                      </Text>
                    </View>
                    {targetHq === hq && <MaterialCommunityIcons name="check-circle" size={20} color={BLUE} />}
                  </TouchableOpacity>
                ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDispatchItem(null)}>Cancel</Button>
            <Button
              mode="contained"
              buttonColor={ORANGE}
              onPress={handleDispatch}
              loading={dispatching}
              disabled={dispatching}
            >
              🚚 Dispatch Equipment
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* CONFIRM RECEIVE MODAL */}
        <Dialog visible={!!receiveItem} onDismiss={() => setReceiveItem(null)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Confirm Equipment Arrival</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogNote}>
              Confirm arrival of <Text style={{ fontWeight: '800', color: NAVY }}>{receiveItem?.name}</Text> ({receiveItem?.qr_code}).
            </Text>

            <Text style={styles.fieldLabel}>Current Status:</Text>
            <Surface style={[styles.hqBox, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]} elevation={0}>
              <MaterialCommunityIcons name="truck-fast" size={20} color={ORANGE} />
              <Text style={{ fontWeight: '800', color: ORANGE, fontSize: 13 }}>{receiveItem?.place}</Text>
            </Surface>

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Receiving Headquarters Base:</Text>
            <View style={{ gap: 8 }}>
              {['Shimla HQ', 'Mandi HQ', 'Kangra HQ'].map(hq => (
                <TouchableOpacity
                  key={hq}
                  style={[styles.targetHqOption, targetHq === hq && styles.targetHqOptionActive]}
                  onPress={() => setTargetHq(hq)}
                >
                  <MaterialCommunityIcons name="office-building" size={20} color={targetHq === hq ? GREEN : '#64748B'} />
                  <Text style={[styles.targetHqTitle, targetHq === hq && { color: GREEN }]}>{hq}</Text>
                  {targetHq === hq && <MaterialCommunityIcons name="check-circle" size={20} color={GREEN} />}
                </TouchableOpacity>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setReceiveItem(null)}>Cancel</Button>
            <Button
              mode="contained"
              buttonColor={GREEN}
              onPress={handleReceive}
              loading={receiving}
              disabled={receiving}
            >
              📥 Confirm Arrival & Available
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* QR CODE VIEWER & DOWNLOAD MODAL */}
        <Dialog visible={!!selectedEqForQR} onDismiss={() => setSelectedEqForQR(null)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Equipment QR Code Tag</Dialog.Title>
          <Dialog.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: NAVY, textAlign: 'center', marginBottom: 2 }}>
              {selectedEqForQR?.name}
            </Text>
            <Text style={{ fontSize: 12, color: BLUE, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 4 }}>
              Tag ID: {selectedEqForQR?.qr_code || `EQ-${selectedEqForQR?.id}`}
            </Text>
            <Text style={{ fontSize: 11, color: '#64748B', textAlign: 'center', marginBottom: 16 }}>
              HQ Location: {selectedEqForQR?.place || 'Shimla HQ'} · {selectedEqForQR?.category}
            </Text>

            {selectedEqForQR && (
              <View style={styles.qrWrapper}>
                <QRCode
                  getRef={c => (qrSvgRef.current = c)}
                  value={JSON.stringify({
                    type: 'EQUIPMENT',
                    id: selectedEqForQR.id,
                    qr_code: selectedEqForQR.qr_code,
                    name: selectedEqForQR.name,
                  })}
                  size={200}
                />
              </View>
            )}

            <Button
              mode="contained"
              buttonColor={GREEN}
              icon="download"
              onPress={handleDownloadQR}
              style={{ marginTop: 20, width: '100%' }}
            >
              📥 Save / Download QR Code Tag
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSelectedEqForQR(null)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },

  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 42 : 54,
    paddingBottom: 16,
  },
  govBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginBottom: 10,
  },
  govBannerText: { color: 'white', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },

  headerButtons: { flexDirection: 'row', gap: 8 },
  headerBtnScan: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  headerBtnAdd: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: ORANGE, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8,
  },
  headerBtnText: { color: 'white', fontSize: 12, fontWeight: '800' },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 10,
  },
  statPill: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: '700', marginTop: 1 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },

  // HQ Selector Bar
  hqBar: { backgroundColor: DARK_BLUE, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  hqScroll: { paddingHorizontal: 14, gap: 8 },
  hqChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  hqChipActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  hqChipText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
  hqChipTextActive: { color: 'white' },

  // Filter bar
  filterBar: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8 },
  filterScroll: { paddingHorizontal: 14, gap: 8 },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1',
  },
  filterChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  filterChipTextActive: { color: 'white' },

  listContent: { padding: 14, paddingBottom: 100 },
  centerLoad: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadText: { color: '#64748B', fontWeight: '600' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 30, marginTop: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: NAVY, marginTop: 12 },
  emptySub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4, lineHeight: 18 },

  // Card
  eqCard: {
    backgroundColor: 'white', borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  eqTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  qrTag: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  qrTagText: { fontSize: 10, fontWeight: '800', color: BLUE, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  categoryBadge: { fontSize: 10, fontWeight: '800', color: BLUE, backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  qtyBadge: { fontSize: 10, fontWeight: '700', color: '#475569', backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  statusChipText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  detailsRow: { flexDirection: 'row', gap: 16, marginBottom: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 11, color: '#64748B', fontWeight: '600' },

  maintNoteBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#DDD6FE',
  },
  maintNoteText: { fontSize: 11, color: PURPLE, fontWeight: '700', flex: 1 },

  cardActions: { flexDirection: 'row', gap: 8 },
  qrViewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE',
  },
  qrViewBtnText: { fontSize: 11, fontWeight: '800', color: BLUE },

  dispatchBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: ORANGE, paddingVertical: 8, borderRadius: 8,
  },
  dispatchBtnText: { fontSize: 11, fontWeight: '800', color: 'white' },

  receiveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: GREEN, paddingVertical: 8, borderRadius: 8,
  },
  receiveBtnText: { fontSize: 11, fontWeight: '800', color: 'white' },

  maintSendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#DDD6FE',
  },
  maintSendBtnText: { fontSize: 11, fontWeight: '800', color: PURPLE },

  maintReturnBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: PURPLE, paddingVertical: 8, borderRadius: 8,
  },
  maintBtnText: { fontSize: 11, fontWeight: '800', color: 'white' },

  // Dialog
  dialog: { backgroundColor: 'white', borderRadius: 16 },
  dialogTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  dialogNote: { fontSize: 12, color: '#64748B', marginBottom: 14 },
  dialogInput: { marginBottom: 10 },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: 6, marginTop: 4 },

  catChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: '#F1F5F9', marginRight: 6, borderWidth: 1, borderColor: '#CBD5E1' },
  catChipActive: { backgroundColor: BLUE, borderColor: BLUE },
  catChipText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  catChipTextActive: { color: 'white' },

  hqBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE' },
  targetHqOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
  targetHqOptionActive: { borderColor: PURPLE, backgroundColor: '#F5F3FF' },
  targetHqTitle: { fontSize: 13, fontWeight: '800', color: NAVY },
  targetHqSub: { fontSize: 10, color: '#64748B' },

  qrWrapper: { padding: 16, backgroundColor: 'white', borderRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#E2E8F0' },
});
