function Spinner() {
    return (
        <div className='spinner-container' style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Spinner;
