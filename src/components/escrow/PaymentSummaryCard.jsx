import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, Lock, CheckCircle, Info } from 'lucide-react';

export function PaymentSummaryCard({ 
  totalAmount, 
  advancePaid = 0,
  manufacturerAdvance = 0,
  remainingAmount = 0,
  escrowStatus,
  showBreakdown = true
}) {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[#1F2933] flex items-center gap-2">
          <DollarSign className="size-5 text-[#2563EB]" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Total Amount */}
        <div className="flex items-center justify-between p-3 bg-[#2563EB]/5 rounded-lg">
          <span className="text-sm text-gray-600">Total Order Amount</span>
          <span className="text-xl font-semibold text-[#2563EB]">
            PKR {totalAmount.toLocaleString()}
          </span>
        </div>

        {showBreakdown && (
          <>
            {/* Advance Paid */}
            {advancePaid > 0 && (
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-[#2563EB]" />
                  <span className="text-sm text-gray-600">Advance Paid (30%)</span>
                </div>
                <span className="font-medium text-[#1F2933]">
                  PKR {advancePaid.toLocaleString()}
                </span>
              </div>
            )}

            {/* Manufacturer Advance */}
            {manufacturerAdvance > 0 && (
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-[#2563EB]" />
                  <span className="text-sm text-gray-600">Released to Manufacturer (5%)</span>
                </div>
                <span className="font-medium text-[#1F2933]">
                  PKR {manufacturerAdvance.toLocaleString()}
                </span>
              </div>
            )}

            {/* Remaining Amount */}
            {remainingAmount > 0 && (
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Remaining in Escrow</span>
                </div>
                <span className="font-medium text-[#1F2933]">
                  PKR {remainingAmount.toLocaleString()}
                </span>
              </div>
            )}
          </>
        )}

        {/* Escrow Status Info */}
        {escrowStatus && (
          <div className={`flex items-start gap-2 p-3 rounded-lg ${
            escrowStatus === 'HOLD' ? 'bg-yellow-50 border border-yellow-200' :
            escrowStatus === 'RELEASED' ? 'bg-[#2563EB]/5 border border-[#2563EB]/20' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <Info className={`size-4 mt-0.5 flex-shrink-0 ${
              escrowStatus === 'HOLD' ? 'text-yellow-600' :
              escrowStatus === 'RELEASED' ? 'text-[#2563EB]' :
              'text-blue-600'
            }`} />
            <p className={`text-sm ${
              escrowStatus === 'HOLD' ? 'text-yellow-700' :
              escrowStatus === 'RELEASED' ? 'text-[#2563EB]' :
              'text-blue-700'
            }`}>
              {escrowStatus === 'HOLD' && 'Payment safely held in escrow. Funds will be released after client approval.'}
              {escrowStatus === 'RELEASED' && 'Payment has been successfully released to the manufacturer.'}
              {escrowStatus === 'PARTIAL' && 'Partial payment released. Remaining amount held in escrow for security.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
/*Purpose: Yeh component payment summary show karta hai (total, advance, remaining aur escrow status breakdown).
Type: Web-based React component hai (web app ke liye banaya gaya hai). */