import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Reglementation() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Coming soon" />
      </Appbar.Header>
      <View style={styles.container}>
        <Icon name="cogs" size={50} color="#000" />
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Coming Soon</Text>
        <Text>Cette fonctionnalité est en développement.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
