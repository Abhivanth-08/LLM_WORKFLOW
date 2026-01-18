import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Send, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { embeddingsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Embeddings3DVisualization } from './Embeddings3DVisualization';

export function EmbeddingsModule() {
  const [texts, setTexts] = useState([
    'Machine learning is fascinating',
    'AI will change the world',
    'I love pizza',
    'Neural networks are powerful',
  ]);
  const [newText, setNewText] = useState('');

  const mutation = useMutation({
    mutationFn: (textList: string[]) => embeddingsApi.generate(textList),
  });

  const handleGenerate = () => {
    mutation.mutate(texts.filter(t => t.trim()));
  };

  const handleAddText = () => {
    if (newText.trim()) {
      setTexts([...texts, newText.trim()]);
      setNewText('');
    }
  };

  const handleRemoveText = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const points = (mutation.data as any)?.points || [];

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Embeddings Lab
        </h2>
        <p className="text-muted-foreground text-sm">
          Visualize text embeddings in 3D space
        </p>
      </motion.div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Input Texts</h3>

          <div className="space-y-2 mb-4">
            {texts.map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border"
              >
                <span className="flex-1 text-sm text-foreground">{text}</span>
                <button
                  onClick={() => handleRemoveText(idx)}
                  className="text-red-500 hover:text-red-400 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
              placeholder="Add new text..."
              className={cn(
                "flex-1 px-3 py-2 rounded-lg",
                "bg-muted/50 border border-border",
                "text-foreground text-sm",
                "focus:outline-none focus:border-primary/50"
              )}
            />
            <button
              onClick={handleAddText}
              className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
            >
              Add
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={mutation.isPending || texts.length === 0}
            className={cn(
              "w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
              "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30",
              "text-foreground font-medium transition-all",
              "hover:from-primary/30 hover:to-secondary/30",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Embeddings
              </>
            )}
          </motion.button>
        </motion.div>

        {/* 3D Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">3D Projection</h3>

          {mutation.isPending && (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {mutation.isError && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500">
              Error generating embeddings
            </div>
          )}

          {!mutation.isPending && !mutation.isError && points.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Box className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Add some texts and click "Generate Embeddings" to visualize
              </p>
            </div>
          )}

          {!mutation.isPending && points.length > 0 && (
            <div className="space-y-4">
              <Embeddings3DVisualization points={points} />

              {/* Coordinate details (collapsible) */}
              <details className="text-sm">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  View Coordinates
                </summary>
                <div className="mt-2 space-y-2 max-h-48 overflow-auto custom-scrollbar">
                  {points.map((point: any, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-muted/20 border border-border/50">
                      <div className="text-foreground font-medium mb-1">{point.text}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-muted-foreground">X:</span>
                          <span className="text-primary ml-1">{point.x.toFixed(3)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Y:</span>
                          <span className="text-secondary ml-1">{point.y.toFixed(3)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Z:</span>
                          <span className="text-accent ml-1">{point.z.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4"
      >
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">What are embeddings?</strong> They are numerical representations of text that capture semantic meaning.
            Similar texts will have similar embeddings (closer in 3D space).
          </div>
        </div>
      </motion.div>
    </div>
  );
}
