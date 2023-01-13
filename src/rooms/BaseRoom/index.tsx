import { Vector3 } from '@react-three/fiber';
import React from 'react';
import { mapPosition } from 'src/utils/mapPosition';
import { Triplet, useBox, usePlane } from '@react-three/cannon';

export type Surface = {
    width: number;
    depth: number;
};

export type Position3D = {
    x: number;
    y: number;
    z: number;
};

interface IBaseRoomProps {
    position: Position3D;
    surface: Surface;
    height?: number;
    children?: React.ReactElement | Array<React.ReactElement>;
}

const FLOOR_LEVEL = 0;
const WALL_SIC = 0.5;

type WallProps = {
    position: Vector3;
    args: [width: number, height: number, depth: number];
    door?: Array<number>;
};

interface IWalls {
    left: WallProps;
    right: WallProps;
    near: WallProps;
    far: WallProps;
}

const _BaseRoom: React.FC<IBaseRoomProps> = ({
    position,
    surface,
    height = 3,
    children = null,
}) => {
    const { position: roomPosition } = mapPosition(position, { ...surface, height }, WALL_SIC);

    const { width, depth } = surface;
    const positionedChildren = React.useMemo(
        () =>
            React.Children.map(children, child => {
                const { position } = child!.props;
                const args =
                    child!.props.args ||
                    child!.props.children?.find((c: any) => !!c.props?.args)?.props.args;
                console.log(args);
                position[0] -= width / 2 - args[0] / 2;
                position[1] += FLOOR_LEVEL + args[1] / 2;
                position[2] -= depth / 2 - args[2] / 2;

                return React.cloneElement(child!, {
                    castShadow: true,
                    receiveShadow: true,
                });
            }),
        [children, depth, width]
    );

    return (
        <group position={roomPosition}>
            <Wall
                roomPosition={roomPosition}
                position={[0, 5.25, 0]}
                args={[width + 1, 0.5, depth + 1]}
            />
            {positionedChildren}
            <Plane
                roomPosition={roomPosition}
                position={[0, FLOOR_LEVEL, 0]}
                dimensions={[width + 1, depth + 1]}
                rotation={[-Math.PI / 2, 0, 0]}
            />
        </group>
    );
};

interface IPlaneProps {
    position: Triplet;
    dimensions: [x: number, z: number];
    rotation?: any;
    roomPosition?: any;
}

const Plane: React.FC<IPlaneProps> = ({ position, dimensions, rotation, roomPosition }) => {
    const [planeRef]: any = usePlane(() => ({
        type: 'Static',
        args: dimensions,
        position: [...position].map((x: number, i: number) => x + (roomPosition?.[i] || 0)) as any,
        rotation,
    }));

    return (
        <mesh ref={planeRef} receiveShadow rotation={rotation}>
            <meshPhongMaterial />
            <planeGeometry args={dimensions} />
        </mesh>
    );
};

interface IWallProps {
    position: Triplet;
    args: [number, number, number];
    roomPosition?: any;
}
export const Wall: React.FC<IWallProps> = ({ position, args, roomPosition }) => {
    const [ref]: any = useBox(() => ({
        position: [...position].map((x: number, i: number) => x + (roomPosition?.[i] || 0)) as any,
        mass: 1,
        type: 'Static',
        args,
    }));
    return (
        <mesh ref={ref} position={[0, 0, 0]}>
            <meshPhongMaterial />
            <boxGeometry args={args} />
        </mesh>
    );
};

export const BaseRoom = React.memo(_BaseRoom);
