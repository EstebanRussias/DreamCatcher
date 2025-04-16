import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "react-native-paper";
import { Link } from "expo-router";

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
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderTagList = (tags) => {
    if (!tags || tags.length === 0) return "Aucun";
    return tags.map((tag) => (typeof tag === "string" ? tag : tag.label || tag)).join(", ");
  };

  return (
    <ScrollView style={styles.container}>
      {dreams.length === 0 ? (
        <Text style={styles.emptyText}>Aucun rêve enregistré</Text>
      ) : (
        dreams.map((dream, index) => (
          <Link
            key={index}
            href={{ pathname: "/edit", params: { id: index } }}
            asChild
          >
            <TouchableOpacity>
              <Card style={styles.card}>
                <Card.Title
                  title={`Rêve ${index + 1}`}
                  subtitle={`Date : ${formatDate(dream.dreamDate)}`}
                />
                <Card.Content>
                  <Text>🕒 Heures de sommeil : {dream.valueHeure || "N/A"}</Text>
                  <Text>Type de rêve : {dream.valueRadio || "N/A"}</Text>
                  <Text>État avant : {dream.selectedItem1 || "N/A"}</Text>
                  <Text>État après : {dream.selectedItem2 || "N/A"}</Text>
                  <Text>Lieu : {dream.hashtag3 || "Aucun"}</Text>
                  <Text>📊 Intensité : {dream.valueIntensite}/10</Text>
                  <Text>📊 Clarté : {dream.valueClarte}/10</Text>
                  <Text>📊 Qualité : {dream.valueQualite}/10</Text>
                  <Text>📖 Signification : {dream.significationValue || "N/A"}</Text>
                  <Text>👥 Tags personnels : {renderTagList(dream.valuePerso)}</Text>
                  <Text>🏷️ Tags généraux : {renderTagList(dream.valueTag)}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </Link>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
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
