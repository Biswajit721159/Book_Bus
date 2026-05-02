import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4">
            <div className="text-center animate-fade-in">
                <div className="text-8xl font-bold text-primary-100 select-none mb-2">404</div>
                <h1 className="text-2xl font-semibold text-slate-800 mb-2">Page not found</h1>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="btn-primary"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
