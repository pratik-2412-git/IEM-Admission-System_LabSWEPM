import React, { useState } from 'react';
import { 
  BadgeCheck, 
  UploadCloud, 
  Eye, 
  Trash2, 
  FileText, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  Clock
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

  // Mandatory Document Slots
  const slots = [
    {
      type: 'marksheet_10th',
      title: 'Class 10th Marksheet / Passing Certificate',
      desc: 'Secondary school examination board result or passing certificate (PDF/JPG)',
      defaultName: 'class_10th_marksheet.pdf',
    },
    {
      type: 'marksheet_12th',
      title: 'Class 12th / Higher Secondary Marksheet',
      desc: 'Final board examination results showing Physics, Chemistry, Math scores',
      defaultName: 'class_12th_marksheet.pdf',
    },
    {
      type: 'id_proof',
      title: 'Government Identity Proof',
      desc: 'Aadhaar Card, Passport, or Voter ID with clear address details',
      defaultName: 'aadhaar_card_proof.pdf',
    },
    {
      type: 'photo',
      title: 'Recent Passport Size Photograph',
      desc: 'Formal passport photo with light/white background (JPG/PNG)',
      defaultName: 'candidate_photo.jpg',
    },
  ];

  const handleFileUpload = async (type: string, title: string, defaultName: string, event?: React.ChangeEvent<HTMLInputElement>) => {
    let fileName = defaultName;
    let fileSize = '1.8MB';

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

  const flaggedDocs = documents.filter(
    d => d.status === 'correction_required' || d.status === 'rejected'
  );
  const hasCorrectionRequired = flaggedDocs.length > 0;

  return (
    <div className="max-w-4xl mx-auto pb-12 text-[#1e1c17]">
      {/* Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Document Scrutiny Upload
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">
              Upload certified verification certificates and identity proofs for Round 1 scrutiny
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Secured Institutional Storage</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between relative px-2 py-1">
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          <div className="absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[42%]"></div>

          {/* Step 1 */}
          <div 
            onClick={() => onStepClick?.(1)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Profile</span>
          </div>

          {/* Step 2 (Active) */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              2
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Documents</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5]">
              3
            </div>
            <span className="text-xs text-[#7b776d] font-medium">Fee Payment</span>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onStepClick?.(4)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-semibold text-xs ring-4 ring-[#fdfbf5]">
              4
            </div>
            <span className="text-xs text-[#7b776d] font-medium">Submit</span>
          </div>
        </div>
      </div>

      {/* Prominent Global Correction Notice Banner */}
      {hasCorrectionRequired && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-xl text-red-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-red-950">Action Required: Document Correction Required</h4>
            <p className="mt-0.5 text-red-800">
              The admissions scrutiny committee flagged <strong>{flaggedDocs.length}</strong> document(s) requiring re-upload. Please review the committee remarks highlighted below and click <strong>RE-UPLOAD DOCUMENT</strong> to submit corrected files.
            </p>
          </div>
        </div>
      )}

      {/* Document Slots */}
      <div className="space-y-4">
        {slots.map((slot) => {
          const doc = documents.find(d => d.type === slot.type);
          const isCorrection = doc && (doc.status === 'correction_required' || doc.status === 'rejected');
          const isApproved = doc && (doc.status === 'approved' || doc.status === 'verified');
          const isPending = doc && (doc.status === 'pending' || doc.status === 'uploaded');

          return (
            <div 
              key={slot.type}
              className={`p-5 rounded-xl border transition-colors ${
                isCorrection 
                  ? 'bg-red-50/70 border-2 border-red-500 shadow-sm' 
                  : isApproved
                  ? 'bg-white border-emerald-300'
                  : 'bg-white border-[#ded9cf]'
              }`}
            >
              {/* Highlight Banner on the specific document card if flagged */}
              {isCorrection && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>ACTION REQUIRED: FIX THIS DOCUMENT</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`p-3 rounded-xl border shrink-0 ${
                    isApproved 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : isCorrection
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-[#f9f6ed] text-[#33253c] border-[#ded9cf]'
                  }`}>
                    {isApproved ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : isCorrection ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : (
                      <FileText className="w-6 h-6 text-[#33253c]" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-headline font-semibold text-sm text-[#1e1c17]">{slot.title}</h3>
                      {doc ? (
                        isApproved ? (
                          <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            APPROVED
                          </span>
                        ) : isCorrection ? (
                          <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border bg-red-100 text-red-800 border-red-400 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {doc.status === 'rejected' ? 'REJECTED' : 'CORRECTION REQUIRED'}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-300 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            PENDING VERIFICATION
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] font-medium text-[#7b776d] italic">Not uploaded</span>
                      )}
                    </div>
                    <p className="text-xs text-[#4a454c] mt-0.5">{slot.desc}</p>

                    {doc && (
                      <p className="text-[11px] text-[#7b776d] font-mono mt-1">
                        {doc.fileName} ({doc.fileSize}) • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    )}

                    {/* Active Committee Scrutiny Remarks */}
                    {isCorrection && (doc.adminRemarks || doc.remarks) && (
                      <div className="mt-3 p-3 bg-red-100/90 border border-red-300 rounded-lg text-xs text-red-950">
                        <div className="font-bold flex items-center gap-1.5 text-red-900">
                          <Info className="w-4 h-4 shrink-0" />
                          <span>Admin Remarks:</span>
                        </div>
                        <p className="mt-1 font-medium leading-relaxed">
                          &ldquo;{doc.adminRemarks || doc.remarks}&rdquo;
                        </p>
                        {doc.verifiedBy && (
                          <p className="mt-1 text-[11px] text-red-800">
                            Scrutinized by: {doc.verifiedBy} {doc.verifiedAt ? `• ${new Date(doc.verifiedAt).toLocaleDateString()}` : ''}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Previous remarks history if preserved */}
                    {!isCorrection && doc?.previousRemarks && (
                      <p className="mt-1 text-[11px] text-[#7b776d] italic">
                        Previous Scrutiny Note resolved: &ldquo;{doc.previousRemarks}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {doc ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onPreviewDoc(doc)}
                        className="px-3 py-1.5 rounded-lg border border-[#ded9cf] text-xs font-semibold text-[#4a454c] hover:bg-[#f0eee6] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      {isCorrection ? (
                        <label className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
                          {uploadingType === slot.type ? (
                            <span className="btn-spinner" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>RE-UPLOAD DOCUMENT</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(slot.type, slot.title, slot.defaultName, e)}
                          />
                        </label>
                      ) : (
                        <label className="px-3 py-1.5 rounded-lg border border-[#33253c] text-xs font-semibold text-[#33253c] hover:bg-[#f1ebdb] flex items-center gap-1.5 cursor-pointer">
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(slot.type, slot.title, slot.defaultName, e)}
                          />
                        </label>
                      )}

                      {!isApproved && (
                        <button
                          type="button"
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <label className="px-4 py-2 bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs">
                      {uploadingType === slot.type ? (
                        <span className="btn-spinner" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      <span>Upload File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(slot.type, slot.title, slot.defaultName, e)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-[#ded9cf] flex justify-between items-center">
        <button
          type="button"
          onClick={onPreviousStep}
          className="px-5 py-2.5 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Application Form</span>
        </button>

        <button
          type="button"
          onClick={onSaveAndContinue}
          className="px-6 py-2.5 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>Continue to Fee Payment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
