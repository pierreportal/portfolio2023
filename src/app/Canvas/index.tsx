import React from 'react';
import { Canvas as ThreeCanvas } from 'react-three-fiber';
import { Physics } from '@react-three/cannon';

interface ICanvasProps {
    debug: boolean;
    children: Array<React.ReactElement> | React.ReactElement;
}

export const Canvas: React.FC<ICanvasProps> = ({ debug, children }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const lockControl = React.useCallback(
        () => canvasRef.current?.requestPointerLock(),
        [canvasRef]
    );

    React.useEffect(() => {
        if (!debug) {
            const canvas = canvasRef.current;
            canvas?.addEventListener('mousedown', lockControl);
            return () => canvas?.removeEventListener('mousedown', lockControl);
        }
    }, [canvasRef, lockControl]);

    return (
        <ThreeCanvas shadows ref={canvasRef}>
            <Physics>{children}</Physics>
        </ThreeCanvas>
    );
};
