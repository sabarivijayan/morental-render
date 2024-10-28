"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Import react-toastify CSS
import styles from "./location-selector.module.css";
import { useRouter } from "next/navigation";
const PickupForm: React.FC = () => {

  const router = useRouter();

  // State for pickup and drop-off fields
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  
  const [dropOffDate, setDropOffDate] = useState("");
  const [dropOffTime, setDropOffTime] = useState("");

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split("T")[0];

  // List of cities in Kerala
  
  // Handle Swap
  const handleRedirect = () => {
    router.push('/all-cars'); // Change '/all-cars' to your actual route
  };

  // Check for date/time validation between pickup and drop-off
  const validateTime = () => {
    if (pickupDate === dropOffDate && pickupTime >= dropOffTime) {
      toast.error("Pickup time cannot be later than or equal to the drop-off time.");  // Show error toast
      setPickupTime(""); // Clear invalid time
    }
  };

  useEffect(() => {
    if (pickupDate && dropOffDate) {
      validateTime();
    }
  }, [pickupTime, dropOffTime]);

  return (
    <div className={styles.container}>
      <ToastContainer /> {/* ToastContainer must be added for toasts to appear */}

      {/* Pick-Up Section */}
      <div className={styles.formGroup}>
        <div className={styles.section}>
          <div className={styles.labelContainer}>
            <div className={styles.radioIndicator} />
            <div className={styles.radioIndicator2} />
            <label className={styles.boldText}>Pick - Up</label>
          </div>

          <div className={styles.formFields}>


            {/* Date Field */}
            <div className={styles.field}>
              <label className={styles.boldText}>Date</label>
              <div className={styles.inputWithIcon}>
                <input
                  className={styles.input}
                  type="date"
                  min={today} // Restrict dates to today or later
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
            </div>

            {/* Divider */}
            <div className={styles.divider}></div>

            {/* Time Field */}
            <div className={styles.field}>
              <label className={styles.boldText}>Time</label>
              <input
                className={styles.input}
                type="time"
                step={1800}
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <button className={styles.swapButton} onClick={handleRedirect}>
        <Image src="/icons/icons8-search.svg" alt="Swap Arrows" width={24} height={24} />
      </button>

      {/* Drop-Off Section */}
      <div className={styles.formGroup}>
        <div className={styles.section}>
          <div className={styles.labelContainer}>
            <div className={styles.radioIndicator} />
            <div className={styles.radioIndicator2} />
            <label className={styles.boldText}>Drop - Off</label>
          </div>

          <div className={styles.formFields}>

            {/* Date Field */}
            <div className={styles.field}>
              <label className={styles.boldText}>Date</label>
              <div className={styles.inputWithIcon}>
                <input
                  className={styles.input}
                  type="date"
                  min={today} // Restrict dates to today or later
                  value={dropOffDate}
                  onChange={(e) => setDropOffDate(e.target.value)}
                />
              </div>
            </div>

            {/* Divider */}
            <div className={styles.divider}></div>

            {/* Time Field */}
            <div className={styles.field}>
              <label className={styles.boldText}>Time</label>
              <input
                className={styles.input}
                type="time"
                step={1800}
                value={dropOffTime}
                onChange={(e) => setDropOffTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupForm;
