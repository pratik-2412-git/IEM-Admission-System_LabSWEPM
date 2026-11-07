import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Receipt,
  ShieldCheck,
  Building2,
  Wallet,
  GraduationCap
} from 'lucide-react';
import { Application, PaymentRecord } from '../types';

interface FeePaymentViewProps {
  application: Application | null;
  payments: PaymentRecord[];
  onProcessPayment: (amount: number, method: string, details?: any) => Promise<PaymentRecord>;
  onPreviousStep: () => void;
  onContinueToSubmit: () => void;
  onViewInvoice: () => void;
  onStepClick?: (stepNumber: 1 | 2 | 3 | 4) => void;
}

export const FeePaymentView: React.FC<FeePaymentViewProps> = ({
  application,
  payments,
  onProcessPayment,
  onPreviousStep,
  onContinueToSubmit,
  onViewInvoice,
  onStepClick,
}) => {
  const existingPayment = payments.find(p => p.status === 'paid' || p.status === 'success');
  const [processing, setProcessing] = useState(false);
  const [successPayment, setSuccessPayment] = useState<PaymentRecord | null>(existingPayment || null);
  const [selectedMethod, setSelectedMethod] = useState<'portal_waiver' | 'online_gateway' | 'scholastic_waiver'>('portal_waiver');

  const feeAmount = 0.00; // Institutional Fee Waiver applied (₹0.00)
  const isSeatAllotted = application?.status === 'seat_allotted' || application?.status === 'admission_confirmed';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payment = await onProcessPayment(feeAmount, selectedMethod, {
        note: 'Institutional Fee Waiver Applied (₹0.00)',
        method: selectedMethod,
      });
      setSuccessPayment(payment);
    } catch (err: any) {
      alert(err.message || 'Fee payment recording failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 text-[#1e1c17]">
      {/* Header & Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Fee Payment
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">
              Confirm your seat acceptance and register institutional admission record
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Institutional Fee Waiver Applied (₹0.00)</span>
          </div>
        </div>

        {/* Stepper (Static) */}
        <div className="flex items-center justify-between relative px-2 py-1">
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          <div className="absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[75%]"></div>

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

          {/* Step 2 */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Documents</span>
          </div>

          {/* Step 3 (Active) */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              3
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Fee Payment</span>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => onStepClick?.(4)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#fdfbf5] border-2 border-[#ded9cf] text-[#7b776d] flex items-center justify-center font-bold text-xs ring-4 ring-[#fdfbf5]">
              4
            </div>
            <span className="text-xs text-[#7b776d]">Submit</span>
          </div>
        </div>
      </div>

      {/* Success State */}
      {successPayment ? (
        <div className="bg-white border border-emerald-200 rounded-xl p-8 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-headline text-2xl font-semibold text-[#33253c]">
              Fees Paid Successfully
            </h2>
            <p className="text-xs md:text-sm text-[#4a454c] max-w-md mx-auto mt-1">
              Your admission processing and seat acceptance transaction of <strong className="text-emerald-700 font-bold">₹0.00</strong> has been confirmed.
            </p>
          </div>

          {/* Transaction Metadata Card */}
          <div className="max-w-md mx-auto p-4 bg-[#f9f6ed] rounded-xl border border-[#ded9cf] text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-[#4a454c]">Transaction Reference:</span>
              <span className="font-mono font-bold text-[#1e1c17]">{successPayment.transactionId || successPayment.transactionReference || 'TXN-IEM-98214'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4a454c]">Invoice Number:</span>
              <span className="font-mono font-bold text-[#1e1c17]">{successPayment.invoiceNumber || 'INV-IEM-2026-001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4a454c]">Total Amount Charged:</span>
              <span className="font-bold text-emerald-800 text-sm">₹0.00 (Institutional Fee Waiver Applied)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4a454c]">Payment Status:</span>
              <span className="font-bold uppercase text-emerald-800">PAID</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onViewInvoice}
              className="px-5 py-2.5 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-[#33253c]" />
              <span>View Fee Payment Receipt</span>
            </button>

            <button
              onClick={onContinueToSubmit}
              className="px-6 py-2.5 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Final Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Payment Execution Form */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Payment Card (2 Cols) */}
          <div className="md:col-span-2 bg-white border border-[#ded9cf] rounded-xl p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-[#ded9cf] flex justify-between items-center">
              <div>
                <h3 className="font-headline text-base font-semibold text-[#33253c]">
                  Fee Payment
                </h3>
                <p className="text-xs text-[#4a454c]">
                  Provisional admission fee processing (Institutional Waiver Applied)
                </p>
              </div>
              <span className="text-lg font-bold font-mono text-[#33253c]">
                ₹0.00
              </span>
            </div>

            {/* Clear Professional Waiver Notice */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
              <strong>Institutional Fee Waiver Applied:</strong> In accordance with the Institute of Engineering &amp; Management (IEM) admissions policy for Session 2026-2027, candidate registration and scrutiny fees are 100% subsidized. Total payable amount is <strong>₹0.00</strong>. Clicking &ldquo;Pay Fees&rdquo; will officially record your payment and generate your Fee Payment Receipt.
            </div>

            {/* Method Selectors */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#1e1c17]">
                Select Payment Option:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('portal_waiver')}
                  className={`p-3 rounded-lg border text-left cursor-pointer ${
                    selectedMethod === 'portal_waiver'
                      ? 'border-[#33253c] bg-[#e7dcea]/40 font-semibold text-[#33253c]'
                      : 'border-[#ded9cf] bg-[#fdfbf5] text-[#4a454c]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Direct Portal Waiver</span>
                  </div>
                  <p className="text-[10px] text-[#7b776d] mt-1">Institutional Fee Waiver</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('online_gateway')}
                  className={`p-3 rounded-lg border text-left cursor-pointer ${
                    selectedMethod === 'online_gateway'
                      ? 'border-[#33253c] bg-[#e7dcea]/40 font-semibold text-[#33253c]'
                      : 'border-[#ded9cf] bg-[#fdfbf5] text-[#4a454c]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Online Gateway</span>
                  </div>
                  <p className="text-[10px] text-[#7b776d] mt-1">Net Banking / Card / UPI</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('scholastic_waiver')}
                  className={`p-3 rounded-lg border text-left cursor-pointer ${
                    selectedMethod === 'scholastic_waiver'
                      ? 'border-[#33253c] bg-[#e7dcea]/40 font-semibold text-[#33253c]'
                      : 'border-[#ded9cf] bg-[#fdfbf5] text-[#4a454c]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Merit Scholastic</span>
                  </div>
                  <p className="text-[10px] text-[#7b776d] mt-1">Academic Category Waiver</p>
                </button>
              </div>
            </div>

            {/* Pay Button */}
            <form onSubmit={handlePay} className="pt-3">
              <button
                id="btn-pay-fees"
                type="submit"
                disabled={processing}
                className="w-full py-3 px-6 bg-[#33253c] hover:bg-[#4a3b53] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {processing ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Pay Fees</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={onPreviousStep}
                className="text-[#4a454c] hover:text-[#1e1c17] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Documents</span>
              </button>
            </div>
          </div>

          {/* Sidebar Breakdown Card (1 Col) */}
          <div className="bg-[#f9f6ed] border border-[#ded9cf] rounded-xl p-5 space-y-4 text-xs">
            <h4 className="font-headline font-semibold text-xs text-[#33253c] uppercase tracking-wider pb-2 border-b border-[#ded9cf]">
              Fee Breakdown
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Admissions Scrutiny Fee:</span>
                <span className="font-mono line-through text-[#7b776d]">₹1,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a454c]">Counseling Round 1:</span>
                <span className="font-mono line-through text-[#7b776d]">₹500.00</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Institutional Fee Waiver:</span>
                <span className="font-mono">- ₹1,500.00</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ded9cf] flex justify-between items-baseline">
              <span className="font-semibold text-[#1e1c17]">Total Payable:</span>
              <span className="text-xl font-bold font-mono text-[#33253c]">₹0.00</span>
            </div>

            <p className="text-[11px] text-[#7b776d] leading-relaxed">
              An official Fee Payment Receipt with unique transaction reference will be issued immediately upon confirmation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
