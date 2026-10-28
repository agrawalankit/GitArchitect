import React, { useState } from 'react';
import {
  GripVertical,
  Eye,
  EyeOff,
  User,
  Zap,
  Hash,
  Compass,
  Cpu,
  BarChart2,
  FolderGit2,
  Target,
  BookOpen,
  MessageSquare,
  FileText,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { SectionMeta, SectionId } from '../types/profile';

interface SectionListProps {
  sections: SectionMeta[];
  selectedSectionId: SectionId;
  onSelectSection: (id: SectionId) => void;
  onToggleSection: (id: SectionId) => void;
  onMoveSection: (fromIndex: number, toIndex: number) => void;
  onResetLayout: () => void;
}

const SECTION_ICONS: Record<SectionId, React.ReactNode> = {
  header: <User className="w-4 h-4" />,
  whatIDo: <Zap className="w-4 h-4" />,
  byTheNumbers: <Hash className="w-4 h-4" />,
  approach: <Compass className="w-4 h-4" />,
  techStack: <Cpu className="w-4 h-4" />,
  stats: <BarChart2 className="w-4 h-4" />,
  projects: <FolderGit2 className="w-4 h-4" />,
  focus: <Target className="w-4 h-4" />,
  content: <BookOpen className="w-4 h-4" />,
  contact: <MessageSquare className="w-4 h-4" />,
  custom: <FileText className="w-4 h-4" />,
};

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  selectedSectionId,
  onSelectSection,
  onToggleSection,
  onMoveSection,
  onResetLayout,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onMoveSection(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-3.5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display">
            Layout Architect
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Drag blocks to customize README order</p>
        </div>
        <button
          onClick={onResetLayout}
          title="Reset order"
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1 flex-1">
        {sections.map((section, idx) => {
          const isSelected = selectedSectionId === section.id;
          const isDragging = draggedIndex === idx;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onClick={() => onSelectSection(section.id)}
              className={`group flex items-center justify-between p-2.5 rounded-xl text-sm cursor-pointer border transition-all ${
                isSelected
                  ? 'bg-slate-800/90 text-white shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800/50'
              } ${!section.enabled ? 'opacity-50' : ''} ${
                isDragging ? 'opacity-30 border-dashed' : ''
              }`}
              style={{
                borderColor: isSelected ? '#63c6ae' : isDragging ? '#63c6ae' : undefined,
                boxShadow: isSelected ? '0 0 15px rgba(99, 198, 174, 0.12)' : undefined,
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="cursor-grab active:cursor-grabbing text-slate-500 group-hover:text-slate-300 transition-colors">
                  <GripVertical className="w-4 h-4" />
                </span>
                <span
                  className="shrink-0"
                  style={{
                    color: isSelected ? '#63c6ae' : '#94a3b8',
                  }}
                >
                  {SECTION_ICONS[section.id] || <FileText className="w-4 h-4" />}
                </span>
                <span className="font-semibold truncate text-sm">{section.label}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Up/Down buttons for accessible reordering */}
                <button
                  disabled={idx === 0}
                  onClick={() => onMoveSection(idx, idx - 1)}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => onMoveSection(idx, idx + 1)}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {/* Visibility toggle */}
                <button
                  onClick={() => onToggleSection(section.id)}
                  title={section.enabled ? 'Hide section' : 'Show section'}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{
                    color: section.enabled ? '#63c6ae' : '#64748b',
                    backgroundColor: section.enabled ? 'rgba(99, 198, 174, 0.1)' : 'transparent',
                  }}
                >
                  {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
