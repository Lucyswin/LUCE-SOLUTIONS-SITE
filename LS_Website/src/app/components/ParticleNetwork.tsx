import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  hasGlow: boolean;
  hasTwinkle: boolean;
  twinklePhase: number;
}

interface ParticleNetworkProps {
  opacity?: number;
}

export function ParticleNetwork({ opacity = 1 }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const colors = {
      darkGrey: "#3a3a3a",
      pink: "#E45792",
      purple: "#4e5ba6",
      yellow: "#f5d547",
      orange: "#ff8c42",
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000);

      for (let i = 0; i < particleCount; i++) {
        let color: string;
        let hasGlow = false;
        let hasTwinkle = false;

        // 70% dark grey, 30% colored
        const rand = Math.random();
        if (rand < 0.7) {
          color = colors.darkGrey;
        } else {
          // Pick a random color
          const colorOptions = [colors.pink, colors.purple, colors.yellow, colors.orange];
          color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
          
          // 60% of colored dots have glow
          hasGlow = Math.random() < 0.6;
          
          // 40% of glowing dots have twinkle
          if (hasGlow) {
            hasTwinkle = Math.random() < 0.4;
          }
        }

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          color,
          hasGlow,
          hasTwinkle,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawParticle = (particle: Particle, time: number) => {
      ctx.beginPath();
      
      let radius = 2;
      
      if (particle.hasGlow) {
        let glowIntensity = 1;
        
        if (particle.hasTwinkle) {
          // Gentle pulsing effect
          glowIntensity = 0.5 + 0.5 * Math.sin(time * 0.002 + particle.twinklePhase);
        }
        
        // Draw glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, 8 * glowIntensity
        );
        gradient.addColorStop(0, particle.color + "ff");
        gradient.addColorStop(0.5, particle.color + "44");
        gradient.addColorStop(1, particle.color + "00");
        
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, 8 * glowIntensity, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw the dot itself
      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawLines = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(58, 58, 58, ${0.15 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      });
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawLines();
      particles.forEach((particle) => drawParticle(particle, time));
      updateParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent", opacity }}
    />
  );
}