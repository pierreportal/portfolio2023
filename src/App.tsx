import React from 'react';
import { Player } from './Player';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from './app/Canvas';
import { BaseRoom, Wall } from './rooms/BaseRoom';
import { Debug } from '@react-three/cannon';

export const DEBUG = true;

function App() {
    return (
        <Canvas debug={DEBUG}>
            <Debug color='black' scale={1}>
                <ambientLight />
                {DEBUG ? <OrbitControls /> : <Player position={[0, 0, 0]} />}
                <pointLight position={[10, 15, 10]} castShadow />

                <BaseRoom surface={{ width: 12, depth: 6 }} position={{ x: 0, y: 0, z: 0 }}>
                    <Wall position={[-0.5, 0, 0]} args={[0.5, 3, 1]} />
                    <Wall position={[-0.5, 0, 3]} args={[0.5, 3, 3]} />
                    <Wall position={[-0.5, 3, 0]} args={[0.5, 2, 6]} />

                    <Wall position={[-0.5, 0, -0.5]} args={[13, 5, 0.5]} />
                    <Wall position={[-0.5, 0, 6]} args={[13, 5, 0.5]} />

                    <mesh position={[0, 0, 0]}>
                        <meshPhongMaterial color='orange' />
                        <boxGeometry args={[1, 1, 1]} />
                    </mesh>
                    <mesh position={[5, 0, 3]}>
                        <meshPhongMaterial color='orange' />
                        <boxGeometry args={[1, 1, 1]} />
                    </mesh>
                </BaseRoom>
                <BaseRoom surface={{ width: 3, depth: 10 }} position={{ x: 12.5, y: 0, z: 0 }} />
            </Debug>
        </Canvas>
    );
}

export default App;
