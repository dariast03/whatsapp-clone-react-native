import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export async function pickImage(onSend: (images: { image: string }[]) => void) {
  if (await ImagePicker.requestMediaLibraryPermissionsAsync()) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    console.log("🚀 ~ pickImage ~ result:", result);

    if (!result.canceled) {
      const maxFileSizeInBytes = 2 * 1024 * 1024 * 4024; // 2MB
      const uris = [];

      console.log("XDDDDDDD");
      for (const asset of result.assets) {
        uris.push({ image: asset.uri });
      }

      console.log("🚀 ~  uris:", uris);
      onSend(uris);
      return uris;
    }
  }
}

export async function takePicture(
  onSend: (images: { image: string }[]) => void
) {
  if (await ImagePicker.requestCameraPermissionsAsync()) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      onSend([{ image: uri }]);
      return uri;
    }
  }
}
