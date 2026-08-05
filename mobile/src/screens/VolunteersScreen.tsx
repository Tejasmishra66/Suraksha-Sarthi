import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, useTheme } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VolunteersScreen() {
  const theme = useTheme();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const token = await SecureStore.getItemAsync('jwt');
      const response = await api.get('/volunteers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch volunteers', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVolunteers();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={volunteers}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No active volunteers found.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated" elevation={1}>
              <Card.Content style={styles.row}>
                <View style={styles.avatar}>
                  <MaterialCommunityIcons name="account-hard-hat" size={32} color="white" />
                </View>
                <View style={styles.details}>
                  <Title style={{ fontSize: 18 }}>{item.name}</Title>
                  <Paragraph style={styles.desc}>Phone: {item.phone}</Paragraph>
                  <Paragraph style={styles.desc}>Dept: {item.department}</Paragraph>
                  <Paragraph style={styles.desc}>Skills: {item.skills}</Paragraph>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  listContent: { padding: 15, paddingBottom: 40 },
  card: { marginBottom: 12, backgroundColor: 'white' },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#e65100', padding: 12, borderRadius: 30, marginRight: 15 },
  details: { flex: 1 },
  desc: { color: '#555', marginTop: 2, fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
});
