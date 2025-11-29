'use client';

import { useState, useEffect } from 'react';
import { Lock, Plus, Search, Tag, Calendar, Shield, Upload, Download, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    encrypted: boolean;
    onChain: boolean;
}

const DEFAULT_NOTES: Note[] = [
    {
        id: '1',
        title: 'DAO Treasury Strategy',
        content: 'Private notes on treasury management and diversification strategy...',
        tags: ['Strategy', 'Finance'],
        createdAt: '2024-12-01',
        updatedAt: '2024-12-15',
        encrypted: true,
        onChain: true,
    },
    {
        id: '2',
        title: 'Security Audit Findings',
        content: 'Confidential security review results and recommendations...',
        tags: ['Security', 'Critical'],
        createdAt: '2024-12-10',
        updatedAt: '2024-12-12',
        encrypted: true,
        onChain: false,
    },
];

export function EncryptedNotesView() {
    // Initialize with empty array to avoid hydration mismatch
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showContent, setShowContent] = useState(false);

    // Load notes from localStorage after component mounts (client-side only)
    useEffect(() => {
        const saved = localStorage.getItem('encrypted-notes');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotes(parsed);
            } catch (e) {
                console.error('Failed to load notes:', e);
                setNotes(DEFAULT_NOTES);
            }
        } else {
            // First time: use default notes
            setNotes(DEFAULT_NOTES);
        }
    }, []);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem('encrypted-notes', JSON.stringify(notes));
        }
    }, [notes]);

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleCreateNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            encrypted: true,
            onChain: false,
        };
        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
        setIsCreating(true);
    };

    const handleDeleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        if (selectedNote?.id === id) {
            setSelectedNote(null);
        }
    };

    return (
        <div className="w-full h-full flex">
            {/* Notes List */}
            <div className="w-80 border-r border-[var(--border-color)] bg-[var(--card-bg)] flex flex-col">
                {/* Search & Create */}
                <div className="p-4 border-b border-[var(--border-color)] space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[var(--foreground)]">Encrypted Notes</h2>
                        <button
                            onClick={handleCreateNote}
                            className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 bg-white/5 border border-[var(--border-color)] rounded-lg text-sm text-[var(--foreground)] placeholder:text-neutral-500 focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredNotes.map((note) => (
                        <button
                            key={note.id}
                            onClick={() => setSelectedNote(note)}
                            className={`w-full p-3 mb-2 rounded-lg text-left transition-all ${selectedNote?.id === note.id
                                ? 'bg-purple-500/10 border border-purple-500/20'
                                : 'bg-white/5 border border-[var(--border-color)] hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-[var(--foreground)] text-sm truncate flex-1">
                                    {note.title}
                                </h3>
                                <div className="flex gap-1 ml-2">
                                    {note.encrypted && <Lock size={12} className="text-green-400" />}
                                    {note.onChain && <Shield size={12} className="text-blue-400" />}
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 truncate mb-2">{note.content}</p>
                            <div className="flex items-center gap-2">
                                {note.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Note Editor */}
            <div className="flex-1 flex flex-col">
                {selectedNote ? (
                    <>
                        {/* Editor Header */}
                        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={selectedNote.title}
                                    onChange={(e) => {
                                        setSelectedNote({ ...selectedNote, title: e.target.value });
                                        setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, title: e.target.value } : n));
                                    }}
                                    className="text-2xl font-bold bg-transparent border-none outline-none text-[var(--foreground)]"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowContent(!showContent)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-[var(--foreground)] transition-all"
                                    title={showContent ? "Hide Content" : "Show Content"}
                                >
                                    {showContent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <button
                                    className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-[var(--foreground)] transition-all"
                                    title="Export to IPFS"
                                >
                                    <Upload size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteNote(selectedNote.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all"
                                    title="Delete Note"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Note Metadata */}
                        <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center gap-4 text-xs text-neutral-500">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>Updated {new Date(selectedNote.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedNote.encrypted ? (
                                    <span className="text-green-400 flex items-center gap-1">
                                        <Lock size={14} />
                                        Encrypted
                                    </span>
                                ) : (
                                    <span className="text-yellow-400">Not Encrypted</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedNote.onChain ? (
                                    <span className="text-blue-400 flex items-center gap-1">
                                        <Shield size={14} />
                                        On-Chain
                                    </span>
                                ) : (
                                    <span className="text-neutral-500">Local Only</span>
                                )}
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="flex-1 overflow-auto p-6">
                            {showContent ? (
                                <textarea
                                    value={selectedNote.content}
                                    onChange={(e) => {
                                        setSelectedNote({ ...selectedNote, content: e.target.value });
                                        setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, content: e.target.value } : n));
                                    }}
                                    className="w-full h-full bg-transparent border-none outline-none resize-none text-[var(--foreground)] font-mono text-sm"
                                    placeholder="Start writing your encrypted note..."
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                                    <Lock size={48} className="mb-4 opacity-20" />
                                    <p className="text-sm">Content is encrypted and hidden</p>
                                    <p className="text-xs mt-2">Click the eye icon to reveal</p>
                                </div>
                            )}
                        </div>

                        {/* Tags Editor */}
                        <div className="p-4 border-t border-[var(--border-color)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Tag size={14} className="text-neutral-500" />
                                <span className="text-xs text-neutral-500">Tags</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedNote.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs flex items-center gap-2"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => {
                                                const newTags = selectedNote.tags.filter((_, idx) => idx !== i);
                                                setSelectedNote({ ...selectedNote, tags: newTags });
                                                setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, tags: newTags } : n));
                                            }}
                                            className="hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={() => {
                                        const tag = prompt('Enter tag name:');
                                        if (tag) {
                                            const newTags = [...selectedNote.tags, tag];
                                            setSelectedNote({ ...selectedNote, tags: newTags });
                                            setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, tags: newTags } : n));
                                        }
                                    }}
                                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-[var(--foreground)] border border-[var(--border-color)] text-xs transition-all"
                                >
                                    + Add Tag
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
                        <Lock size={64} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">No Note Selected</p>
                        <p className="text-sm mt-2">Select a note from the sidebar or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
}
