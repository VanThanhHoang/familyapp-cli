import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AppFormInput from "../../components/FormInput";
import AppFormDateInput from "../../components/FormDateInput";
import AppHeader from "../../components/AppHeader";
import { useThemeContext } from "../../ThemeContext";
import ItemToogle from "../friend/ItemToogle";
import RadioButtonGroup from "../friend/RadioButtonGroup";
import { formatDate2 } from "../../helper/string_format";
import { AppContext } from "../../AppContext";
import AxiosInstance from "../../network/AxiosInstance";
import { useNavigation, useRoute } from "@react-navigation/native";
import {launchImageLibrary} from 'react-native-image-picker';
import { Image } from "react-native";
import { APP_CONSTANTS } from "../../helper/constant";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Dropdown from "../friend/Dropdown";

const PeopleEditScreen = () => {
  const route = useRoute();
  const { id } = route.params;
  console.log("id", id);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [personData, setPersonData] = useState(null);
  const { setIsLoading } = useContext(AppContext);
  const { theme } = useThemeContext();
  const isDarkMode = theme.mode === "dark";
  const styles = useStyles(theme);
  const scrollView = React.useRef(null);
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setSelectedImage(response.assets[0]);
        setProfileImage(response.assets[0].uri);
        uploadImage(response.assets[0]);
      }
    });
  };
  const uploadImage = async (file) => {
    setIsLoading(true);
    try {
      const fileData = {
        uri: file.uri,
        type: "image/jpeg",
        name: `${new Date().getTime()}.jpg`,
      };
      const formData = new FormData();
      formData.append("profile_picture", fileData);
      const response = await AxiosInstance("multipart/form-data").put(
        `people/people-detail/${id}/`,
        formData
      );
      if (response.data.profile_picture) {
        Alert.alert("Thành công", "Ảnh đã được cập nhật");
      } else {
        Alert.alert("Lỗi", "Tải lên ảnh thất bại");
      }
    } catch (error) {
      console.log("error", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tải lên ảnh");
    } finally {
      setIsLoading(false);
    }
  };

  const scroll = () => {
    if (scrollView.current) {
      scrollView.current.scrollTo({
        y: 400,
        animated: true,
      });
    }
  };

  const getPersonData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance().get(`people/people-detail/${id}/`);
      setPersonData(response.data);
      setProfileImage(
        response.data.profile_picture ?? APP_CONSTANTS.defaultAvatar
      );
      console.log("personData", response.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load person data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPersonData();
  }, [id]);

  const toggleItems = [
    {
      title: "Giới tính",
      onPress: () => {
        setPersonData({
          ...personData,
          gender: !personData.gender,
        });
      },
      isChecked: personData?.gender,
      color: "#ff1694",
      colorChecked: "#1a70ce",
      icon: "transgender",
      textChecked: "Nam",
      textUnchecked: "Nữ",
    },
    {
      title: "Tình trạng hôn nhân",
      onPress: () => {
        setPersonData({
          ...personData,
          marital_status: !personData.marital_status,
        });
        if (!personData.marital_status) {
          scroll();
        }
      },
      isChecked: personData?.marital_status,
      color: theme.colors.text,
      colorChecked: "#ff1694",
      icon: "heart",
      textChecked: "Đã kết hôn",
      textUnchecked: "Độc thân",
    },
    {
      title: "Tình trạng sống",
      onPress: () => {
        setPersonData({
          ...personData,
          is_alive: !personData.is_alive,
          death_date: personData.is_alive ? "" : personData.death_date,
        });
        if (personData.is_alive) {
          scroll();
        }
      },
      isChecked: personData?.is_alive,
      color: theme.colors.text,
      colorChecked: "#ff1694",
      icon: "pulse",
      textChecked: "Còn sống",
      textUnchecked: "Đã mất",
    },
  ];

  const radioButtonGroups = [
    {
      title: "Tình trạng công việc",
      options: [
        { label: "Đang học", value: "Đang học" },
        { label: "Đi làm", value: "Đi làm" },
        { label: "Nội trợ", value: "Nội trợ" },
        { label: "Đi tu", value: "Đi tu" },
      ],
      selectedValue: personData?.status,
      onSelect: (value) => setPersonData({ ...personData, status: [value] }),
      formKey: "status",
    },
    {
      title: "Tôn giáo",
      options: [
        { label: "Công giáo", value: "Công giáo" },
        { label: "Đạo Phật", value: "Đạo Phật" },
        { label: "Tin Lành", value: "Tin Lành" },
        { label: "Đạo khác", value: "Đạo khác" },
      ],
      selectedValue: personData?.religion,
      onSelect: (value) => setPersonData({ ...personData, religion: [value] }),
      formKey: "religion",
    },
    {
      title: "Quan hệ",
      options: [
        { label: "Ân nhân", value: "Ân nhân" },
        { label: "Giáo viên", value: "Giáo viên" },
        { label: "Bạn bè", value: "Bạn bè" },
        { label: "Bạn học", value: "Bạn học" },
      ],
      selectedValue: personData?.relationship_category,
      onSelect: (value) =>
        setPersonData({ ...personData, relationship_category: [value] }),
      formKey: "relationship_category",
    },
  ];

  const formInputs = [
    {
      title: "Họ và tên",
      key: "full_name_vn",
      value: personData?.full_name_vn,
    },
    {
      title: "Email",
      key: "email",
      value: personData?.email,
    },
    {
      title: "Ngày tháng năm sinh (yyyy-mm-dd)",
      key: "birth_date",
      isDate: true,
      onChangeDate: (date) => {
        setPersonData({
          ...personData,
          birth_date: formatDate2(date),
        });
      },
      value: personData?.birth_date,
    },
    {
      title: "Địa chỉ",
      key: "address",
      value: personData?.address,
    },
    {
      title: "Số điện thoại",
      key: "phone_number",
      value: personData?.phone_number,
    },
    {
      title: "Quốc tịch",
      key: "nationality",
      value: personData?.nationality,
    },
    {
      title: "Tiểu sử",
      key: "history",
      value: personData?.history,
    },
  ];

  const additionalFormInputs = [
    {
      title: "Trình độ học vấn",
      key: "education_level",
      value: personData?.education_level,
    },
    {
      title: "Ghi chú tu hành",
      key: "monk_notes",
      value: personData?.monk_notes,
    },
    {
      title: "Nghề nghiệp",
      key: "occupation",
      value: personData?.occupation,
    },
    {
      title: "Liên kết mạng xã hội",
      key: "social_media_links",
      value: personData?.social_media_links,
    },
  ];
  const RELIGION_CHOICES = [
    { label: "Công giáo", value: "catholic" },
    { label: "Phật giáo", value: "buddhist" },
    { label: "Tin Lành", value: "protestant" },
    { label: "Đạo khác", value: "other" },
  ];

  const STATUS_CHOICES = [
    { label: "Đang đi học", value: "student" },
    { label: "Đã đi làm", value: "employed" },
    { label: "Thất nghiệp", value: "unemployed" },
    { label: "Đi tu", value: "monk" },
  ];

  const RELATIONSHIP_CATEGORY_CHOICES = [
    { label: "Ân Nhân", value: "benefactor" },
    { label: "Teacher", value: "teacher" },
    { label: "Bạn gái cũ", value: "ex_girlfriend" },
    { label: "Bạn học", value: "classmate" },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const dataUpdate = {
        full_name_vn: personData.full_name_vn,
        birth_date: personData.birth_date,
        achievement: personData.achievement,
        cause_of_death: personData.cause_of_death,
        current_age: personData.current_age,
        death_date: personData.death_date,
        death_info: personData.death_info,
        education_level: personData.education_level,
        email: personData.email,
        full_name: personData.full_name,
        gender: personData.gender,
        health_status: personData.health_status,
        history: personData.history,
        hobbies_interests: personData.hobbies_interests,
        is_alive: personData.is_alive,
        marital_status: personData.marital_status,
        nationality: personData.nationality,
        occupation: personData.occupation,
        people_id: personData.people_id,
        phone_number: personData.phone_number,
        social_media_links: personData.social_media_links,
        status: personData.status,
        relationship_category: personData.relationship_category,
        religion: personData.religion,
      };

      const res = await AxiosInstance().patch(
        `people/people-detail/${id}/`,
        dataUpdate
      );
      console.log("res", res);
      Alert.alert("Thành công", "Đã cập nhật thông tin người dùng");
      navigation.goBack();
    } catch (error) {
      console.log("error", { ...error });
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setIsLoading(false);
    }
  };

  if (!personData) {
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AppHeader
        right={{
          icon: "save",
          onPress: handleSave,
        }}
        back
        title="Chỉnh sửa thông tin"
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 300,
        }}
        ref={scrollView}
        showsVerticalScrollIndicator={false}
        style={{
          width: "100%",
        }}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri:
                `${profileImage}?timestamp=${new Date().getTime()}` ??
                APP_CONSTANTS.defaultAvatar,
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            onPress={pickImage}
            style={[
              styles.cameraIcon,
              { backgroundColor: isDarkMode ? theme.colors.card : "white" },
            ]}
          >
            <Ionicons name="camera" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        {formInputs.map((input, index) => {
          return input.isDate ? (
            <AppFormDateInput
              key={index}
              onSaveText={input.onChangeDate}
              value={input.value}
              title={input.title}
            />
          ) : (
            <AppFormInput
              key={index}
              title={input.title}
              value={input.value}
              onTextChange={(text) =>
                setPersonData({ ...personData, [input.key]: text })
              }
            />
          );
        })}
        {toggleItems.map((item, index) => (
          <ItemToogle
            key={index}
            title={item.title}
            onPress={item.onPress}
            isChecked={item.isChecked}
            color={item.color}
            colorChecked={item.colorChecked}
            icon={item.icon}
            textChecked={item.textChecked}
            textUnchecked={item.textUnchecked}
          />
        ))}
        {personData.marital_status && (
          <AppFormDateInput
            value={personData.wedding_day}
            onSaveText={(date) => {
              setPersonData({
                ...personData,
                wedding_day: formatDate2(date),
              });
            }}
            title="Ngày cưới (yyy-mm-dd)"
          />
        )}
        {!personData.is_alive && (
          <AppFormDateInput
            value={personData.death_date}
            onSaveText={(date) => {
              setPersonData({
                ...personData,
                death_date: formatDate2(date),
              });
            }}
            title="Ngày mất (yyy-mm-dd)"
          />
        )}
        <Dropdown
          label="Tình trạng công việc"
          options={STATUS_CHOICES}
          selectedValue={personData.status}
          onSelect={(value) => setPersonData({ ...formData, status: value })}
          theme={theme}
        />

        <Dropdown
          label="Tôn giáo"
          options={RELIGION_CHOICES}
          selectedValue={personData.religion}
          onSelect={(value) => setPersonData({ ...personData, religion: value })}
          theme={theme}
        />

        <Dropdown
          label="Quan hệ"
          options={RELATIONSHIP_CATEGORY_CHOICES}
          selectedValue={personData.relationship_category}
          onSelect={(value) =>
            setPersonData({ ...personData, relationship_category: value })
          }
          theme={theme}
        />
        {additionalFormInputs.map((input, index) => (
          <AppFormInput
            key={index}
            title={input.title}
            value={input.value}
            onTextChange={(text) => {
              setPersonData({ ...personData, [input.key]: text });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
    },
    imageWrapper: {
      position: "relative",
      width: 120,
      height: 120,
      alignSelf: "center",
      marginVertical: 10,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: "gray",
      backgroundColor: "gray",
      resizeMode: "cover",
    },
    cameraIcon: {
      position: "absolute",
      bottom: 1,
      right: -1,
      borderRadius: 15,
      padding: 2,
    },
  });

export default PeopleEditScreen;
