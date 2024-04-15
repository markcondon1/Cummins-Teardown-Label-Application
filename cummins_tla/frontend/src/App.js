import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from "./pages/Login";
import FirstFit from "./pages/FirstFit";
import Reman from "./pages/Reman";
import TeardownTray from "./pages/TeardownTray";
import Dashboard from "./pages/Dashboard";
import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom";
import {useSelector} from "react-redux";
import Admin from "./pages/Admin";
import DeleteUser from "./pages/DeleteUser";
import AddUser from "./pages/AddUser";
import PrinterLogs from "./pages/PrinterLogs";

function App() {
    const userAuth = useSelector(state => state.user);
    //handles returning to login screen if user is not logged in
    const ProtectedRoute = ({children}) =>{
        if(!userAuth.userAuth){
            return <Navigate to="/"/>;
        }
        return children;
    };
//handles the creation of routes and their paths.
//Routes are protected, which requires the user to login
  return (
      <div className="App">
          <Router>
              <Routes>
                  <Route exact path="/" element={<Login/>} />
                  <Route exact path="/app" element={<App/>} />
                  <Route exact path="/app/home" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
                  <Route exact path="/app/firstFit" element={<ProtectedRoute><FirstFit/></ProtectedRoute> }/>
                  <Route exact path="/app/Reman" element={<ProtectedRoute><Reman/></ProtectedRoute>} />
                  <Route exact path="/app/teardownTray" element={<ProtectedRoute><TeardownTray/></ProtectedRoute>} />
                  <Route exact path="/app/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
                  <Route exact path="/app/admin/deleteUsers" element={<ProtectedRoute><DeleteUser/></ProtectedRoute>} />
                  <Route exact path="/app/admin/addUser" element={<ProtectedRoute><AddUser/></ProtectedRoute>} />
                  <Route exact path="/app/admin/printerLogs" element={<ProtectedRoute><PrinterLogs/></ProtectedRoute>} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
