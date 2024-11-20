import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState({
        id: null,
        username: null,
        name: null,
        admin: false,
    })

    const login = async (username, password) =>{
        try {
            const result = await window.api.login(username, password);
            console.log(result)
            if (result.success) {
                setUser({
                    id:result.user.id_tecnico,
                    username,
                    name:result.user.name,
                    admin:!!result.user.is_admin,
                })

                return{success:true}
            }else{
                return{success:false, error:result.error}
            }
        }catch (err) {
            return{success:false, error:"Se produjo un error inesperado"}
          }
    }

    return (
            <AuthContext.Provider value={{user, login}}>
                {children}
            </AuthContext.Provider>
    )
}
