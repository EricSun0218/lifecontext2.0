export interface ContextSource {
  icon: string;
  title: string;
  url: string;
}

export interface Insight {
  id: string;
  type: 'Analysis' | 'Suggestion' | 'Warning' | 'Critical' | 'Action';
  title: string;
  content: string;
  tag: string;
  markdownContent?: string;
}

export interface DashboardEntry {
  id: number;
  time: string;
  context: {
    title: string;
    sources: ContextSource[];
  };
  insights: Insight[];
}