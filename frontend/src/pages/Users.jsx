import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { FaUserShield, FaUser } from 'react-icons/fa';

function Users() {
    const { user, isLoading } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
            toast.error('Access Denied');
        }

        const fetchUsers = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const response = await axios.get('/api/users/users', config);
                setUsers(response.data);
                setIsFetching(false);
            } catch (error) {
                console.error('Fetch users error:', error);
                toast.error('Could not fetch users');
                setIsFetching(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchUsers();
        }
    }, [user, navigate]);

    if (isLoading || isFetching) {
        return <Spinner />;
    }

    return (
        <div className="container py-4">
            <BackButton url='/admin' />
            <h1 className="fw-black mb-4 mt-4">System Users</h1>

            <div className='card border-0 shadow-sm rounded-4 overflow-hidden bg-white'>
                {/* Desktop Table */}
                <div className='table-responsive d-none d-md-block'>
                    <table className='table table-hover align-middle mb-0'>
                        <thead>
                            <tr className='bg-light bg-opacity-50'>
                                <th className='px-4 py-3 border-0 small text-uppercase text-muted fw-black'>User Information</th>
                                <th className='px-4 py-3 border-0 small text-uppercase text-muted fw-black'>Security Role</th>
                                <th className='px-4 py-3 border-0 small text-uppercase text-muted fw-black text-end'>Registration Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className='border-bottom border-light'>
                                    <td className='px-4 py-3'>
                                        <div className='d-flex align-items-center gap-3'>
                                            <div className={`p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm ${u.role === 'admin' ? 'bg-primary text-white' : 'bg-light text-primary'}`} style={{ width: '38px', height: '38px' }}>
                                                {u.role === 'admin' ? <FaUserShield size={16} /> : <FaUser size={16} />}
                                            </div>
                                            <div>
                                                <div className='fw-black text-dark lh-1 mb-1'>{u.name}</div>
                                                <div className='text-muted small'>{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3'>
                                        <span className={`badge rounded-pill pt-1 px-3 fw-black ${u.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10' : 'bg-info bg-opacity-10 text-info border border-info border-opacity-10'}`} style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className='px-4 py-3 small text-muted text-end fw-bold'>{new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="d-md-none p-2 p-md-3">
                    <div className="d-flex flex-column gap-2">
                        {users.map(u => (
                            <div key={u._id} className="card shadow-sm border-0 rounded-4 overflow-hidden mb-1" style={{ background: 'linear-gradient(to right, #ffffff, #fafafa)' }}>
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm ${u.role === 'admin' ? 'bg-primary text-white' : 'bg-light text-primary'}`} style={{ width: '40px', height: '40px' }}>
                                            {u.role === 'admin' ? <FaUserShield size={18} /> : <FaUser size={18} />}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="fw-black text-main lh-1 mb-1" style={{ fontSize: '16px' }}>{u.name}</div>
                                            <div className="text-muted" style={{ fontSize: '12px' }}>{u.email}</div>
                                        </div>
                                        <span className={`badge rounded-pill pt-1 px-2 fw-black ${u.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10' : 'bg-info bg-opacity-10 text-info border border-info border-opacity-10'}`} style={{ fontSize: '9px' }}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                                        <span className="text-muted small fw-bold" style={{ fontSize: '10px' }}>REGISTERED ON</span>
                                        <span className="text-main fw-black" style={{ fontSize: '10px' }}>{new Date(u.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Users;
