import { DB as db } from "@/firebase/config";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { IChatMessage } from "react-native-gifted-chat";

export type Message = {
  id?: string;
  message: string;
  date: Date;
  isSent: boolean;
};

export const getChatMessages = async (chatId: string) => {
  if (chatId) {
    const messagesRef = collection(
      doc(collection(db, "CHATS"), chatId),
      "messages"
    );
    const q = query(messagesRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Message;
      messages.push({
        id: doc.id,
        message: data.message,
        //@ts-ignore
        date: data.date.toDate(),
        isSent: data.isSent,
      });
    });
    return messages;
  }
};

export type MessagePayload = {
  message: string;
  type: "text" | "image" | "video";
  image?: string;
};

export const sendMessage = async (
  chatId: string,
  payload: MessagePayload,
  uname: string
) => {
  try {


    const newMessage: Message = {
      ...payload,
      isSent: true,
      date: new Date()
    };

    // Actualizar documento principal del chat
    const chatRef = doc(collection(db, "CHATS"), chatId);
    await setDoc(chatRef, {
      latestMessage: serverTimestamp(),
      isRead: 0,
      uname,
    });

    // Agregar mensaje a la subcolección
    const messagesRef = collection(chatRef, "messages");
    await addDoc(messagesRef, newMessage);
  } catch (error) {
    console.log(error);
    throw new Error("Error al enviar mensaje");
  }
};

const CHAT_ID = "Bopy07q62FQkCbsaDnV3";

const sendInitialMessage = async (chatId: string, uname: string) => {
  const chatRef = doc(collection(db, "CHATS"), chatId);
  const messagesRef = collection(chatRef, "messages");
  const messagesSnapshot = await getDocs(messagesRef);

  if (messagesSnapshot.empty) {
    await setDoc(chatRef, {
      uname,
    });

    await addDoc(messagesRef, {
      message:
        "¡Hola! Bienvenido al chat de la Universidad UPDS. ¿En qué podemos ayudarte hoy? ¿Tienes alguna pregunta sobre nuestros programas académicos, proceso de admisión o eventos próximos?",
      isSent: false,
      date: serverTimestamp(),
      uname: "UPDS",
    });
  } else {
    await setDoc(
      chatRef,
      {
        uname,
      },
      { merge: true }
    );
  }
};

export const cargarMensajes = async (
  chatId: string,
  uname: string,
  setData: Function
) => {
  //await sendInitialMessage(chatId, uname);

  const chatRef = doc(collection(db, "CHATS"), chatId);
  const messagesRef = collection(chatRef, "messages");
  const q = query(messagesRef, orderBy("date", "desc"));

  return onSnapshot(q, (snapshot) => {
    const mensajes = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      ...(doc.data() as Message & MessagePayload),
      id: doc.id,
    }));

    console.log("🚀 ~ mensajes ~ mensajes:", mensajes)

    const mensajesParsed: IChatMessage[] = mensajes.map((msg) => {
      
      if (msg.type === "image") {
        return {
          _id: msg.id,
          text: msg.message,
          // @ts-ignore
          createdAt: msg.date.toDate(),
          user: {
            _id: msg.isSent ? 1 : 2,
            avatar: msg.isSent
              ? ""
              : "https://scontent.flpb2-2.fna.fbcdn.net/v/t39.30808-6/324587280_505638334992771_7839182741225428604_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=qVtb-s0bTAcAX9nYaHI&_nc_ht=scontent.flpb2-2.fna&oh=00_AfAZwMlQKerguZqryKGMHOCscZxDizeIgCSHAffFmZPQjQ&oe=64893FAB",
          },
          image: msg.image,
        };
      }

      console.log({
        msg
      });
      return {
        _id: msg.id,
        text: msg.message,
        // @ts-ignore
        createdAt: msg.date.toDate(),
        user: {
          _id: msg.isSent ? 1 : 2,
          avatar: msg.isSent
            ? ""
            : "https://scontent.flpb2-2.fna.fbcdn.net/v/t39.30808-6/324587280_505638334992771_7839182741225428604_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=qVtb-s0bTAcAX9nYaHI&_nc_ht=scontent.flpb2-2.fna&oh=00_AfAZwMlQKerguZqryKGMHOCscZxDizeIgCSHAffFmZPQjQ&oe=64893FAB",
        },
      };
    });

    setData(mensajesParsed);
  });
};
