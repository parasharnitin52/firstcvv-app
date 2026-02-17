import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let mouse = { x: null, y: null };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Random size
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                // Premium colors from the palette (Purple/Indigo/Orange/Blue)
                // Premium Blue/Indigo/Cyan Palette
                const colors = ['#D4AF37', '#F5F5F5', '#FFFFFF', '#FFD700', '#E5E4E2'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // "Forward in the direction the cursor moves" behavior
                // We'll interpret this as attraction/flow towards mouse or gentle float + mouse interaction

                // Standard floating
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Interaction radius
                    const forceDistance = 150;

                    if (distance < forceDistance) {
                        // Move AWAY from cursor (repel) or TOWARDS (attract)? 
                        // User said "forward in the direction the cursor moves"
                        // Let's make them flow with the mouse somewhat or just react dynamically
                        // A slight repulsion feels very premium/interactive (like the ref image usually behaves)
                        // But specifically "in direction moves" might imply trailing. 
                        // Let's simple attraction/repulsion for "premium feel".
                        // Let's go with a Repulsion effect as it clears a path (premium feel).

                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (forceDistance - distance) / forceDistance;
                        // Move away
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                // Boundary wrap
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 9000; // Density
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        // Event Listeners
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Init
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 bg-transparent pointer-events-none"
        />
    );
};

export default ParticleBackground;
