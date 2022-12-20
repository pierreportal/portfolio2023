import React from 'react';
import { Triplet, useBox } from '@react-three/cannon';
import { useFrame, useThree } from 'react-three-fiber';
import { FirstPersonCamera } from '../utils/fpsCamera';

const ctr = new FirstPersonCamera();

interface IPlayerProps {
    position: Triplet;
}

export const Player: React.FC<IPlayerProps> = ({ position }) => {
    const { camera } = useThree();
    const cameraRef = React.useRef(camera);

    const [playerRef, api] = useBox(() => ({
        type: 'Dynamic',
        mass: 100,
        position,
        args: [1, 2, 1],
    }));

    api.position.subscribe((p: Triplet) => {
        playerRef.current?.position.set(...p);
    });

    ctr.camera_ = cameraRef.current;
    ctr.playerApi_ = api;
    useFrame(() => {
        ctr.update([0, 0, 0]);
        cameraRef.current?.position.set(
            playerRef.current?.position.x as number,
            cameraRef.current?.position.y || ((2 - 0.3) as number),
            playerRef.current?.position.z as number
        );
        api.rotation.set(0, 0, 0);
    });
    return <mesh ref={playerRef as any} />;
};
