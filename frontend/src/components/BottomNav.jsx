import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTicketAlt, FaPlus, FaUser, FaLock } from 'react-icons/fa';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function BottomNav() {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bottom-nav d-md-none fixed-bottom bg-white border-top shadow-lg px-3 py-2">
            <div className="d-flex justify-content-around align-items-center">
                <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
                    <FaHome size={20} />
                    <span>Home</span>
                </Link>
                <Link to="/tickets" className={`bottom-nav-item ${isActive('/tickets') ? 'active' : ''}`}>
                    <FaTicketAlt size={20} />
                    <span>Tickets</span>
                </Link>
                <Link to="/new-ticket" className="bottom-nav-item plus-item">
                    <div className="plus-btn bg-primary text-white shadow">
                        <FaPlus size={20} />
                    </div>
                </Link>
                <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
                    <FaUser size={20} />
                    <span>Profile</span>
                </Link>
                {user.role === 'admin' && (
                    <Link to="/admin" className={`bottom-nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <FaLock size={20} />
                        <span>Admin</span>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default BottomNav;
