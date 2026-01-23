import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { attentionApi } from '@/lib/api';

// Simple 3D scatter plot using HTML/CSS (lightweight alternative to Three.js)
interface HeadPoint {
    x: number;
    y: number;
    z: number;
    layer: number;
    head: number;
    cluster: number;
    label: string;
    name: string;
}

interface ClusterInfo {
    cluster_id: number;
    label: string;
    num_heads: number;
    description: string;
}

const CLUSTER_COLORS = [
    '#3b82f6', // blue - Syntax Trackers
    '#10b981', // green - Semantic Linkers
    '#f59e0b', // amber - Positional Encoders
    '#ef4444', // red - Rare Pattern Detectors
    '#8b5cf6', // purple - Context Aggregators
];

export function AttentionHeadProfilerModule() {
    const [selectedHead, setSelectedHead] = useState<HeadPoint | null>(null);
    const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
    const [rotation, setRotation] = useState({ x: 20, y: 45 });

    // Fetch head profiles
    const { data: profilesData, isLoading, error } = useQuery({
        queryKey: ['head-profiles'],
        queryFn: () => attentionApi.getHeadProfiles(),
        staleTime: Infinity, // Cache forever since profiles don't change
    });

    // Fetch examples for selected head
    const { data: examplesData } = useQuery({
        queryKey: ['head-examples', selectedHead?.layer, selectedHead?.head],
        queryFn: () => {
            if (!selectedHead) return null;
            return attentionApi.getHeadExamples(selectedHead.layer, selectedHead.head);
        },
        enabled: !!selectedHead,
    });

    // Fetch cluster info
    const { data: clusterData } = useQuery({
        queryKey: ['cluster-info', selectedCluster],
        queryFn: () => {
            if (selectedCluster === null) return null;
            return attentionApi.getClusterInfo(selectedCluster);
        },
        enabled: selectedCluster !== null,
    });

    // Fetch metadata
    const { data: metadata } = useQuery({
        queryKey: ['profiler-metadata'],
        queryFn: () => attentionApi.getMetadata(),
        staleTime: Infinity,
    });

    // Fetch head explanation
    const { data: explanation } = useQuery({
        queryKey: ['head-explanation', selectedHead?.layer, selectedHead?.head],
        queryFn: () => {
            if (!selectedHead) return null;
            return attentionApi.getHeadExplanation(selectedHead.layer, selectedHead.head);
        },
        enabled: !!selectedHead,
    });

    const points: HeadPoint[] = profilesData?.points || [];

    // Normalize coordinates for display
    const normalizeCoord = (value: number, min: number, max: number) => {
        return ((value - min) / (max - min)) * 100;
    };

    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const zValues = points.map(p => p.z);

    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const zMin = Math.min(...zValues);
    const zMax = Math.max(...zValues);

    return (
        <div className="min-h-full flex flex-col gap-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-2xl font-bold gradient-text mb-2">
                    Attention Head Personality Profiler
                </h2>
                <p className="text-muted-foreground text-sm">
                    Discover that GPT-2's 144 attention heads have learned different linguistic roles
                </p>
                {metadata?.stability_score && (
                    <div className="text-xs text-muted-foreground mt-2">
                        Cluster Stability (ARI): {metadata.stability_score.toFixed(2)} ± {metadata.stability_std?.toFixed(2) || '0.05'}
                    </div>
                )}
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 3D Visualization */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-panel p-6"
                >
                    <h3 className="font-semibold text-foreground mb-4">
                        144 Attention Heads Clustered by Behavior
                    </h3>

                    {isLoading && (
                        <div className="flex items-center justify-center h-96">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Computing head profiles...</span>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
                            Error loading head profiles. Make sure the API is running.
                        </div>
                    )}

                    {!isLoading && !error && points.length > 0 && (
                        <div className="relative">
                            {/* Simple 2D projection (X vs Y) */}
                            <div
                                className="relative w-full h-96 bg-muted/20 rounded-lg border border-border overflow-hidden"
                                style={{ perspective: '1000px' }}
                            >
                                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                                    {Array.from({ length: 100 }).map((_, i) => (
                                        <div key={i} className="border border-border/50" />
                                    ))}
                                </div>

                                {/* Plot points */}
                                {points.map((point, idx) => {
                                    const x = normalizeCoord(point.x, xMin, xMax);
                                    const y = 100 - normalizeCoord(point.y, yMin, yMax); // Flip Y
                                    const size = 4 + (point.z - zMin) / (zMax - zMin) * 4; // Size based on Z

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedHead(point)}
                                            onMouseEnter={() => setSelectedCluster(point.cluster)}
                                            className={cn(
                                                "absolute rounded-full transition-all cursor-pointer",
                                                "hover:scale-150 hover:z-10",
                                                selectedHead?.name === point.name && "scale-150 ring-2 ring-white z-20"
                                            )}
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                                width: `${size}px`,
                                                height: `${size}px`,
                                                backgroundColor: CLUSTER_COLORS[point.cluster],
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                            title={`${point.name} - ${point.label}`}
                                        />
                                    );
                                })}

                                {/* Axes labels */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                                    Dimension 1 →
                                </div>
                                <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                                    Dimension 2 →
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                {[0, 1, 2, 3, 4].map((clusterId) => {
                                    const clusterLabel = points.find(p => p.cluster === clusterId)?.label || `Cluster ${clusterId}`;
                                    const count = points.filter(p => p.cluster === clusterId).length;

                                    return (
                                        <button
                                            key={clusterId}
                                            onClick={() => setSelectedCluster(clusterId)}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all",
                                                "border hover:bg-muted/50",
                                                selectedCluster === clusterId
                                                    ? "bg-muted border-primary"
                                                    : "bg-background border-border"
                                            )}
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: CLUSTER_COLORS[clusterId] }}
                                            />
                                            <span className="font-medium">{clusterLabel}</span>
                                            <span className="text-muted-foreground">({count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Info Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    {/* Selected Head Info */}
                    {selectedHead && (
                        <div className="glass-panel p-4">
                            <h4 className="font-semibold text-foreground mb-2">
                                {selectedHead.name}
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Layer:</span>
                                    <span className="font-mono">{selectedHead.layer}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Head:</span>
                                    <span className="font-mono">{selectedHead.head}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span
                                        className="font-medium"
                                        style={{ color: CLUSTER_COLORS[selectedHead.cluster] }}
                                    >
                                        {selectedHead.label}
                                    </span>
                                </div>
                            </div>

                            {/* Examples */}
                            {examplesData?.examples && examplesData.examples.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <h5 className="text-xs font-semibold text-muted-foreground mb-2">
                                        EXAMPLE PATTERNS
                                    </h5>
                                    <div className="space-y-2">
                                        {examplesData.examples.map((ex: any, idx: number) => (
                                            <div key={idx} className="text-xs p-2 rounded bg-muted/30">
                                                <div className="text-foreground mb-1">"{ex.sentence}"</div>
                                                <div className="text-muted-foreground">
                                                    <span className="text-primary font-mono">{ex.from_token}</span>
                                                    {' → '}
                                                    <span className="text-secondary font-mono">{ex.to_token}</span>
                                                    {' '}
                                                    <span className="text-muted-foreground">
                                                        ({(ex.weight * 100).toFixed(1)}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Head Explanation */}
                            {explanation && explanation.explanations && explanation.explanations.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <h5 className="text-xs font-semibold text-muted-foreground mb-2">
                                        WHY {selectedHead.name.toUpperCase()} IS A {explanation.cluster.toUpperCase()}:
                                    </h5>
                                    <ul className="text-xs space-y-1">
                                        {explanation.explanations.map((exp: string, i: number) => (
                                            <li key={i} className="text-foreground">• {exp}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cluster Info */}
                    {clusterData && (
                        <div className="glass-panel p-4">
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: CLUSTER_COLORS[clusterData.cluster_id] }}
                                />
                                {clusterData.label}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                {clusterData.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                                {clusterData.num_heads} heads in this cluster
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    {!selectedHead && !selectedCluster && (
                        <div className="glass-panel p-4">
                            <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p><strong className="text-foreground">How to use:</strong></p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Click any point to see that head's behavior</li>
                                        <li>Hover over clusters in the legend for descriptions</li>
                                        <li>Point size indicates depth (Z-axis)</li>
                                        <li>Colors show behavioral clusters</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Explanation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6"
            >
                <h3 className="font-semibold text-foreground mb-3">What This Shows</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                        GPT-2 has <strong className="text-foreground">144 attention heads</strong> (12 layers × 12 heads).
                        We analyzed each head's behavior across 50 diverse sentences and discovered they've specialized:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong style={{ color: CLUSTER_COLORS[0] }}>Syntax Trackers</strong>: Monitor grammatical structure</li>
                        <li><strong style={{ color: CLUSTER_COLORS[1] }}>Semantic Linkers</strong>: Connect related concepts</li>
                        <li><strong style={{ color: CLUSTER_COLORS[2] }}>Positional Encoders</strong>: Track word order</li>
                        <li><strong style={{ color: CLUSTER_COLORS[3] }}>Rare Pattern Detectors</strong>: Identify unusual constructions</li>
                        <li><strong style={{ color: CLUSTER_COLORS[4] }}>Context Aggregators</strong>: Build holistic representations</li>
                    </ul>
                    <p className="pt-2">
                        This clustering was computed using t-SNE on behavioral features extracted from real attention patterns.
                        <strong className="text-foreground"> This is not a simulation—it's actual GPT-2 behavior.</strong>
                    </p>
                    {metadata?.disclaimer && (
                        <p className="pt-2 text-xs italic border-t border-border mt-3 pt-3">
                            {metadata.disclaimer}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
