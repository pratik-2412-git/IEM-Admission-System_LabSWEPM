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
  Receipt 
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
          colors: ['#33253c', '#4a3b53', '#e7dcea', '#059669'],
        });
      } catch (err) {
        // ignore
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 text-[#1e1c17] transition-colors duration-300">
      {/* Header & Stepper */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-semibold text-[#33253c] tracking-tight">
              Fee Payment
            </h1>
            <p className="text-xs text-[#4a454c] mt-0.5">Complete the official 2026 application processing fee</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f9f6ed] border border-[#ded9cf] rounded-full text-xs text-[#4a454c] font-medium shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Verified Payment Gateway</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between relative px-2 py-1">
          <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#eae6da] z-0"></div>
          <div className="animated-progress-bar absolute left-6 top-5 h-0.5 bg-[#33253c] z-0 w-[74%]"></div>

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

          {/* Step 2 */}
          <div 
            onClick={() => onStepClick?.(2)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              ✓
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Documents</span>
          </div>

          {/* Step 3 (Active) */}
          <div 
            onClick={() => onStepClick?.(3)}
            className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#33253c] text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-[#fdfbf5]">
              3
            </div>
            <span className="text-xs font-semibold text-[#33253c]">Payment</span>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-up stagger-1">
        {/* Left Column: Payment Form / Confirmation (8 cols) */}
        <div className="lg:col-span-8">
          {successPayment ? (
            <div 
              id="payment-success-card"
              className="bg-white/95 backdrop-blur-xs border border-emerald-200 rounded-xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-headline text-xl md:text-2xl font-semibold text-[#33253c]">
                  Payment Verified Successfully
                </h3>
                <p className="text-xs md:text-sm text-[#4a454c] mt-1">
                  Transaction reference <strong className="text-[#33253c] font-mono font-semibold">{successPayment.transactionId}</strong> logged to admissions ledger.
                </p>
              </div>

              {/* Receipt Snippet */}
              <div className="bg-[#f9f6ed] border border-[#ded9cf] rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4a454c]">Application ID:</span>
                  <span className="font-semibold text-[#33253c]">{application?.id || 'IEM-2026-001'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a454c]">Invoice Number:</span>
                  <span className="font-semibold text-[#33253c]">{successPayment.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a454c]">Amount Paid:</span>
                  <span className="font-bold text-emerald-700">${successPayment.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4a454c]">Timestamp:</span>
                  <span className="text-[#1e1c17]">{new Date(successPayment.paidAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  id="view-invoice-btn"
                  type="button"
                  onClick={onViewInvoice}
                  className="px-5 py-2.5 rounded-lg border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Receipt className="w-4 h-4 text-[#33253c]" />
                  <span>View Tax Invoice</span>
                </button>

                <button
                  id="continue-to-final-submit-btn"
                  type="button"
                  onClick={onContinueToSubmit}
                  className="px-6 py-2.5 rounded-lg bg-[#33253c] text-white hover:bg-[#4a3b53] text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer transition-colors group"
                >
                  <span>Continue to Final Review</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-xs border border-[#ded9cf] rounded-xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#33253c] mb-3">
                  Select Gateway Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    id="pay-method-card"
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#33253c] bg-[#e7dcea]/40 text-[#33253c] font-semibold'
                        : 'border-[#ded9cf] bg-[#f9f6ed] hover:bg-[#f0eee6] text-[#4a454c]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#33253c]" />
                    <span className="text-xs">Credit / Debit Card</span>
                  </button>

                  <button
                    id="pay-method-upi"
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-[#33253c] bg-[#e7dcea]/40 text-[#33253c] font-semibold'
                        : 'border-[#ded9cf] bg-[#f9f6ed] hover:bg-[#f0eee6] text-[#4a454c]'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#33253c]" />
                    <span className="text-xs">UPI / QR Code</span>
                  </button>

                  <button
                    id="pay-method-netbanking"
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#33253c] bg-[#e7dcea]/40 text-[#33253c] font-semibold'
                        : 'border-[#ded9cf] bg-[#f9f6ed] hover:bg-[#f0eee6] text-[#4a454c]'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#33253c]" />
                    <span className="text-xs">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Form by Method */}
              <form onSubmit={handlePay} className="space-y-4 pt-2">
                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#1e1c17] mb-1">
                        Cardholder Name <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1e1c17] mb-1">
                        Card Number <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] outline-none font-mono"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4a454c]">
                          VISA / MC
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1e1c17] mb-1">
                          Expiry Date <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1e1c17] mb-1">
                          CVV / CVC <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] outline-none font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-4 text-center">
                    <div className="p-4 bg-[#f9f6ed] rounded-xl max-w-xs mx-auto border border-[#ded9cf]">
                      <div className="w-36 h-36 bg-white mx-auto rounded-lg p-2 flex items-center justify-center border border-[#ded9cf] shadow-2xs">
                        <QrCode className="w-32 h-32 text-[#33253c]" />
                      </div>
                      <p className="text-xs text-[#4a454c] mt-2 font-medium">Scan using BHIM, GPay, or Paytm</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1e1c17] mb-1">
                        Or enter UPI Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="w-full max-w-md mx-auto px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] outline-none text-center font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#1e1c17] mb-1.5">
                      Select Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#ded9cf] focus:border-[#33253c] bg-[#fcfaf2] text-[#1e1c17] outline-none"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-[#ded9cf]">
                  <div className="flex items-center gap-2 text-xs text-[#4a454c]">
                    <Lock className="w-4 h-4 text-[#33253c]" />
                    <span>256-bit Encrypted SSL Gateway</span>
                  </div>

                  <button
                    id="submit-payment-btn"
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2.5 rounded-lg bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer group"
                  >
                    {processing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>AUTHORIZING...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ${feeAmount.toFixed(2)} USD</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
          <div className="bg-white/95 backdrop-blur-xs rounded-xl p-6 border border-[#ded9cf] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="font-headline text-sm font-semibold text-[#33253c]">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs pb-4 border-b border-[#ded9cf]">
              <div className="flex justify-between text-[#4a454c]">
                <span>Application Assessment Fee</span>
                <span className="font-semibold text-[#1e1c17]">$45.00</span>
              </div>
              <div className="flex justify-between text-[#4a454c]">
                <span>Document Scrutiny Surcharge</span>
                <span className="font-semibold text-[#1e1c17]">$5.00</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Early Bird Waiver</span>
                <span>-$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs uppercase font-semibold text-[#33253c]">Total Payable:</span>
              <span className="text-xl font-bold text-[#33253c]">${feeAmount.toFixed(2)}</span>
            </div>

            <div className="p-3 bg-[#f9f6ed] rounded-lg border border-[#ded9cf] text-xs text-[#4a454c] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#33253c] shrink-0 mt-0.5" />
              <span>
                Payment is securely bound to Application ID <strong className="text-[#33253c]">{application?.id || 'IEM-2026-001'}</strong>.
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[#ded9cf] flex justify-between">
        <button
          type="button"
          onClick={onPreviousStep}
          className="border border-[#33253c] text-[#33253c] hover:bg-[#f1ebdb] text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Documents</span>
        </button>

        {successPayment && (
          <button
            type="button"
            onClick={onContinueToSubmit}
            className="bg-[#33253c] hover:bg-[#4a3b53] text-white text-xs font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer group"
          >
            <span>Next: Final Review</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </div>
  );
};
