import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, List, useTheme } from 'react-native-paper';

export default function GuidesScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={{ color: theme.colors.primary, fontSize: 24, textAlign: 'center' }}>
          Responder Guidelines
        </Title>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.categoryTitle}>Flash Floods</Title>
          <List.Item
            title="Do not walk through moving water."
            left={props => <List.Icon {...props} icon="close-circle" color={theme.colors.error} />}
          />
          <List.Item
            title="Move to higher ground immediately."
            left={props => <List.Icon {...props} icon="check-circle" color="#4caf50" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.categoryTitle}>Landslides</Title>
          <List.Item
            title="Listen for unusual sounds (trees cracking, boulders knocking)."
            left={props => <List.Icon {...props} icon="ear-hearing" color={theme.colors.primary} />}
          />
          <List.Item
            title="Move away from the path of a landslide quickly."
            left={props => <List.Icon {...props} icon="run-fast" color={theme.colors.primary} />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.categoryTitle}>Earthquakes</Title>
          <List.Item
            title="Drop, Cover, and Hold on."
            left={props => <List.Icon {...props} icon="shield-half-full" color={theme.colors.primary} />}
          />
          <List.Item
            title="If indoors, stay there. Do not run outside."
            left={props => <List.Icon {...props} icon="home-alert" color={theme.colors.primary} />}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { padding: 20, backgroundColor: 'white', marginBottom: 10 },
  card: { margin: 15, marginTop: 5, backgroundColor: 'white' },
  categoryTitle: { color: '#e65100', marginBottom: 10 },
});
