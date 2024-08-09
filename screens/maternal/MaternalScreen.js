import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "../../network/AxiosInstance";
import AppHeader from "../../components/AppHeader";
import Modal from "react-native-modal";
import { AppContext } from "../../AppContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "react-native-linear-gradient";
import { useThemeContext } from "../../ThemeContext";
import createMember from "../myfamily/DataFamily";
import styles from "../components/paternal/PaternalScreenStyles";
import FamilyMemberCard from "../components/Avata/FamilyMemberCard";

const MaternalScreen = () => {
  const navigation = useNavigation();
  const { setIsLoading } = useContext(AppContext);
  const { theme: rneTheme } = useThemeContext();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const fetchFamilyData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("access");
      const peopleId = await AsyncStorage.getItem("people_id");
      if (token && peopleId) {
        const response = await AxiosInstance().get("maternal/relationship/");
        const data = response.data;
        setFamilyMembers(processFamilyData(data));
      }
    } catch (error) {
      console.error("Error fetching family data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchFamilyData);
    return unsubscribe;
  }, [fetchFamilyData, navigation]);

  const processFamilyData = (data) => {
    const processedData = [];

    const processSection = (section, title) => {
      if (section && section.relationships) {
        const members = processRelationships(section.relationships, title);
        processedData.push({ title, members });
      }
    };

    processSection(data.great_great_maternal_grandparents, data.great_great_maternal_grandparents?.title);
    processSection(data.great_maternal_grandparents, data.great_maternal_grandparents?.title);
    processSection(data.maternal_grandparents, data.maternal_grandparents?.title);
    processSection(data.mother_siblings, data.mother_siblings?.title);

    return processedData;
  };

  const processRelationships = (relationships, title) => {
    const membersWithSpouses = [];
    const membersWithoutSpouses = [];

    relationships.forEach(person => {
      const member = createMember(person, title);
      if (person.spouse) {
        membersWithSpouses.push([member, createMember(person.spouse, title)]);
      } else {
        membersWithoutSpouses.push(member);
      }
    });

    // Sort members by age
    membersWithSpouses.sort((a, b) => calculateAge(b[0].birth_date) - calculateAge(a[0].birth_date));
    membersWithoutSpouses.sort((a, b) => calculateAge(b.birth_date) - calculateAge(a.birth_date));

    const pairedWithoutSpouses = [];
    for (let i = 0; i < membersWithoutSpouses.length; i += 2) {
      pairedWithoutSpouses.push(membersWithoutSpouses.slice(i, i + 2));
    }

    return [...membersWithSpouses, ...pairedWithoutSpouses];
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const renderFamilyPairs = ({ item }) => (
    <View>
      <View style={[styles.divider, { borderBottomColor: rneTheme.colors.dividerColor }]} />
      <View style={styles.parentHighlightContainer}>
        {typeof item.title === 'string' ? (
          <Text style={[styles.parentTitle, { color: rneTheme.colors.text }]}>{item.title}</Text>
        ) : (
          item.title
        )}
        {item.parentAvatars && (
          <View style={styles.parentAvatarsContainer}>
            {item.parentAvatars.father && <Image source={{ uri: item.parentAvatars.father }} style={styles.parentAvatar} />}
            {item.parentAvatars.mother && <Image source={{ uri: item.parentAvatars.mother }} style={styles.parentAvatar} />}
          </View>
        )}
      </View>
      {Array.isArray(item.members) && item.members.map((memberGroup, index) => (
        <View style={styles.pairContainer} key={index}>
          {Array.isArray(memberGroup) ? memberGroup.map((member, idx) => <FamilyMemberCard key={idx} member={member} />) : <FamilyMemberCard key={index} member={memberGroup} />}
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: rneTheme.colors.background }]}>
      <AppHeader back title="Gia Đình Ngoại" />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddFamilyCenterScreen")}>
        <LinearGradient colors={["#FFD700", "#FFA500"]} start={[0, 0]} end={[1, 1]} style={styles.addButtonGradient}>
          <Icon name="person-add" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
      <FlatList data={familyMembers} keyExtractor={(item, index) => index.toString()} renderItem={renderFamilyPairs} />
      <Modal isVisible={isModalVisible}>
        <View style={[styles.modalContent, { backgroundColor: rneTheme.colors.card }]}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MaternalScreen;
