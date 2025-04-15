import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Alert } from "react-native";
import {TextInput,Button,Checkbox,RadioButton,Text} from "react-native-paper";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import TagInputComponent from "./tag.input.personne";
import TagInputTags from "./tag.input.tags";


import AsyncStorage from "@react-native-async-storage/async-storage";

import Slider from "@react-native-community/slider";

import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const { width } = Dimensions.get("window");

export default function DreamForm() {
  const emojisWithIcons = [
    { id: 1, title: "heureux", icon: "emoticon-happy-outline" },
    { id: 2, title: "chill", icon: "emoticon-cool-outline" },
    { id: 3, title: "rire", icon: "emoticon-lol-outline" },
    { id: 4, title: "triste", icon: "emoticon-sad-outline" },
    { id: 5, title: "pleure", icon: "emoticon-cry-outline" },
    { id: 6, title: "colère", icon: "emoticon-angry-outline" },
    { id: 7, title: "confus", icon: "emoticon-confused-outline" },
  ];
  const [date, setDate] = useState(""); // date du rêve
  const [valueHeure, setValueHeure] = useState(""); // heure de sommeil

  const [valueRadio, setValueRadio] = React.useState(""); // radio button type de rêve

  const [selectedItem1, setSelectedItem1] = useState(""); // etat avant
  const [selectedItem2, setSelectedItem2] = useState(""); // etat apres

  const [hashtag3, setHashtag3] = useState("");

  const [valueIntensite, setValueIntensite] = useState(""); // Intensité du reve
  const [valueClarte, setValueClarte] = useState(""); // Clarté du reve
  const [valueQualite, setValueQualite] = useState(""); // Qualité du reve
  const [significationValue, setSignificationValue] = useState(""); // Signification du reve
  const [valuePerso, setValuePerso] = useState([]); // Tags personnels
  const [valueTag, setValueTag] = useState([]); // Tags

  const etatAvantRef = useRef();
  const etatApresRef = useRef();




  

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const day = today.getDate();
  const formattedDate = `${year}-${month}-${day}`;

  const findHashtagIdByLabel = async (hashtag) => {
    try {
      // Récupère les données des rêves stockées dans le AsyncStorage
      const existingDreams = await AsyncStorage.getItem("dreamFormDataArray");
      let dreamsData = existingDreams ? JSON.parse(existingDreams) : [];

      // Parcours tous les rêves pour trouver un hashtag existant
      for (let dream of dreamsData) {
        for (let hashtagKey in dream.hashtags) {
          const hashtagStored = dream.hashtags[hashtagKey]; // Récupère l'objet du hashtag stocké
          console.log(hashtag, hashtagStored.label);
          if (hashtagStored.label === hashtag) {
            // Si le hashtag est trouvé, renvoie son ID
            return hashtagStored.id;
          }
        }
      }

      // Si le hashtag n'existe pas, crée un nouvel ID
      const newId = `hashtag-${Math.random().toString(36).substr(2, 9)}`;
      return newId;
    } catch (error) {
      console.error("Erreur lors de la gestion des hashtags:", error);
      return null;
    }
  };

  const handleDreamSubmission = async () => {
    try {
      // Récupérer le tableau actuel depuis AsyncStorage
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      const formDataArray = existingData ? JSON.parse(existingData) : [];
      
      // Trouver les IDs des hashtags

      const hashtag3Id = await findHashtagIdByLabel(hashtag3);
      const title1 = selectedItem1.title;
      const title2 = selectedItem2.title;
      // Ajouter le nouveau formulaire au tableau
      formDataArray.push({
        valueRadio: valueRadio,
        selectedItem1: title1,
        selectedItem2: title2,
        hashtag3: hashtag3,
        valueHeure: valueHeure,
        valueIntensite: valueIntensite,
        valueClarte: valueClarte,
        valueQualite: valueQualite,
        significationValue: significationValue,
        valuePerso: valuePerso,
        valueTag: valueTag,
        dreamDate: date,
      });

      // Sauvegarde des nouvelles données
      await AsyncStorage.setItem("dreamFormDataArray", JSON.stringify(formDataArray));

      // Affichage du message de succès
      Alert.alert("Succès", "Votre rêve a été enregistré avec succès!", [{ text: "OK" }]);

      // Réinitialisation des champs
      setHashtag3("");
      setDate("");
      setValueRadio("");
      setSelectedItem1("");
      etatAvantRef.current.reset();
      etatApresRef.current.reset();
      setSelectedItem2("");
      setValueHeure("");
      setValueIntensite(0);
      setValueClarte(0);
      setValueQualite(0);
      setSignificationValue("");
      setValuePerso([]);
      setValueTag([]);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.textlabel} variant="titleMedium">
        Date & heure :
      </Text>

      <Calendar
        style={{
          borderWidth: 1,
          borderColor: "#275950",
          height: 350,
          width: width * 0.8,
          marginBottom: 16,
        }}
        current={formattedDate}
        onDayPress={(day) => setDate(day.dateString)}
        markedDates={{
          [date]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: "#275950",
          },
        }}
      />
      <TextInput
        label="Nombres d'heures de someil"
        keyboardType="numeric" // Affiche un clavier numérique
        value={valueHeure}
        onChangeText={(text) => {
          // Accepte uniquement les entiers
          if (/^\d*$/.test(text)) {
            // Vérifie que la chaîne contient uniquement des chiffres
            setValueHeure(text);
          }
        }}
        underlineColor="#275950"
        selectionColor="#275950"
        activeUnderlineColor="#275950"
        activeOutlineColor="#275950"
        textColor="#275950"
        style={[styles.input, { width: width * 0.8 }]}
      />

      <Text style={styles.textlabel} variant="titleMedium">
        Type du rêve :
      </Text>

      <RadioButton.Group
        onValueChange={(valueRadio) => setValueRadio(valueRadio)}
        value={valueRadio}
      >
        <RadioButton.Item
          label="Cauchemar"
          value="Cauchemar"
          color="#275950"
          uncheckedColor="#275950"
          style={{ width: width * 0.8 }}
        />
        <RadioButton.Item
          label="Rêve lucide"
          value="lucide"
          color="#275950"
          uncheckedColor="#275950"
          style={{ width: width * 0.8 }}
        />
        <RadioButton.Item
          label="Rêve ordinaire"
          value="ordinaire"
          color="#275950"
          uncheckedColor="#275950"
          style={{ width: width * 0.8 }}
        />
        <RadioButton.Item
          label="Autre"
          value="Autre"
          color="#275950"
          uncheckedColor="#275950"
          style={{ width: width * 0.8 }}
        />
      </RadioButton.Group>

      <Text style={styles.textlabel} variant="titleMedium">
        Etat avant & apres :
      </Text>
      <SelectDropdown
        data={emojisWithIcons}
        ref={etatAvantRef}
        onSelect={(selectedItem1, index) => {
          console.log(selectedItem1, index);
          setSelectedItem1(selectedItem1);
        }}
        renderButton={(selectedItem1, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              {selectedItem1 && (
                <Icon
                  name={selectedItem1.icon}
                  style={styles.dropdownButtonIconStyle}
                />
              )}
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem1 && selectedItem1.title) || "Etat avant"}
              </Text>
              <Icon
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#D2D9DF" }),
              }}
            >
              <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
              <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <SelectDropdown
        data={emojisWithIcons}
        ref={etatApresRef}
        onSelect={(selectedItem2, index) => {
          console.log(selectedItem2, index);
          setSelectedItem2(selectedItem2);
        }}
        renderButton={(selectedItem2, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              {selectedItem2 && (
                <Icon
                  name={selectedItem2.icon}
                  style={styles.dropdownButtonIconStyle}
                />
              )}
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem2 && selectedItem2.title) || "Etat après"}
              </Text>
              <Icon
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#D2D9DF" }),
              }}
            >
              <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
              <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <Text style={styles.textlabel} variant="titleMedium">
        ... :
      </Text>

      <TextInput
        label="Hashtag 3"
        value={hashtag3}
        onChangeText={setHashtag3}
        underlineColor="#275950"
        selectionColor="#275950"
        activeUnderlineColor="#275950"
        activeOutlineColor="#275950"
        textColor="#275950"
        style={[styles.input, { width: width * 0.8 }]}
      />

      <Text style={styles.textlabel} variant="titleMedium">
        Intensité du rêve : {valueIntensite}{" "}
      </Text>
      <Slider
        style={{ width: width * 0.8, height: 40 }}
        minimumValue={0}
        maximumValue={10}
        step={1} // Pour garantir des valeurs entières
        minimumTrackTintColor="#41BFB3"
        maximumTrackTintColor="#275950"
        onValueChange={(valueIntensite) => setValueIntensite(valueIntensite)}
      />

      <Text style={styles.textlabel} variant="titleMedium">
        Clarté du rêve : {valueClarte}{" "}
      </Text>
      <Slider
        style={{ width: width * 0.8, height: 40 }}
        minimumValue={0}
        maximumValue={10}
        step={1} // Pour garantir des valeurs entières
        minimumTrackTintColor="#41BFB3"
        maximumTrackTintColor="#275950"
        onValueChange={(valueClarte) => setValueClarte(valueClarte)}
      />
      <Text style={styles.textlabel} variant="titleMedium">
        Qualité du rêve : {valueQualite}{" "}
      </Text>
      <Slider
        style={{ width: width * 0.8, height: 40 }}
        minimumValue={0}
        maximumValue={10}
        step={1} // Pour garantir des valeurs entières
        minimumTrackTintColor="#41BFB3"
        maximumTrackTintColor="#275950"
        onValueChange={(valueQualite) => setValueQualite(valueQualite)}
      />


      <TextInput
        label="Signification du rêve"
        value={significationValue}
        onChangeText={setSignificationValue}
        underlineColor="#275950"
        selectionColor="#275950"
        activeUnderlineColor="#275950"
        activeOutlineColor="#275950"
        textColor="#275950"
        style={[styles.input, { width: width * 0.8 }]}
      />

      <TagInputComponent
      tags = {valuePerso}
      setTags = {setValuePerso}
       />

      <TagInputTags
      tags = {valueTag}
      setTags = {setValueTag}
      />

      <Button
        mode="contained"
        onPress={handleDreamSubmission}
        style={styles.button}
      >
        Soumettre
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#275950",
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#275950",
  },
  textlabel: {
    alignSelf: "flex-start",
    marginBottom: 8,
    fontWeight: "bold",
    color: "#275950",
  },
  dropdownButtonStyle: {
    width: width * 0.8,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#275950",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#275950",
    height: 350,
    width: width * 0.8,
    marginBottom: 16,
  },
});
