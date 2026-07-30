import React from 'react';

interface BanyaStockLogoProps {
    collapsed?: boolean;
    className?: string;
}

export const BanyaStockLogo: React.FC<BanyaStockLogoProps> = ({ collapsed = false, className = '' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Gold B-Arrow Icon Mark */}
            <svg
                width="34"
                height="34"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 transition-transform duration-300 hover:scale-105"
            >
                <path
                    d="M10 28V12L22 12M10 28H22L10 16"
                    stroke="#E5B246"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M18 22L28 10M28 10H20M28 10V18"
                    stroke="#E5B246"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Typography Text */}
            {!collapsed && (
                <span className="font-extrabold text-xl tracking-wider text-white font-sans transition-opacity duration-300">
                    BANYSTOCK
                </span>
            )}
        </div>
    );
};

export default BanyaStockLogo;
