import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Zap, Sparkles, Brain, Layers, Binary, Network, Cpu, FileOutput } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface ArchBlock {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  mathFormula?: string;
  details: string[];
}

const architectureBlocks: ArchBlock[] = [
  {
    id: 'input',
    label: 'Input Text',
    description: 'Raw text sequence',
    icon: FileOutput,
    details: [
      'User provides raw text input',
      'Text is preprocessed (lowercasing, normalization)',
      'Handles various encodings (UTF-8, etc.)',
    ],
  },
  {
    id: 'tokenizer',
    label: 'Tokenizer',
    description: 'Text → Tokens',
    icon: Binary,
    mathFormula: 'T = tokenize(text) → [t₁, t₂, ..., tₙ]',
    details: [
      'Splits text into subword tokens (BPE, WordPiece)',
      'Maps tokens to integer IDs from vocabulary',
      'Adds special tokens ([CLS], [SEP], [PAD])',
      'Vocabulary size typically 32K-100K tokens',
    ],
  },
  {
    id: 'embedding',
    label: 'Embeddings',
    description: 'Tokens → Vectors',
    icon: Sparkles,
    mathFormula: 'E = W_e · T + P_e',
    details: [
      'Token embeddings: Look up vectors from embedding matrix',
      'Positional embeddings: Encode sequence position',
      'Combined embedding dimension: 768-12288',
      'Creates dense semantic representations',
    ],
  },
  {
    id: 'attention',
    label: 'Self-Attention',
    description: 'Contextual Understanding',
    icon: Network,
    mathFormula: 'Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V',
    details: [
      'Query, Key, Value projections from embeddings',
      'Multi-head attention (8-96 heads)',
      'Captures long-range dependencies',
      'O(n²) complexity with context length',
    ],
  },
  {
    id: 'ffn',
    label: 'Feed Forward',
    description: 'Non-linear Transform',
    icon: Brain,
    mathFormula: 'FFN(x) = GELU(xW₁ + b₁)W₂ + b₂',
    details: [
      'Two linear transformations with activation',
      'Expansion ratio typically 4x hidden size',
      'GELU or SwiGLU activation functions',
      'Where the "knowledge" is stored',
    ],
  },
  {
    id: 'layers',
    label: 'N× Layers',
    description: 'Deep Processing',
    icon: Layers,
    details: [
      'Stack of transformer blocks (12-96 layers)',
      'Residual connections around each sub-layer',
      'Layer normalization (Pre-LN or Post-LN)',
      'Each layer refines representations',
    ],
  },
  {
    id: 'output',
    label: 'Output Head',
    description: 'Logits → Text',
    icon: Cpu,
    mathFormula: 'P(token) = softmax(h · W_vocab)',
    details: [
      'Project hidden state to vocabulary size',
      'Softmax produces probability distribution',
      'Sampling: greedy, top-k, top-p, temperature',
      'Generates tokens autoregressively',
    ],
  },
];

export function ArchitectureModule() {
  const { mathModeEnabled } = useAppStore();
  const [selectedBlock, setSelectedBlock] = useState<ArchBlock | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const handleBlockClick = useCallback((block: ArchBlock) => {
    setSelectedBlock(block);
  }, []);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBlock(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center flex-shrink-0"
      >
        <motion.div 
          className="w-24 h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent mx-auto mb-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        
        <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Transformer Architecture
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Click any component to explore in detail
        </p>
      </motion.div>

      {/* Vertical Flowchart */}
      <div className="flex-1 flex justify-center overflow-y-auto custom-scrollbar py-4">
        <div className="flex flex-col items-center gap-2 max-w-sm w-full px-4">
          {architectureBlocks.map((block, index) => {
            const Icon = block.icon;
            const isHovered = hoveredBlock === block.id;
            const isSelected = selectedBlock?.id === block.id;

            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="w-full flex flex-col items-center"
              >
                {/* Block Card */}
                <motion.button
                  onClick={() => handleBlockClick(block)}
                  onMouseEnter={() => setHoveredBlock(block.id)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative w-full rounded-xl cursor-pointer",
                    "border transition-all duration-300",
                    "flex items-center gap-4 p-4",
                    "bg-neutral-900/60",
                    isHovered || isSelected 
                      ? "border-neutral-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "border-neutral-800"
                  )}
                >
                  {/* Icon */}
                  <motion.div
                    className={cn(
                      "p-3 rounded-lg flex-shrink-0",
                      "bg-neutral-800/80 border",
                      isHovered ? "border-neutral-600" : "border-neutral-700/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors duration-300",
                      isHovered ? "text-white" : "text-neutral-400"
                    )} />
                  </motion.div>

                  {/* Label */}
                  <div className="text-left flex-1 min-w-0">
                    <div className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      isHovered ? "text-white" : "text-neutral-200"
                    )}>
                      {block.label}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                      {block.description}
                    </div>
                  </div>

                  {/* Indicator */}
                  <motion.div
                    className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300",
                      isHovered || isSelected ? "bg-white" : "bg-neutral-700"
                    )}
                    animate={isHovered ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
                  />

                  {/* Math formula tooltip */}
                  <AnimatePresence>
                    {mathModeEnabled && block.mathFormula && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute left-full ml-4 z-50"
                      >
                        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 font-mono text-xs text-neutral-300 whitespace-nowrap shadow-xl">
                          {block.mathFormula}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Connector Arrow */}
                {index < architectureBlocks.length - 1 && (
                  <motion.div
                    className="flex flex-col items-center py-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.08 + 0.2 }}
                  >
                    <div className="w-px h-4 bg-gradient-to-b from-neutral-700 to-neutral-800" />
                    <ChevronDown className="w-4 h-4 text-neutral-600 -my-1" />
                    
                    {/* Animated particle */}
                    <motion.div
                      className="absolute w-1.5 h-1.5 rounded-full bg-neutral-400"
                      animate={{
                        y: [0, 20],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: index * 0.4,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Data flow indicator */}
          <motion.div
            className="flex items-center justify-center gap-2 text-xs text-neutral-500 mt-4 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Zap className="w-3 h-3" />
            <span>Data flows through the pipeline</span>
          </motion.div>
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedBlock && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedBlock(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[380px] z-50 bg-neutral-950 border-l border-neutral-800"
            >
              <div className="p-6 h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700">
                      <selectedBlock.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedBlock.label}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {selectedBlock.description}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setSelectedBlock(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-400" />
                  </motion.button>
                </div>

                {/* Math formula */}
                {selectedBlock.mathFormula && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-neutral-900 border border-neutral-800 p-4 mb-6 rounded-lg"
                  >
                    <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wider">
                      Formula
                    </div>
                    <div className="font-mono text-sm text-neutral-200">
                      {selectedBlock.mathFormula}
                    </div>
                  </motion.div>
                )}

                {/* Details */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="text-xs text-neutral-500 mb-3 uppercase tracking-wider">
                    Key Concepts
                  </div>
                  <div className="space-y-3">
                    {selectedBlock.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 mt-2 flex-shrink-0" />
                        <span className="text-neutral-300 text-sm leading-relaxed">
                          {detail}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-neutral-800 text-center">
                  <p className="text-xs text-neutral-600">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 mx-1">ESC</kbd> to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}