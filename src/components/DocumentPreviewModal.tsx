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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 text-[#1e1c17]">
      <div 
        id="document-preview-modal"
        className="bg-white max-w-2xl w-full rounded-2xl border border-[#ded9cf] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#ded9cf] bg-[#fdfbf5] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#f9f6ed] border border-[#ded9cf] text-[#33253c] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-headline font-semibold text-sm text-[#33253c]">
                {document.title}
              </h4>
              <p className="text-xs text-[#4a454c]">
                {document.fileName} • {document.fileSize}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#4a454c] hover:text-[#1e1c17] hover:bg-[#f0eee6] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewer Simulation */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f9f6ed]/40 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-full max-w-md bg-white border border-[#ded9cf] p-8 rounded-xl shadow-xs text-center space-y-4">
            <div className="w-16 h-16 bg-[#f9f6ed] border border-[#ded9cf] text-[#33253c] rounded-xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>

            <div>
              <h5 className="font-headline font-semibold text-base text-[#1e1c17]">{document.title}</h5>
              <p className="text-xs text-[#4a454c] mt-1">{document.description || 'Verified Document for Application'}</p>
            </div>

            <div className="bg-[#f9f6ed] p-3.5 rounded-lg text-xs space-y-1.5 text-left border border-[#ded9cf]">
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Verification Status:</span>
                <span className="font-semibold text-emerald-800 uppercase">{document.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Checksum SHA256:</span>
                <span className="text-[11px] text-[#1e1c17] font-mono">a9f87c2...b138</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Scrutinized By:</span>
                <span className="text-[#1e1c17]">IEM Admissions Registrar</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographically Certified &amp; Archived</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#ded9cf] bg-[#fdfbf5] flex justify-between items-center">
          <span className="text-xs text-[#4a454c]">Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#33253c] text-white text-xs font-semibold rounded-lg hover:bg-[#4a3b53] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
