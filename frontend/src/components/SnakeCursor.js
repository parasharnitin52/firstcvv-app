import React, { useEffect, useRef } from 'react';

const SnakeCursor = () => {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const segments = useRef([]);
    const numSegments = 25;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true });

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-initialize segments on resize to current mouse position
            segments.current = Array.from({ length: numSegments }, () => ({ x: mouse.current.x, y: mouse.current.y }));
        };

        window.addEventListener('resize', resize);

        // Initial mouse position from window if possible, else 0,0
        mouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        segments.current = Array.from({ length: numSegments }, () => ({ x: mouse.current.x, y: mouse.current.y }));
        resize();

        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update segments
            segments.current[0].x = mouse.current.x;
            segments.current[0].y = mouse.current.y;

            for (let i = 1; i < numSegments; i++) {
                const prev = segments.current[i - 1];
                const curr = segments.current[i];

                // Slightly slower trailing for better "snake" feel
                curr.x += (prev.x - curr.x) * 0.35;
                curr.y += (prev.y - curr.y) * 0.35;
            }

            // Draw segments individually for tapering width
            for (let i = 0; i < numSegments - 1; i++) {
                const curr = segments.current[i];
                const next = segments.current[i + 1];

                ctx.beginPath();
                ctx.strokeStyle = `rgba(212, 175, 55, ${1 - (i / numSegments)})`; // Fade out
                ctx.lineWidth = Math.max(0.5, 6 - (i / numSegments) * 5); // Tapering
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                ctx.moveTo(curr.x, curr.y);
                ctx.lineTo(next.x, next.y);
                ctx.stroke();
            }

            // Draw a subtle glow at the head
            ctx.beginPath();
            ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
            ctx.arc(mouse.current.x, mouse.current.y, 8, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[99999]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default SnakeCursor;
