"use client";
import React, { useState } from "react";
import styles from "./all-cars.module.css"; // Import the styles for layout
import FilterSidebar from "@/modules/user/all-cars/components/sidebar/sidebar";
import PickupForm from "@/modules/user/all-cars/components/location-selector/location-selector";
import CarDisplay from "@/modules/user/all-cars/components/car-display/car-display";

const AllCarsComponent = () => {
  // State for search and filters
  const [filters, setFilters] = useState({
    searchQuery: "",
    transmissionType: [] as string[],
    fuelType: [] as string[],
    numberOfSeats: [] as number[],
    priceSort: "", // You can add more filters like price range if needed
  });

  // State for pickup and drop-off dates
  const [pickUpDate, setPickUpDate] = useState<string>(""); // Initialize to empty string
  const [dropOffDate, setDropOffDate] = useState<string>("");

  // Update the filters when they change in the sidebar
  const handleFilterChange = (updatedFilters: any) => {
    setFilters(updatedFilters);
  };

  // Handle date changes from PickupForm and pass them to CarDisplay
  const handleDateChange = (pickUpDate: string, dropOffDate: string) => {
    setPickUpDate(pickUpDate); // Update the state for pick-up date
    setDropOffDate(dropOffDate); // Update the state for drop-off date
  };

  return (
    <div className={styles.allCarsContainer}>
      {/* Sidebar on the left */}
      <div className={styles.sidebarContainer}>
        <FilterSidebar onFilterChange={handleFilterChange} />
      </div>

      {/* Right side: form and car display */}
      <div className={styles.mainContent}>
        <div className={styles.pickupForm}>
          {/* Pass date change handler to PickupForm */}
          <PickupForm onDateChange={handleDateChange} />
        </div>
        <div className={styles.carGridContainer}>
          {/* Pass filters, pickUpDate, and dropOffDate to CarDisplay */}
          <CarDisplay
            filters={filters}
            pickUpDate={pickUpDate}
            dropOffDate={dropOffDate}
          />
        </div>
      </div>
    </div>
  );
};

export default AllCarsComponent;
