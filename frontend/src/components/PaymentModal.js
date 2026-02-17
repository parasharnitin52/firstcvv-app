import React, { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle, Sparkles } from 'lucide-react';

const PaymentModal = ({ template, onClose, onSuccess }) => {
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const api = (await import('../utils/api')).default;
            const res = await api.post('/payment/unlock', { templateId: template.id });

            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess(template.id);
                }, 1200);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && !processing && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-8 text-white">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                        <Lock className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Unlock Template</h2>
                    </div>
                    <p className="text-white/80 text-sm">
                        One-time payment to unlock full access
                    </p>
                </div>

                {success ? (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                        <p className="text-gray-500 text-sm">Template unlocked. Redirecting...</p>
                    </div>
                ) : (
                    /* Payment Form */
                    <div className="p-6">
                        {/* Template Info */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary-600">₹{template.price}</p>
                                    <p className="text-xs text-gray-400">one-time</p>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-6">
                            {[
                                'Full access to edit and customize',
                                'Unlimited downloads in PDF format',
                                'ATS-optimized layout',
                                'Lifetime access to this template'
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                                    <Sparkles className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                    {feat}
                                </div>
                            ))}
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${processing
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                        >
                            {processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Pay ₹{template.price}
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            🔒 Secure mock payment • No real charges
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
