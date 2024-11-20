import { useContext, useState } from "react"
import loginImage from '../assets/login_image.png'
import { useForm } from "../hooks/useForm"
import { AuthContext } from "../context/AuthContext"


// eslint-disable-next-line react/prop-types
export const Login = () => {

    const {formState, onInputChange} = useForm({
        user:"",
        password:""
    })

    const {login} = useContext(AuthContext)

    const [error, setError] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("");

        console.log("SUBMIT")
        if (formState.user==="" || formState.password==="") {
            setError("Por favor, rellene todos los campos.");
            return;
        }

        const result = await login(formState.user, formState.password)

        if (!result.success){
            setError(result.error)
        }
    }

    return (
        <div className="login">
            
            <img className="login-image" src={loginImage} />
            

            <div className="login-content">
                <h1>¡Bienvenido de vuelta!</h1>
                <p>Inicie sesión en su cuenta</p>

                <form onSubmit={handleSubmit}>
    
                <label htmlFor="user">Usuario:</label>
                <input 
                    type="text"
                    name="user"
                    id="user"
                    value={formState.user}
                    onChange={onInputChange}
                />

                <label htmlFor="password">Contraseña:</label>
                <input 
                    type="password"
                    name="password"
                    id="password"
                    value={formState.password}
                    onChange={onInputChange}
                />

                <p className="form-error">{error}</p>

                <button type="submit">Iniciar Sesión</button>
                </form>
        
            </div>
            
        </div>
  )
}
