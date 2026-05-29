import { useEffect, useState, RefObject } from 'react';

interface UseMouseDistanceOpacityOptions {
    d1?: number;
    d2?: number;
    hintDuration?: number;
}

/**
 * Custom hook that adjusts element opacity based on mouse distance
 * Uses exponential decay for smooth fading
 * Includes transient hint for better discoverability
 *
 * @param elementRef - Reference to the DOM element
 * @param options - Configuration options
 * @returns opacity value between 0 and 1
 */
export function useMouseDistanceOpacity(
    elementRef: RefObject<HTMLElement>,
    options: UseMouseDistanceOpacityOptions = {},
): number {
    const { d1 = 200, d2 = 400, hintDuration = 100 } = options;
    const [opacity, setOpacity] = useState(0.5);

    useEffect(() => {
        // Detect touch devices - NOOP for touch
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            setOpacity(1);
            return;
        }

        const calculateOpacity = (mouseX: number, mouseY: number): number => {
            const element = elementRef.current;
            if (!element) return 1;

            const rect = element.getBoundingClientRect();

            // Find nearest point on element's bounding box to mouse
            const nearestX = Math.max(rect.left, Math.min(mouseX, rect.right));
            const nearestY = Math.max(rect.top, Math.min(mouseY, rect.bottom));

            // Calculate L1 (Manhattan) distance - faster than Euclidean
            const distance = Math.abs(mouseX - nearestX) + Math.abs(mouseY - nearestY);

            // Apply opacity logic
            if (distance < d1) {
                // Fully visible
                return 1.0;
            } else if (distance > d2) {
                // Invisible
                return 0.0;
            } else {
                // Exponential decay from 1 at d1 to 0 at d2
                // Normalized formula: (exp(-k * t) - exp(-k)) / (1 - exp(-k))
                // where t = (d - d1) / (d2 - d1) goes from 0 to 1
                const t = (distance - d1) / (d2 - d1);
                const k = 10; // Steepness factor
                const expK = Math.exp(-k);
                return (Math.exp(-k * t) - expK) / (1 - expK);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const element = elementRef.current;
            if (!element) return;

            // Calculate and set distance-based opacity
            const calculatedOpacity = calculateOpacity(e.clientX, e.clientY);
            setOpacity(calculatedOpacity);
        };

        // Add mouse move listener
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [elementRef, d1, d2]);

    return opacity;
}
