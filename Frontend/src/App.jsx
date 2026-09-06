import { ToastContainer } from 'react-toastify'
import AppRoutes from './routes/AppRoutes.jsx'
import 'react-toastify/dist/ReactToastify.css'
import './styles/toast.css'

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="bottom-right" autoClose={3200} newestOnTop closeButton={false} />
    </>
  )
}

export default App
