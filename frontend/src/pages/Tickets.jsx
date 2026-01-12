import { useEffect, useState, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { FaTicketAlt, FaSearch, FaPlus, FaArrowRight, FaClock, FaCheckDouble, FaExclamationTriangle } from 'react-icons/fa';

function Tickets() {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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
            t._id.includes(searchTerm)
        );
    }, [searchTerm, tickets]);

    if (isLoading) return <Spinner />;

    return (
        <div className="container py-3 py-md-4">
            {/* Optimized Header Area */}
            <div className="mb-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                    <div>
                        <nav aria-label="breadcrumb" className="mb-1 d-none d-sm-block">
                            <ol className="breadcrumb small text-uppercase fw-bold m-0 p-0" style={{ letterSpacing: '0.05em' }}>
                                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                                <li className="breadcrumb-item active text-primary" aria-current="page">Support History</li>
                            </ol>
                        </nav>
                        <h3 className="fw-black mb-0 letter-spacing-tight fs-2">
                            Ticket Records
                        </h3>
                        <p className="text-muted small mb-0 fw-bold d-sm-none text-uppercase opacity-75" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Request Management</p>
                    </div>
                    <div className="d-flex gap-2 w-100 w-sm-auto">
                        <Link to="/new-ticket" className="btn btn-primary rounded-pill px-4 py-2 fw-black shadow-sm d-flex align-items-center justify-content-center gap-2 flex-grow-1 border-0" style={{ fontSize: '13px' }}>
                            <FaPlus size={12} /> NEW REQUEST
                        </Link>
                    </div>
                </div>
            </div>

            {/* Optimized Stats Grid for User */}
            <div className="row g-2 g-md-3 mb-4">
                {[
                    { label: 'Total Records', val: tickets.length, icon: <FaTicketAlt />, color: 'dark' },
                    { label: 'Active Support', val: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length, icon: <FaClock />, color: 'primary' },
                    { label: 'Resolved Case', val: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length, icon: <FaCheckDouble />, color: 'success' },
                    { label: 'High Priority', val: tickets.filter(t => t.priority === 'High').length, icon: <FaExclamationTriangle />, color: 'danger' }
                ].map((stat, i) => (
                    <div className="col-6 col-md-3" key={i}>
                        <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden bg-white">
                            <div className="card-body p-3">
                                <div className="d-flex flex-column gap-1">
                                    <div className={`bg-${stat.color} bg-opacity-10 text-${stat.color} p-2 rounded-3 d-flex align-items-center justify-content-center mb-1`} style={{ width: '30px', height: '30px' }}>
                                        <div style={{ fontSize: '13px' }}>{stat.icon}</div>
                                    </div>
                                    <div>
                                        <h4 className="fw-black mb-0 lh-1">{stat.val}</h4>
                                        <p className="text-muted fw-bold text-uppercase mb-0 mt-1" style={{ fontSize: '8px', letterSpacing: '0.05em' }}>{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Toolbar */}
            <div className="row g-2 mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-1 px-2">
                            <div className="input-group input-group-sm bg-light rounded-pill px-2 py-1 flex-grow-1 border-0">
                                <span className="input-group-text bg-transparent border-0 pe-1"><FaSearch className="text-muted opacity-50" size={12} /></span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent"
                                    placeholder="Search by ID or Title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '13px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Grid & Mobile Management List */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-transparent">
                {/* Desktop Table View */}
                <div className="table-responsive d-none d-lg-block bg-white rounded-4 overflow-hidden">
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
                                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                                >
                                    <td className="px-4">
                                        <span className="font-monospace fw-bold text-muted small">
                                            #{ticket._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4">
                                        <div className="fw-black small text-dark mb-0 text-truncate" style={{ maxWidth: '300px' }}>{ticket.title}</div>
                                        <span className={`badge rounded-pill pt-1 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10 border border-danger border-opacity-10' : 'text-muted bg-light'}`} style={{ fontSize: '0.65rem' }}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4">
                                        <div className="text-muted d-flex align-items-center gap-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                                            {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-4">
                                        <span className={`status-badge px-3 py-1 rounded-pill fw-black ${ticket.status === 'Open' ? 'bg-primary text-white' :
                                            ticket.status === 'In Progress' ? 'bg-warning text-dark' :
                                                ticket.status === 'Resolved' ? 'bg-success text-white' : 'bg-danger text-white'
                                            }`} style={{ fontSize: '0.65rem' }}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 text-end">
                                        <Link to={`/ticket/${ticket._id}`} className="btn btn-outline-primary btn-sm rounded-pill fw-black px-3 py-1 border-0 bg-primary bg-opacity-10" style={{ fontSize: '10px' }}>
                                            MANAGE
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Premium Card View */}
                <div className="d-lg-none p-0">
                    <div className="d-flex flex-column gap-3">
                        {filteredTickets.length === 0 ? (
                            <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                                <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                                    <FaTicketAlt size={32} className="text-muted opacity-25" />
                                </div>
                                <h6 className="fw-black text-dark mb-2">No Records Found</h6>
                                <p className="small text-muted mb-0 px-4">Try adjusting your search or create a new support request.</p>
                            </div>
                        ) : (
                            filteredTickets.map(ticket => (
                                <div
                                    key={ticket._id}
                                    className="card shadow-sm border-0 rounded-4 overflow-hidden position-relative"
                                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                                    style={{ cursor: 'pointer', background: '#fff', transition: 'all 0.2s ease' }}
                                >
                                    {/* Status Color Bar */}
                                    <div
                                        className={`position-absolute top-0 start-0 w-100 ${ticket.status === 'Open' ? 'bg-primary' :
                                                ticket.status === 'In Progress' ? 'bg-warning' :
                                                    ticket.status === 'Resolved' ? 'bg-success' : 'bg-danger'
                                            }`}
                                        style={{ height: '4px' }}
                                    />

                                    <div className="card-body p-4 pt-3">
                                        {/* Header Section */}
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="flex-grow-1 pe-2">
                                                <div className="text-muted font-monospace fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                    #{ticket._id.slice(-6).toUpperCase()}
                                                </div>
                                                <h6 className="fw-black mb-0 text-dark lh-sm" style={{ fontSize: '15px' }}>
                                                    {ticket.title}
                                                </h6>
                                            </div>
                                            <span className={`status-badge px-3 py-1 rounded-pill fw-black text-nowrap ${ticket.status === 'Open' ? 'bg-primary bg-opacity-10 text-primary' :
                                                    ticket.status === 'In Progress' ? 'bg-warning bg-opacity-10 text-warning' :
                                                        ticket.status === 'Resolved' ? 'bg-success bg-opacity-10 text-success' :
                                                            'bg-danger bg-opacity-10 text-danger'
                                                }`} style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                                                {ticket.status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Metadata Section */}
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: '#f0f0f0 !important' }}>
                                            <div className="d-flex gap-3 align-items-center">
                                                {/* Priority Badge */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className={`rounded-circle ${ticket.priority === 'High' ? 'bg-danger' : ticket.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}
                                                        style={{ width: '6px', height: '6px' }} />
                                                    <span className={`fw-black text-uppercase ${ticket.priority === 'High' ? 'text-danger' : 'text-muted'}`}
                                                        style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                        {ticket.priority}
                                                    </span>
                                                </div>

                                                {/* Date */}
                                                <div className="d-flex align-items-center gap-2">
                                                    <FaClock className="text-muted opacity-50" size={10} />
                                                    <span className="text-muted fw-bold" style={{ fontSize: '11px' }}>
                                                        {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* View Action */}
                                            <div className="d-flex align-items-center gap-2 text-primary">
                                                <span className="fw-black text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                    View
                                                </span>
                                                <FaArrowRight size={10} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {filteredTickets.length === 0 && (
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mt-4 d-none d-lg-block bg-white">
                        <div className="px-4 py-5 text-center text-muted">
                            <div className="py-5">
                                <FaTicketAlt className="display-4 opacity-10 mb-3" />
                                <h6 className="fw-bold text-muted mb-1">No Support Records Found</h6>
                                <p className="small mb-0">You haven't submitted any requests or no matches found for your search.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tickets;
