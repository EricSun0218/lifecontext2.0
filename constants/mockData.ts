
import {
    Folder, FileText, Video, Image as ImageIcon, MoreHorizontal,
    Globe, Youtube, Mic
} from 'lucide-react';
import React from 'react';

// --- Types ---
export interface Category {
    id: string;
    name: string;
    icon?: React.ElementType;
    children?: Category[];
    isOpen?: boolean;
}

export interface KnowledgeItem {
    id: string;
    title: string;
    description: string;
    type: 'image' | 'video' | 'text' | 'audio';
    source?: string;
    date: string;
    thumbnail?: string;
    tags?: string[];
}

// --- Dummy Data ---
export const INITIAL_CATEGORIES: Category[] = [
    {
        id: 'culture',
        name: 'Culture',
        isOpen: true,
        children: [
            { id: 'food', name: 'Food' },
            { id: 'art', name: 'Art' },
            { id: 'music', name: 'Music' }
        ]
    },
    {
        id: 'finance',
        name: 'Finance',
        isOpen: true,
        children: [
            { id: 'trading', name: 'Trading' },
            { id: 'crypto', name: 'Crypto' },
            { id: 'investing', name: 'Investing' }
        ]
    },
    {
        id: 'relationships',
        name: 'Relationships',
        isOpen: true,
        children: [
            { id: 'dating', name: 'Dating' },
            { id: 'networking', name: 'Networking' }
        ]
    },
    {
        id: 'technology',
        name: 'Technology',
        isOpen: false,
        children: [
            { id: 'ai', name: 'AI' },
            { id: 'automotive', name: 'Automotive' },
            { id: 'social_media', name: 'Social Media' }
        ]
    }
];

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
    {
        id: '1',
        title: 'MineContext/README_zh.md at main · ...',
        description: 'We read every piece of feedback, and take your input very seriously.',
        type: 'text',
        date: 'Fri Nov 28 2025',
        source: 'Github',
        tags: ['Documentation']
    },
    {
        id: '2',
        title: 'lifecontext宣发 - 飞书云文档',
        description: 'LifeContext launch strategy and marketing materials.',
        type: 'image',
        date: 'Fri Nov 21 2025',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
        source: 'Feishu',
        tags: ['Marketing']
    },
    {
        id: '3',
        title: 'TicNote：你的随身AI思考伙伴',
        description: 'TicNote是出门问问发布的新一代Agentic AI软硬件结合的产品，通过内置「Shadow AI」为用户构建“有记忆的AI记录+主动洞察+主...',
        type: 'text',
        date: 'Fri Nov 21 2025',
        source: 'TicNote',
        tags: ['Product']
    },
    {
        id: '4',
        title: 'Google Gemini',
        description: '认识 Gemini：Google 旗下的 AI 助理，在写作、规划和开展头脑风暴等方面获得帮助。体验生成式 AI 的强大功能。',
        type: 'image',
        date: 'Fri Nov 21 2025',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
        source: 'Google',
        tags: ['AI', 'Tool']
    },
    {
        id: '5',
        title: 'SORA: the all Ai TikTok Clone. will slop end creativity?',
        description: 'Sora is an AI-powered TikTok clone that generates videos using artificial intelligence, allowing users to create...',
        type: 'video',
        date: 'Fri Nov 21 2025',
        thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
        source: 'YouTube',
        tags: ['Dating', 'AI']
    }
];
