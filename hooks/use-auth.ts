
import { useQueryClient } from "@tanstack/react-query";
import {  useRef } from "react";
import { useAuthStore } from "@/store/use-auth-store";

export const useAuth = () => {
  const authStore = useAuthStore();

  const queryClient = useQueryClient();
  const { setLogout, token, setLogin, user, setToken, status } = authStore;

/*   const signIn = useMutation(
    ["auth", "session"],
    (data: IFormLogin) => authService.login(data),
    {
      onSuccess: (response) => {
        const careers = response.data.usuario.carreras;
        setCareers(careers);
        setSelectedCareer(careers[0]?.id);
        setSelectedInscriptionCareer(careers[0]?.inscripcionCarreraId);
        setLogin(response.data);

        Toast.show({
          type: "success",
          text1: "Excelente",
          text2: "Has iniciado sesion correctamente :)",
        });
      },
      onError: (error: any) => {
        setLogout();

        if (error?.message?.includes("CanceledError")) {
          Toast.show({
            type: "error",
            text1: "Algo salio mal",
            text2:
              "La solicitud fue cancelada debido a una alta demanda con el servidor",
          });
        } else if ([400, 401, 403].includes(error?.response?.status || 0)) {
          console.log("XDD");
          Toast.show({
            type: "error",
            text1: "Algo salio mal",
            text2:
              error.response.data.msg || "Usuario o contrasena incorrectos :(",
          });
        }
      },
    }
  );
  const signInOffice365 = useMutation(
    ["auth", "office365"],
    (token: string) => authService.loginWithOffice365(token),
    {
      onSuccess: (response) => {
        const careers = response.data.usuario.carreras;
        setCareers(careers);
        setSelectedCareer(careers[0]?.id);
        setSelectedInscriptionCareer(careers[0]?.inscripcionCarreraId);
        setLogin(response.data);

        Toast.show({
          type: "success",
          text1: "Excelente",
          text2: "Has iniciado sesion correctamente :)",
        });
      },
      onError: (error: any) => {
        setLogout();

        if (error?.message?.includes("CanceledError")) {
          Toast.show({
            type: "error",
            text1: "Algo salio mal",
            text2:
              "La solicitud fue cancelada debido a una alta demanda con el servidor",
          });
        } else if ([400, 401, 403].includes(error?.response?.status || 0)) {
          Toast.show({
            type: "error",
            text1: "Algo salio mal",
            text2:
              error.response.data.msg || "Usuario o contrasena incorrectos :(",
          });
        }
      },
    }
  ); */

  /* const refreshSessionTestOffice = useQuery(
    ["auth", "session", "officece"],
    authService.getProfileTestOffice,
    {
      onSuccess: (response) => {
        console.log("🚀 ~ useAuth ~ response:", response);
        // login(response.data);
      },
      onError: () => {
        console.log("ERROR REFRESH LOGOUT");
        //  setLogout();
      },
      retry: false,
      refetchInterval: token ? 1000000 : false,
      //TODO: DISABLE ON SERVER
      //enabled: !!token,
      enabled: false,
    }
  ); */

  const signOut = () => {
    queryClient.clear();
    setLogout();
  };
/* 
  useEffect(() => {
    updsApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) setLogout();
        return Promise.reject(error);
      }
    );
  }, []); */

  return {
    ...authStore,
  //  signIn,
    signOut,
  //  signInOffice365,
    // refreshSession,
    // refreshSessionTestOffice,
  };
};

