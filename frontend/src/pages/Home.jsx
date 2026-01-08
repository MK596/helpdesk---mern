import { Link } from 'react-router-dom';
import { FaPlus, FaTicketAlt, FaUserShield, FaArrowRight, FaSearch, FaBolt, FaQuestionCircle, FaShieldAlt } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function Home() {
    const { user } = useContext(AuthContext);
    const [activeCount, setActiveCount] = useState(0);

    useEffect(() => {
        const fetchTicketCount = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get('/api/tickets', config);
                const active = response.data.filter(t => t.status === 'Open' || t.status === 'In Progress');
                setActiveCount(active.length);
            } catch (error) {
                console.error('Failed to fetch ticket count');
            }
        };

        if (user) {
            fetchTicketCount();
        }
    }, [user]);

    return (
        <div className="home-wrapper">
            {/* Hero Section */}
            <header className="hero-section py-5 mb-5 position-relative overflow-hidden text-center">
                <div className="container position-relative z-1">
                    <div className="mb-4 d-inline-block">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold letter-spacing-tight d-flex align-items-center gap-2 mx-auto" style={{ width: 'fit-content' }}>
                            <FaShieldAlt size={14} /> Official Support Portal
                        </span>
                    </div>
                    <h1 className="display-4 fw-black mb-3 text-gradient">How can we help today?</h1>
                    <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
                        {user ? (
                            <>Welcome back, <span className="fw-bold text-primary">{user.name}</span>. Track resolution progress or start a new conversation with our experts.</>
                        ) : (
                            <>The fastest way to resolve your technical issues. Sign in to access your personalized support dashboard.</>
                        )}
                    </p>
                    {!user && (
                        <div className="d-flex justify-content-center gap-3">
                            <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill shadow hover-translate transition-all">
                                Get Started
                            </Link>
                            <Link to="/register" className="btn btn-outline-dark px-4 py-2 rounded-pill hover-translate transition-all">
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
                {/* Subtle Decorative Elements */}
                <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, #065f46 0%, transparent 70%)' }}></div>
            </header>

            <div className="container">
                {/* User Action Cards */}
                {user && (
                    <div className="row justify-content-center g-3 g-md-4 mb-5">
                        <div className="col-12 col-md-5">

                            <div className="card h-100 border-0 glass-card p-4 hover-translate hover-glow transition-all rounded-4 shadow-sm">
                                <div className="d-flex align-items-start gap-4">
                                    <div className="bg-gradient-primary text-white p-3 rounded-4 shadow-sm">
                                        <FaPlus className="fs-3" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="fw-bold mb-2">Create Ticket</h4>
                                        <p className="text-muted small mb-4">Submit a new request and get technical assistance within minutes.</p>
                                        <Link to="/new-ticket" className="btn btn-primary btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2 w-fit-content">
                                            Open New <FaArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-5">

                            <div className="card h-100 border-0 glass-card p-4 hover-translate hover-glow transition-all rounded-4 shadow-sm position-relative">
                                {activeCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-3 border-white shadow" style={{ fontSize: '10px', zIndex: 1, padding: '6px 8px' }}>
                                        {activeCount} PENDING
                                    </span>
                                )}
                                <div className="d-flex align-items-start gap-4">
                                    <div className="bg-dark text-white p-3 rounded-4 shadow-sm">
                                        <FaTicketAlt className="fs-3" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h4 className="fw-bold mb-2">My History</h4>
                                        <p className="text-muted small mb-4">View your submitted tickets, track status and read team replies.</p>
                                        <Link to="/tickets" className="btn btn-outline-dark btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2 w-fit-content">
                                            View Archive <FaArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Alert for Users */}
                {user && user.role !== 'admin' && activeCount > 0 && (
                    <div className="row justify-content-center mb-5">
                        <div className="col-md-10">
                            <div className="alert border-0 bg-primary bg-opacity-10 d-flex align-items-center gap-3 p-4 rounded-4">
                                <div className="bg-primary text-white p-2 rounded-circle">
                                    <FaSearch size={14} />
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1 text-primary">In-Review Processing</h6>
                                    <p className="small mb-0 text-main opacity-75">
                                        You have <strong>{activeCount} active ticket(s)</strong>. Our specialized support team is currently investigating your requests.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Admin Portal Section */}
                {user && user.role === 'admin' && (
                    <div className="row justify-content-center mb-5">
                        <div className="col-md-10">
                            <div className="card border-0 bg-dark text-white p-4 p-lg-5 rounded-4 rounded-lg-5 overflow-hidden position-relative shadow-lg">

                                <div className="position-relative z-1 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
                                    <div className="text-center text-lg-start">
                                        <div className="badge bg-primary px-3 py-1 rounded-pill mb-3 small fw-bold">SYSTEM ADMIN</div>
                                        <h2 className="fw-black mb-2">Administrator Console</h2>
                                        <p className="opacity-75 mb-0 lead small">Complete control over tickets, user accounts, and system health.</p>
                                    </div>
                                    <Link to="/admin" className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold text-main hover-translate transition-all d-flex align-items-center gap-3">
                                        Launch Dashboard <FaBolt className="text-primary" />
                                    </Link>
                                </div>
                                {/* Abstract Background Decor */}
                                <div className="position-absolute top-50 start-0 translate-middle-y opacity-10 ms-n5">
                                    <FaUserShield size={200} />
                                </div>
                                <div className="position-absolute top-0 end-0 p-5 mt-n5 me-n5 opacity-10">
                                    <FaBolt size={150} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Support Info Grid for Guests */}
                {!user && (
                    <div className="row g-4 mb-5">
                        <div className="col-md-4">
                            <div className="text-center p-4">
                                <FaBolt className="text-primary fs-1 mb-3" />
                                <h5 className="fw-bold">Fast Response</h5>
                                <p className="text-muted small">Our average response time for critical issues is under 2 hours.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-4">
                                <FaShieldAlt className="text-primary fs-1 mb-3" />
                                <h5 className="fw-bold">Secure Portal</h5>
                                <p className="text-muted small">Your data and tickets are protected with enterprise-grade security.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-4">
                                <FaQuestionCircle className="text-primary fs-1 mb-3" />
                                <h5 className="fw-bold">Expert Support</h5>
                                <p className="text-muted small">Direct access to our senior engineering and support team.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Home;
