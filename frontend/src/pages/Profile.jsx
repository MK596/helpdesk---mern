import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import BackButton from '../components/BackButton';
import { FaUserCircle, FaEnvelope, FaShieldAlt, FaIdBadge, FaCheckCircle } from 'react-icons/fa';

function Profile() {
    const { user } = useContext(AuthContext);
    const [formData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const { name, email } = formData;

    return (
        <div className="container py-3 py-md-4">
            {/* Optimized Header Area */}
            <div className="mb-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                    <div>
                        <nav aria-label="breadcrumb" className="mb-1 d-none d-sm-block">
                            <ol className="breadcrumb small text-uppercase fw-bold m-0 p-0" style={{ letterSpacing: '0.05em' }}>
                                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                                <li className="breadcrumb-item active text-primary" aria-current="page">Settings</li>
                            </ol>
                        </nav>
                        <h3 className="fw-black mb-0 letter-spacing-tight fs-2">
                            Account Profile
                        </h3>
                        <p className="text-muted small mb-0 fw-bold d-sm-none text-uppercase opacity-75" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>User Identity</p>
                    </div>
                    <div className="d-flex gap-2 w-100 w-sm-auto">
                        <BackButton url="/" className="flex-grow-1 flex-sm-grow-0" />
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 bg-white">
                        <div className="card-header bg-primary text-white p-3 border-0 d-flex align-items-center gap-2">
                            <FaUserCircle className="fs-5" />
                            <h6 className="fw-black mb-0 text-uppercase small" style={{ letterSpacing: '0.05em' }}>Personal Information</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="small fw-black text-muted text-uppercase d-block mb-2" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Full Name</label>
                                <div className="bg-light p-3 rounded-4 border-0 d-flex align-items-center gap-3">
                                    <FaIdBadge className="text-primary opacity-50" />
                                    <span className="fw-black text-dark">{name}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="small fw-black text-muted text-uppercase d-block mb-2" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Email Address</label>
                                <div className="bg-light p-3 rounded-4 border-0 d-flex align-items-center gap-3">
                                    <FaEnvelope className="text-primary opacity-50" />
                                    <span className="fw-black text-dark">{email}</span>
                                </div>
                            </div>

                            <div>
                                <label className="small fw-black text-muted text-uppercase d-block mb-2" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Role Status</label>
                                <div className={`p-3 rounded-4 border-0 d-flex align-items-center justify-content-between ${user?.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-light text-dark'}`}>
                                    <div className="d-flex align-items-center gap-3">
                                        <FaShieldAlt className={user?.role === 'admin' ? 'text-primary' : 'text-muted'} />
                                        <span className="fw-black text-uppercase">{user?.role}</span>
                                    </div>
                                    {user?.role === 'admin' && <FaCheckCircle className="text-primary" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card shadow-sm border-0 rounded-4 p-4 h-100 bg-white">
                        <h6 className="fw-black mb-4 d-flex align-items-center gap-2 text-uppercase small" style={{ letterSpacing: '0.05em' }}>
                            <FaShieldAlt className="text-primary" /> Permissions
                        </h6>

                        {user?.role === 'admin' ? (
                            <div className="text-center py-4 bg-primary bg-opacity-5 rounded-4 mb-4">
                                <div className="bg-primary text-white rounded-circle d-inline-flex p-3 mb-3 shadow-sm">
                                    <FaCheckCircle size={28} />
                                </div>
                                <h6 className="fw-black mb-1">Administrative Level</h6>
                                <p className="small text-muted mb-0 px-3">You have complete access to system controls and user management.</p>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-light rounded-4 mb-4">
                                <div className="bg-white text-muted rounded-circle d-inline-flex p-3 mb-3 shadow-sm border">
                                    <FaShieldAlt size={28} />
                                </div>
                                <h6 className="fw-black mb-1">Standard Access</h6>
                                <p className="small text-muted mb-0 px-3">Authorized for personal support request management only.</p>
                            </div>
                        )}

                        <div className="mt-auto pt-3">
                            <div className="p-3 rounded-4 bg-light border-0">
                                <div className="d-flex gap-3">
                                    <FaCheckCircle className="text-success mt-1" size={14} />
                                    <div className="text-muted fw-bold" style={{ fontSize: '11px', lineHeight: '1.5' }}>
                                        Account secured with active JWT encryption. All operations are logged.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
