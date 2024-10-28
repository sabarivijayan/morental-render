// public/data/bookings.ts

import { Booking } from '@/interfaces/bookings';

export const bookings: Booking[] = [
  {
    id: '9761',
    carModel: 'Nissan GT – R',
    carType: 'Sport Car',
    pickUpLocation: 'Kota Semarang',
    pickUpDate: '20 July 2022',
    pickUpTime: '07.00',
    dropOffLocation: 'Kota Semarang',
    dropOffDate: '21 July 2022',
    dropOffTime: '01.00',
    price: '80.00',
  },
  {
    id: '9762',
    carModel: 'Toyota Supra',
    carType: 'Sport Car',
    pickUpLocation: 'Jakarta',
    pickUpDate: '22 July 2022',
    pickUpTime: '10.00',
    dropOffLocation: 'Jakarta',
    dropOffDate: '23 July 2022',
    dropOffTime: '12.00',
    price: '100.00',
  },
  // Add more bookings as needed
];
