import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"


export const Navbar = () => {
    
    const {user} = useContext(AuthContext)

    return (
        <nav>
            <ul>
                <li><button>Tu área</button></li>
                {user.admin && ( 
                <>
                    <li><button>Proyectos</button></li>
                    <li><button>Personal</button></li>
                    <li><button>Informes</button></li>
                    <li><button>Avisos</button></li>
                </>
                )}
                <li><button>Ajustes</button></li>
                <li><button>Información</button></li>
            </ul>
        </nav>
    )
}
