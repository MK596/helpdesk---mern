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
        <nav
            className={`navbar border-bottom sticky-top header-nav transition-all ${scrolled ? 'scrolled shadow-sm' : ''}`}
            style={{
                paddingTop: 'clamp(0.15rem, 2vw, 0.75rem)',
                paddingBottom: 'clamp(0.15rem, 2vw, 0.75rem)'
            }}
        >
            <div className="container d-flex align-items-center justify-content-between px-2 px-sm-4">
                <Link className="navbar-brand d-flex align-items-center gap-1 gap-sm-2 text-primary m-0 p-0" to="/">
                    <FaLifeRing className="d-none d-sm-inline" style={{ fontSize: '1.25rem' }} />
                    <FaLifeRing className="d-sm-none" style={{ fontSize: '0.75rem' }} />
                    <span className="fw-black" style={{ fontSize: 'clamp(0.75rem, 3vw, 1.25rem)', letterSpacing: '-0.02em' }}>HELPDESK</span>
                </Link>

                <div className="ms-auto">
                    <ul className="navbar-nav flex-row align-items-center gap-1 gap-sm-4 m-0">
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
                                    <button
                                        className="btn btn-outline-danger d-flex align-items-center justify-content-center border-0 bg-danger bg-opacity-10 text-danger rounded-circle"
                                        onClick={onLogout}
                                        title="Logout"
                                        style={{
                                            width: 'clamp(24px, 5vw, 34px)',
                                            height: 'clamp(24px, 5vw, 34px)',
                                            padding: '0.2rem'
                                        }}
                                    >
                                        <FaSignOutAlt size={window.innerWidth < 768 ? 10 : 14} />
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link d-flex align-items-center gap-1 fw-bold p-0 px-sm-1" to="/login">
                                        <FaSignInAlt size={window.innerWidth < 768 ? 12 : 15} />
                                        <span className="d-none d-sm-inline" style={{ fontSize: '0.9rem' }}>Login</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="btn btn-primary d-flex align-items-center gap-1 shadow-sm border-0"
                                        to="/register"
                                        style={{
                                            padding: 'clamp(0.2rem, 1vw, 0.5rem) clamp(0.4rem, 2vw, 1rem)',
                                            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)'
                                        }}
                                    >
                                        <FaUser size={window.innerWidth < 768 ? 10 : 13} /> <span>Register</span>
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
