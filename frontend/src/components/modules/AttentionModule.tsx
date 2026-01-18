import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { attentionApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export function AttentionModule() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const [layer, setLayer] = useState(0);
  const [head, setHead] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const mutation = useMutation({
    mutationFn: (data: { text: string; layer: number; head: number }) =>
      attentionApi.analyze(data),
  });

  const handleAnalyze = () => {
    mutation.mutate({ text, layer, head });
  };

  const result = mutation.data as any;
  const tokens = result?.tokens || [];
  const matrix = result?.attention_matrix || [];

  // Get color for attention weight
  const getColor = (weight: number) => {
    const intensity = Math.round(weight * 255);
    return `rgb(${intensity}, ${Math.round(intensity * 0.6)}, ${255 - intensity})`;
  };

  return (
    <div className="min-h-full flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Attention Mechanism
        </h2>
        <p className="text-muted-foreground text-sm">
          Visualize how transformers attend to different tokens
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Input Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={cn(
                "w-full h-24 resize-none rounded-lg p-3",
                "bg-muted/50 border border-border",
                "text-foreground text-sm",
                "focus:outline-none focus:border-primary/50"
              )}
            />
          </div>

          {/* Layer and Head Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Layer: {layer}
              </label>
              <input
                type="range"
                min="0"
                max="11"
                value={layer}
                onChange={(e) => setLayer(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Head: {head}
              </label>
              <input
                type="range"
                min="0"
                max="11"
                value={head}
                onChange={(e) => setHead(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Analyze Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={mutation.isPending}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
              "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30",
              "text-foreground font-medium transition-all",
              "hover:from-primary/30 hover:to-secondary/30",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze Attention
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Attention Matrix */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Grid3X3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              Attention Heatmap (Layer {result?.layer || 0}, Head {result?.head || 0})
            </h3>
          </div>

          {tokens.length > 0 && matrix.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Heatmap - Left side (2 columns) */}
              <div className="lg:col-span-2 overflow-auto custom-scrollbar max-h-[600px] border border-border/50 rounded-lg">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2"></th>
                      {tokens.map((token: string, idx: number) => (
                        <th key={idx} className="p-2 text-xs text-muted-foreground font-mono">
                          {token}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row: number[], rowIdx: number) => (
                      <tr key={rowIdx}>
                        <td className="p-2 text-xs text-muted-foreground font-mono">
                          {tokens[rowIdx]}
                        </td>
                        {row.map((weight: number, colIdx: number) => (
                          <td
                            key={colIdx}
                            className="p-2 text-center cursor-pointer transition-transform hover:scale-110"
                            style={{
                              backgroundColor: getColor(weight),
                              minWidth: '40px',
                              minHeight: '40px',
                            }}
                            onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <span className="text-xs font-mono text-white drop-shadow">
                              {weight.toFixed(2)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Word labels and info - Right side (1 column) */}
              <div className="lg:col-span-1 space-y-4">
                {/* Word labels with hover highlighting */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Sentence Tokens</h4>
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {tokens.map((token: string, idx: number) => (
                      <div
                        key={idx}
                        className={cn(
                          "px-3 py-2 rounded text-sm font-mono transition-all",
                          hoveredCell && (hoveredCell.row === idx || hoveredCell.col === idx)
                            ? "bg-primary/20 border border-primary text-primary font-bold scale-105"
                            : "bg-muted/30 border border-border text-foreground"
                        )}
                      >
                        <span className="text-xs text-muted-foreground mr-2">{idx}</span>
                        {token}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover info */}
                {hoveredCell && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-primary/10 border border-primary/30"
                  >
                    <div className="text-sm font-semibold mb-2 text-foreground">Connection</div>
                    <div className="text-sm mb-2">
                      <span className="font-bold text-primary">{tokens[hoveredCell.row]}</span>
                      {' → '}
                      <span className="font-bold text-secondary">{tokens[hoveredCell.col]}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Weight: <span className="font-mono text-foreground">{matrix[hoveredCell.row][hoveredCell.col].toFixed(4)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Position: [{hoveredCell.row}, {hoveredCell.col}]
                    </div>
                  </motion.div>
                )}

                {!hoveredCell && (
                  <div className="p-4 rounded-lg bg-muted/20 border border-border">
                    <div className="text-xs text-muted-foreground">
                      💡 Hover over any cell in the heatmap to see which words are attending to each other
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColor(0) }} />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColor(0.5) }} />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColor(1) }} />
              <span>High</span>
            </div>
          </div>
        </motion.div>
      )}

      {mutation.isError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
          Error analyzing attention
        </div>
      )}
    </div>
  );
}
