import { FaSignInAlt, FaSignOutAlt, FaUser, FaLock, FaLifeRing } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    // Local state for scroll effect
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar border-bottom sticky-top py-2 py-sm-3 header-nav transition-all ${scrolled ? 'scrolled shadow-sm' : ''}`}>
            <div className="container d-flex align-items-center justify-content-between px-3 px-sm-4">
                <Link className="navbar-brand d-flex align-items-center gap-1 gap-sm-2 text-primary" to="/">
                    <FaLifeRing className="fs-5 fs-sm-4" />
                    <span className="fw-black" style={{ fontSize: 'clamp(0.9rem, 4.5vw, 1.25rem)', letterSpacing: '-0.02em' }}>HELPDESK</span>
                </Link>

                <div className="ms-auto">
                    <ul className="navbar-nav flex-row align-items-center gap-2 gap-sm-4">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <li className="nav-item d-none d-md-inline">
                                        <Link className="nav-link d-flex align-items-center gap-1 fw-bold px-1" to="/admin">
                                            <FaLock size={14} /> <span>Admin</span>
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item d-none d-md-inline">
                                    <Link className="nav-link d-flex align-items-center gap-1 fw-bold px-1" to="/profile">
                                        <FaUser size={14} /> <span>Profile</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center border-0 bg-danger bg-opacity-10 text-danger rounded-circle p-2" onClick={onLogout} title="Logout" style={{ width: '34px', height: '34px' }}>
                                        <FaSignOutAlt size={14} />
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link d-flex align-items-center gap-1 fw-bold px-1" to="/login">
                                        <FaSignInAlt size={15} /> <span style={{ fontSize: '0.9rem' }}>Login</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3 shadow-sm border-0" to="/register">
                                        <FaUser size={13} /> <span style={{ fontSize: '0.9rem' }}>Register</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
