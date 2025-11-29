'use client';

import { useState, useEffect } from 'react';
import { Database, Users, Settings, Calendar, BarChart3, FileText, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface WorkspaceData {
    description: string;
    activeTasks: string;
    teamMembers: string;
    completion: string;
    daysActive: string;
}

interface WorkspaceViewProps {
    workspaceName: string;
    onViewChange?: (view: string) => void;
}

export function WorkspaceView({ workspaceName, onViewChange }: WorkspaceViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
        description: '',
        activeTasks: '',
        teamMembers: '',
        completion: '',
        daysActive: '',
    });

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('workspace-data');
        console.log('Loading workspace data from localStorage:', saved);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                console.log('Parsed workspace data:', parsed);
                setWorkspaceData(parsed);
            } catch (e) {
                console.error('Failed to load workspace data', e);
            }
        }
    }, []);

    const handleSave = () => {
        console.log('Saving workspace data:', workspaceData);
        localStorage.setItem('workspace-data', JSON.stringify(workspaceData));
        setIsEditing(false);
        toast.success('Workspace details saved successfully!');
    };

    const handleNewTask = () => {
        if (onViewChange) {
            onViewChange('board');
        }
    };

    const handleInviteMembers = () => {
        alert('Invite Members feature coming soon! You will be able to share workspace access via wallet address.');
    };

    const handleViewReports = () => {
        alert('Reports & Analytics dashboard coming soon! Track your workspace performance metrics.');
    };

    const hasData = workspaceData.description || workspaceData.activeTasks ||
        workspaceData.teamMembers || workspaceData.completion ||
        workspaceData.daysActive;

    return (
        <div className="w-full h-full overflow-auto p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Database size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">{workspaceName}</h1>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={workspaceData.description}
                                    onChange={(e) => setWorkspaceData({ ...workspaceData, description: e.target.value })}
                                    placeholder="Enter workspace description..."
                                    className="bg-white/5 border border-[var(--border-color)] rounded px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-purple-500/50 w-96"
                                />
                            ) : (
                                <p className="text-neutral-400 text-sm">
                                    {workspaceData.description || 'No description yet'}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all flex items-center gap-2"
                            >
                                <Save size={16} />
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-[var(--foreground)] transition-all"
                            >
                                <Edit2 size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Active Tasks */}
                    <div className="p-6 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-purple-500/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Active Tasks</span>
                            <FileText size={18} className="text-blue-400" />
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={workspaceData.activeTasks}
                                onChange={(e) => setWorkspaceData({ ...workspaceData, activeTasks: e.target.value })}
                                placeholder="24"
                                className="w-full text-3xl font-bold bg-white/5 border border-[var(--border-color)] rounded px-2 py-1 text-[var(--foreground)] focus:outline-none focus:border-purple-500/50"
                            />
                        ) : (
                            <div className="text-3xl font-bold text-[var(--foreground)]">
                                {workspaceData.activeTasks || '-'}
                            </div>
                        )}
                    </div>

                    {/* Team Members */}
                    <div className="p-6 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-purple-500/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Team Members</span>
                            <Users size={18} className="text-purple-400" />
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={workspaceData.teamMembers}
                                onChange={(e) => setWorkspaceData({ ...workspaceData, teamMembers: e.target.value })}
                                placeholder="8"
                                className="w-full text-3xl font-bold bg-white/5 border border-[var(--border-color)] rounded px-2 py-1 text-[var(--foreground)] focus:outline-none focus:border-purple-500/50"
                            />
                        ) : (
                            <div className="text-3xl font-bold text-[var(--foreground)]">
                                {workspaceData.teamMembers || '-'}
                            </div>
                        )}
                    </div>

                    {/* Completion */}
                    <div className="p-6 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-purple-500/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Completion</span>
                            <BarChart3 size={18} className="text-green-400" />
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={workspaceData.completion}
                                onChange={(e) => setWorkspaceData({ ...workspaceData, completion: e.target.value })}
                                placeholder="67%"
                                className="w-full text-3xl font-bold bg-white/5 border border-[var(--border-color)] rounded px-2 py-1 text-[var(--foreground)] focus:outline-none focus:border-purple-500/50"
                            />
                        ) : (
                            <div className="text-3xl font-bold text-[var(--foreground)]">
                                {workspaceData.completion || '-'}
                            </div>
                        )}
                    </div>

                    {/* Days Active */}
                    <div className="p-6 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-purple-500/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-neutral-500 uppercase tracking-wider">Days Active</span>
                            <Calendar size={18} className="text-orange-400" />
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={workspaceData.daysActive}
                                onChange={(e) => setWorkspaceData({ ...workspaceData, daysActive: e.target.value })}
                                placeholder="12"
                                className="w-full text-3xl font-bold bg-white/5 border border-[var(--border-color)] rounded px-2 py-1 text-[var(--foreground)] focus:outline-none focus:border-purple-500/50"
                            />
                        ) : (
                            <div className="text-3xl font-bold text-[var(--foreground)]">
                                {workspaceData.daysActive || '-'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State / Quick Actions */}
                {!hasData && !isEditing ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Database size={64} className="text-neutral-500/20 mb-4" />
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Welcome to Your Workspace</h2>
                        <p className="text-neutral-400 mb-6">Start by adding your workspace details</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all flex items-center gap-2"
                        >
                            <Edit2 size={18} />
                            Add Workspace Details
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                    onClick={handleNewTask}
                                    className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                                        <Plus size={20} className="text-purple-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-[var(--foreground)] text-sm">New Task</div>
                                        <div className="text-xs text-neutral-500">Create a new task</div>
                                    </div>
                                </button>
                                <button
                                    onClick={handleInviteMembers}
                                    className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                                        <Users size={20} className="text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-[var(--foreground)] text-sm">Invite Members</div>
                                        <div className="text-xs text-neutral-500">Add team members</div>
                                    </div>
                                </button>
                                <button
                                    onClick={handleViewReports}
                                    className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-green-500/30 hover:bg-green-500/5 transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                                        <FileText size={20} className="text-green-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-[var(--foreground)] text-sm">View Reports</div>
                                        <div className="text-xs text-neutral-500">Check analytics</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
