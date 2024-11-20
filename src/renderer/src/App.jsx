
import { useContext } from 'react'
import { Login } from './components/Login'
import { ProjectManager } from './components/ProjectManager'
import { AuthContext} from './context/AuthContext'


function App() {

  const {user} = useContext(AuthContext)
  

  return (
    <>
      {user.id ? <ProjectManager />:<Login />}
    </>
  )
}

export default App

