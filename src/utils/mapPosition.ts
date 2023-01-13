import { Vector3 } from '@react-three/fiber';

export const mapPosition = (
    position: { x: number; y: number; z: number },
    dimension: { width: number; height: number; depth: number },
    wallSic: number
) => {
    const { x, y, z } = position;
    const { width, height, depth } = dimension;

    const mappedX = x;
    const mappedY = y;
    const mappedZ = z;

    return {
        position: [mappedX, mappedY, mappedZ] as Vector3,
        dimension,
    };
};
