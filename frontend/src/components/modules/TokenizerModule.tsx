import { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Hash, Palette, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tokenizerApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Token {
  text: string;
  id: number;
}

export function TokenizerModule() {
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog.');
  const [hoveredToken, setHoveredToken] = useState<number | null>(null);

  // Fetch tokenization results
  const { data, isLoading, error } = useQuery({
    queryKey: ['tokenize', inputText],
    queryFn: () => tokenizerApi.tokenize(inputText),
    enabled: inputText.length > 0,
  });

  const tokens: Token[] = (data as any)?.tokens || [];
  const stats = (data as any)?.stats || { characters: 0, tokens: 0, compressionRatio: 0 };

  const colors = [
    'bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan',
    'bg-neon-violet/20 border-neon-violet/40 text-neon-violet',
    'bg-neon-emerald/20 border-neon-emerald/40 text-neon-emerald',
    'bg-neon-amber/20 border-neon-amber/40 text-neon-amber',
    'bg-neon-rose/20 border-neon-rose/40 text-neon-rose',
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Tokenizer Lab
        </h2>
        <p className="text-muted-foreground text-sm">
          Watch text transform into tokens in real-time
        </p>
      </motion.div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6">
        {[
          { icon: Type, label: 'Characters', value: stats.characters },
          { icon: Hash, label: 'Tokens', value: stats.tokens },
          { icon: Palette, label: 'Ratio', value: stats.compressionRatio.toFixed(2) + 'x' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel-subtle px-4 py-2 flex items-center gap-3"
          >
            <stat.icon className="w-4 h-4 text-primary" />
            <div>
              <div className="text-lg font-bold text-foreground font-mono">
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Input Text</span>
          </div>

          <div className="relative flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste text here..."
              className={cn(
                "w-full h-full resize-none rounded-lg p-4",
                "bg-muted/50 border border-border",
                "text-foreground font-mono text-sm leading-relaxed",
                "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                "placeholder:text-muted-foreground/50",
                "custom-scrollbar"
              )}
            />

            {/* Character count */}
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
              {inputText.length} chars
            </div>
          </div>
        </motion.div>

        {/* Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Tokens</span>
          </div>

          <div className="flex-1 flex flex-wrap content-start gap-2 p-4 bg-muted/30 rounded-lg border border-border overflow-auto custom-scrollbar">
            {isLoading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {error && (
              <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
                Error tokenizing text
              </div>
            )}

            {!isLoading && !error && tokens.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Type something to see tokens...
              </div>
            )}

            {!isLoading && tokens.map((token, index) => (
              <motion.div
                key={`${token.text}-${index}`}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: index * 0.03,
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                }}
                onMouseEnter={() => setHoveredToken(index)}
                onMouseLeave={() => setHoveredToken(null)}
                className="relative"
              >
                <div
                  className={cn(
                    "token-chip border font-mono",
                    colors[index % colors.length],
                    hoveredToken === index && "scale-110 z-10"
                  )}
                >
                  <span className="text-foreground">
                    {token.text === ' ' ? '␣' : token.text}
                  </span>
                </div>

                {/* Token ID tooltip */}
                {hoveredToken === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
                    style={{
                      top: index < 10 ? '100%' : 'auto',
                      bottom: index < 10 ? 'auto' : '100%',
                      marginTop: index < 10 ? '8px' : '0',
                      marginBottom: index < 10 ? '0' : '8px',
                    }}
                  >
                    <div className="bg-card border border-border rounded px-2 py-1 text-xs font-mono text-primary shadow-lg">
                      ID: {token.id}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Hover tokens to reveal IDs</span>
            <span className="text-primary">•</span>
            <span>Colors indicate token boundaries</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
