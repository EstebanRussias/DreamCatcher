import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  RadioButton,
  Text,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import Slider from "@react-native-community/slider";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TagInputComponent from "./tag.input.personne";
import TagInputTags from "./tag.input.tags";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const emojisWithIcons = [
  { id: 1, title: "heureux", icon: "emoticon-happy-outline" },
  { id: 2, title: "chill", icon: "emoticon-cool-outline" },
  { id: 3, title: "rire", icon: "emoticon-lol-outline" },
  { id: 4, title: "triste", icon: "emoticon-sad-outline" },
  { id: 5, title: "pleure", icon: "emoticon-cry-outline" },
  { id: 6, title: "colère", icon: "emoticon-angry-outline" },
  { id: 7, title: "confus", icon: "emoticon-confused-outline" },
];

export default function DreamEditForm() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dreamIndex = parseInt(id as string, 10);

  const [date, setDate] = useState("");
  const [valueHeure, setValueHeure] = useState("");
  const [valueRadio, setValueRadio] = useState("");
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [selectedItem2, setSelectedItem2] = useState(null);
  const [hashtag3, setHashtag3] = useState("");
  const [valueIntensite, setValueIntensite] = useState(0);
  const [valueClarte, setValueClarte] = useState(0);
  const [valueQualite, setValueQualite] = useState(0);
  const [significationValue, setSignificationValue] = useState("");
  const [valuePerso, setValuePerso] = useState([]);
  const [valueTag, setValueTag] = useState([]);

  const etatAvantRef = useRef();
  const etatApresRef = useRef();

  useEffect(() => {
    const loadDream = async () => {
      try {
        const stored = await AsyncStorage.getItem("dreamFormDataArray");
        if (stored) {
          const dreams = JSON.parse(stored);
          const dream = dreams[dreamIndex];
          if (!dream) return;

          setDate(dream.dreamDate || "");
          setValueHeure(dream.valueHeure || "");
          setValueRadio(dream.valueRadio || "");
          setSelectedItem1(
            emojisWithIcons.find((e) => e.title === dream.selectedItem1) || null
          );
          setSelectedItem2(
            emojisWithIcons.find((e) => e.title === dream.selectedItem2) || null
          );
          setHashtag3(dream.hashtag3 || "");
          setValueIntensite(dream.valueIntensite || 0);
          setValueClarte(dream.valueClarte || 0);
          setValueQualite(dream.valueQualite || 0);
          setSignificationValue(dream.significationValue || "");
          setValuePerso(dream.valuePerso || []);
          setValueTag(dream.valueTag || []);
        }
      } catch (err) {
        console.error("Erreur chargement rêve :", err);
      }
    };
    if (!isNaN(dreamIndex)) loadDream();
  }, [dreamIndex]);

  const handleSave = async () => {
    try {
      const stored = await AsyncStorage.getItem("dreamFormDataArray");
      const dreams = stored ? JSON.parse(stored) : [];

      dreams[dreamIndex] = {
        dreamDate: date,
        valueHeure,
        valueRadio,
        selectedItem1: selectedItem1?.title || "",
        selectedItem2: selectedItem2?.title || "",
        hashtag3,
        valueIntensite,
        valueClarte,
        valueQualite,
        significationValue,
        valuePerso,
        valueTag,
      };

      await AsyncStorage.setItem("dreamFormDataArray", JSON.stringify(dreams));
      Alert.alert("Succès", "Rêve modifié avec succès !");
      router.back();
    } catch (err) {
      console.error("Erreur sauvegarde :", err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
      <Text style={styles.textlabel}>Date du rêve :</Text>
      <Calendar
        current={date}
        onDayPress={(day) => setDate(day.dateString)}
        markedDates={{
          [date]: {
            selected: true,
            selectedColor: "#275950",
          },
        }}
        style={styles.calendar}
      />

      <TextInput
        label="Heures de sommeil"
        value={valueHeure}
        keyboardType="numeric"
        onChangeText={setValueHeure}
        style={styles.input}
      />

      <RadioButton.Group onValueChange={setValueRadio} value={valueRadio}>
        {['Cauchemar', 'lucide', 'ordinaire', 'Autre'].map((val) => (
          <RadioButton.Item
            key={val}
            label={val}
            value={val}
            color="#275950"
            uncheckedColor="#275950"
          />
        ))}
      </RadioButton.Group>

      <SelectDropdown
        data={emojisWithIcons}
        ref={etatAvantRef}
        onSelect={(item) => setSelectedItem1(item)}
        defaultValue={selectedItem1}
        renderButton={(selectedItem1, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            {selectedItem1 && <Icon name={selectedItem1.icon} style={styles.dropdownButtonIconStyle} />}
            <Text style={styles.dropdownButtonTxtStyle}>{selectedItem1?.title || "État avant"}</Text>
            <Icon name={isOpened ? "chevron-up" : "chevron-down"} style={styles.dropdownButtonArrowStyle} />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        )}
        dropdownStyle={styles.dropdownMenuStyle}
      />

      <SelectDropdown
        data={emojisWithIcons}
        ref={etatApresRef}
        onSelect={(item) => setSelectedItem2(item)}
        defaultValue={selectedItem2}
        renderButton={(selectedItem2, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            {selectedItem2 && <Icon name={selectedItem2.icon} style={styles.dropdownButtonIconStyle} />}
            <Text style={styles.dropdownButtonTxtStyle}>{selectedItem2?.title || "État après"}</Text>
            <Icon name={isOpened ? "chevron-up" : "chevron-down"} style={styles.dropdownButtonArrowStyle} />
          </View>
        )}
        renderItem={(item, index, isSelected) => (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        )}
        dropdownStyle={styles.dropdownMenuStyle}
      />

      <TextInput
        label="Hashtag"
        value={hashtag3}
        onChangeText={setHashtag3}
        style={styles.input}
      />

      <Text style={styles.textlabel}>Intensité : {valueIntensite}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={valueIntensite}
        onValueChange={setValueIntensite}
        style={{ width: width * 0.8 }}
      />

      <Text style={styles.textlabel}>Clarté : {valueClarte}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={valueClarte}
        onValueChange={setValueClarte}
        style={{ width: width * 0.8 }}
      />

      <Text style={styles.textlabel}>Qualité : {valueQualite}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={valueQualite}
        onValueChange={setValueQualite}
        style={{ width: width * 0.8 }}
      />

      <TextInput
        label="Signification"
        value={significationValue}
        onChangeText={setSignificationValue}
        style={styles.input}
      />

      <TagInputComponent tags={valuePerso} setTags={setValuePerso} />
      <TagInputTags tags={valueTag} setTags={setValueTag} />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Enregistrer les modifications
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    width: width * 0.8,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#275950",
  },
  textlabel: {
    alignSelf: "flex-start",
    marginBottom: 8,
    fontWeight: "bold",
    color: "#275950",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#275950",
    height: 350,
    width: width * 0.8,
    marginBottom: 16,
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
});
