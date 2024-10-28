"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./location-selector.module.css";

interface PickupFormProps {
  onDateChange?: (pickUpDate: string, dropOffDate: string, pickUpTime: string, dropOffTime: string) => void;
}

const PickupForm: React.FC<PickupFormProps> = ({ onDateChange }) => {
  const [pickUpDate, setPickUpDate] = useState("");
  const [dropOffDate, setDropOffDate] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");
  const [dropOffTime, setDropOffTime] = useState("");

  useEffect(() => {
    if (onDateChange) {
      // Notify parent when dates or times change
      onDateChange(pickUpDate, dropOffDate, pickUpTime, dropOffTime);
    }
  }, [pickUpDate, dropOffDate, pickUpTime, dropOffTime]);

  return (
    <div className={styles.container}>
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
                  value={pickUpDate}
                  onChange={(e) => setPickUpDate(e.target.value)}
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
                value={pickUpTime}
                onChange={(e) => setPickUpTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className={styles.swapButtonWrapper}>
        <button className={styles.swapButton}>
          <Image src="/icons/icons8-search.svg" alt="Swap Arrows" width={24} height={24} />
        </button>
      </div>

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