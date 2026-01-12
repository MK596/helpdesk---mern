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
        <div className="container py-3 py-md-4">
            {/* Optimized Header for Mobile & Desktop */}
            <div className="mb-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                    <div>
                        <nav aria-label="breadcrumb" className="mb-1 d-none d-sm-block">
                            <ol className="breadcrumb small text-uppercase fw-bold m-0 p-0" style={{ letterSpacing: '0.05em' }}>
                                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                                <li className="breadcrumb-item active text-primary" aria-current="page">Admin Dashboard</li>
                            </ol>
                        </nav>
                        <h3 className="fw-black mb-0 letter-spacing-tight d-flex align-items-center gap-2 fs-2 fs-md-3">
                            Admin Dashboard
                        </h3>
                        <p className="text-muted small mb-0 fw-bold d-sm-none text-uppercase opacity-75" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Administrator Overview</p>
                    </div>
                    <div className="d-flex gap-2 w-100 w-sm-auto">
                        <Link to="/admin/users" className="btn btn-dark btn-sm rounded-pill px-4 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow-sm border-0">
                            <FaUsers size={14} /> <span className="small">USER DIRECTORY</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Optimized Stats Grid */}
            <div className="row g-2 g-md-3 mb-4">
                {[
                    { label: 'Total Volume', val: tickets.length, icon: <FaTicketAlt />, color: 'dark' },
                    { label: 'Pending Action', val: tickets.filter(t => t.status === 'Open').length, icon: <FaExclamationTriangle />, color: 'primary' },
                    { label: 'Active Handling', val: tickets.filter(t => t.status === 'In Progress').length, icon: <FaClock />, color: 'warning' },
                    { label: 'Resolved Cases', val: tickets.filter(t => (t.status === 'Resolved' || t.status === 'Closed')).length, icon: <FaCheckDouble />, color: 'success' }
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

            {/* Advanced Filtration Toolbar */}
            <div className="row g-2 mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-1 px-2 d-flex flex-column flex-md-row gap-2">
                            <div className="input-group input-group-sm bg-light rounded-pill px-2 py-1 flex-grow-1 border-0">
                                <span className="input-group-text bg-transparent border-0 pe-1"><FaSearch className="text-muted opacity-50" size={12} /></span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none bg-transparent"
                                    placeholder="Search by ID, User or Title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '13px' }}
                                />
                            </div>
                            <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-1">
                                <FaFilter className="text-muted small" size={10} />
                                <select
                                    className="form-select form-select-sm border-0 bg-transparent fw-bold text-primary shadow-none p-0"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ fontSize: '12px' }}
                                >
                                    <option value="All">All Tickets</option>
                                    <option value="Open">Open Only</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Data Grid & Mobile Management List */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
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
                                <tr key={ticket._id} className="border-bottom border-light align-middle" style={{ cursor: 'pointer' }} onClick={() => navigate(`/ticket/${ticket._id}`)}>
                                    <td className="px-4 py-3 font-monospace small text-muted">#{ticket._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow-sm" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                {ticket.user?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div className="fw-bold text-dark">{ticket.user?.name || 'User'}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="fw-black text-main mb-1">{ticket.title}</div>
                                        <span className={`badge rounded-pill pt-1 px-2 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10' : 'text-muted bg-light'}`} style={{ fontSize: '0.65rem' }}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`status-badge ${getStatusBadge(ticket.status)}`}>{ticket.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Admin Card List - Highly Optimized */}
                <div className="d-lg-none p-2 pt-3">
                    <div className="d-flex flex-column gap-3">
                        {filteredTickets.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="text-muted opacity-50 mb-2"><FaTicketAlt size={40} /></div>
                                <p className="fw-bold text-muted mb-0">No matching tickets found</p>
                            </div>
                        ) : (
                            filteredTickets.map(ticket => (
                                <div
                                    key={ticket._id}
                                    className="card shadow-sm border-0 rounded-4 overflow-hidden position-relative transition-all"
                                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                                    style={{ cursor: 'pointer', background: '#fff' }}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-black shadow-sm" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                                                    {ticket.user?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="fw-black text-main lh-1 mb-1" style={{ fontSize: '14px' }}>{ticket.user?.name || 'User'}</div>
                                                    <div className="text-muted font-monospace" style={{ fontSize: '10px' }}>#{ticket._id.slice(-6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                            <span className={`status-badge px-2 py-1 rounded-6 fw-black ${getStatusBadge(ticket.status)}`} style={{ fontSize: '8px', letterSpacing: '0.05em' }}>
                                                {ticket.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <h6 className="fw-bold mb-3 text-dark pe-2" style={{ fontSize: '14px', lineHeight: '1.4' }}>{ticket.title}</h6>
                                        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                                            <div className="d-flex gap-2 align-items-center">
                                                <span className={`badge rounded-pill px-2 py-1 ${ticket.priority === 'High' ? 'text-danger bg-danger bg-opacity-10' : 'text-muted bg-light'}`} style={{ fontSize: '9px' }}>
                                                    {ticket.priority.toUpperCase()}
                                                </span>
                                                <span className="text-muted small fw-bold" style={{ fontSize: '10px' }}>
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="text-primary fw-black d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                                                VIEW <FaArrowRight size={8} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
