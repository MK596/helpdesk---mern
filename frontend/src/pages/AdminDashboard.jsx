import { useEffect, useState, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { FaUsers, FaSearch, FaArrowRight, FaTicketAlt, FaClock, FaCheckDouble, FaExclamationTriangle, FaFilter, FaCalendarAlt } from 'react-icons/fa';

function AdminDashboard() {
    const { user, isLoading } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isFetching, setIsFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
            toast.error('Access Denied: Admins Only');
        }

        const fetchAllTickets = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get('/api/tickets/all', config);
                setTickets(response.data);
                setIsFetching(false);
            } catch (error) {
                console.error('Fetch all tickets error:', error);
                toast.error('Could not fetch tickets');
                setIsFetching(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchAllTickets();
        }
    }, [user, navigate]);

    const filteredTickets = useMemo(() => {
        let result = tickets;

        if (statusFilter !== 'All') {
            result = result.filter(t => t.status === statusFilter);
        }

        if (searchTerm) {
            result = result.filter(t =>
                t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t._id.includes(searchTerm)
            );
        }

        return result;
    }, [statusFilter, searchTerm, tickets]);

    if (isLoading || isFetching) return <Spinner />;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Open': return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20';
            case 'In Progress': return 'bg-warning bg-opacity-10 text-main border border-warning border-opacity-20';
            case 'Resolved': return 'bg-success bg-opacity-10 text-success border border-success border-opacity-20';
            case 'Closed': return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-20';
            default: return 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-20';
        }
    };

    return (
        <div className="container py-4">
            {/* Professional Breadcrumb & Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <nav aria-label="breadcrumb" className="mb-2">
                        <ol className="breadcrumb small text-uppercase fw-bold m-0 p-0" style={{ letterSpacing: '0.05em' }}>
                            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                            <li className="breadcrumb-item active text-primary" aria-current="page">Admin Control</li>
                        </ol>
                    </nav>
                    <h3 className="fw-black mb-0 letter-spacing-tight d-flex align-items-center gap-2 fs-2 fs-md-3">
                        System Overview
                    </h3>
                </div>
                <div className="d-flex gap-2 w-100 w-md-auto">
                    <Link to="/admin/users" className="btn btn-dark btn-sm rounded-pill px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0 shadow-sm border-0">
                        <FaUsers size={14} /> <span className="small">USER DIRECTORY</span>
                    </Link>
                </div>

            </div>

            {/* Elegant Stats Hub */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Total Volume', val: tickets.length, icon: <FaTicketAlt />, color: 'dark', trend: '+12%' },
                    { label: 'Pending Action', val: tickets.filter(t => t.status === 'Open').length, icon: <FaExclamationTriangle />, color: 'primary', trend: 'Critical' },
                    { label: 'Active Handling', val: tickets.filter(t => t.status === 'In Progress').length, icon: <FaClock />, color: 'warning', trend: 'Stable' },
                    { label: 'Resolved Cases', val: tickets.filter(t => (t.status === 'Resolved' || t.status === 'Closed')).length, icon: <FaCheckDouble />, color: 'success', trend: '98%' }
                ].map((stat, i) => (
                    <div className="col-6 col-md-3" key={i}>
                        <div className={`card border-0 shadow-sm h-100 overflow-hidden`}>
                            <div className="card-body p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className={`bg-${stat.color} bg-opacity-10 text-${stat.color} p-2 rounded-3 fs-6`}>
                                        {stat.icon}
                                    </div>
                                    <span className="badge bg-light text-muted fw-bold" style={{ fontSize: '0.6rem' }}>{stat.trend}</span>
                                </div>
                                <div className="mt-2">
                                    <h2 className="fw-black mb-0 lh-1">{stat.val}</h2>
                                    <p className="small text-muted fw-bold text-uppercase mb-0 mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Filtration Toolbar */}
            <div className="row g-2 g-md-3 mb-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-1 px-3">
                            <div className="input-group input-group-sm bg-transparent border-0 px-1 py-1 align-items-center">
                                <span className="input-group-text bg-transparent border-0 ps-1"><FaSearch className="text-muted opacity-50" /></span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent py-2"
                                    placeholder="Search reference, user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '14px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-2 px-3 d-flex align-items-center gap-2">
                            <div className="bg-light p-1 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                                <FaFilter size={10} className="text-muted" />
                            </div>
                            <select
                                className="form-select form-select-sm border-0 bg-transparent fw-bold text-primary shadow-none py-1"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ fontSize: '14px' }}
                            >
                                <option value="All">All Ticket States</option>
                                <option value="Open">Unassigned / Open</option>
                                <option value="In Progress">In Handling</option>
                                <option value="Resolved">Resolution Pending</option>
                                <option value="Closed">Archived / Closed</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Data Grid & Mobile Management List */}
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                {/* Desktop Admin Table */}
                <div className="table-responsive d-none d-lg-block">
                    <table className="table table-hover align-middle mb-0">
                        <thead>
                            <tr className="bg-light bg-opacity-50">
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black" style={{ width: '120px' }}>Reference</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black">Requester</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black">Subject & Priority</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black">Current Status</th>
                                <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-black text-end">Operations</th>
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
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>
                                                {ticket.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="fw-bold small text-main lh-1">{ticket.user?.name || 'Unknown User'}</div>
                                                <div className="text-muted" style={{ fontSize: '0.65rem' }}>{ticket.user?.email || 'System generated'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4">
                                        <div className="fw-bold small text-main mb-1 text-truncate" style={{ maxWidth: '200px' }}>{ticket.title}</div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <span className={`badge rounded-pill pt-1 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10 border border-danger border-opacity-10' : 'text-muted bg-light'}`} style={{ fontSize: '0.55rem' }}>
                                                {ticket.priority.toUpperCase()}
                                            </span>
                                            <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }}>
                                                <FaCalendarAlt size={10} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4">
                                        <span className={`status-badge px-3 py-1 rounded-pill fw-bold ${getStatusBadge(ticket.status)}`} style={{ fontSize: '0.65rem' }}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 text-end">
                                        <span className="btn btn-primary btn-sm rounded-pill fw-bold px-3 py-1 shadow-sm transition-all" style={{ fontSize: '0.65rem' }}>
                                            MANAGE
                                        </span>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Admin Card List */}
                <div className="d-lg-none p-2 p-md-3">
                    <div className="d-flex flex-column gap-2 gap-md-3">
                        {filteredTickets.map(ticket => (
                            <div
                                key={ticket._id}
                                className="card shadow-sm border-0 rounded-4 overflow-hidden position-relative hover-translate transition-all mb-1"
                                onClick={() => navigate(`/ticket/${ticket._id}`)}
                                style={{ cursor: 'pointer', background: 'linear-gradient(to right, #ffffff, #fafafa)' }}
                            >
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow-sm" style={{ width: '28px', height: '28px', fontSize: '10px' }}>
                                                {ticket.user?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="fw-bold small text-main lh-1" style={{ fontSize: '13px' }}>{ticket.user?.name || 'User'}</div>
                                                <div className="text-muted" style={{ fontSize: '10px' }}>#{ticket._id.slice(-6).toUpperCase()}</div>
                                            </div>
                                        </div>
                                        <span className={`status-badge px-2 py-1 rounded-pill fw-black ${getStatusBadge(ticket.status)}`} style={{ fontSize: '9px', letterSpacing: '0.02em' }}>
                                            {ticket.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h6 className="fw-black mb-2 text-main text-truncate pe-4" style={{ letterSpacing: '-0.01em', fontSize: '15px' }}>{ticket.title}</h6>
                                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                                        <div className="d-flex gap-2">
                                            <span className={`badge rounded-pill pt-1 px-2 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10' : 'text-muted bg-light'}`} style={{ fontSize: '9px' }}>
                                                {ticket.priority.toUpperCase()}
                                            </span>
                                            <span className="text-muted small d-flex align-items-center gap-1 fw-bold" style={{ fontSize: '10px' }}>
                                                <FaCalendarAlt size={10} className="mb-1" /> {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-primary fw-black" style={{ fontSize: '10px' }}>MANAGE <FaArrowRight size={8} /></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {filteredTickets.length === 0 && (
                    <div className="px-4 py-5 text-center text-muted">
                        <div className="py-4">
                            <FaTicketAlt className="display-4 opacity-10 mb-3" />
                            <p className="fw-bold mb-0">Null results. Adjust filtration criteria.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
