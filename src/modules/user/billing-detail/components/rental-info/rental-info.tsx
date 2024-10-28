import React, { useEffect, useState } from "react";
import styles from "./rental-info.module.css";
import Select, { SingleValue } from "react-select";
import { City } from "country-state-city";

interface RentalInfoFormProps {
  setRentalDays: (days: number) => void;
  onInputChange: (field: string, isValid: boolean, data?: any) => void;
}

interface LocationOption {
  value: string;
  label: string;
}

const RentalInfoForm: React.FC<RentalInfoFormProps> = ({ setRentalDays, onInputChange }) => {
  const today = new Date().toISOString().split("T")[0];

  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState<SingleValue<LocationOption>>(null);
  const [dropoffLocation, setDropoffLocation] = useState<SingleValue<LocationOption>>(null);
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");

  const citiesOfKerala = City.getCitiesOfState("IN", "KL").map((city) => ({
    value: city.name,
    label: city.name,
  }));

  useEffect(() => {
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

  const calculateRentalDays = (pickup: string, dropoff: string) => {
    const pickDate = new Date(pickup);
    const dropDate = new Date(dropoff);
    const days = Math.ceil((dropDate.getTime() - pickDate.getTime()) / (1000 * 3600 * 24)) + 1;
    setRentalDays(days);
  };

  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPickupDate = e.target.value;
    setPickupDate(newPickupDate);
    if (newPickupDate > dropoffDate) {
      setDropoffDate(newPickupDate);
    }
    calculateRentalDays(newPickupDate, dropoffDate);
  };

  const handleDropoffDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDropoffDate = e.target.value;
    setDropoffDate(newDropoffDate);
    if (newDropoffDate < pickupDate) {
      setPickupDate(newDropoffDate);
    }
    calculateRentalDays(pickupDate, newDropoffDate);
  };

  return (
    <div className={styles.rentalInfoContainer}>
      <div className={styles.header}>
        <h2>Rental Info</h2>
        <p className={styles.stepInfo}>Step 2 of 4</p>
      </div>
      <p className={styles.subHeading}>Please select your rental date</p>

      <div className={styles.section}>
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
              options={citiesOfKerala}
              value={pickupLocation}
              onChange={(option) => setPickupLocation(option as SingleValue<LocationOption>)} // Type-casting
              placeholder="Select your city"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="pickupDate">Pick-up Date:</label>
            <input
              type="date"
              id="pickupDate"
              min={today}
              value={pickupDate}
              onChange={handlePickupDateChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="pickupTime">Time</label>
            <input 
              type="time" 
              id="pickupTime" 
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
        </div>

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
              options={citiesOfKerala}
              value={dropoffLocation}
              onChange={(option) => setDropoffLocation(option as SingleValue<LocationOption>)} // Type-casting
              placeholder="Select your city"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="dropoffDate">Drop-off Date:</label>
            <input
              type="date"
              id="dropoffDate"
              min={pickupDate}
              value={dropoffDate}
              onChange={handleDropoffDateChange}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="dropoffTime">Time</label>
            <input 
              type="time" 
              id="dropoffTime" 
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalInfoForm;
