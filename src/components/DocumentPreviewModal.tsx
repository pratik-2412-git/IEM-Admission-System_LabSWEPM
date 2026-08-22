import React from 'react';
import { X, FileText, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 text-[#F8FAFC]">
      <div 
        id="document-preview-modal"
        className="bg-[#0F172A] max-w-2xl w-full rounded-xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1E293B] bg-[#030712] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#1E293B] text-teal-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-headline font-semibold text-sm text-[#F8FAFC]">
                {document.title}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                {document.fileName} • {document.fileSize}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewer Simulation */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#030712]/50 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] p-8 rounded-xl shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-[#030712] border border-[#1E293B] text-teal-400 rounded-xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>

            <div>
              <h5 className="font-headline font-bold text-base text-[#F8FAFC]">{document.title}</h5>
              <p className="text-xs text-slate-400 mt-1">{document.description || 'Verified Document for Application'}</p>
            </div>

            <div className="bg-[#030712] p-3 rounded-lg text-xs space-y-1.5 text-left border border-[#1E293B] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-teal-400 uppercase">{document.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Checksum SHA256:</span>
                <span className="text-[10px] text-slate-300">a9f87c2...b138</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified By:</span>
                <span className="text-slate-200">IEM Admissions Registrar</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-teal-400 font-mono font-medium pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHICALLY_CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#030712] flex justify-between items-center font-mono">
          <span className="text-xs text-slate-400">Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2DD4BF] text-[#020617] text-xs font-bold rounded-lg hover:bg-teal-400 cursor-pointer transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
