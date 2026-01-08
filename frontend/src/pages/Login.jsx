import { useState, useContext, useEffect } from 'react';
import { FaSignInAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const navigate = useNavigate();

    const { login, isLoading, error, user } = useContext(AuthContext);

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

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = { email, password };
        login(userData);
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="container py-5 mt-lg-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow-sm border-0 auth-card p-4 p-md-5">

                        <div className="text-center mb-4">
                            <h2 className="fw-black">Welcome Back</h2>
                            <p className="text-secondary small">Please sign in to continue</p>
                        </div>

                        <form onSubmit={onSubmit}>
                            <div className="mb-4">
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
                                        placeholder='name@company.com'
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
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

                            <div className="mb-4 d-flex justify-content-between align-items-center">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="remember" />
                                    <label className="form-check-label small" htmlFor="remember">Remember me</label>
                                </div>
                                <Link to="/forgot-password" title="Forgot password link" className="small fw-bold text-decoration-none">Forgot password?</Link>
                            </div>

                            <button className='btn btn-primary w-100 py-3 fw-bold mb-4 shadow-sm'>
                                Login
                            </button>

                            <p className="text-center text-secondary small mb-0">
                                Don't have an account? <Link to="/register" className="fw-bold text-decoration-none">Create Account</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
