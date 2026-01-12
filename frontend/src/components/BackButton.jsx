import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BackButton = ({ url = '/', className = '' }) => {
    return (
        <Link to={url} className={`btn btn-dark btn-sm rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-2 w-fit-content shadow-sm transition-all ${className}`}>
            <FaArrowLeft size={10} /> <span style={{ fontSize: '11px' }}>BACK</span>
        </Link>
    );
};

export default BackButton;
