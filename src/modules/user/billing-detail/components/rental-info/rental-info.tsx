import React, { useEffect, useState } from "react";
import styles from "./rental-info.module.css";
import Select from "react-select";
import { City } from "country-state-city"; // Importing City for managing locations

interface RentalInfoFormProps {
  setRentalDays: (days: number) => void; // Callback to set rental days in the parent component
  onInputChange: (field: string, isValid: boolean, data?: any) => void; // Callback for form validation
}

const RentalInfoForm: React.FC<RentalInfoFormProps> = ({ setRentalDays, onInputChange }) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // State variables to store rental information
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");

  // Fetching cities from Kerala state
  const citiesOfKerala = City.getCitiesOfState("IN", "KL").map((city) => ({
    value: city.name,
    label: city.name,
  }));

  useEffect(() => {
    // Validate form fields and notify parent component about the rental info
    const isFormValid =
      !!pickupLocation &&
      !!dropoffLocation &&
      !!pickupDate &&
      !!dropoffDate &&
      !!pickupTime &&
      !!dropoffTime;

    onInputChange("rentalInfo", isFormValid, {
      pickUpDate: new Date(pickupDate),
      pickUpTime: pickupTime,
      dropOffDate: new Date(dropoffDate),
      dropOffTime: dropoffTime,
      pickUpLocation: pickupLocation?.value,
      dropOffLocation: dropoffLocation?.value,
    });
  }, [pickupLocation, dropoffLocation, pickupDate, dropoffDate, pickupTime, dropoffTime]);

  // Function to calculate the number of rental days
  const calculateRentalDays = (pickup: string, dropoff: string) => {
    const pickDate = new Date(pickup);
    const dropDate = new Date(dropoff);
    // Calculate the difference in days between pickup and dropoff
    const days = Math.ceil((dropDate.getTime() - pickDate.getTime()) / (1000 * 3600 * 24)) + 1;
    setRentalDays(days); // Update rental days in the parent component
  };

  // Handler for changes in pickup date
  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPickupDate = e.target.value;
    setPickupDate(newPickupDate);
    // If pickup date is later than dropoff date, update dropoff date to match pickup date
    if (newPickupDate > dropoffDate) {
      setDropoffDate(newPickupDate);
    }
    calculateRentalDays(newPickupDate, dropoffDate); // Recalculate rental days
  };

  // Handler for changes in dropoff date
  const handleDropoffDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDropoffDate = e.target.value;
    setDropoffDate(newDropoffDate);
    // If dropoff date is earlier than pickup date, update pickup date to match dropoff date
    if (newDropoffDate < pickupDate) {
      setPickupDate(newDropoffDate);
    }
    calculateRentalDays(pickupDate, newDropoffDate); // Recalculate rental days
  };

  return (
    <div className={styles.rentalInfoContainer}>
      <div className={styles.header}>
        <h2>Rental Info</h2>
        <p className={styles.stepInfo}>Step 2 of 4</p>
      </div>
      <p className={styles.subHeading}>Please select your rental date</p>

      <div className={styles.section}>
        {/* Pick-up section */}
        <div className={styles.pickUpDropOffContainer}>
          <div className={styles.circleWrapper}>
            <div className={styles.outerCircle}>
              <div className={styles.innerCircle}></div>
            </div>
          </div>
          <span className={styles.label}>Pick – Up</span>
        </div>

        <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="pickupLocation">Locations</label>
            <Select
              id="pickupLocation"
              options={citiesOfKerala} // Dropdown options for city selection
              value={pickupLocation} // Controlled component value
              onChange={(option) => setPickupLocation(option)} // Update pickup location on selection
              placeholder="Select your city"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="pickupDate">Pick-up Date:</label>
            <input
              type="date"
              id="pickupDate"
              min={today} // Prevent selection of past dates
              value={pickupDate} // Controlled component value
              onChange={handlePickupDateChange} // Handle date change
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="pickupTime">Time</label>
            <input 
              type="time" 
              id="pickupTime" 
              value={pickupTime} // Controlled component value
              onChange={(e) => setPickupTime(e.target.value)} // Update pickup time
            />
          </div>
        </div>

        {/* Drop-off section */}
        <div className={styles.pickUpDropOffContainer}>
          <div className={styles.circleWrapper}>
            <div className={styles.outerCircle}>
              <div className={styles.innerCircle}></div>
            </div>
          </div>
          <span className={styles.label}>Drop – Off</span>
        </div>

        <div className={styles.fields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="dropoffLocation">Locations</label>
            <Select
              id="dropoffLocation"
              options={citiesOfKerala} // Dropdown options for city selection
              value={dropoffLocation} // Controlled component value
              onChange={(option) => setDropoffLocation(option)} // Update dropoff location on selection
              placeholder="Select your city"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="dropoffDate">Drop-off Date:</label>
            <input
              type="date"
              id="dropoffDate"
              min={pickupDate} // Prevent selection of dates earlier than pickup date
              value={dropoffDate} // Controlled component value
              onChange={handleDropoffDateChange} // Handle date change
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="dropoffTime">Time</label>
            <input 
              type="time" 
              id="dropoffTime" 
              value={dropoffTime} // Controlled component value
              onChange={(e) => setDropoffTime(e.target.value)} // Update dropoff time
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalInfoForm;
