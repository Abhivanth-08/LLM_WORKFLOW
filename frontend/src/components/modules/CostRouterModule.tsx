import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, DollarSign, Zap, Award, Send } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { costApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const complexityLevels = [
  { label: 'Simple', description: 'Basic Q&A, classification', value: 1 },
  { label: 'Moderate', description: 'Summarization, analysis', value: 2 },
  { label: 'Complex', description: 'Reasoning, code generation', value: 3 },
  { label: 'Advanced', description: 'Multi-step, creative tasks', value: 4 },
];

type Priority = 'quality' | 'speed' | 'cost';

export function CostRouterModule() {
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [complexity, setComplexity] = useState(2);
  const [priority, setPriority] = useState<Priority>('quality');

  const mutation = useMutation({
    mutationFn: (data: {
      prompt: string;
      system_prompt: string;
      complexity: number;
      priority: Priority;
    }) => costApi.analyze(data),
  });

  const handleAnalyze = () => {
    if (!prompt.trim()) return;
    mutation.mutate({
      prompt,
      system_prompt: systemPrompt,
      complexity,
      priority,
    });
  };

  const result = mutation.data as any;

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Smart Cost Router
        </h2>
        <p className="text-muted-foreground text-sm">
          Find the optimal model for your use case
        </p>
      </motion.div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prompt Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              System Prompt (Optional)
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant..."
              className={cn(
                "w-full h-20 resize-none rounded-lg p-3",
                "bg-muted/50 border border-border",
                "text-foreground text-sm",
                "focus:outline-none focus:border-primary/50"
              )}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Your Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className={cn(
                "w-full h-32 resize-none rounded-lg p-3",
                "bg-muted/50 border border-border",
                "text-foreground text-sm",
                "focus:outline-none focus:border-primary/50"
              )}
            />
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 space-y-4"
        >
          {/* Complexity */}
          <div>
            <div className="text-sm font-medium text-foreground mb-3">Task Complexity</div>
            <div className="space-y-2">
              {complexityLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setComplexity(level.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left",
                    complexity === level.value
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/30 border border-transparent hover:border-border"
                  )}
                >
                  <div>
                    <div className={cn(
                      "text-sm font-medium",
                      complexity === level.value ? "text-primary" : "text-foreground"
                    )}>
                      {level.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{level.description}</div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          i < level.value
                            ? complexity === level.value ? "bg-primary" : "bg-muted-foreground"
                            : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <div className="text-sm font-medium text-foreground mb-3">Optimization Priority</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'quality' as Priority, icon: Award, label: 'Quality', color: 'text-neon-violet' },
                { id: 'speed' as Priority, icon: Zap, label: 'Speed', color: 'text-neon-amber' },
                { id: 'cost' as Priority, icon: DollarSign, label: 'Cost', color: 'text-neon-emerald' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPriority(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg transition-all",
                    priority === item.id
                      ? "bg-secondary/10 border border-secondary/30"
                      : "bg-muted/30 border border-transparent hover:border-border"
                  )}
                >
                  <item.icon className={cn(
                    "w-6 h-6",
                    priority === item.id ? item.color : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    priority === item.id ? "text-secondary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analyze Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyze}
        disabled={mutation.isPending || !prompt.trim()}
        className={cn(
          "w-full max-w-md mx-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg",
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
            Get Recommendation
          </>
        )}
      </motion.button>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Recommended Model */}
          <div className="lg:col-span-1 glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm uppercase tracking-wide text-muted-foreground">
                Recommended
              </span>
            </div>
            <div className="text-2xl font-bold text-primary mb-2">
              {result.recommended.name}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              {result.recommended.description}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quality</span>
                <span className="font-mono text-foreground">{result.recommended.quality}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speed</span>
                <span className="font-mono text-foreground">{result.recommended.speed} tok/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-mono text-green-500">${result.recommended.cost.toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* All Models */}
          <div className="lg:col-span-2 glass-panel p-6">
            <h3 className="font-semibold text-foreground mb-4">All Models Comparison</h3>
            <div className="space-y-2 max-h-64 overflow-auto custom-scrollbar">
              {result.all_models.map((model: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <span className="text-sm text-foreground">{model.name}</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    ${model.cost.toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {mutation.isError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
          Error analyzing cost
        </div>
      )}
    </div>
  );
}
