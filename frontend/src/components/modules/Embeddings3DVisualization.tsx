import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useMemo } from 'react';

interface Point3D {
    text: string;
    x: number;
    y: number;
    z: number;
    cluster: string;
}

interface Embeddings3DProps {
    points: Point3D[];
}

function Point({ position, text, color }: { position: [number, number, number]; text: string; color: string }) {
    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text
                position={[0, 0.1, 0]}
                fontSize={0.08}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {text}
            </Text>
        </group>
    );
}

export function Embeddings3DVisualization({ points }: Embeddings3DProps) {
    const normalizedPoints = useMemo(() => {
        if (points.length === 0) return [];

        // Find min/max for normalization
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const zs = points.map(p => p.z);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const minZ = Math.min(...zs);
        const maxZ = Math.max(...zs);

        // Calculate ranges
        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        const rangeZ = maxZ - minZ || 1;

        // Use the maximum range for uniform scaling
        const maxRange = Math.max(rangeX, rangeY, rangeZ);

        // Normalize to [-2, 2] range while preserving relative distances
        return points.map(p => ({
            ...p,
            x: ((p.x - minX) / maxRange) * 4 - 2,
            y: ((p.y - minY) / maxRange) * 4 - 2,
            z: ((p.z - minZ) / maxRange) * 4 - 2,
        }));
    }, [points]);

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden bg-muted/30 border border-border relative">
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} />

                {/* Grid helper */}
                <gridHelper args={[8, 20, '#444444', '#222222']} position={[0, -2, 0]} />

                {/* Axes with labels */}
                <group>
                    {/* X axis - Red */}
                    <line>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([-3, -2, 0, 3, -2, 0])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#ff4444" linewidth={2} />
                    </line>
                    <Text position={[3.3, -2, 0]} fontSize={0.15} color="#ff4444">
                        Dim 1
                    </Text>

                    {/* Y axis - Green */}
                    <line>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([0, -2, 0, 0, 2, 0])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#44ff44" linewidth={2} />
                    </line>
                    <Text position={[0, 2.3, 0]} fontSize={0.15} color="#44ff44">
                        Dim 2
                    </Text>

                    {/* Z axis - Blue */}
                    <line>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([0, -2, -3, 0, -2, 3])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#4444ff" linewidth={2} />
                    </line>
                    <Text position={[0, -2, 3.3]} fontSize={0.15} color="#4444ff">
                        Dim 3
                    </Text>
                </group>

                {/* Data points */}
                {normalizedPoints.map((point, idx) => (
                    <Point
                        key={idx}
                        position={[point.x, point.y, point.z]}
                        text={point.text.substring(0, 15)}
                        color={point.cluster === 'User Input' ? '#fbbf24' : '#3b82f6'}
                    />
                ))}

                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={3}
                    maxDistance={15}
                />
            </Canvas>

            <div className="absolute top-2 left-2 text-xs font-semibold text-foreground bg-card/90 px-3 py-1.5 rounded border border-border">
                Semantic Vector Space (Real Projection)
            </div>

            <div className="absolute bottom-2 right-2 flex items-center gap-3 text-xs bg-card/90 px-3 py-1.5 rounded border border-border">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                    <span className="text-muted-foreground">Reference</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div>
                    <span className="text-muted-foreground">User Input</span>
                </div>
            </div>

            <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded">
                🖱️ Drag to rotate • 🔍 Scroll to zoom • {points.length} points
            </div>
        </div>
    );
}
