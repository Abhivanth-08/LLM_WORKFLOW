import { motion } from 'framer-motion';
import { Sigma, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export function ContextBar() {
  const { mathModeEnabled, toggleMathMode, activeModule } = useAppStore();

  const moduleLabels: Record<string, string> = {
    architecture: 'LLM Architecture',
    tokenizer: 'Tokenizer Lab',
    embeddings: 'Embedding Space',
    attention: 'Attention Mechanism',
    context: 'Context Window',
    redteaming: 'Red Teaming',
    router: 'Smart Cost Router',
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background/50 backdrop-blur-sm">
      {/* Module Title */}
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <h1 className="text-lg font-semibold text-foreground">
          {moduleLabels[activeModule]}
        </h1>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">AI Ready</span>
        </div>

        {/* Math Mode Toggle */}
        <button
          onClick={toggleMathMode}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
            "border text-sm font-medium",
            mathModeEnabled
              ? "bg-secondary/20 border-secondary text-secondary glow-violet"
              : "bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:border-secondary/50"
          )}
        >
          <Sigma className="w-4 h-4" />
          <span>Math Mode</span>
          <div className={cn(
            "w-8 h-4 rounded-full transition-colors relative",
            mathModeEnabled ? "bg-secondary" : "bg-muted"
          )}>
            <motion.div
              className="absolute top-0.5 w-3 h-3 rounded-full bg-foreground"
              animate={{ left: mathModeEnabled ? 16 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </button>
      </div>
    </header>
  );
}
