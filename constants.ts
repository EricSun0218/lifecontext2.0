
import { DashboardEntry } from './types';

export const DASHBOARD_DATA: DashboardEntry[] = [
  {
    id: 1,
    time: "11:00",
    context: {
      title: "Gemini Architecture Research",
      sources: [
        { icon: "Youtube", title: "Tech Talk 2024", url: "youtube.com" },
        { icon: "Book", title: "Google DeepMind Papers", url: "deepmind.google" }
      ]
    },
    insights: [
      {
        id: "i1",
        type: "Analysis",
        title: "MoE Architecture Advantages",
        content: "Mixture-of-Experts allows scaling parameters without linear cost increases. This architecture enables the model to activate only a fraction of its parameters per token.",
        tag: "Technical",
        markdownContent: `
# Deep Dive: Mixture of Experts

> **Core Concept:** MoE models use a "router" network to select a subset of "expert" networks to process each token.

### Why it matters?
Traditional dense models activate **all** parameters for every input. MoE models only activate a fraction (e.g., 10-15%), significantly reducing FLOPs per inference.

### Pseudocode Logic
\`\`\`python
def forward(x):
  # Router decides which expert gets the token
  weights, indices = router(x)
  
  # Only run selected experts
  output = 0
  for i, expert in enumerate(experts):
      if i in indices:
          output += weights[i] * expert(x)
  return output
\`\`\`

### Key Benefits
*   **Scalability:** Train trillion-parameter models cheaply.
*   **Latency:** Faster inference than dense equivalents.
*   **Specialization:** Experts can specialize in code, math, or creative writing.
`
      },
      {
        id: "i2",
        type: "Action",
        title: "Implementation Strategy",
        content: "Consider using the 1.5 Pro API for the context window, but cache common queries to optimize latency.",
        tag: "DevOps",
        markdownContent: `
## Deployment Plan

To optimize for both **cost** and **performance**, we recommend a hybrid approach involving caching and model tiering.

### 1. Tiered Caching Strategy
Use **Context Caching** for large, static assets to reduce token usage:
*   API Documentation
*   Codebase Snapshots
*   Brand Style Guides

### 2. Model Selection
*   **Complex Reasoning:** Use *Gemini 1.5 Pro*
*   **High Volume / Chat:** Use *Gemini 1.5 Flash*
*   **Offline / Privacy:** Use *Gemma 2* (Self-hosted)

> **Note:** Flash is approx. 10x cheaper for simple RAG tasks than Pro.

### Action Items
*   Refactor API client to support caching headers.
*   Benchmark latency between Pro and Flash for your specific use case.
`
      }
    ]
  },
  {
    id: 2,
    time: "10:45",
    context: {
      title: "React Performance Debugging",
      sources: [
        { icon: "Github", title: "LifeContext/Repo", url: "github.com" }
      ]
    },
    insights: [
      {
        id: "i3",
        type: "Critical",
        title: "Reduce Re-renders",
        content: "The Timeline component is re-rendering on scroll. Implement React.memo() and virtualization.",
        tag: "Performance",
        markdownContent: `
# Critical Performance Issue

We detected a **main-thread blocking** issue during rapid scrolling on mobile devices.

### Diagnosis
The \`TimelineCard\` component is receiving a new function reference for \`onInsightClick\` on every render of the parent.

\`\`\`javascript
// ❌ Bad Pattern causing re-renders
<TimelineCard 
  onClick={() => handleInsight(id)} // New function every time
/>

// ✅ Fixed Pattern
const handleInsight = useCallback((id) => { ... }, []);
<TimelineCard onClick={handleInsight} />
\`\`\`

### Impact Analysis
*   **FPS Drop:** Scrolled at ~45fps on high-end devices.
*   **Battery:** Excessive CPU usage draining battery.

> **Recommendation:** Please apply the fix immediately to \`components/TimelineCard.tsx\`.
`
      }
    ]
  },
  {
    id: 3,
    time: "09:30",
    context: {
      title: "Design System Audit",
      sources: [
        { icon: "Globe", title: "Dribbble Inspiration", url: "dribbble.com" },
        { icon: "Globe", title: "Tailwind UI", url: "tailwindui.com" }
      ]
    },
    insights: [
      {
        id: "i4",
        type: "Suggestion",
        title: "Contrast Accessibility",
        content: "Current glassmorphism borders are too subtle (10% opacity). Increase to 15-20% for better definition.",
        tag: "UI/UX",
        markdownContent: `
### Visual Hierarchy Adjustment

The current glassmorphism implementation is too subtle in light mode or high-glare environments.

*   **Current:** \`border-white/10\`
*   **Proposed:** \`border-white/20\` + \`shadow-sm\`

**Reasoning:**
1.  Improves edge detection for visually impaired users.
2.  Creates better separation from the background mesh.

> "Good design is invisible, but usable design is visible."
`
      },
      {
        id: "i5",
        type: "Warning",
        title: "Animation Overhead",
        content: "Multiple background blur animations are consuming excessive GPU resources.",
        tag: "Performance",
        markdownContent: `
## GPU Bottleneck Detected

CSS filters like \`backdrop-filter: blur()\` are expensive when animating, especially on large areas.

### Optimization Tips
1.  Use **opacity** animations instead of blur radius animations where possible.
2.  Promote layers using \`will-change: transform\`.
3.  Reduce the number of simultaneous glowing orbs.

\`\`\`css
/* Expensive */
animation: blurPulse 2s infinite;

/* Cheap & Performant */
animation: opacityPulse 2s infinite;
\`\`\`
`
      }
    ]
  }
];
