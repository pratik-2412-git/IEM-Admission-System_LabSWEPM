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
  onStepClick?: (stepNumber: 1 | 2 | 3 | 4) => void;
}

export const DocumentUploadView: React.FC<DocumentUploadViewProps> = ({
  documents,
  applicationId,
  onUploadDocument,
  onDeleteDocument,
  onPreviousStep,
  onSaveAndContinue,
  onPreviewDoc,
  onStepClick,
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
    <div className="max-w-4xl mx-auto pb-12 text-[#1e1c17] transition-colors duration-300">
      {/* Header & Stepper */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Document Upload
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">Upload certified verification documents in PDF or image format</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Credential Scrutiny</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between relative px-2 py-1">
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          <div className="animated-progress-bar absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[42%]"></div>

          {/* Step 1 */}
          <div 
            onClick={() => onStepClick?.(1)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Profile</span>
          </div>

          {/* Step 2 (Active) */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              2
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Documents</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5]">
              3
            </div>
            <span className="text-xs text-[#7b776d] font-medium">Payment</span>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onStepClick?.(4)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5]">
              4
            </div>
            <span className="text-xs text-[#7b776d] font-medium">Submit</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-up stagger-1">
        {/* Upload Zones Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Document 1: Government ID Proof */}
          <div 
            id="upload-zone-id-proof"
            className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f9f6ed] border border-[#ded9cf] flex items-center justify-center text-[#33253c] shrink-0">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-sm md:text-base font-semibold text-[#1e1c17] flex items-center gap-1.5">
                  Government ID Proof <span className="text-[#ba1a1a] text-xs">*</span>
                </h3>
                <p className="text-xs text-[#4a454c] mt-0.5">Aadhaar Card, Passport, or Voter ID.</p>
                {idProofDoc && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      idProofDoc.status === 'verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-[#f0eee6] text-[#4a454c] border border-[#ded9cf]'
                    }`}>
                      {idProofDoc.status === 'verified' ? 'VERIFIED' : 'COMMITTED'}
                    </span>
                    <span className="text-xs text-[#4a454c] font-mono">{idProofDoc.fileName} ({idProofDoc.fileSize})</span>
                  </div>
                )}
              </div>
            </div>

            {idProofDoc ? (
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <button
                  id="view-id-proof-btn"
                  onClick={() => onPreviewDoc(idProofDoc)}
                  className="p-2 text-[#33253c] hover:bg-[#f9f6ed] rounded-lg transition-colors border border-[#ded9cf] cursor-pointer"
                  aria-label="View Document"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  id="delete-id-proof-btn"
                  onClick={() => onDeleteDocument(idProofDoc.id)}
                  className="p-2 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors border border-red-200 cursor-pointer"
                  aria-label="Remove Document"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full md:w-auto">
                <label className="flex flex-col items-center justify-center w-full md:w-56 h-20 border-2 border-dashed border-[#ded9cf] hover:border-[#33253c] rounded-xl cursor-pointer bg-[#fcfaf2] hover:bg-[#f9f6ed] transition-colors">
                  <div className="flex flex-col items-center justify-center p-2">
                    <UploadCloud className="w-5 h-5 text-[#33253c] mb-1" />
                    <p className="text-xs text-[#4a454c]">
                      <span className="font-semibold text-[#33253c]">Click to upload</span> or drag
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
            className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f9f6ed] border border-[#ded9cf] flex items-center justify-center text-[#33253c] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-sm md:text-base font-semibold text-[#1e1c17] flex items-center gap-1.5">
                  Class 12th Marksheet <span className="text-[#ba1a1a] text-xs">*</span>
                </h3>
                <p className="text-xs text-[#4a454c] mt-0.5">Final senior secondary examination certificate.</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    {marksheetDoc?.status === 'verified' ? 'VERIFIED' : 'COMMITTED'}
                  </span>
                  <span className="text-xs text-[#4a454c] font-mono">
                    {marksheetDoc?.fileName || 'marksheet_12th_2025.pdf'} ({marksheetDoc?.fileSize || '2.4MB'})
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
                  fileName: 'marksheet_12th_2025.pdf',
                  fileSize: '2.4MB',
                  status: 'verified',
                  uploadedAt: new Date().toISOString(),
                })}
                className="p-2 text-[#33253c] hover:bg-[#f9f6ed] rounded-lg transition-colors border border-[#ded9cf] cursor-pointer"
                aria-label="View Document"
                title="View Document"
              >
                <Eye className="w-4 h-4" />
              </button>
              {marksheetDoc && (
                <button
                  id="delete-marksheet-btn"
                  onClick={() => onDeleteDocument(marksheetDoc.id)}
                  className="p-2 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors border border-red-200 cursor-pointer"
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
            className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f9f6ed] border border-[#ded9cf] flex items-center justify-center text-[#33253c] shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline text-sm md:text-base font-semibold text-[#1e1c17] flex items-center gap-1.5">
                  Recent Photograph <span className="text-[#ba1a1a] text-xs">*</span>
                </h3>
                <p className="text-xs text-[#4a454c] mt-0.5">Passport size with clean background.</p>
                {photoDoc && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                      COMMITTED
                    </span>
                    <span className="text-xs text-[#4a454c] font-mono">{photoDoc.fileName} ({photoDoc.fileSize})</span>
                  </div>
                )}
              </div>
            </div>

            {photoDoc ? (
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <button
                  id="view-photo-btn"
                  onClick={() => onPreviewDoc(photoDoc)}
                  className="p-2 text-[#33253c] hover:bg-[#f9f6ed] rounded-lg transition-colors border border-[#ded9cf] cursor-pointer"
                  aria-label="View Photo"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  id="delete-photo-btn"
                  onClick={() => onDeleteDocument(photoDoc.id)}
                  className="p-2 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors border border-red-200 cursor-pointer"
                  aria-label="Remove Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-full md:w-auto">
                <label className="flex flex-col items-center justify-center w-full md:w-56 h-20 border-2 border-dashed border-[#ded9cf] hover:border-[#33253c] rounded-xl cursor-pointer bg-[#fcfaf2] hover:bg-[#f9f6ed] transition-colors">
                  <div className="flex flex-col items-center justify-center p-2">
                    <UploadCloud className="w-5 h-5 text-[#33253c] mb-1" />
                    <p className="text-xs text-[#4a454c]">
                      <span className="font-semibold text-[#33253c]">Click to upload</span> photo
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
          <div className="bg-white/95 backdrop-blur-xs rounded-xl p-6 border border-[#ded9cf] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="font-headline text-sm font-semibold text-[#33253c] mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#33253c]" />
              Upload Guidelines
            </h3>

            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-[#33253c] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1e1c17]">Supported Formats</p>
                  <p className="text-[#4a454c] mt-0.5">PDF, JPEG, JPG, PNG only.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <FileCheck className="w-4 h-4 text-[#33253c] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1e1c17]">File Size Limit</p>
                  <p className="text-[#4a454c] mt-0.5">Maximum 5MB per document. Ensure all details are legible.</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1e1c17]">Clarity Verification</p>
                  <p className="text-[#4a454c] mt-0.5">Documents must be high-contrast and fully un-cropped.</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-[#ded9cf]">
              <p className="text-xs text-[#4a454c] mb-3">Having trouble uploading documents?</p>
              <button
                id="contact-support-guidelines-btn"
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="w-full flex justify-center items-center gap-2 border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#33253c]" />
                <span>Contact Scrutiny Desk</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-4 border-t border-[#ded9cf] flex justify-between items-center">
        <button
          id="docs-prev-step-btn"
          type="button"
          onClick={onPreviousStep}
          className="border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Step</span>
        </button>

        <button
          id="docs-save-continue-btn"
          type="button"
          onClick={onSaveAndContinue}
          className="bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer group"
        >
          <span>Save &amp; Continue</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-xl p-6 border border-[#ded9cf] shadow-2xl relative text-[#1e1c17]">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 p-1 text-[#4a454c] hover:bg-[#f0eee6] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline font-semibold text-lg text-[#33253c] mb-2">
              Document Verification Support
            </h3>
            <p className="text-xs text-[#4a454c] mb-4 leading-relaxed">
              If your file size exceeds 5MB or your Digilocker sync failed, you may request manual administrative document review.
            </p>

            <div className="bg-[#f9f6ed] p-4 rounded-lg text-xs space-y-2 mb-4 border border-[#ded9cf]">
              <p><strong className="text-[#33253c]">Email:</strong> doc-support@iem.edu.in</p>
              <p><strong className="text-[#33253c]">Helpdesk Phone:</strong> +91 33 2357 2059 (Ext 104)</p>
              <p><strong className="text-[#33253c]">Office:</strong> Room 102, Academic Block A, Salt Lake</p>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full bg-[#33253c] hover:bg-[#4a3b53] text-white py-2.5 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
