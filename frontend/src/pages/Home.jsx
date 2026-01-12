import { Link } from 'react-router-dom';
import { FaPlus, FaTicketAlt, FaUserShield, FaArrowRight, FaSearch, FaBolt, FaQuestionCircle, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
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
                console.error('Failed to fetch ticket count:', error);
            }
        };

        if (user) {
            fetchTicketCount();
        }
    }, [user]);

    return (
        <div className="home-wrapper">
            {/* Hero Section - Compact Mobile */}
            <header className="hero-section py-2 py-md-5 mb-3 mb-md-5 position-relative overflow-hidden text-center">
                <div className="container position-relative z-1">
                    <div className="mb-2 mb-md-3 d-none d-sm-inline-block">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold letter-spacing-tight d-flex align-items-center gap-2 mx-auto" style={{ width: 'fit-content' }}>
                            <FaShieldAlt size={14} /> Official Support Portal
                        </span>
                    </div>
                    <h1 className="fw-black mb-2 mb-md-3 text-gradient" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>How can we help today?</h1>
                    <p className="text-muted mx-auto mb-3 mb-md-4 px-2 d-none d-sm-block" style={{ maxWidth: '600px', fontSize: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
                        {user ? (
                            <>Welcome back, <span className="fw-bold text-primary">{user.name}</span>. Track resolution progress or start a new conversation with our experts.</>
                        ) : (
                            <>The fastest way to resolve your technical issues. Sign in to access your personalized support dashboard.</>
                        )}
                    </p>
                    <p className="text-muted mx-auto mb-3 px-2 d-sm-none small">
                        {user ? (
                            <>Welcome back, <span className="fw-bold text-primary">{user.name}</span>!</>
                        ) : (
                            <>Quick support access. Sign in to get started.</>
                        )}
                    </p>
                    {!user && (
                        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3 px-4 px-sm-0">
                            <Link to="/login" className="btn btn-primary px-3 px-sm-4 py-2 rounded-pill shadow hover-translate transition-all">
                                Get Started
                            </Link>
                            <Link to="/register" className="btn btn-outline-dark px-3 px-sm-4 py-2 rounded-pill hover-translate transition-all">
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
                    <div className="row justify-content-center g-3 g-md-4 mb-5 px-1 px-md-0">
                        <div className="col-12 col-md-5">

                            <div className="card h-100 border-0 glass-card p-3 p-md-4 hover-translate hover-glow transition-all rounded-4 shadow-sm">
                                <div className="d-flex align-items-center gap-3 gap-md-4">
                                    <div className="bg-gradient-primary text-white p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-center" style={{ minWidth: '60px', height: '60px' }}>
                                        <FaPlus className="fs-3" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold mb-1">Create Ticket</h5>
                                        <p className="text-muted small mb-3 mb-md-4 d-none d-sm-block">Submit a new request and get technical assistance within minutes.</p>
                                        <Link to="/new-ticket" className="btn btn-primary btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2 w-fit-content shadow-sm">
                                            Open New <FaArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-5">

                            <div className="card h-100 border-0 glass-card p-3 p-md-4 hover-translate hover-glow transition-all rounded-4 shadow-sm position-relative">
                                {activeCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-3 border-white shadow" style={{ fontSize: '9px', zIndex: 1, padding: '5px 7px' }}>
                                        {activeCount}
                                    </span>
                                )}
                                <div className="d-flex align-items-center gap-3 gap-md-4">
                                    <div className="bg-dark text-white p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-center" style={{ minWidth: '60px', height: '60px' }}>
                                        <FaTicketAlt className="fs-3" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold mb-1">My History</h5>
                                        <p className="text-muted small mb-3 mb-md-4 d-none d-sm-block">View your submitted tickets, track status and read team replies.</p>
                                        <Link to="/tickets" className="btn btn-outline-dark btn-sm rounded-pill px-4 fw-bold d-flex align-items-center gap-2 w-fit-content border-0 bg-light">
                                            View Records <FaArrowRight size={12} />
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
                            <div className="card border-0 bg-dark text-white p-4 p-md-5 rounded-4 rounded-lg-5 overflow-hidden position-relative shadow-lg">

                                <div className="position-relative z-1 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
                                    <div className="text-center text-lg-start">
                                        <div className="badge bg-primary px-3 py-1 rounded-pill mb-2 small fw-bold">SYSTEM ADMIN</div>
                                        <h2 className="fw-black mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>Admin Dashboard</h2>
                                        <p className="opacity-75 mb-0 lead small">Complete control over tickets, user accounts, and system health.</p>
                                    </div>
                                    <Link to="/admin" className="btn btn-light btn-lg px-4 py-3 rounded-pill fw-bold text-main hover-translate transition-all d-flex align-items-center justify-content-center gap-3 w-100 w-lg-auto">
                                        Go to Dashboard <FaBolt className="text-primary" />
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
                {/* Getting Started Guide */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-10">
                        <div className="mb-4 text-center">
                            <h3 className="fw-black text-gradient">How it Works</h3>
                            <p className="text-muted small">Follow these simple steps to get the most out of our support platform</p>
                        </div>
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100 text-center p-4 rounded-4 bg-white">
                                    <div className="bg-primary text-white p-3 rounded-circle mx-auto mb-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaPlus size={24} />
                                    </div>
                                    <h6 className="fw-bold mb-2">1. Create a Ticket</h6>
                                    <p className="text-muted small mb-0">
                                        Click <strong>"Create Ticket"</strong> after logging in. Fill out the subject, priority level, and a detailed description of your technical issue.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100 text-center p-4 rounded-4 bg-white">
                                    <div className="bg-primary text-white p-3 rounded-circle mx-auto mb-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaSearch size={22} />
                                    </div>
                                    <h6 className="fw-bold mb-2">2. Track Progress</h6>
                                    <p className="text-muted small mb-0">
                                        Visit <strong>"My History"</strong> to see all your active records. Click on any ticket to see the <strong>"Support Response"</strong> from our expert team.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100 text-center p-4 rounded-4 bg-white">
                                    <div className="bg-primary text-white p-3 rounded-circle mx-auto mb-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaCheckCircle size={24} />
                                    </div>
                                    <h6 className="fw-bold mb-2">3. Resolve & Close</h6>
                                    <p className="text-muted small mb-0">
                                        Once our team provides a solution, verify it works and then click <strong>"Close Ticket"</strong> to archive the conversation and keep your history clean.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Guidelines & Terms */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-10">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-header bg-light border-0 py-3 px-4">
                                <h5 className="fw-black mb-0 d-flex align-items-center gap-2">
                                    <FaQuestionCircle className="text-primary" /> Usage Guidelines & Terms
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-primary mb-2">1. Account Responsibility</h6>
                                        <p className="text-muted small">
                                            Users are responsible for maintaining the confidentiality of their account credentials.
                                            Contact administrators immediately if you suspect unauthorized access.
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-primary mb-2">2. Ticket Submission</h6>
                                        <p className="text-muted small">
                                            Please provide detailed descriptions and accurate priority levels for all requests.
                                            One issue per ticket helps our team resolve your problems faster.
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-primary mb-2">3. Professional Conduct</h6>
                                        <p className="text-muted small">
                                            Our support staff is here to help. We maintain a zero-tolerance policy for
                                            harassment or abusive language in ticket communications.
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-primary mb-2">4. Resolution Policy</h6>
                                        <p className="text-muted small">
                                            Tickets are processed based on priority and submission time.
                                            Closing a ticket signifies your issue has been successfully resolved.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-top">
                                    <p className="text-center text-muted small mb-0 font-italic">
                                        By using this platform, you agree to follow these guidelines to ensure a productive support environment for everyone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;
