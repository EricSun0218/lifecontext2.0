
import { DashboardEntry } from './types';

export const getDashboardData = (t: any): DashboardEntry[] => [
  {
    id: 1,
    time: "11:00",
    context: {
      title: t('dashboard.entry1.context_title'),
      sources: [
        { icon: "Youtube", title: t('dashboard.entry1.source1'), url: "youtube.com" },
        { icon: "Book", title: t('dashboard.entry1.source2'), url: "deepmind.google" }
      ]
    },
    insights: [
      {
        id: "i1",
        type: "Analysis",
        title: t('dashboard.entry1.insight1.title'),
        content: t('dashboard.entry1.insight1.content'),
        tag: "Technical",
        markdownContent: t('dashboard.entry1.insight1.markdown')
      },
      {
        id: "i2",
        type: "Action",
        title: t('dashboard.entry1.insight2.title'),
        content: t('dashboard.entry1.insight2.content'),
        tag: "DevOps",
        markdownContent: t('dashboard.entry1.insight2.markdown')
      }
    ]
  },
  {
    id: 2,
    time: "10:45",
    context: {
      title: t('dashboard.entry2.context_title'),
      sources: [
        { icon: "Github", title: t('dashboard.entry2.source1'), url: "github.com" }
      ]
    },
    insights: [
      {
        id: "i3",
        type: "Critical",
        title: t('dashboard.entry2.insight1.title'),
        content: t('dashboard.entry2.insight1.content'),
        tag: "Performance",
        markdownContent: t('dashboard.entry2.insight1.markdown')
      }
    ]
  },
  {
    id: 3,
    time: "09:30",
    context: {
      title: t('dashboard.entry3.context_title'),
      sources: [
        { icon: "Globe", title: t('dashboard.entry3.source1'), url: "dribbble.com" },
        { icon: "Globe", title: t('dashboard.entry3.source2'), url: "tailwindui.com" }
      ]
    },
    insights: [
      {
        id: "i4",
        type: "Suggestion",
        title: t('dashboard.entry3.insight1.title'),
        content: t('dashboard.entry3.insight1.content'),
        tag: "UI/UX",
        markdownContent: t('dashboard.entry3.insight1.markdown')
      },
      {
        id: "i5",
        type: "Warning",
        title: t('dashboard.entry3.insight2.title'),
        content: t('dashboard.entry3.insight2.content'),
        tag: "Performance",
        markdownContent: t('dashboard.entry3.insight2.markdown')
      }
    ]
  }
];

// Keep for backward compatibility if needed, but ideally should be removed or deprecated
export const DASHBOARD_DATA: DashboardEntry[] = [];
