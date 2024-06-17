import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home';
import Login from './pages/auth/Login';
import Reset from './pages/auth/Reset';
import Register from './pages/auth/Register';
import Forget from './pages/auth/Forget';
import Sidebar from './components/sidebar/Sidebar';
import Layout from './components/layout/Layout'
import Dashboard from './pages/dashboard/Dashboard';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getLoginStatus } from './services/authServices';
import { SET_LOGIN } from './redux/features/auth/authSlice';
import AddInventory from './pages/addInventory/AddInventory';
import InventoryDetail from './components/Inventory/InventoryDetail/InventoryDetail';
import EditInventory from './pages/editInventory/EditInventory';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import Contact from './pages/contact/Contact';
import AIChat from "./pages/AIChat/AIChat"



axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loginStatus(){
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status))
    }
    loginStatus();
  }, [dispatch]);
  return (
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/resetpassword/:resetToken' element={<Reset />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forget' element={<Forget />} />

        <Route path='/dashboard' element={
          <Sidebar>
            <Layout>
              <Dashboard />
            </Layout>  
          </Sidebar>
        } />

        <Route path='/add-inventory' element={
          <Sidebar>
            <Layout>
              <AddInventory />
            </Layout>  
          </Sidebar>
          } />

        <Route
          path="/inventory-detail/:id"
          element={
            <Sidebar>
              <Layout>
                <InventoryDetail />
              </Layout>
            </Sidebar>
          }
        />

        <Route
          path="/edit-inventory/:id"
          element={
            <Sidebar>
              <Layout>
                <EditInventory />
              </Layout>
            </Sidebar>
          }
        />

        <Route
          path="/profile"
          element={
            <Sidebar>
              <Layout>
                <Profile />
              </Layout>
            </Sidebar>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <Sidebar>
              <Layout>
                <EditProfile />
              </Layout>
            </Sidebar>
          }
        />

        <Route
          path="/contact-us"
          element={
            <Sidebar>
              <Layout>
                <Contact />
              </Layout>
            </Sidebar>
          }
        />

        <Route
          path="/aichat"
          element={
            <Sidebar>
              <Layout>
                <AIChat />
              </Layout>
            </Sidebar>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
