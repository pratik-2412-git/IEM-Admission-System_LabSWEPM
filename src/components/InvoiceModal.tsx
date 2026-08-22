import React from 'react';
import { X, Printer, Receipt, CheckCircle2 } from 'lucide-react';
import { Application, PaymentRecord } from '../types';
import { IEMLogo } from './IEMLogo';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  payment?: PaymentRecord | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  application,
  payment,
}) => {
  if (!isOpen) return null;

  const txnId = payment?.transactionId || 'TXN987654321';
  const invoiceNum = payment?.invoiceNumber || 'INV-2024-001';
  const amount = payment?.amount || 50.00;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto text-[#F8FAFC]">
      <div 
        id="fee-invoice-modal"
        className="bg-[#0F172A] max-w-2xl w-full rounded-xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-[#1E293B] bg-[#030712] flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-400" />
            <h3 className="font-headline font-bold text-sm text-[#F8FAFC]">Fee Payment Tax Invoice</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg border border-[#1E293B] bg-[#0F172A] text-teal-400 hover:bg-slate-800 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT_INVOICE</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-[#F8FAFC] font-mono">
          <div className="flex justify-between items-start border-b border-[#1E293B] pb-4">
            <div className="flex items-center gap-3">
              <IEMLogo size="lg" variant="icon" />
              <div>
                <h2 className="font-headline font-bold text-base md:text-lg text-[#F8FAFC]">IEM Admission Processing Cell</h2>
                <p className="text-xs text-slate-400">GSTIN: 19AAATI1234F1Z8</p>
                <p className="text-xs text-slate-400">EP-Block, Salt Lake Electronic Complex, Kolkata 700091</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-teal-400 block">INVOICE #{invoiceNum}</span>
              <span className="text-[11px] text-slate-400">Date: {new Date(payment?.paidAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-[#030712] p-4 rounded-lg border border-[#1E293B]">
            <div>
              <p className="font-semibold text-slate-400 text-[10px] uppercase">Billed To (Applicant):</p>
              <p className="font-bold text-[#F8FAFC] text-sm mt-0.5">{application?.personal.fullName || 'Aanya Sharma'}</p>
              <p className="text-slate-400">App ID: {application?.id || 'IEM-2026-001'}</p>
              <p className="text-slate-400">{application?.personal.email}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-400 text-[10px] uppercase">Payment Particulars:</p>
              <p className="text-slate-300"><span className="text-slate-400">Txn ID:</span> {txnId}</p>
              <p className="text-slate-300"><span className="text-slate-400">Method:</span> {payment?.paymentMethod?.toUpperCase() || 'CARD (ONLINE)'}</p>
              <p className="text-teal-400 font-bold mt-1 uppercase text-[11px]">STATUS: COMPLETED / PAID</p>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 text-[10px] uppercase">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">SAC Code</th>
                <th className="py-2 text-right">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              <tr>
                <td className="py-2.5">
                  <span className="font-semibold text-slate-200 block">Application Processing &amp; Assessment Fee</span>
                  <span className="text-[11px] text-slate-400">Undergraduate Engineering Admissions Cycle 2026</span>
                </td>
                <td className="py-2.5 text-right text-slate-400">999293</td>
                <td className="py-2.5 text-right font-semibold text-slate-100">$45.00</td>
              </tr>
              <tr>
                <td className="py-2.5">
                  <span className="font-semibold text-slate-200 block">Document Scrutiny &amp; Verification Charge</span>
                  <span className="text-[11px] text-slate-400">Central Registrar Online Verification</span>
                </td>
                <td className="py-2.5 text-right text-slate-400">999299</td>
                <td className="py-2.5 text-right font-semibold text-slate-100">$5.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-[#1E293B] font-bold text-sm">
                <td className="py-3" colSpan={2}>Total Paid:</td>
                <td className="py-3 text-right text-teal-400">${amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="p-3 bg-[#030712] border border-[#1E293B] rounded-lg text-[11px] text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>This is an automated computer-generated tax invoice verified under secure ledger records.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E293B] bg-[#030712] flex justify-end print:hidden font-mono">
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
