import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { FaUserShield, FaClock, FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaTrash, FaUserEdit, FaInfoCircle, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

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
            toast.error('Error closing ticket');
        }
    }

    if (isLoading) return <Spinner />;

    if (!ticket) {
        return (
            <div className='container py-4 text-center'>
                <FaExclamationCircle className='text-danger fs-2 mb-3' />
                <h4 className='fw-bold'>Ticket Not Found</h4>
                <BackButton url='/' />
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
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-12">

                    <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <BackButton url={user.role === 'admin' ? '/admin' : '/tickets'} />
                            <div className="d-flex align-items-center gap-2 mt-3">
                                <span className={`status-badge text-white ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                                <span className="small text-muted">ID: {ticket._id.toUpperCase().slice(-8)}</span>
                            </div>
                            <h3 className="fw-bold mt-2 mb-0">{ticket.title}</h3>
                        </div>

                        <div className="d-flex gap-2">
                            {user.role !== 'admin' && !isEditing && (
                                <>
                                    {ticket.status !== 'Closed' && (
                                        <>
                                            <button onClick={() => setIsEditing(true)} className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-2">
                                                <FaEdit /> EDIT DETAILS
                                            </button>
                                            <button onClick={onTicketClose} className="btn btn-outline-warning btn-sm fw-bold">
                                                CLOSE TICKET
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </header>

                    <div className="row g-3">
                        <div className="col-lg-8">
                            {/* Request Info */}
                            {isEditing ? (
                                <div className="card border shadow-sm p-4 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold mb-0">Edit Ticket Details</h5>
                                        <button onClick={() => setIsEditing(false)} className="btn btn-link text-muted p-0 text-decoration-none">
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <form onSubmit={onUserUpdate}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>Ticket Title</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '9px' }}>Priority Level</label>
                                            <select
                                                className="form-select form-select-sm"
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
                                                className="form-control form-control-sm"
                                                rows="5"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary btn-sm fw-bold px-4 d-flex align-items-center gap-2">
                                                <FaSave /> SAVE CHANGES
                                            </button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-light btn-sm fw-bold px-4">
                                                CANCEL
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    <div className="card border shadow-sm p-3 mb-3">
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div className="bg-dark text-white rounded px-2 py-1 fw-bold small">
                                                {ticket.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="fw-bold small">{ticket.user?.name}</div>
                                            <div className="ms-auto small text-muted font-monospace" style={{ fontSize: '10px' }}>
                                                {new Date(ticket.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-light rounded-2 border">
                                            <p className="small mb-0 whitespace-pre-wrap">{ticket.description}</p>
                                        </div>
                                        <div className="mt-2 small fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>
                                            Priority: <span className={ticket.priority === 'High' ? 'text-danger' : 'text-success'}>{ticket.priority}</span>
                                        </div>
                                    </div>

                                    {/* Response Info */}
                                    <div className={`card border shadow-sm p-3 ${ticket.adminReply ? 'border-start border-4 border-success' : ''}`}>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div className="bg-success text-white rounded p-1">
                                                <FaUserShield size={14} />
                                            </div>
                                            <div className="fw-bold small text-success">Support Response</div>
                                        </div>

                                        {ticket.adminReply ? (
                                            <div className="p-3 border rounded-2">
                                                <p className="small mb-0 fst-italic">"{ticket.adminReply}"</p>
                                                <div className="mt-2 text-success fw-bold small text-uppercase" style={{ fontSize: '9px' }}>
                                                    <FaCheckCircle className="me-1" /> RESOLVED
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-3">
                                                <FaClock className="text-muted opacity-25 mb-2" size={24} />
                                                <p className="small text-muted fw-bold text-uppercase mb-0" style={{ fontSize: '9px' }}>Awaiting Support...</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="col-lg-4">
                            {user.role === 'admin' ? (
                                <div className="card bg-dark text-white border-0 shadow-sm p-3 rounded-3">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                        <FaUserEdit className="text-primary" /> Manage
                                    </h6>
                                    <form onSubmit={onAdminUpdate}>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase text-white-50" style={{ fontSize: '9px' }}>Status</label>
                                            <select
                                                className="form-select form-select-sm bg-white bg-opacity-10 border-0 text-white shadow-none"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option className="text-dark" value="Open">Open</option>
                                                <option className="text-dark" value="In Progress">In Progress</option>
                                                <option className="text-dark" value="Resolved">Resolved</option>
                                                <option className="text-dark" value="Closed">Closed</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-uppercase text-white-50" style={{ fontSize: '9px' }}>Reply</label>
                                            <textarea
                                                className="form-control form-control-sm bg-white bg-opacity-10 border-0 text-white shadow-none"
                                                rows="4"
                                                value={adminReply}
                                                onChange={(e) => setAdminReply(e.target.value)}
                                                placeholder="Write a response..."
                                            ></textarea>
                                        </div>
                                        <button className="btn btn-primary btn-sm w-100 fw-bold mb-2">
                                            SAVE UPDATE
                                        </button>
                                        <button type="button" onClick={onDelete} className="btn btn-link text-danger w-100 fw-bold text-decoration-none small" style={{ fontSize: '10px' }}>
                                            <FaTrash className="me-1" /> DELETE
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="card bg-light border p-3 rounded-3">
                                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
                                        <FaInfoCircle className="text-primary" /> Info
                                    </h6>
                                    <p className="small text-muted mb-0">This case is being handled by our technical operations team. You will be notified of any changes.</p>
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

