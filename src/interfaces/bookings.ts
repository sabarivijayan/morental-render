// src/types/bookings.ts

export interface Booking {
    id: string;
    carImage: string;
    carModel: string;
    carType: string;
    pickUpLocation: string;
    pickUpDate: string;
    pickUpTime: string;
    dropOffLocation: string;
    dropOffDate: string;
    dropOffTime: string;
    price: string;
    address: string;
  }
  
  export interface RentalDetailsProps {
    bookings: Booking[];
  }
  export interface BillingInfoFormProps {
    onInputChange: (field: string, isValid: boolean) => void;
    prefillData?: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  }
  