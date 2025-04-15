import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Button } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabThreeScreen() {

  // Fonction pour effacer une valeur spécifique dans AsyncStorage par clé
  const clearValueByKey = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Value for key "${key}" has been removed.`);
    } catch (error) {
      console.error('Error removing value:', error);
    }
  };

  // Fonction de gestion du clic
  const handlePress = () => {
    const keyToRemove = 'dreamFormDataArray'; // Remplacez 'your_key' par la clé de l'élément que vous voulez supprimer
    clearValueByKey(keyToRemove);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Three</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button icon="trash-can" mode="contained" onPress={handlePress} style={styles.button}>
        Supprimer les rêves
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    backgroundColor: '#275950', // Couleur de fond du bouton
  },
});
