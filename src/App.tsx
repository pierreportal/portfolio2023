import React from 'react';
import { Player } from './Player';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from './app/Canvas';

function App() {
    return (
        <Canvas>
            {/* <OrbitControls /> */}
            <Player position={[0, 0, 0]} />
            <pointLight position={[10, 10, 10]} />
            <mesh>
                <boxGeometry />
                <meshStandardMaterial color='hotpink' />
            </mesh>
        </Canvas>
    );
}

export default App;
