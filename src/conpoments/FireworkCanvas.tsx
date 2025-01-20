import { useRef, useEffect } from 'react'

function FireworkCanvas () {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const particles: any[] = [];
        const colors = ['#F27999', '#D94EB4', '#63F2F2', '#F28585', '#FF33B5'];

        function createParticle(x: number, y: number) {
        for (let i = 0; i < 50; i++) {
            particles.push({
            x,
            y,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
        }

        function createRandomFireworks() {
            if (canvas) {
                const width = canvas.width;
                const height = canvas.height;

                intervalRef.current = window.setInterval(() => {
                    const randomX = Math.random() * width;
                    const randomY = Math.random() * height;
                    createParticle(randomX, randomY);
                }, 500); // 1초 간격
            }
        }

        function updateParticles() {
            particles.forEach((particle, index) => {
                particle.x += particle.dx;
                particle.y += particle.dy;
                particle.radius *= 0.98;
                if (particle.radius < 0.5) particles.splice(index, 1);
            });
        }

        function drawParticles() {
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach((particle) => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                });
            }
        }

        function animate() {
            updateParticles();
            drawParticles();
            requestAnimationFrame(animate);
        }

        createRandomFireworks();
        animate();

        // 2초 후 폭죽 이벤트 종료
        setTimeout(() => {
            if (intervalRef.current !== null) {
            clearInterval(intervalRef.current); // 폭죽 생성 중단
            }
        }, 5000);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ display: 'block', position: 'fixed', top: 0, left: 0, }}
        />
    );
}

export default FireworkCanvas;