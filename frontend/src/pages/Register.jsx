import { useState, useContext, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = formData;
    const navigate = useNavigate();

    const { register, isLoading, error, user } = useContext(AuthContext);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (user) {
            navigate('/');
        }
    }, [error, user, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const userData = { name, email, password };
                await register(userData);
                toast.success('Registration successful! Please sign in.');
                navigate('/login');
            } catch (err) {
                // error is already handled by context and displayed via useEffect
            }
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="container py-5 mt-lg-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-7">
                    <div className="card shadow-sm border-0 auth-card p-4 p-md-5">

                        <div className="text-center mb-4">
                            <h2 className="fw-black">Create Account</h2>
                            <p className="text-secondary small">Join our professional support platform</p>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="row g-3 mb-4">
                                <div className="col-12">
                                    <label className="form-label fw-bold small text-uppercase tracking-wider">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><FaUser className="text-muted" /></span>
                                        <input
                                            type='text'
                                            className='form-control bg-light border-start-0 ps-0'
                                            id='name'
                                            name='name'
                                            value={name}
                                            onChange={onChange}
                                            placeholder='John Doe'
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold small text-uppercase tracking-wider">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-muted" /></span>
                                        <input
                                            type='email'
                                            className='form-control bg-light border-start-0 ps-0'
                                            id='email'
                                            name='email'
                                            value={email}
                                            onChange={onChange}
                                            placeholder='john@example.com'
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase tracking-wider">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><FaLock className="text-muted" /></span>
                                        <input
                                            type='password'
                                            className='form-control bg-light border-start-0 ps-0'
                                            id='password'
                                            name='password'
                                            value={password}
                                            onChange={onChange}
                                            placeholder='••••••••'
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-uppercase tracking-wider">Confirm</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><FaLock className="text-muted" /></span>
                                        <input
                                            type='password'
                                            className='form-control bg-light border-start-0 ps-0'
                                            id='confirmPassword'
                                            name='confirmPassword'
                                            value={confirmPassword}
                                            onChange={onChange}
                                            placeholder='••••••••'
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className='btn btn-primary w-100 py-3 fw-bold mb-4 shadow-sm'>
                                Register Account
                            </button>

                            <p className="text-center text-secondary small mb-0">
                                Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Sign In</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
