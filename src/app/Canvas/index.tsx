import React from 'react';
import { Canvas as ThreeCanvas } from 'react-three-fiber';
import { Physics } from '@react-three/cannon';

interface ICanvasProps {
    children: Array<React.ReactElement> | React.ReactElement;
}

export const Canvas: React.FC<ICanvasProps> = ({ children }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const lockControl = React.useCallback(
        () => canvasRef.current?.requestPointerLock(),
        [canvasRef]
    );

    React.useEffect(() => {
        const canvas = canvasRef.current;
        canvas?.addEventListener('mousedown', lockControl);
        return () => canvas?.removeEventListener('mousedown', lockControl);
    }, [canvasRef, lockControl]);

    return (
        <ThreeCanvas ref={canvasRef}>
            <Physics>{children}</Physics>
        </ThreeCanvas>
    );
};
