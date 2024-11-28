import { useContext, useState } from "react"
import {useForm} from '../../hooks'
import {AuthContext} from "../context"
import loginImage from '../../assets/login_image.png'
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {

    const {user, password, onInputChange} = useForm({
        user:"",
        password:""
    })
    

    const [error, setError] = useState("")

    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    const onLoginSubmit = async (event) => {
        event.preventDefault()
        setError("");
        
        console.log("submit")

        if (user==="" || password==="") {
            setError("Por favor, rellene todos los campos.");
            return;
        }

        console.log("LOGIN")

        const result = await login(user, password)

        console.log(result)

        if (result.success){

            navigate("/projects",{
                replace:true
            })
            
        }else{
            setError(result.error)
        }
    }


    return (
        <div className="login">
            
            <img className="login-image" src={loginImage} />
            

            <div className="login-content">
                <h1>¡Bienvenido de vuelta!</h1>
                <p>Inicie sesión en su cuenta</p>

                <form onSubmit={onLoginSubmit}>
    
                <label htmlFor="user">Usuario:</label>
                <input 
                    type="text"
                    name="user"
                    id="user"
                    value={user}
                    onChange={onInputChange}
                />

                <label htmlFor="password">Contraseña:</label>
                <input 
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={onInputChange}
                />

                <p className="form-error">{error}</p>

                <button type="submit">Iniciar Sesión</button>
                </form>
        
            </div>
            
        </div>
  )
}
