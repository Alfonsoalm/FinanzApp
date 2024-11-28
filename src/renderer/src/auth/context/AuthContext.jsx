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
           
            if (result.success) {
                const {data} = result 
                console.log(data)
                setUser({
                    id:data.id,
                    username,
                    name:data.name,
                    admin:!!data.is_admin,
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
