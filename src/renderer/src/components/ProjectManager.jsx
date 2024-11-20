import { Navbar } from "./Navbar"
import logo from '../assets/logo.png'
import { useEffect } from "react"

export const ProjectManager = () => {

    useEffect(() => {
        window.api.maximizeWindow()
    }, [])
    
    
    return (
        <div className="project-manager">
            <div className="menu">
                <Navbar />
                <img src={logo} />
            </div>
            <div className="content">
                <h1>ProjectManager</h1>
                <hr/>
            </div>
        </div>
    )
}
