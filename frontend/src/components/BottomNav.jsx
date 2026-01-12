import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTicketAlt, FaPlus, FaUser, FaLock, FaThLarge, FaQuestionCircle } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function BottomNav() {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bottom-nav d-md-none fixed-bottom shadow-lg">
            <div className="container-fluid d-flex justify-content-between align-items-center h-100 px-3">
                <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
                    <FaHome size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/tickets" className={`bottom-nav-item ${isActive('/tickets') ? 'active' : ''}`}>
                    <FaTicketAlt size={22} />
                    <span>Records</span>
                </Link>
                <Link to="/new-ticket" className="bottom-nav-item plus-item">
                    <div className="plus-btn text-white">
                        <FaPlus size={22} />
                    </div>
                </Link>
                {user.role === 'admin' ? (
                    <Link to="/admin" className={`bottom-nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <FaThLarge size={22} />
                        <span>Admin</span>
                    </Link>
                ) : (
                    <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
                        <FaQuestionCircle size={22} />
                        <span>Support</span>
                    </Link>
                )}
                <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
                    <FaUser size={22} />
                    <span>Account</span>
                </Link>
            </div>
        </div>
    );
}

export default BottomNav;
