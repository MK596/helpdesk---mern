import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { FaPaperPlane, FaUser, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';

function NewTicket() {
    const { user } = useContext(AuthContext);
    const [name] = useState(user.name);
    const [email] = useState(user.email);
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Low');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post(
                '/api/tickets',
                { title, description, priority },
                config
            );

            setIsLoading(false);
            toast.success('Ticket submitted');
            navigate('/tickets');
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Error occurred');
        }
    };

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
                                <li className="breadcrumb-item"><Link to="/tickets" className="text-decoration-none text-muted">Records</Link></li>
                                <li className="breadcrumb-item active text-primary" aria-current="page">New Request</li>
                            </ol>
                        </nav>
                        <h3 className="fw-black mb-0 letter-spacing-tight fs-2">
                            Create Ticket
                        </h3>
                        <p className="text-muted small mb-0 fw-bold d-sm-none text-uppercase opacity-75" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Support Intake</p>
                    </div>
                    <div className="d-flex gap-2 w-100 w-sm-auto">
                        <BackButton url="/tickets" className="flex-grow-1 flex-sm-grow-0" />
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                        <div className="card-header bg-light border-0 p-4">
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <div className="small fw-black text-muted text-uppercase mb-1" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>Requester</div>
                                    <div className="fw-black d-flex align-items-center gap-2 text-dark"><FaUser size={12} className="text-primary opacity-50" /> {name}</div>
                                </div>
                                <div className="col-sm-6 text-sm-end">
                                    <div className="small fw-black text-muted text-uppercase mb-1" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>Email Identity</div>
                                    <div className="fw-black text-primary d-flex align-items-center gap-2 justify-content-sm-end"><FaEnvelope size={12} className="opacity-50" /> {email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            <form onSubmit={onSubmit}>
                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <label className="form-label small fw-black text-uppercase text-muted" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Ticket Title</label>
                                        <input
                                            type='text'
                                            name='title'
                                            id='title'
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="form-control rounded-3 px-3 py-2 border-0 bg-light shadow-none"
                                            placeholder='Brief summary of the issue...'
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-black text-uppercase text-muted d-block mb-2" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Priority Level</label>
                                        <div className="d-flex gap-2" role="group">
                                            {['Low', 'Medium', 'High'].map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    className={`btn flex-grow-1 py-3 rounded-3 fw-black transition-all border-0 ${priority === p ? 'btn-primary shadow-sm' : 'bg-light text-muted opacity-75'}`}
                                                    onClick={() => setPriority(p)}
                                                    style={{ fontSize: '11px' }}
                                                >
                                                    {p.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label small fw-black text-uppercase text-muted" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Case Description</label>
                                        <textarea
                                            name='description'
                                            id='description'
                                            rows='5'
                                            className='form-control rounded-3 px-3 py-2 border-0 bg-light shadow-none'
                                            placeholder='Detailed explanation of what happened...'
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <button className='btn btn-primary w-100 py-3 rounded-pill fw-black d-flex align-items-center justify-content-center gap-2 shadow-sm border-0'>
                                    <FaPaperPlane size={14} /> SUBMIT REQUEST
                                </button>

                                <div className="mt-4 text-center">
                                    <div className="p-3 rounded-4 bg-light bg-opacity-50">
                                        <p className="text-muted fw-bold mb-0" style={{ fontSize: '11px' }}>
                                            <FaExclamationCircle className="me-2 text-primary" />
                                            Expected response within 2-4 business hours for priority handling.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewTicket;
