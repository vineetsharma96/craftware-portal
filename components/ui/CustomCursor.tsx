'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function CustomCursor() {
    const [mounted, setMounted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 });

    // 1. Raw Coordinates
    const mouseX = useMotionValue(-500);
    const mouseY = useMotionValue(-500);

    // 2. Physics Springs
    const springConfig = { damping: 28, stiffness: 220, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // 3. Top-level Hook Declarations (Never inside JSX or conditions)
    const dynamicHue = useTransform(
        [smoothX, smoothY],
        ([latestX, latestY]: number[]) => {
            const xRatio = Math.min(Math.max(latestX / (windowDimensions.width || 1), 0), 1);
            const yRatio = Math.min(Math.max(latestY / (windowDimensions.height || 1), 0), 1);
            return 170 + (xRatio * 0.6 + yRatio * 0.4) * 120; // Sweeps Cyan -> Violet -> Blue
        }
    );

    const ambientBackground = useTransform(dynamicHue, (h) => `hsla(${h}, 90%, 55%, 0.12)`);
    const radialBackground = useTransform(
        dynamicHue,
        (h) => `radial-gradient(circle, hsla(${h}, 90%, 60%, 0.18) 0%, transparent 65%)`
    );
    const ringColor = useTransform(dynamicHue, (h) => `hsla(${h}, 85%, 60%, 0.45)`);
    const dotColor = useTransform(dynamicHue, (h) => `hsl(${h}, 95%, 60%)`);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        setMounted(true);
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });

        const handleResize = () => {
            setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                target?.closest('button') ||
                target?.closest('a') ||
                target?.closest('input') ||
                target?.closest('select') ||
                target?.closest('textarea') ||
                target?.getAttribute('role') === 'button'
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseover', handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY, isVisible]);

    // Prevent hydration layout mismatch without breaking Hook execution order
    if (!mounted) {
        return null;
    }

    return (
        <div
            className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            aria-hidden="true"
        >
            {/* 1. Large Ambient Background Spotlight */}
            <motion.div
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: ambientBackground,
                }}
                className="fixed w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none -z-10"
            />

            {/* 2. Secondary Shifting Radial Accent */}
            <motion.div
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: radialBackground,
                }}
                className="fixed w-[320px] h-[320px] rounded-full blur-[60px] pointer-events-none -z-10"
            />

            {/* 3. Outer Precision Ring */}
            <motion.div
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: '-50%',
                    translateY: '-50%',
                    borderColor: ringColor,
                }}
                animate={{
                    scale: isHovered ? 1.8 : 1,
                    borderWidth: isHovered ? '1.5px' : '1px',
                }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="fixed w-8 h-8 rounded-full pointer-events-none"
            />

            {/* 4. Center Target Dot */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: dotColor,
                }}
                animate={{
                    scale: isHovered ? 0 : 1,
                    opacity: isHovered ? 0 : 1,
                }}
                transition={{ duration: 0.1 }}
                className="fixed w-1.5 h-1.5 rounded-full pointer-events-none"
            />
        </div>
    );
}