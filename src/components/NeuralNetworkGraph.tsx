'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Connection {
  from: string;
  to: string;
}

export function NeuralNetworkGraph() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [stats, setStats] = useState({
    epoch: 124,
    loss: 0.0842,
    accuracy: 97.85,
    lr: 0.001,
  });

  useEffect(() => {
    setMounted(true);
    // Animate stats subtly over time
    const interval = setInterval(() => {
      setStats((prev) => {
        const nextLoss = Math.max(0.012, prev.loss - (Math.random() * 0.002 - 0.0008));
        const nextAcc = Math.min(99.9, prev.accuracy + (Math.random() * 0.1 - 0.03));
        return {
          epoch: prev.epoch + 1,
          loss: parseFloat(nextLoss.toFixed(4)),
          accuracy: parseFloat(nextAcc.toFixed(2)),
          lr: prev.epoch > 200 ? 0.0001 : 0.001,
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  // Define nodes in layers
  const layers: Node[][] = [
    // Input layer
    [
      { id: 'in_1', x: 60, y: 80, label: 'x₁ (Feature Input)' },
      { id: 'in_2', x: 60, y: 180, label: 'x₂ (Context Embedding)' },
      { id: 'in_3', x: 60, y: 280, label: 'x₃ (State Vector)' },
    ],
    // Hidden layer 1
    [
      { id: 'h1_1', x: 170, y: 50, label: 'h₁₁ (Self-Attention)' },
      { id: 'h1_2', x: 170, y: 130, label: 'h₁₂ (Latent Layer)' },
      { id: 'h1_3', x: 170, y: 210, label: 'h₁₃ (Dense Projection)' },
      { id: 'h1_4', x: 170, y: 290, label: 'h₁₄ (Feature Extraction)' },
    ],
    // Hidden layer 2
    [
      { id: 'h2_1', x: 280, y: 50, label: 'h₂₁ (Relu Activation)' },
      { id: 'h2_2', x: 280, y: 130, label: 'h₂₂ (Context Gating)' },
      { id: 'h2_3', x: 280, y: 210, label: 'h₂₃ (Attention Head)' },
      { id: 'h2_4', x: 280, y: 290, label: 'h₂₄ (Dropout Regularized)' },
    ],
    // Output layer
    [
      { id: 'out_1', x: 390, y: 130, label: 'ŷ₁ (AI Response Likelihood)' },
      { id: 'out_2', x: 390, y: 230, label: 'ŷ₂ (User Intent Classification)' },
    ],
  ];

  // Flatten nodes for rendering
  const nodes = layers.flat();

  // Generate all connections between adjacent layers
  const connections: Connection[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    const currentLayer = layers[l];
    const nextLayer = layers[l + 1];
    currentLayer.forEach((currNode) => {
      nextLayer.forEach((nextNode) => {
        connections.push({ from: currNode.id, to: nextNode.id });
      });
    });
  }

  // Find position by node ID
  const getNodePos = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  // Determine if a connection is active (hovered)
  const isConnectionActive = (conn: Connection) => {
    if (!hoveredNode) return false;
    return conn.from === hoveredNode || conn.to === hoveredNode;
  };

  return (
    <div className={`relative w-full max-w-lg aspect-[4/3] rounded-2xl p-6 ${
      isDark 
        ? 'bg-[#1e2540]/80 shadow-neu-dark border border-white/5' 
        : 'bg-[#f0f1f6]/90 shadow-neu-light border border-white/80'
      } backdrop-blur-md overflow-hidden`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Floating Header Stats Card */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-xs font-mono select-none pointer-events-none">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="opacity-60">EPOCH</span>
            <span className="font-semibold text-black dark:text-white">{stats.epoch}</span>
          </div>
          <div className="flex flex-col">
            <span className="opacity-60">ACCURACY</span>
            <span className="font-semibold text-black dark:text-white">{stats.accuracy}%</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="opacity-60">LOSS</span>
            <span className="font-semibold text-black dark:text-white">{stats.loss}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="opacity-60">LEARNING RATE</span>
            <span className="font-semibold text-black dark:text-white">{stats.lr}</span>
          </div>
        </div>
      </div>

      {/* Main SVG Container */}
      <svg
        viewBox="0 0 450 350"
        className="w-full h-full pt-8 cursor-crosshair select-none"
      >
        {/* Connections Layer */}
        {connections.map((conn, idx) => {
          const fromPos = getNodePos(conn.from);
          const toPos = getNodePos(conn.to);
          const isActive = isConnectionActive(conn);

          return (
            <g key={idx}>
              {/* Connection Line */}
              <motion.line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={
                  isActive
                    ? isDark ? '#ffffff' : '#000000' // Glowing active connection
                    : isDark ? '#334155' : '#cbd5e1'
                }
                strokeWidth={isActive ? 2.5 : 1}
                opacity={isActive ? 0.8 : 0.4}
                transition={{ duration: 0.3 }}
              />

              {/* Pulsing signal bullet along the connection lines */}
              {idx % 4 === 0 && (
                <motion.circle
                  r={2}
                  fill={isDark ? '#ffffff' : '#000000'}
                  animate={{
                    cx: [fromPos.x, toPos.x],
                    cy: [fromPos.y, toPos.y],
                  }}
                  transition={{
                    duration: 3 + (idx % 3),
                    repeat: Infinity,
                    ease: 'linear',
                    delay: idx * 0.1,
                  }}
                  opacity={hoveredNode ? 0.2 : 0.7}
                />
              )}
            </g>
          );
        })}

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const isNodeHovered = hoveredNode === node.id;
          
          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer Glow Ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isNodeHovered ? 14 : 7}
                fill={isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'}
                animate={{
                  scale: isNodeHovered ? [1, 1.25, 1] : 1,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
                opacity={isNodeHovered ? 1 : 0}
              />

              {/* Node Center Circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isNodeHovered ? 8 : 5}
                fill={
                  isNodeHovered
                    ? isDark ? '#ffffff' : '#000000'
                    : isDark ? '#94a3b8' : '#64748b'
                }
                stroke={isDark ? '#1e293b' : '#fff'}
                strokeWidth={isNodeHovered ? 2 : 1}
                animate={{
                  scale: isNodeHovered ? 1.2 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Info Tooltip */}
      <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none min-h-[2.5rem] flex items-center justify-center">
        {hoveredNode ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
              isDark 
                ? 'bg-slate-900/90 text-white border-white/10' 
                : 'bg-white/90 text-black border-black/10'
            } shadow-md`}
          >
            {nodes.find((n) => n.id === hoveredNode)?.label}
          </motion.div>
        ) : (
          <div className="text-xs opacity-40 font-mono italic">
            Hover over nodes to inspect neural paths
          </div>
        )}
      </div>
    </div>
  );
}
