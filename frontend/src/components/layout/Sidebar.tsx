import { motion } from 'framer-motion';
import {
  Cpu,
  Split,
  Box,
  Grid3X3,
  Scroll,
  Shield,
  Route,
  ChevronLeft,
  ChevronRight,
  Brain,
  Minus
} from 'lucide-react';
import { useAppStore, type ModuleId } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface NavItem {
  id: ModuleId | 'separator';
  label: string;
  icon: React.ElementType;
  color: string;
  isSeparator?: boolean;
}

const navItems: NavItem[] = [

  { id: 'architecture', label: 'Architecture', icon: Cpu, color: 'text-muted-foreground' },
  { id: 'tokenizer', label: 'Tokenizer Lab', icon: Split, color: 'text-muted-foreground' },
  { id: 'embeddings', label: 'Embeddings', icon: Box, color: 'text-muted-foreground' },
  { id: 'attention', label: 'Attention', icon: Grid3X3, color: 'text-muted-foreground' },
  { id: 'profiler', label: 'Attention Head Profiler', icon: Brain, color: 'text-primary' },
  { id: 'context', label: 'Context Window', icon: Scroll, color: 'text-muted-foreground' },
  { id: 'separator', label: '', icon: Minus, color: '', isSeparator: true },
  { id: 'redteaming', label: 'Security Analysis', icon: Shield, color: 'text-muted-foreground' },
  { id: 'router', label: 'Cost Router', icon: Route, color: 'text-muted-foreground' },
];

export function Sidebar() {
  const { activeModule, setActiveModule, sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "relative h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <motion.div
          className="flex items-center gap-3"
          layout
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md" />
            <Cpu className="w-5 h-5 text-primary relative z-10" />
          </div>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="font-semibold text-sm text-foreground">LLM Internals</span>
              <span className="text-[10px] text-muted-foreground">Explorer</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          // Handle separator
          if (item.isSeparator) {
            return (
              <div
                key={`separator-${index}`}
                className={cn(
                  "my-3 border-t border-border/50",
                  sidebarCollapsed ? "mx-2" : "mx-3"
                )}
              />
            );
          }

          const isActive = activeModule === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveModule(item.id as ModuleId)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent group relative",
                isActive && "bg-sidebar-accent"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-primary"
                />
              )}

              {/* Icon */}
              <div className={cn(
                "relative flex items-center justify-center",
                isActive && "text-primary"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
              </div>

              {/* Label */}
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
