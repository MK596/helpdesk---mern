import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { FaUserShield, FaClock, FaCheckCircle, FaExclamationCircle, FaTrash, FaUserEdit, FaInfoCircle, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function Ticket() {
    const [ticket, setTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [adminReply, setAdminReply] = useState('');
    const [status, setStatus] = useState('');

    // Edit states for user
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPriority, setEditPriority] = useState('');

    const { user } = useContext(AuthContext);
    const { ticketId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get(`/api/tickets/${ticketId}`, config);
                setTicket(response.data);
                setAdminReply(response.data.adminReply || '');
                setStatus(response.data.status);

                // Pre-fill edit states
                setEditTitle(response.data.title);
                setEditDescription(response.data.description);
                setEditPriority(response.data.priority);

                setIsLoading(false);
            } catch (error) {
                console.error('Fetch ticket error:', error);
                toast.error('Could not fetch ticket details');
                setIsLoading(false);
            }
        };

        if (user) {
            fetchTicket();
        }
    }, [user, ticketId]);

    const onAdminUpdate = async (e) => {
        e.preventDefault();
        if (user.role !== 'admin') return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const updatedData = { status, adminReply };
            const response = await axios.put(`/api/tickets/${ticketId}`, updatedData, config);
            setTicket(response.data);
            toast.success(`Updated: ${status}`);
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Update failed');
        }
    }

    const onUserUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const updatedData = {
                title: editTitle,
                description: editDescription,
                priority: editPriority
            };
            const response = await axios.put(`/api/tickets/${ticketId}`, updatedData, config);
            setTicket(response.data);
            setIsEditing(false);
            toast.success('Ticket updated');
        } catch (error) {
            console.error('User update error:', error);
            toast.error('Failed to update ticket');
        }
    }

    const onDelete = async () => {
        if (!window.confirm('Delete this record forever? This action cannot be undone.')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`/api/tickets/${ticketId}`, config);
            toast.success('Record Permanently Deleted');

            // Navigate based on role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/tickets');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Deletion error');
        }
    }

    const onTicketClose = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`/api/tickets/${ticketId}`, { status: 'Closed' }, config);
            setTicket({ ...ticket, status: 'Closed' });
            setStatus('Closed');
            toast.success('Ticket closed');
            if (user.role !== 'admin') navigate('/tickets');
        } catch (error) {
            console.error('Close ticket error:', error);
            toast.error('Error closing ticket');
        }
    }

    if (isLoading) return <Spinner />;

    if (!ticket) {
        return (
            <div className='container py-5 text-center'>
                <FaExclamationCircle className='text-danger fs-2 mb-3' />
                <h4 className='fw-black'>Ticket Not Found</h4>
                <p className="text-muted small">This record might have been deleted or moved.</p>
                <BackButton url='/' className="mt-4 mx-auto" />
            </div>
        );
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Open': return 'bg-primary';
            case 'In Progress': return 'bg-warning text-main';
            case 'Resolved': return 'bg-success';
            case 'Closed': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="container py-3 py-md-4">
            <div className="row justify-content-center">
                <div className="col-12">
                    {/* Professional Header */}
                    <header className="mb-4">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                            <div className="w-100">
                                <nav aria-label="breadcrumb" className="mb-2 d-none d-sm-block">
                                    <ol className="breadcrumb small text-uppercase fw-bold m-0 p-0" style={{ letterSpacing: '0.05em' }}>
                                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                                        <li className="breadcrumb-item"><Link to={user.role === 'admin' ? '/admin' : '/tickets'} className="text-decoration-none text-muted">{user.role === 'admin' ? 'Dashboard' : 'Records'}</Link></li>
                                        <li className="breadcrumb-item active text-primary" aria-current="page">Case #{ticket._id.slice(-6).toUpperCase()}</li>
                                    </ol>
                                </nav>
                                <div className="d-flex align-items-center gap-3">
                                    <BackButton url={user.role === 'admin' ? '/admin' : '/tickets'} className="m-0" />
                                    <h3 className="fw-black mb-0 letter-spacing-tight fs-2 flex-grow-1">{ticket.title}</h3>
                                </div>
                                <div className="d-flex align-items-center gap-2 mt-2">
                                    <span className={`status-badge text-white rounded-pill px-3 py-1 fw-black ${getStatusClass(ticket.status)}`} style={{ fontSize: '9px' }}>{ticket.status.toUpperCase()}</span>
                                    <span className="text-muted font-monospace" style={{ fontSize: '10px' }}>ID: {ticket._id.toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="d-flex gap-2 w-100 w-sm-auto">
                                {user.role !== 'admin' && !isEditing && ticket.status !== 'Closed' && (
                                    <>
                                        <button onClick={() => setIsEditing(true)} className="btn btn-dark btn-sm rounded-pill px-4 py-2 fw-black d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-sm-grow-0 shadow-sm border-0">
                                            <FaEdit size={12} /> <span className="small">EDIT</span>
                                        </button>
                                        <button onClick={onTicketClose} className="btn btn-light border btn-sm rounded-pill px-4 py-2 fw-black d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-sm-grow-0 shadow-sm">
                                            <span className="small">CLOSE</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="row g-3">
                        <div className="col-lg-8">
                            {/* Request Info */}
                            {isEditing ? (
                                <div className="card border-0 shadow-sm p-4 mb-3 rounded-4 bg-white">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-black mb-0">Edit Details</h5>
                                        <button onClick={() => setIsEditing(false)} className="btn btn-link text-muted p-0 text-decoration-none">
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <form onSubmit={onUserUpdate}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>Title</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm rounded-3 px-3 py-2"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>Priority</label>
                                            <select
                                                className="form-select form-select-sm rounded-3 px-3 py-2"
                                                value={editPriority}
                                                onChange={(e) => setEditPriority(e.target.value)}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>Description</label>
                                            <textarea
                                                className="form-control form-control-sm rounded-3 px-3 py-2"
                                                rows="5"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-black shadow-sm d-flex align-items-center gap-2">
                                                <FaSave /> SAVE CHANGES
                                            </button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-light btn-sm rounded-pill px-4 py-2 fw-black">
                                                CANCEL
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-3">
                                        <div className="d-flex align-items-center gap-3 mb-4">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm fw-black" style={{ width: '45px', height: '45px', fontSize: '18px' }}>
                                                {ticket.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="fw-black text-dark lh-1 mb-1" style={{ fontSize: '16px' }}>{ticket.user?.name}</div>
                                                <div className="text-muted small fw-bold opacity-75">{new Date(ticket.createdAt).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-light rounded-4 border-0">
                                            <p className="small mb-0 whitespace-pre-wrap lh-lg" style={{ fontSize: '14px', color: '#1e293b' }}>{ticket.description}</p>
                                        </div>
                                        <div className="mt-4 d-flex align-items-center gap-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="small fw-black text-uppercase text-muted" style={{ fontSize: '9px' }}>Priority:</span>
                                                <span className={`badge rounded-pill px-3 py-1 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10' : 'text-success bg-success bg-opacity-10'}`} style={{ fontSize: '9px' }}>
                                                    {ticket.priority.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Response Section */}
                                    <div className={`card border-0 shadow-sm p-4 rounded-4 ${ticket.adminReply ? 'bg-primary bg-opacity-5 border-start border-4 border-primary' : 'bg-white'}`}>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div className="bg-primary text-white rounded p-1 d-flex align-items-center">
                                                <FaUserShield size={14} />
                                            </div>
                                            <div className="fw-black small text-primary text-uppercase" style={{ letterSpacing: '0.05em' }}>Support Response</div>
                                        </div>

                                        {ticket.adminReply ? (
                                            <div className="p-3 bg-white rounded-3 shadow-sm border">
                                                <p className="small mb-0 text-dark lh-lg" style={{ fontSize: '14px' }}>{ticket.adminReply}</p>
                                                <div className="mt-3 text-success fw-black small text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                                                    <FaCheckCircle /> RESOLVED
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 bg-light rounded-3">
                                                <FaClock className="text-muted opacity-25 mb-2" size={30} />
                                                <p className="small text-muted fw-black text-uppercase mb-0" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Awaiting Support Review</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-lg-4">
                            {user.role === 'admin' ? (
                                <div className="card bg-dark text-white border-0 shadow-lg p-4 rounded-4 position-sticky" style={{ top: '20px' }}>
                                    <h5 className="fw-black mb-4 d-flex align-items-center gap-2">
                                        <FaUserEdit className="text-primary" /> System Control
                                    </h5>
                                    <form onSubmit={onAdminUpdate}>
                                        <div className="mb-4">
                                            <label className="form-label small fw-black text-uppercase text-white-50" style={{ fontSize: '10px' }}>Status</label>
                                            <select
                                                className="form-select form-select-sm bg-white bg-opacity-10 border-0 text-white shadow-none rounded-3 py-2"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option className="text-dark" value="Open">Open</option>
                                                <option className="text-dark" value="In Progress">In Progress</option>
                                                <option className="text-dark" value="Resolved">Resolved</option>
                                                <option className="text-dark" value="Closed">Closed</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label small fw-black text-uppercase text-white-50" style={{ fontSize: '10px' }}>Admin Response</label>
                                            <textarea
                                                className="form-control form-control-sm bg-white bg-opacity-10 border-0 text-white shadow-none rounded-3 py-2"
                                                rows="5"
                                                value={adminReply}
                                                onChange={(e) => setAdminReply(e.target.value)}
                                                placeholder="Enter response for consumer..."
                                            ></textarea>
                                        </div>
                                        <button className="btn btn-primary w-100 rounded-pill py-2 fw-black shadow-sm mb-3">
                                            SAVE CHANGES
                                        </button>
                                        <button type="button" onClick={onDelete} className="btn btn-link text-danger w-100 fw-black text-decoration-none small" style={{ fontSize: '10px' }}>
                                            <FaTrash className="me-1" /> PERMANENT DELETE
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="card bg-light border-0 shadow-sm p-4 rounded-4">
                                    <h6 className="fw-black mb-3 d-flex align-items-center gap-2">
                                        <FaInfoCircle className="text-primary" /> Help Center
                                    </h6>
                                    <p className="small text-muted mb-0 lh-lg">This request is currently under review by our operations team. You will receive an automated notification once we provide a resolution.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ticket;
