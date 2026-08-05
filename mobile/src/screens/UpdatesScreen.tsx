import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, useTheme } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api';

export default function UpdatesScreen() {
  const theme = useTheme();
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBulletins = async () => {
    try {
      const response = await api.get('/bulletins');
      setBulletins(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch bulletins', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBulletins();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBulletins();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={bulletins}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No recent bulletins.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="elevated" elevation={1}>
              <Card.Content>
                <Title style={{ color: theme.colors.primary, fontWeight: '900', fontSize: 18 }}>{item.category || 'General Update'}</Title>
                <Paragraph style={styles.desc}>{item.message}</Paragraph>
                <Text variant="labelSmall" style={styles.time}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  listContent: { padding: 16, paddingBottom: 40 },
  card: { marginBottom: 16, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  desc: { color: '#3E5060', marginTop: 8, fontSize: 15, lineHeight: 22 },
  time: { color: '#64748B', marginTop: 12, textAlign: 'right', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
});
