# 🧠 LLM Internals Explorer

> **See what's actually happening inside GPT-2 and BERT**

Most LLM tutorials show you APIs. This shows you the math, the attention, the embeddings—using real models, not simulations.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)

---

## Why This Exists

Understanding transformers requires seeing their internals. This tool lets you:

- **Explore Real Models**: Every visualization uses actual GPT-2/BERT inference—no fake data
- **Discover Head Personalities**: See that GPT-2's 144 attention heads learned different linguistic roles
- **Understand Embeddings**: Perform vector arithmetic (King - Man + Woman = Queen) in 3D space

---

## 🎯 Headline Feature: Attention Head Personality Profiler

**The Discovery**: GPT-2's 144 attention heads aren't uniform—they've specialized.

- **Syntax Trackers** (Cluster 0): Monitor grammatical structure and agreement
- **Semantic Linkers** (Cluster 1): Connect related concepts across sentences  
- **Positional Encoders** (Cluster 2): Track word order and sequence
- **Rare Pattern Detectors** (Cluster 3): Identify unusual linguistic constructions
- **Context Aggregators** (Cluster 4): Build holistic sentence representations

**How it works**: We run 50 diverse sentences through GPT-2, extract behavioral features from each head's attention patterns, then cluster them using t-SNE. Click any head in the 3D visualization to see example sentences showing what it does.

---

## Features

### 🎯 Attention Head Profiler (NEW)
Discover that GPT-2's 144 attention heads have learned different roles. See them clustered by behavior in interactive 3D.

### 🔍 Real Attention Weights  
View actual GPT-2 attention across all 12 layers × 12 heads. See which words attend to which.

### 📊 Semantic Vector Space
Explore word embeddings in 3D. Perform vector arithmetic and see the geometry of meaning.

### 🔤 Tokenizer Lab
Watch BPE tokenization happen in real-time. Understand why "hello" is one token but "antidisestablishmentarianism" is many.

### 🏗️ Architecture Overview
Interactive transformer diagram showing embeddings → attention → FFN → output.

### 📉 Context Window Analysis
Visualize the "Lost in the Middle" phenomenon—how recall degrades at different context positions.

### 🔒 AI Security Analyzer
LLM-powered prompt injection detection using Agno agents (fallback to heuristics if no API key).

### 💰 Cost Router
Compare LLM API costs across providers (GPT-4, Claude, Llama). Understand token pricing.

---

## Technical Stack

**Models**: GPT-2 (124M params), all-MiniLM-L6-v2 (sentence transformers)  
**Backend**: FastAPI, PyTorch, Transformers, scikit-learn  
**Frontend**: React, TypeScript, Vite, TailwindCSS, React Three Fiber  
**Visualization**: Plotly, t-SNE clustering  

---

## Educational Depth

Each module includes:
- ✅ Mathematical formulas (attention equation, softmax, PCA)
- ✅ Real model outputs (not simulations)
- ✅ Interactive experiments
- ✅ Source code you can read

---

## What Makes This Different

❌ **Not a demo**: Real GPT-2 inference, not simulated attention  
❌ **Not surface-level**: Shows the math and the mechanics  
❌ **Not just visualization**: Reveals non-obvious insights (head specialization)  

✅ **Educational tool**: Built for engineers who want to understand, not just use  
✅ **Real models**: Every number comes from actual transformer forward passes  
✅ **Novel insights**: Attention head clustering is genuinely rare  

---

## Contributing

Focus areas:
- More attention head analysis patterns
- Additional transformer architectures (BERT, T5, Llama)
- Performance optimizations for large sequences
- More canonical sentences for head profiling

---

## Requirements

- Python 3.8+
- Node.js 18+
- 4GB RAM (for GPT-2 inference)
- Optional: OpenRouter API key (for AI security analysis)

---

## Acknowledgments

- **HuggingFace Transformers** for pre-trained models
- **OpenAI tiktoken** for tokenization
- **Sentence Transformers** for embeddings
- **Plotly** for visualizations
- **shadcn/ui** for React components

---

**Built to teach, not to impress.**

[Report Bug](https://github.com/yourusername/llm_workflow/issues) · [Request Feature](https://github.com/yourusername/llm_workflow/issues)
