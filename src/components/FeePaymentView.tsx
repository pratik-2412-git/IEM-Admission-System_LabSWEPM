import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Receipt,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Application, PaymentRecord } from '../types';

interface FeePaymentViewProps {
  application: Application | null;
  payments: PaymentRecord[];
  onProcessPayment: (amount: number, method: string, details?: any) => Promise<PaymentRecord>;
  onPreviousStep: () => void;
  onContinueToSubmit: () => void;
  onViewInvoice: () => void;
}

export const FeePaymentView: React.FC<FeePaymentViewProps> = ({
  application,
  payments,
  onProcessPayment,
  onPreviousStep,
  onContinueToSubmit,
  onViewInvoice,
}) => {
  const existingPayment = payments.find(p => p.status === 'success');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState(application?.personal.fullName || 'Aanya Sharma');

  const [upiId, setUpiId] = useState('candidate@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [processing, setProcessing] = useState(false);
  const [successPayment, setSuccessPayment] = useState<PaymentRecord | null>(existingPayment || null);

  const feeAmount = 50.00;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payment = await onProcessPayment(feeAmount, paymentMethod, {
        cardLast4: paymentMethod === 'card' ? '4242' : undefined,
        upiId: paymentMethod === 'upi' ? upiId : undefined,
        bankName: paymentMethod === 'netbanking' ? selectedBank : undefined,
      });

      setSuccessPayment(payment);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4d3e56', '#65556e', '#e1ccea', '#10b981'],
        });
      } catch (err) {
        // ignore
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12 text-[#F8FAFC]">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Transaction Portal [03]</span>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight mt-0.5">
          Fee Payment
        </h2>
        <p className="font-body text-xs md:text-sm text-slate-400 mt-1">
          Complete the official 2026 application processing fee to finalize candidate submission.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Payment Form / Confirmation (8 cols) */}
        <div className="lg:col-span-8">
          {successPayment ? (
            <div 
              id="payment-success-card"
              className="bg-[#0F172A] border border-teal-500/30 rounded-xl p-6 md:p-8 shadow-sm text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-headline text-xl md:text-2xl font-bold text-[#F8FAFC]">
                  Payment Verified Successfully
                </h3>
                <p className="text-xs md:text-sm text-slate-400 mt-1 font-mono">
                  Transaction <strong className="text-teal-300">{successPayment.transactionId}</strong> recorded to admission ledger.
                </p>
              </div>

              {/* Receipt Snippet */}
              <div className="bg-[#030712] border border-[#1E293B] rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Application ID:</span>
                  <span className="font-semibold text-slate-200">{application?.id || 'IEM-2024-001'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Invoice Number:</span>
                  <span className="font-semibold text-slate-200">{successPayment.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-teal-400">${successPayment.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-slate-300">{new Date(successPayment.paidAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="view-invoice-btn"
                  type="button"
                  onClick={onViewInvoice}
                  className="px-5 py-2.5 rounded-lg border border-[#1E293B] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Receipt className="w-4 h-4 text-teal-400" />
                  <span>VIEW_INVOICE</span>
                </button>

                <button
                  id="continue-to-final-submit-btn"
                  type="button"
                  onClick={onContinueToSubmit}
                  className="px-6 py-2.5 rounded-lg bg-[#2DD4BF] text-[#020617] hover:bg-teal-400 text-xs font-bold flex items-center gap-2 shadow-sm shadow-teal-500/10 cursor-pointer transition-colors"
                >
                  <span>Continue to Step 4: Submit</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 md:p-8 shadow-sm space-y-6">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                  Select Gateway Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    id="pay-method-card"
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-teal-400 bg-teal-500/10 text-teal-300 font-semibold'
                        : 'border-[#1E293B] bg-[#030712] hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-teal-400" />
                    <span className="text-xs">Credit / Debit Card</span>
                  </button>

                  <button
                    id="pay-method-upi"
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-teal-400 bg-teal-500/10 text-teal-300 font-semibold'
                        : 'border-[#1E293B] bg-[#030712] hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-teal-400" />
                    <span className="text-xs">UPI / QR Code</span>
                  </button>

                  <button
                    id="pay-method-netbanking"
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-teal-400 bg-teal-500/10 text-teal-300 font-semibold'
                        : 'border-[#1E293B] bg-[#030712] hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-teal-400" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Form by Method */}
              <form onSubmit={handlePay} className="space-y-4 pt-2">
                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Cardholder Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Card Number <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none font-mono"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-teal-400">
                          VISA / MC
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Expiry Date <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          CVV / CVC <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4 text-center">
                    <div className="p-4 bg-[#030712] rounded-xl max-w-xs mx-auto border border-[#1E293B]">
                      <div className="w-36 h-36 bg-white mx-auto rounded-lg p-2 flex items-center justify-center border border-slate-700 shadow-sm">
                        <QrCode className="w-32 h-32 text-[#020617]" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2 font-mono">Scan with UPI App</p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Or enter UPI VPA ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full max-w-md mx-auto px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none text-center font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Select Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#1E293B] focus:border-teal-400 bg-[#030712] text-slate-100 outline-none"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-[#1E293B]">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Lock className="w-4 h-4 text-teal-400" />
                    <span>256-bit SSL Gateway</span>
                  </div>

                  <button
                    id="submit-payment-btn"
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 rounded-lg bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold transition-all shadow-sm shadow-teal-500/10 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>AUTHORIZING...</span>
                      </>
                    ) : (
                      <>
                        <span>PAY ${feeAmount.toFixed(2)} USD</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Fee Summary (4 cols) */}
        <aside className="lg:col-span-4 h-fit">
          <div className="bg-[#0F172A] rounded-xl p-6 border border-[#1E293B] shadow-sm space-y-4">
            <h3 className="font-headline text-sm font-semibold text-[#F8FAFC]">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs pb-4 border-b border-[#1E293B]">
              <div className="flex justify-between text-slate-400">
                <span>Application Assessment Fee</span>
                <span className="font-mono font-semibold text-slate-200">$45.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Document Verification Surcharge</span>
                <span className="font-mono font-semibold text-slate-200">$5.00</span>
              </div>
              <div className="flex justify-between text-teal-400 font-mono">
                <span>Early Bird Waiver</span>
                <span>-$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-300">Total Payable:</span>
              <span className="text-lg font-mono font-bold text-teal-400">${feeAmount.toFixed(2)}</span>
            </div>

            <div className="p-3 bg-[#030712] rounded-lg border border-[#1E293B] text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                Payment is instantly linked with Application ID <strong className="text-slate-200 font-mono">{application?.id || 'IEM-2024-001'}</strong>.
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[#1E293B] flex justify-between">
        <button
          type="button"
          onClick={onPreviousStep}
          className="border border-[#1E293B] bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Documents</span>
        </button>

        {successPayment && (
          <button
            type="button"
            onClick={onContinueToSubmit}
            className="bg-[#2DD4BF] hover:bg-teal-400 text-[#020617] text-xs font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm shadow-teal-500/10 flex items-center gap-2 cursor-pointer"
          >
            <span>Next: Final Review</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
