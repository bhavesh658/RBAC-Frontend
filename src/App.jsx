import AppRoutes from "./routes/AppRoutes"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
      <AppRoutes />


      <ToastContainer 
        position="top-center" 
        autoClose={1000} 
        hideProgressBar={false}
        theme="colored"
      />
    </>
  )
}

export default App
