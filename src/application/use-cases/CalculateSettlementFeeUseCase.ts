import { FeeCalculationRequest, FeeCalculationResult } from '@/domain/entities/fee';
import { PaymentMethod } from '@/domain/entities/transaction';

export class CalculateSettlementFeeUseCase {
  private readonly IVA_RATE = 0.21; // 21% IVA on fee (as in backend SettlementCalculatorService)

  execute(request: FeeCalculationRequest): FeeCalculationResult {
    const grossAmount = Math.max(0, request.grossAmount || 0);
    const paymentMethod: PaymentMethod = request.paymentMethod || 'DEBIT';
    const immediateWithPenalty = !!request.immediateWithPenalty;

    let feePercentage = 0;
    let scheduledPayoutDate = new Date();
    let payoutDelayHoursOrDays = '';

    switch (paymentMethod) {
      case 'DEBIT':
        feePercentage = 0.008; // 0.8%
        scheduledPayoutDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        payoutDelayHoursOrDays = '24 Hours';
        break;

      case 'CREDIT_1':
        feePercentage = 0.018; // 1.8%
        scheduledPayoutDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
        payoutDelayHoursOrDays = '48 Hours';
        break;

      case 'CREDIT_3':
        if (immediateWithPenalty) {
          // 6.5% + 2% penalty = 8.5% total fee, immediate accreditation
          feePercentage = 0.065 + 0.02; // 8.5%
          scheduledPayoutDate = new Date();
          payoutDelayHoursOrDays = 'Immediate (With 2% Penalty)';
        } else {
          feePercentage = 0.065; // 6.5%
          scheduledPayoutDate = this.addBusinessDays(new Date(), 10);
          payoutDelayHoursOrDays = '10 Business Days';
        }
        break;

      case 'QR':
        feePercentage = 0.006; // 0.6%
        scheduledPayoutDate = new Date(); // 0 hours
        payoutDelayHoursOrDays = 'Immediate (0 Hours)';
        break;

      default:
        feePercentage = 0.008;
        scheduledPayoutDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        payoutDelayHoursOrDays = '24 Hours';
    }

    const rawFee = grossAmount * feePercentage;
    const feeApplied = this.roundToTwoDecimals(rawFee);

    const rawTax = feeApplied * this.IVA_RATE;
    const taxApplied = this.roundToTwoDecimals(rawTax);

    const totalDeductions = this.roundToTwoDecimals(feeApplied + taxApplied);
    const amountNet = this.roundToTwoDecimals(grossAmount - totalDeductions);

    return {
      amountGross: grossAmount,
      amountNet,
      feeApplied,
      taxApplied,
      feePercentage,
      taxRate: this.IVA_RATE,
      scheduledPayoutDate: scheduledPayoutDate.toISOString(),
      payoutDelayHoursOrDays,
    };
  }

  private addBusinessDays(startDate: Date, businessDaysToAdd: number): Date {
    const date = new Date(startDate);
    let added = 0;

    while (added < businessDaysToAdd) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        added++;
      }
    }

    return date;
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
