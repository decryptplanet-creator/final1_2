import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { X, DollarSign, CheckCircle, TrendingUp, Lock, FileText, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function PaymentHistoryModal({ onClose, orderId, transactions }) {
  const { isDarkMode } = useTheme();

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'advance-paid':
        return <DollarSign className="size-5 text-[#2563EB]" />;
      case 'manufacturer-advance':
        return <TrendingUp className="size-5 text-green-600" />;
      case 'final-payment':
        return <DollarSign className="size-5 text-[#2563EB]" />;
      case 'full-release':
        return <CheckCircle className="size-5 text-green-600" />;
      default:
        return <FileText className="size-5 text-gray-400" />;
    }
  };

  const getTotalAmount = () => {
    return transactions.reduce((sum, t) => t.status === 'completed' ? sum + t.amount : sum, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className={`max-w-3xl w-full my-8 ${isDarkMode ? 'bg-[#2A3642] border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}>
                Payment History & Escrow Logs
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Complete audit trail for Order #{orderId}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className={isDarkMode ? 'text-gray-400 hover:text-[#F9FAFB]' : 'text-gray-400 hover:text-[#1F2933]'}
            >
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Summary Card */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gradient-to-br from-[#2563EB]/10 to-[#2563EB]/5'} border border-[#2563EB]/30`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Transaction Amount
                </p>
                <p className="text-3xl font-bold text-[#2563EB]">
                  PKR {getTotalAmount().toLocaleString()}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className={`${isDarkMode ? 'border-gray-600 text-[#F9FAFB]' : 'border-gray-300 text-[#1F2933]'}`}
              >
                <Download className="size-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Transaction Timeline */}
          <div>
            <h3 className={`font-medium mb-4 flex items-center gap-2 ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
              <FileText className="size-5 text-[#2563EB]" />
              Transaction Timeline
            </h3>

            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div 
                  key={transaction.id}
                  className={`relative pl-12 pb-4 ${
                    index !== transactions.length - 1 ? 'border-l-2' : ''
                  } ${
                    transaction.status === 'completed' 
                      ? isDarkMode ? 'border-green-500/30' : 'border-green-300' 
                      : isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } ml-6`}
                >
                  {/* Icon */}
                  <div className={`absolute -left-6 top-0 size-12 rounded-full flex items-center justify-center ${
                    transaction.status === 'completed'
                      ? isDarkMode ? 'bg-green-500/10' : 'bg-green-50'
                      : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    {getTransactionIcon(transaction.type)}
                  </div>

                  {/* Content */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1F2933]' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                          {transaction.description}
                        </h4>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${
                          transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          PKR {transaction.amount.toLocaleString()}
                        </p>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-1 ${
                          transaction.status === 'completed'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {transaction.status === 'completed' ? (
                            <>
                              <CheckCircle className="size-3" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Lock className="size-3" />
                              Pending
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Transaction ID:</span>
                          <p className={`font-mono text-xs ${isDarkMode ? 'text-[#F9FAFB]' : 'text-[#1F2933]'}`}>
                            {transaction.id}
                          </p>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
                          <p className={`font-medium ${
                            transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {transaction.status === 'completed' ? 'Verified & Completed' : 'In Escrow'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Protection Info */}
          <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[#2563EB] mb-1">
                  Escrow Protection Active
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  All payments are processed through Skillora's secure escrow system. 
                  This audit trail provides complete transparency and ensures trust between all parties.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
/*Purpose: Yeh modal payment history aur escrow transactions ka complete record (timeline + summary) show karta hai.
Type: Web-based React component hai (web app ke liye, mobile native ke liye direct nahi). */