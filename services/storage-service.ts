import { STORAGE } from "@/firebase/config";
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";

type FolderNameStorage = "chat";

export type UploadFile = {
  uri: string;
  folderName: FolderNameStorage;
};

const uploadFile = async ({ uri, folderName }: UploadFile): Promise<string> => {
  try {

    const fileExtension = uri.split(".").pop();
    const uniqueId = Date.now() + Math.random().toString(36).substring(7);
    const imageName = `${uniqueId}.${fileExtension}`;
    
    // Crear referencia al archivo en Firebase Storage
    const storageRef = ref(STORAGE, `${folderName}/${imageName}`);

    // Para web necesitamos convertir el URI a un Blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Subir el archivo
    await uploadBytes(storageRef, blob);
    
    // Obtener la URL de descarga
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};

export default {
  uploadImage: uploadFile,
};