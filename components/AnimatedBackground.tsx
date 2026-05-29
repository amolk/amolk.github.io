'use client';

import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none"
            style={{ pointerEvents: 'none', zIndex: 0 }}
        >
            {/* Base gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-neutral-50/50 to-neutral-100/30" />

            {/* Animated grain texture */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                    animation: 'grain-shift 20s linear infinite',
                }}
            />

            {/* Subtle grid pattern responsive to mouse */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
          `,
                    backgroundSize: '80px 80px',
                    transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)`,
                    willChange: 'transform',
                }}
            />

            {/* Floating orb 1 - top left */}
            <div
                className="absolute w-96 h-96 rounded-full opacity-[0.08]"
                style={{
                    left: '-10%',
                    top: '-10%',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)',
                    animation: 'float-slow 12s ease-in-out infinite',
                }}
            />

            {/* Floating orb 2 - bottom right */}
            <div
                className="absolute w-80 h-80 rounded-full opacity-[0.06]"
                style={{
                    right: '-5%',
                    bottom: '-5%',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)',
                    animation: 'float-slow 15s ease-in-out infinite 2s',
                }}
            />

            {/* Diagonal shimmer accent */}
            <div
                className="absolute inset-0 opacity-0"
                style={{
                    background:
                        'linear-gradient(135deg, transparent 30%, rgba(0,0,0,0.02) 50%, transparent 70%)',
                    animation: 'shimmer 8s ease-in-out infinite',
                }}
            />

            {/* Mouse-reactive light glow - subtle */}
            <div
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-[0.03]"
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    willChange: 'transform',
                    transition: 'all 0.05s ease-out',
                }}
            />
        </div>
    );
}
