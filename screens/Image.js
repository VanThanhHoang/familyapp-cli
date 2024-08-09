import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import ImageViewer from "react-native-image-zoom-viewer";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { Image } from "react-native";

const DetailImage = ({ route, navigation }) => {
  const { link } = route.params;
  const [loading, setLoading] = useState(false);

  const images = [{ url: link }];

  const handleDownload = async () => {
    setLoading(true);
    try {
      const fileUri = `${RNFS.DocumentDirectoryPath}/temp_image.jpg`;
      const downloadResult = await RNFS.downloadFile({
        fromUrl: link,
        toFile: fileUri,
      }).promise;

      if (downloadResult.statusCode === 200) {
        await Share.open({
          url: `file://${fileUri}`,
          title: "Download Image",
          message: "Image downloaded successfully",
        });
        Alert.alert("Success", "Image downloaded successfully");
      } else {
        Alert.alert("Error", "Failed to download image");
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "An error occurred while downloading the image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDownload}
          style={styles.downloadButton}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.downloadingText}>Downloading...</Text>
          ) : (
            <Ionicons name="download-outline" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
      <ImageViewer
        enableImageZoom={true}
        imageUrls={images}
        enableSwipeDown={true}
        renderImage={(props) => {
          return (
            <Image
              {...props}
              style={{
                width: Dimensions.get("window").width,
                backgroundColor: "white",
                alignSelf: "center",
                height: 400,
              }}
            />
          );
        }}
        saveToLocalByLongPress={true}
        onSwipeDown={() => navigation.goBack()}
        backgroundColor="black"
        renderIndicator={() => null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "black",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  backButton: {
    padding: 8,
  },
  downloadButton: {
    padding: 8,
  },
  downloadingText: {
    color: "#fff",
  },
});

export default DetailImage;
