import React, { useState } from 'react';
import { 
  BadgeCheck, 
  UploadCloud, 
  Eye, 
  Trash2, 
  Camera, 
  FileText, 
  Info, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentUploadViewProps {
  documents: DocumentItem[];
  applicationId: string;
  onUploadDocument: (type: string, title: string, fileName: string, fileSize: string, fileUrl?: string) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
  onPreviousStep: () => void;
  onSaveAndContinue: () => void;
  onPreviewDoc: (doc: DocumentItem) => void;
}

export const DocumentUploadView: React.FC<DocumentUploadViewProps> = ({
  documents,
  applicationId,
  onUploadDocument,
  onDeleteDocument,
  onPreviousStep,
  onSaveAndContinue,
  onPreviewDoc,
}) => {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Find doc by type
  const idProofDoc = documents.find(d => d.type === 'id_proof');
  const marksheetDoc = documents.find(d => d.type === 'marksheet_12th');
  const photoDoc = documents.find(d => d.type === 'photo');

  const handleSimulatedFileUpload = async (type: string, title: string, defaultName: string, defaultSize: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    let fileName = defaultName;
    let fileSize = defaultSize;

    if (event?.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      fileName = file.name;
      fileSize = `${(file.size / (1024 * 1024)).toFixed(1)}MB`;
    }

    setUploadingType(type);
    try {
      await onUploadDocument(type, title, fileName, fileSize);
    } finally {
      setUploadingType(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12 text-[#F8FAFC]">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Verification Stage [02]</span>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight mt-0.5">
          Document Upload
        </h2>
        <p className="font-body text-xs md:text-sm text-slate-400 mt-1">
          Upload required verification documents in PDF or JPG format for automated credential processing.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload Zones Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Document 1: Government ID Proof */}
          <div 
            id="upload-zone-id-proof"
            className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#030712] border border-[#1E293B] flex items-center justify-center text-teal-400 shrink-0">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-sm md:text-base font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                  Government ID Proof <span className="text-rose-400 text-xs">*</span>
                </h3>
                <p className="font-body text-xs text-slate-400 mt-0.5">Aadhaar, PAN, or Passport.</p>
                {idProofDoc && (
                  <div className="flex items-center gap-2 mt-2 font-mono">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      idProofDoc.status === 'verified' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {idProofDoc.status === 'verified' ? 'VERIFIED' : 'COMMITTED'}
                    </span>
                    <span className="text-[11px] text-slate-400">{idProofDoc.fileName} ({idProofDoc.fileSize})</span>
                  </div>
                )}
              </div>
            </div>

            {idProofDoc ? (
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <button
                  id="view-id-proof-btn"
                  onClick={() => onPreviewDoc(idProofDoc)}
                  className="p-2 text-teal-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-[#1E293B]"
                  aria-label="View Document"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  id="delete-id-proof-btn"
                  onClick={() => onDeleteDocument(idProofDoc.id)}
                  className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-900/30"
                  aria-label="Remove Document"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full md:w-auto">
                <label className="flex flex-col items-center justify-center w-full md:w-64 h-24 border-2 border-dashed border-[#1E293B] hover:border-teal-400 rounded-xl cursor-pointer bg-[#030712] hover:bg-slate-900/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <UploadCloud className="w-5 h-5 text-teal-400 mb-1" />
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-teal-300">Click to upload</span> or drag
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => handleSimulatedFileUpload('id_proof', 'Government ID Proof', 'aadhaar_card_doc.pdf', '1.8MB', e)}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Document 2: Class 12th Marksheet */}
          <div 
            id="upload-zone-marksheet"
            className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#030712] border border-[#1E293B] flex items-center justify-center text-teal-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-sm md:text-base font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                  Class 12th Marksheet <span className="text-rose-400 text-xs">*</span>
                </h3>
                <p className="font-body text-xs text-slate-400 mt-0.5">Final board examination results.</p>
                <div className="flex items-center gap-2 mt-2 font-mono">
                  <span className="text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                    {marksheetDoc?.status === 'verified' ? 'VERIFIED' : 'COMMITTED'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {marksheetDoc?.fileName || 'marksheet_12th_2023.pdf'} ({marksheetDoc?.fileSize || '2.4MB'})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-end">
              <button
                id="view-marksheet-btn"
                onClick={() => onPreviewDoc(marksheetDoc || {
                  id: 'marksheet_preview',
                  applicationId,
                  type: 'marksheet_12th',
                  title: 'Class 12th Marksheet',
                  description: 'Final board examination results.',
                  fileName: 'marksheet_12th_2023.pdf',
                  fileSize: '2.4MB',
                  status: 'verified',
                  uploadedAt: new Date().toISOString(),
                })}
                className="p-2 text-teal-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-[#1E293B]"
                aria-label="View Document"
                title="View Document"
              >
                <Eye className="w-4 h-4" />
              </button>
              {marksheetDoc && (
                <button
                  id="delete-marksheet-btn"
                  onClick={() => onDeleteDocument(marksheetDoc.id)}
                  className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-900/30"
                  aria-label="Remove Document"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Document 3: Recent Photograph */}
          <div 
            id="upload-zone-photo"
            className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#030712] border border-[#1E293B] flex items-center justify-center text-teal-400 shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-sm md:text-base font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                  Recent Photograph <span className="text-rose-400 text-xs">*</span>
                </h3>
                <p className="font-body text-xs text-slate-400 mt-0.5">Passport size, neutral contrast background.</p>
                {photoDoc && (
                  <div className="flex items-center gap-2 mt-2 font-mono">
                    <span className="text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                      COMMITTED
                    </span>
                    <span className="text-[11px] text-slate-400">{photoDoc.fileName} ({photoDoc.fileSize})</span>
                  </div>
                )}
              </div>
            </div>

            {photoDoc ? (
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <button
                  id="view-photo-btn"
                  onClick={() => onPreviewDoc(photoDoc)}
                  className="p-2 text-teal-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-[#1E293B]"
                  aria-label="View Photo"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  id="delete-photo-btn"
                  onClick={() => onDeleteDocument(photoDoc.id)}
                  className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-900/30"
                  aria-label="Remove Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full md:w-auto">
                <label className="flex flex-col items-center justify-center w-full md:w-64 h-24 border-2 border-dashed border-[#1E293B] hover:border-teal-400 rounded-xl cursor-pointer bg-[#030712] hover:bg-slate-900/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <UploadCloud className="w-5 h-5 text-teal-400 mb-1" />
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold text-teal-300">Click to upload</span> or drag
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleSimulatedFileUpload('photo', 'Recent Photograph', 'candidate_photo_passport.jpg', '650KB', e)}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Guidelines Sidebar (4 cols) */}
        <aside className="lg:col-span-4 h-fit">
          <div className="bg-[#0F172A] rounded-xl p-6 border border-[#1E293B] shadow-sm">
            <h3 className="font-headline text-sm font-semibold text-[#F8FAFC] mb-5 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-400" />
              Upload Guidelines
            </h3>

            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">Supported Formats</p>
                  <p className="text-slate-400 mt-0.5 font-mono text-[11px]">PDF, JPEG, JPG, PNG only.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <FileCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">File Size Limit</p>
                  <p className="text-slate-400 mt-0.5 font-mono text-[11px]">Maximum 5MB per document. Ensure text is legible.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">Clarity Verification</p>
                  <p className="text-slate-400 mt-0.5">Documents must not be blurry. Edges should be visible.</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-[#1E293B]">
              <p className="text-xs text-slate-400 mb-3">Having trouble uploading documents?</p>
              <button
                id="contact-support-guidelines-btn"
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="w-full flex justify-center items-center gap-2 border border-[#1E293B] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                <span>CONTACT_SUPPORT</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-4 border-t border-[#1E293B] flex justify-between items-center">
        <button
          id="docs-prev-step-btn"
          type="button"
          onClick={onPreviousStep}
          className="border border-[#1E293B] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        <button
          id="docs-save-continue-btn"
          type="button"
          onClick={onSaveAndContinue}
          className="bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm shadow-teal-500/10 flex items-center gap-2 cursor-pointer"
        >
          <span>Save &amp; Continue</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0F172A] max-w-md w-full rounded-xl p-6 border border-[#1E293B] shadow-2xl relative text-[#F8FAFC]">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline font-semibold text-lg text-[#F8FAFC] mb-2">
              Document Verification Support
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              If your file size exceeds 5MB or your Digilocker sync failed, you may request manual administrative document review.
            </p>

            <div className="bg-[#030712] p-4 rounded-lg text-xs space-y-2 mb-4 border border-[#1E293B] font-mono">
              <p><strong className="text-teal-400">Email:</strong> doc-support@iem.edu.in</p>
              <p><strong className="text-teal-400">Helpdesk Phone:</strong> +91 33 2357 2059 (Ext 104)</p>
              <p><strong className="text-teal-400">Office:</strong> Room 102, Academic Block A, Salt Lake</p>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] py-2.5 rounded-lg text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
