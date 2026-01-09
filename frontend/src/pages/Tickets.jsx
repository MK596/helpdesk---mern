import { useEffect, useState, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { FaTicketAlt, FaSearch, FaPlus, FaFilter, FaInbox } from 'react-icons/fa';

function Tickets() {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get('/api/tickets', config);
                setTickets(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Fetch tickets error:', error);
                toast.error('Could not fetch tickets');
                setIsLoading(false);
            }
        };

        if (user) {
            fetchTickets();
        }
    }, [user]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t =>
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, tickets]);

    if (isLoading) return <Spinner />;

    return (
        <div className="container py-4">
            {/* Professional Header Area */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
                <div>
                    <nav aria-label="breadcrumb" className="mb-2">
                        <ol className="breadcrumb small text-uppercase fw-bold m-0 p-0" style={{ letterSpacing: '0.05em' }}>
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                            <li className="breadcrumb-item active text-primary" aria-current="page">Support Requests</li>
                        </ol>
                    </nav>
                    <h3 className="fw-black mb-0 letter-spacing-tight d-flex align-items-center gap-2">
                        My Support Records
                    </h3>
                </div>
                <div className="d-flex gap-2 w-100 w-md-auto">
                    <Link to="/" className="btn btn-outline-dark rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0">
                        Back to Home
                    </Link>
                    <Link to="/new-ticket" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0">
                        <FaPlus /> New Request
                    </Link>
                </div>
            </div>

            {/* Practical Stats Overlay */}
            <div className="row g-3 mb-4">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm rounded-3 h-100">
                        <div className="card-body p-2 px-3 d-flex align-items-center">
                            <div className="input-group input-group-sm bg-light rounded-pill px-2 py-1 flex-grow-1">
                                <span className="input-group-text bg-transparent border-0"><FaSearch className="text-muted opacity-50" /></span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent"
                                    placeholder="Search by subject or content..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm bg-primary bg-opacity-10 rounded-3 h-100">
                        <div className="card-body p-3 d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary text-white p-2 rounded-3">
                                    <FaTicketAlt size={16} />
                                </div>
                                <div>
                                    <div className="small fw-bold text-muted text-uppercase mb-0" style={{ fontSize: '10px' }}>Total Records</div>
                                    <h5 className="fw-black mb-0 text-main">{tickets.length}</h5>
                                </div>
                            </div>
                            <div className="text-end">
                                <div className="small fw-bold text-success text-uppercase mb-0" style={{ fontSize: '10px' }}>Active cases</div>
                                <h5 className="fw-black mb-0 text-success">{tickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Data Grid & Mobile List */}
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                {/* Desktop Table View */}
                <div className="table-responsive d-none d-md-block">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr className="bg-light bg-opacity-50">
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black" style={{ width: '120px' }}>Reference</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black">Subject Issue</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black">Created On</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black">Current Status</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map(ticket => (
                                <tr
                                    key={ticket._id}
                                    className="border-bottom border-light align-middle transition-all"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => (window.location.href = `/ticket/${ticket._id}`)}
                                >
                                    <td className="px-4">
                                        <span className="font-monospace fw-bold text-muted small">
                                            #{ticket._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4">
                                        <div className="fw-bold small text-main mb-0 text-truncate" style={{ maxWidth: '300px' }}>{ticket.title}</div>
                                        <span className={`badge rounded-pill pt-1 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10 border border-danger border-opacity-10' : 'text-muted bg-light'}`} style={{ fontSize: '0.55rem' }}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4">
                                        <div className="text-muted d-flex align-items-center gap-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                                            {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-4">
                                        <span className={`status-badge px-3 py-1 rounded-pill fw-bold ${ticket.status === 'Open' ? 'bg-primary text-white' :
                                            ticket.status === 'In Progress' ? 'bg-warning text-dark' :
                                                ticket.status === 'Resolved' ? 'bg-success text-white' : 'bg-danger text-white'
                                            }`} style={{ fontSize: '0.65rem' }}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 text-end">
                                        <Link to={`/ticket/${ticket._id}`} className="btn btn-light btn-sm rounded-pill fw-bold px-3 py-1 border shadow-none" style={{ fontSize: '0.65rem' }}>
                                            VIEW DETAILS
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="d-md-none p-3">
                    <div className="d-flex flex-column gap-3">
                        {filteredTickets.map(ticket => (
                            <Link
                                to={`/ticket/${ticket._id}`}
                                key={ticket._id}
                                className="text-decoration-none"
                            >
                                <div className="card shadow-none border rounded-3 p-3 hover-glow">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <span className="font-monospace fw-bold text-muted" style={{ fontSize: '0.7rem' }}>
                                                #{ticket._id.slice(-6).toUpperCase()}
                                            </span>
                                            <h6 className="fw-bold mb-1 mt-1 text-main">{ticket.title}</h6>
                                        </div>
                                        <span className={`status-badge px-2 py-1 rounded-pill fw-bold ${ticket.status === 'Open' ? 'bg-primary text-white' :
                                            ticket.status === 'In Progress' ? 'bg-warning text-dark' :
                                                ticket.status === 'Resolved' ? 'bg-success text-white' : 'bg-danger text-white'
                                            }`} style={{ fontSize: '0.6rem' }}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-muted fw-bold" style={{ fontSize: '0.65rem' }}>
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                        <span className={`badge rounded-pill pt-1 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10 border border-danger border-opacity-10' : 'text-muted bg-light'}`} style={{ fontSize: '0.55rem' }}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {filteredTickets.length === 0 && (
                    <div className="px-4 py-5 text-center text-muted">
                        <div className="py-5">
                            <FaTicketAlt className="display-4 opacity-10 mb-3" />
                            <h6 className="fw-bold text-muted mb-1">No Support Records Found</h6>
                            <p className="small mb-0">You haven't submitted any requests or no matches found for your search.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tickets;
