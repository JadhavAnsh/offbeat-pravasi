import { useQuery } from '@tanstack/react-query';

import { getBookings } from '../services';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: ({ signal }) => getBookings(signal),
  });
}
