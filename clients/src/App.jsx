import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from "./pages/Home";;
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import UpdateProfile from "./pages/UpdateProfile";

function App() {

  const {user} = useContext(AuthContext);

  return (
    
      <Router>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login/>}/>
          <Route path="/register" element={user ? <Navigate to="/"/>: <Register />} />
          <Route path="/login" element={user ? <Navigate to="/"/> : <Login />} />
          <Route path="/update" element={user ? <UpdateProfile />  : <Navigate to="/"/>} />
        </Routes>
      </Router>
   
  )
}

export default App
