import { useState } from "react";
import { MessagePayload, cargarMensajes, sendMessage } from "../services/chat-service";
import { IChatMessage } from "react-native-gifted-chat";
import { useAuth } from "./use-auth";

export interface MensajeParsed {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    avatar: string;
  };
}

export const useChat = ({ CHAT_ID }: { CHAT_ID: string | null }) => {
  const [data, setData] = useState<IChatMessage[]>([]);
  const [isLoading, setisLoading] = useState(false);

  const { user, status } = useAuth();

  const getMensages = async () => {
    //  setisLoading(true);
    // const CHAT_ID = userAuth.usuario.documentoIdentidad
    console.log("🚀 ~ getMensages ~ CHAT_ID:", {
      CHAT_ID,
      status,
      user: "FAKE NAME",
    });

    if (CHAT_ID) {
        await cargarMensajes(CHAT_ID, "FAKE NAME", setData);
      
    }
    // setisLoading(false);
  };

  const enviarMensage = async (payload: MessagePayload) => {
    // const CHAT_ID = userAuth.usuario.documentoIdentidad
    //console.log(CHAT_ID, "CHAT ID ON SEND")
    try {
      if (CHAT_ID) {
        // console.log("ENVIANDO")
              await sendMessage(CHAT_ID, payload, "FAKE NAME");
           }
    } catch (e: any) {
      throw new Error(e);
    }
  };

  /*   useEffect(() => {
        getMensages()
      }, []) */
  return {
    data,
    isLoading,
    setData,
    getMensages,
    enviarMensage,
  };
};
