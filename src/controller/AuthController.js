import AsyncStorage from "@react-native-async-storage/async-storage";




export const AuthController =  {
    getUsuarioLogado: async () => {
        try{
            const data = await AsyncStorage.getItem("@dogs/usuario_logado")
            return data ? JSON.parse(data) : null
        }catch{
            return null
        }
    },

    getUsuarioId: async () =>{
        try{
            const usuario = await AuthController.getUsuarioLogado()
            return usuario ? usuario.id: null
        }catch{
            return null
        }
    }
}