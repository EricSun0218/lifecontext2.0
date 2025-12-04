
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
        name: 'categories.culture',
        isOpen: true,
        children: [
            { id: 'food', name: 'categories.food' },
            { id: 'art', name: 'categories.art' },
            { id: 'music', name: 'categories.music' }
        ]
    },
    {
        id: 'finance',
        name: 'categories.finance',
        isOpen: true,
        children: [
            { id: 'trading', name: 'categories.trading' },
            { id: 'crypto', name: 'categories.crypto' },
            { id: 'investing', name: 'categories.investing' }
        ]
    },
    {
        id: 'relationships',
        name: 'categories.relationships',
        isOpen: true,
        children: [
            { id: 'dating', name: 'categories.dating' },
            { id: 'networking', name: 'categories.networking' }
        ]
    },
    {
        id: 'technology',
        name: 'categories.technology',
        isOpen: false,
        children: [
            { id: 'ai', name: 'categories.ai' },
            { id: 'automotive', name: 'categories.automotive' },
            { id: 'social_media', name: 'categories.social_media' }
        ]
    }
];

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
    {
        id: '1',
        title: 'knowledge_items.item1.title',
        description: 'knowledge_items.item1.description',
        type: 'text',
        date: 'Fri Nov 28 2025',
        source: 'Github',
        tags: ['Documentation']
    },
    {
        id: '2',
        title: 'knowledge_items.item2.title',
        description: 'knowledge_items.item2.description',
        type: 'image',
        date: 'Fri Nov 21 2025',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
        source: 'Feishu',
        tags: ['Marketing']
    },
    {
        id: '3',
        title: 'knowledge_items.item3.title',
        description: 'knowledge_items.item3.description',
        type: 'text',
        date: 'Fri Nov 21 2025',
        source: 'TicNote',
        tags: ['Product']
    },
    {
        id: '4',
        title: 'knowledge_items.item4.title',
        description: 'knowledge_items.item4.description',
        type: 'image',
        date: 'Fri Nov 21 2025',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
        source: 'Google',
        tags: ['AI', 'Tool']
    },
    {
        id: '5',
        title: 'knowledge_items.item5.title',
        description: 'knowledge_items.item5.description',
        type: 'video',
        date: 'Fri Nov 21 2025',
        thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
        source: 'YouTube',
        tags: ['Dating', 'AI']
    }
];
