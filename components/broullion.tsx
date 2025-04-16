import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";

export default function DreamList() {
  const [dreams, setDreams] = useState([]);

  useEffect(() => {
    const fetchDreams = async () => {
      try {
        const storedDreams = await AsyncStorage.getItem("dreamFormDataArray");
        if (storedDreams) {
          setDreams(JSON.parse(storedDreams) || []);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des rêves:", error);
      }
    };
    fetchDreams();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Si la date est invalide, renvoie-la telle quelle
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ScrollView style={styles.container}>
      {dreams.length === 0 ? (
        <Text style={styles.emptyText}>Aucun rêve enregistré</Text>
      ) : (
        dreams.map((dream, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title title={`Rêve ${index + 1} - ${formatDate(dream.dreamDate)}`} />
            <Card.Content>
              <Text>
                Le {formatDate(dream.dreamDate)}, tu as fait un rêve {dream.valueRadio} après avoir dormi pendant {dream.valueHeure} heures.
                Avant de t'endormir, tu te sentais {dream.selectedItem1}, et à ton réveil, tu t'es senti {dream.selectedItem2}.
                Ce rêve est associé au hashtag {dream.hashtag3}, et il a une intensité de {dream.valueIntensite},
                une clarté de {dream.valueClarte}, et une qualité de {dream.valueQualite}.
              </Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#275950",
    borderWidth: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#000000",
  },
});
