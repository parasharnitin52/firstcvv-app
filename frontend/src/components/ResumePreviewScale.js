import React, { useState, useEffect, useRef } from 'react';

const ResumePreviewScale = ({ children }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const resumeWidth = 794; // 210mm in pixels at 96 DPI approx
                // Add some padding/margin safety
                const newScale = (containerWidth - 32) / resumeWidth;
                setScale(Math.min(newScale, 1)); // Don't scale up, only down
            }
        };

        // Initial calculation
        handleResize();

        // Observer
        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-y-auto overflow-x-hidden relative custom-scrollbar flex justify-center bg-gray-50 p-4"
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '210mm',
                    minHeight: '297mm',
                    transition: 'transform 0.2s ease-out'
                }}
                className="shadow-lg bg-white"
            >
                {children}
            </div>
        </div>
    );
};

export default ResumePreviewScale;
