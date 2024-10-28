export interface CarCardProps {
    title: string;
    category: string;
    imageUrl: string;
    fuelCapacity: string;
    transmission: string;
    capacity: number;
    price: string;
    discountedPrice?: string; // Optional property
    onRentNow: () => void; // Function to handle the "Rent Now" action
}


export interface RentableCar {
    id: string;
    car: {
      id: string;
      name: string;
      type: string;
      primaryImageUrl: string;
      fuelType: string;
      transmissionType: string;
      numberOfSeats: number;
    };
    pricePerDay: number;
  }
  
// Define CarData and Car interfaces based on your data structure
export interface Car {
  id: string;
  name: string;
  primaryImageUrl: string;
  description: string;
  type: string;
  numberOfSeats: number;
  transmissionType: string;
  fuelType: string;
  secondaryImagesUrls: string[];
}

export interface CarData {
  car: Car;
  pricePerDay: number;
  discountPrice?: number;
  reviewsCount?: number;
}

// Use CarData in RentalSummary component props
export interface RentalSummaryProps {
  carData: CarData | null;
  rentalDays: number;
}
