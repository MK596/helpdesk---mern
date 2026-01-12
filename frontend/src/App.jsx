import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewTicket from './pages/NewTicket';
import Tickets from './pages/Tickets';
import Ticket from './pages/Ticket';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='min-h-screen'>
          <Header />
          <div className="container mx-auto px-4 pb-mobile-nav">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route path='/new-ticket' element={<NewTicket />} />
                <Route path='/tickets' element={<Tickets />} />
                <Route path='/ticket/:ticketId' element={<Ticket />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/admin' element={<AdminDashboard />} />
                <Route path='/admin/users' element={<Users />} />
              </Route>
            </Routes>
          </div>
          <BottomNav />
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
