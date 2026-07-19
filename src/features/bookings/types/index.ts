export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';

export type BookingSummary = {
  createdAt: string;
  holdExpiresAt?: string | null;
  id: string;
  quantity: number;
  status: BookingStatus;
  totalAmountInr: number;
  trekId: string;
  trekSnapshot: {
    endDate?: string;
    location?: string;
    name: string;
    startDate?: string;
  };
};
