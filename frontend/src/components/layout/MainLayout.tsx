import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { ContextBar } from './ContextBar';
import { useAppStore } from '@/store/useAppStore';

// Module imports
import { ArchitectureModule } from '@/components/modules/ArchitectureModule';
import { TokenizerModule } from '@/components/modules/TokenizerModule';
import { EmbeddingsModule } from '@/components/modules/EmbeddingsModule';
import { AttentionModule } from '@/components/modules/AttentionModule';
import { AttentionHeadProfilerModule } from '@/components/modules/AttentionHeadProfilerModule';
import { ContextWindowModule } from '@/components/modules/ContextWindowModule';
import { RedTeamingModule } from '@/components/modules/RedTeamingModule';
import { CostRouterModule } from '@/components/modules/CostRouterModule';

const moduleComponents = {
  architecture: ArchitectureModule,
  tokenizer: TokenizerModule,
  embeddings: EmbeddingsModule,
  attention: AttentionModule,
  profiler: AttentionHeadProfilerModule,
  context: ContextWindowModule,
  redteaming: RedTeamingModule,
  router: CostRouterModule,
};

export function MainLayout() {
  const { activeModule, sidebarCollapsed } = useAppStore();

  const ActiveComponent = moduleComponents[activeModule];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* Radial gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(187 92% 55% / 0.03) 0%, transparent 50%)'
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ContextBar />

        {/* Module content */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="h-full overflow-auto custom-scrollbar p-6"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* HUD corner decorations */}
      <div className="hud-corner top-left top-0 left-0 fixed pointer-events-none" />
      <div className="hud-corner top-right top-0 right-0 fixed pointer-events-none" />
      <div className="hud-corner bottom-left bottom-0 left-0 fixed pointer-events-none" />
      <div className="hud-corner bottom-right bottom-0 right-0 fixed pointer-events-none" />
    </div>
  );
}
