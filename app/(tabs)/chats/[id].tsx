import { useCallback, useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  GiftedChat,
  Send,
  Bubble,
  InputToolbar,
  Composer,
  IChatMessage,
} from "react-native-gifted-chat";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
//import { COLORS } from "~/constants";
import { useAuth } from "../../../hooks/use-auth";

import Toast from "react-native-toast-message";
import Colors from "@/constants/Colors";
import Actions from "./_components/actions";
import { useStorage } from "@/hooks/use-storage";
import { useChat } from '../../../hooks/use-chat';

const ChatScreen = () => {
  {
    const { status, user } = useAuth();
    const {id} = useLocalSearchParams<{id:string}>();
    
    const [chatId, setChatId] = useState<null | string>(id)

    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const { data, setData, enviarMensage, getMensages, isLoading } = useChat({
      CHAT_ID: chatId,
    });

    const { uploadFileMutation } = useStorage();

    const onSend = useCallback(
      async (messages: IChatMessage[] = []) => {
        let _id = Math.floor(Math.random() * 1000000);
        console.log("🚀 ~ selectedImages:", selectedImages)

        try {
          if (selectedImages.length) {
            const payload = {
              message: messages[0]?.text,
              type: "image",
              image: selectedImages[0],
            } as const;

            const parsedPayload: IChatMessage = {
              _id,
              text: messages[0]?.text,
              user: {
                _id: 1,
              },
              createdAt: new Date(),
              image: payload.image,
            };

            setSelectedImages([]);

            setData((previousMessages: IChatMessage[]) =>
              GiftedChat.append(previousMessages, [parsedPayload])
            );

            const urlImage = await uploadFileMutation.mutateAsync({
              uri: payload.image,
              folderName: "chat",
            });

            await enviarMensage({
              ...payload,
              image: urlImage,
            });
          } else if (messages[0]?.text) {
            const payload = {
              message: messages[0]?.text,
              type: "text",
            } as const;

            const parsedPayload: IChatMessage = {
              _id,
              text: messages[0]?.text,
              user: {
                _id: 1,
              },
              createdAt: new Date(),
            };

            setData((previousMessages: IChatMessage[]) =>
              GiftedChat.append(previousMessages, [parsedPayload])
            );

            await enviarMensage(payload);
          }
        } catch (e) {
          Toast.show({
            text1: "Error",
            text2: "No se pudo enviar el mensaje, vuelve a intentarlo",
            type: "error",
          });
          setData((previousMessages: IChatMessage[]) =>
            previousMessages.filter((msg) => msg._id !== _id)
          );
        }
        /*   setData((previousMessages: any) =>
          GiftedChat.append(previousMessages, messages)
        ); */
      },
      [chatId, selectedImages]
    );

    const startChat = async () => {
      if (status === "authenticated") {
        setChatId("MI_CHAT_ID");
      } 
      
    };

    useEffect(() => {
      startChat();
    }, []);

    useEffect(() => {
      if (chatId) getMensages();
    }, [chatId]);

    /* useEffect(() => {
      //console.log(chatId, "USE EFET")
      if (chatId && chatId.length > 0) {
        if (status === "autenticado") {
          setChatId(user.usuario.documentoIdentidad)
          //console.log(chatId)
        } else {
          setVisibleModal(true)
        }
        getMensages()
      }
    }, [chatId]) */

  

    const onSendAction = (data: { image: string }[]) => {
      setSelectedImages(data.map((img) => img.image));
    };

    const renderActions = useCallback(
      (props: any) =>
        Platform.OS === "web" ? null : (
          <Actions {...props} onSend={onSendAction} />
        ),
      [onSendAction]
    );

    const renderChatFooter = () => {
      if (!selectedImages.length) return null;

      const removeImage = (uri: string) => {
        setSelectedImages((images) => images.filter((img) => img !== uri));
      };

      return (
        <View style={styles.container}>
      {selectedImages.map((uri) => (
        <View key={uri} style={styles.imageContainer}>
          <Image
            source={{
              uri
            }}
            resizeMode="cover"
            style={styles.image}
          />
          <View style={styles.closeButtonContainer}>
            <TouchableOpacity onPress={() => removeImage(uri)}>
              <MaterialCommunityIcons name="close" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
      );
    };

    return (
      <GiftedChat
            renderChatFooter={renderChatFooter}
            messages={data}
            onQuickReply={(s) => {
              // console.log(s);
            }}
            onSend={(messages: any) => onSend(messages)}
            user={{
              _id: 1,
            }}
            infiniteScroll
            alwaysShowSend
            renderSend={(props) => <BotonEnviar {...props} />}
            placeholder="Escribe algo..."
            renderBubble={(props) => <Burbuja {...props} />}
            renderInputToolbar={(props) => <Input {...props} />}
            renderActions={renderActions}
            scrollToBottom
            scrollToBottomComponent={() => (
              <View>
                <FontAwesome name="chevron-down" />
              </View>
            )}
          />
    );
  }
};

const Burbuja = (props: any) => {
  const isDark = false
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: isDark
            ? Colors.dark.secondary
            : Colors.light.background,
        },
        left: {
          backgroundColor: isDark ? "#3b70ff" : "#cccccc49",
        },
      }}
      textStyle={{
        right: {
          color: "#fff",
        },
        left: {
          color: isDark ? "#FFF" : "#000",
        },
      }}
    />
  );
};

const Input = (props: any) => {
  const isDark = false;
  return (
    <InputToolbar
      {...props}
      optionTintColor="#fff"
      renderComposer={(x) => (
        <Composer {...x} textInputStyle={{ color: isDark ? "#FFF" : "#000" }} />
      )}
      containerStyle={{
        backgroundColor: isDark ? Colors.dark.secondary : "#fff",
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
        borderRadius: 25,
        borderWidth: 0.2,
      }}
    />
  );
};

const BotonEnviar = (props: any) => {
  const isDark = false
  return (
    <Send {...props} containerStyle={{ borderWidth: 0 }}>
      <View>
        <MaterialCommunityIcons
          name="send-circle"
          size={35}
          color={isDark ? "#FFF" : Colors.light.background}
          style={{ padding: 5 }}
        />
      </View>
    </Send>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  containerDark: {
    backgroundColor: '#1f2937', // Este es un color aproximado para dark:bg-secondary-dark
  },
  imageContainer: {
    position: 'relative',
    marginRight: 20,
    width: '100%',
    height: 240, // aproximadamente 60 unidades de Tailwind
  },
  image: {
    height: '100%',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatScreen;