import { useState } from "react"


export const Login = () => {

    const [formData, setFormData] = useState({
        user:"",
        password:""
    })

    const handleChange = ({target}) => {
        const {name, value} = target
        
        setFormData({
            ...formData,
            [name]:value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(formData)
    }

    return (
        <div className="login">
            <h1>Project Manager</h1>

            <form onSubmit={handleSubmit}>
            <label htmlFor="user">Usuario</label>
            <input 
                type="text"
                name="user"
                id="user"
                value={formData.user}
                onChange={handleChange}
            />

            <label htmlFor="password">Contraseña</label>
            <input 
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
            />

            <button type="submit">Iniciar Sesión</button>
            </form>
        
        </div>
  )
}
