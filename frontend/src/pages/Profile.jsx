import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaShieldAlt, FaIdBadge, FaCheckCircle, FaUserShield } from 'react-icons/fa';

function Profile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const { name, email } = formData;

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
                        <div>
                            <nav aria-label="breadcrumb" className="mb-2">
                                <ol className="breadcrumb small text-uppercase fw-bold m-0 p-0" style={{ letterSpacing: '0.05em' }}>
                                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                                    <li className="breadcrumb-item active text-primary" aria-current="page">User Settings</li>
                                </ol>
                            </nav>
                            <h4 className="fw-bold mb-0">Account Profile</h4>
                        </div>
                        <Link to="/" className="btn btn-outline-primary btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                            <FaIdBadge /> RETURN TO DASHBOARD
                        </Link>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-7">
                            <div className="card shadow-sm h-100 overflow-hidden">
                                <div className="card-header bg-primary text-white p-3 border-0 d-flex align-items-center gap-2">
                                    <FaUserCircle className="fs-5" />
                                    <h6 className="fw-bold mb-0">Personal Information</h6>
                                </div>
                                <div className="card-body p-3">
                                    <div className="mb-3">
                                        <label className="small fw-bold text-muted text-uppercase d-block mb-1" style={{ fontSize: '9px' }}>Full Name</label>
                                        <div className="bg-light p-2 rounded border small d-flex align-items-center gap-2">
                                            <FaIdBadge className="text-primary opacity-50" />
                                            <span className="fw-bold">{name}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="small fw-bold text-muted text-uppercase d-block mb-1" style={{ fontSize: '9px' }}>Email Address</label>
                                        <div className="bg-light p-2 rounded border small d-flex align-items-center gap-2">
                                            <FaEnvelope className="text-primary opacity-50" />
                                            <span className="fw-bold">{email}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="small fw-bold text-muted text-uppercase d-block mb-1" style={{ fontSize: '9px' }}>Role Status</label>
                                        <div className={`p-2 rounded border small d-flex align-items-center justify-content-between ${user?.role === 'admin' ? 'bg-primary bg-opacity-10 border-primary text-primary' : 'bg-light'}`}>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaShieldAlt />
                                                <span className="fw-bold text-uppercase">{user?.role}</span>
                                            </div>
                                            {user?.role === 'admin' && <FaCheckCircle />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="card shadow-sm p-3 h-100">
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <FaShieldAlt className="text-primary" /> Permissions
                                </h6>

                                {user?.role === 'admin' ? (
                                    <div className="text-center py-3">
                                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3 mb-2">
                                            <FaCheckCircle size={24} />
                                        </div>
                                        <h6 className="fw-bold mb-1">Admin Access</h6>
                                        <p className="small text-muted mb-0">Global management enabled.</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-3">
                                        <div className="bg-light text-muted rounded-circle d-inline-flex p-3 mb-2">
                                            <FaShieldAlt size={24} />
                                        </div>
                                        <h6 className="fw-bold mb-1">Standard Access</h6>
                                        <p className="small text-muted mb-0">Limited to personal ticket management.</p>
                                    </div>
                                )}

                                <hr className="my-3 opacity-10" />

                                <div className="p-2 rounded bg-light small">
                                    <div className="d-flex gap-2">
                                        <FaCheckCircle className="text-success mt-1" size={12} />
                                        <div className="text-muted" style={{ fontSize: '10px' }}>
                                            Account is secured with session-based JWT encryption.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
