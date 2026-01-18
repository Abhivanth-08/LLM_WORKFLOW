import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scroll, TrendingDown, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { contextApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export function ContextWindowModule() {
  const [maxTokens, setMaxTokens] = useState(16000);

  const { data, isLoading } = useQuery({
    queryKey: ['recall-curve', maxTokens],
    queryFn: () => contextApi.getRecallCurve(maxTokens),
  });

  const recallData = data?.data || [];

  // Group by position for visualization
  const positions = ['start', 'middle', 'end'];
  const positionData = positions.map(pos => {
    const items = recallData.filter((d: any) => d.position === pos);
    const avgRecall = items.length > 0
      ? items.reduce((sum: number, d: any) => sum + d.recall, 0) / items.length
      : 0;
    return { position: pos, recall: avgRecall };
  });

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Context Window Analysis
        </h2>
        <p className="text-muted-foreground text-sm">
          Understand the "Lost in the Middle" problem
        </p>
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <h3 className="font-semibold text-foreground mb-3">What is a Context Window?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The context window is the maximum amount of text (measured in tokens) that an LLM can process at once.
          Research shows that LLMs have better recall for information at the <span className="text-green-500 font-medium">start</span> and <span className="text-green-500 font-medium">end</span> of the context,
          but struggle with the <span className="text-red-500 font-medium">middle</span>.
        </p>

        {/* Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Context Window Size: {maxTokens.toLocaleString()} tokens
          </label>
          <input
            type="range"
            min="1000"
            max="32000"
            step="1000"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1K</span>
            <span>16K</span>
            <span>32K</span>
          </div>
        </div>
      </motion.div>

      {/* Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 flex-1"
      >
        <h3 className="font-semibold text-foreground mb-4">Recall Performance by Position</h3>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {positionData.map((item, idx) => {
              const isGood = item.recall > 70;
              const Icon = isGood ? TrendingUp : TrendingDown;

              return (
                <motion.div
                  key={`${item.position}-${maxTokens}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={cn(
                        "w-4 h-4",
                        isGood ? "text-green-500" : "text-red-500"
                      )} />
                      <span className="text-sm font-medium text-foreground capitalize">
                        {item.position}
                      </span>
                    </div>
                    <span className={cn(
                      "text-sm font-mono font-bold",
                      isGood ? "text-green-500" : "text-red-500"
                    )}>
                      {item.recall.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.recall}%` }}
                      transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                      className={cn(
                        "h-full rounded-lg",
                        isGood
                          ? "bg-gradient-to-r from-green-500/50 to-green-500"
                          : "bg-gradient-to-r from-red-500/50 to-red-500"
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Key Insight */}
        <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-start gap-2">
            <Scroll className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium text-foreground mb-1">Key Insight</div>
              <div className="text-sm text-muted-foreground">
                Notice how the middle positions have lower recall scores. This is why it's important to place
                critical information at the <strong>beginning</strong> or <strong>end</strong> of your prompts!
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
