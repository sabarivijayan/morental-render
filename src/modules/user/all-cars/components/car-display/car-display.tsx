"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import CarCard from "../car-display/car-card/car-card";
import styles from "./car-display.module.css";
import { GET_AVAILABLE_CARS, GET_RENTABLE_CARS, FETCH_BOOKINGS } from "@/graphql/queries/booking-cars";
import { Spin, Alert } from "antd";
import { RentableCar } from "@/interfaces/cars";
import { useRouter } from "next/navigation";

const CarDisplay = ({ filters, pickUpDate, dropOffDate }: { filters: any, pickUpDate: string, dropOffDate: string }) => {

  // Determine which query to use based on the presence of filters or dates
  const shouldUseAvailableCarsQuery = pickUpDate || dropOffDate || filters.searchQuery || filters.transmissionType.length || filters.fuelType.length || filters.numberOfSeats.length || filters.maxPrice;

  const { loading: carLoading, error: carError, data: carData } = useQuery(
    shouldUseAvailableCarsQuery ? GET_AVAILABLE_CARS : GET_RENTABLE_CARS,
    {
      variables: shouldUseAvailableCarsQuery
        ? {
            pickUpDate: pickUpDate || "default-pickup-date",
            dropOffDate: dropOffDate || "default-dropoff-date",
            query: filters.searchQuery,
            transmissionType: filters.transmissionType,
            fuelType: filters.fuelType,
            numberOfSeats: filters.numberOfSeats,
            priceSort: filters.priceSort,
            maxPrice: filters.maxPrice
          }
        : {},
    }
  );

  // Query to fetch all bookings
  const { loading: bookingLoading, error: bookingError, data: bookingData } = useQuery(FETCH_BOOKINGS);

  const router = useRouter();

  if (carLoading || bookingLoading) return <Spin tip="Loading cars and bookings..." />;
  if (carError || bookingError) return <Alert message="Error loading data. Please enter a date in the date picker." type="error" />;

  const rentableCars: RentableCar[] = carData?.getAvailableCars?.data || carData?.getRentableCars || [];
  const bookings = bookingData?.fetchBookings?.data || [];

  // Function to filter out cars with conflicting bookings
  const filterCarsByBookingConflicts = (cars: RentableCar[], pickUpDate: string, dropOffDate: string) => {
    const pickUp = new Date(pickUpDate);
    const dropOff = new Date(dropOffDate);

    return cars.filter((car) => {
      // Find bookings for this car
      const carBookings = bookings.filter((booking: any) => booking.carId === car.car.id);

      // If no bookings for this car, it's available
      if (!carBookings.length) return true;

      // Check for booking conflicts
      return carBookings.every((booking: any) => {
        const bookingStart = new Date(booking.pickUpDate);
        const bookingEnd = new Date(booking.dropOffDate);
        // A conflict occurs if the selected range overlaps with any existing booking
        return dropOff < bookingStart || pickUp > bookingEnd;
      });
    });
  };

  // Apply filtering based on bookings if dates are provided
  const filteredCars = pickUpDate && dropOffDate ? filterCarsByBookingConflicts(rentableCars, pickUpDate, dropOffDate) : rentableCars;

  // Handle rent now click
  const handleRentNowClick = (carId: string) => {
    router.push(`/car-detail/${carId}`);
  };

  // Render car cards in grid
  const renderCarCardsInGrid = filteredCars.map((rentableCar: RentableCar) => (
    <div key={rentableCar.id} className={styles.carItem}>
      <CarCard
        title={rentableCar.car.name}
        category={rentableCar.car.type}
        imageUrl={rentableCar.car.primaryImageUrl}
        fuelCapacity={rentableCar.car.fuelType}
        transmission={rentableCar.car.transmissionType}
        capacity={rentableCar.car.numberOfSeats}
        price={`₹${rentableCar.pricePerDay}`}
        onRentNow={() => handleRentNowClick(rentableCar.id)}
      />
    </div>
  ));

  return (
    <div className={styles.homeContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>Available Cars</h2>
      </div>
      <div className={styles.carGrid}>{renderCarCardsInGrid}</div>
    </div>
  );
};

export default CarDisplay;