import Image from "next/image";
import styles from "./summary-info.module.css";
import { RentalSummaryProps } from "@/interfaces/cars"; // Importing interface for props

const RentalSummary: React.FC<RentalSummaryProps> = ({
  carData, // Data related to the rented car
  rentalDays, // Number of days the car is rented
}) => {
  // Display a loading message if carData is not yet available
  if (!carData) return <p>Loading car summary...</p>;

  // Calculate the total price based on daily rate and rental duration
  const totalPrice = carData.pricePerDay * rentalDays;

  return (
    <div className={styles.summaryContainer}>
      <h2 className={styles.title}>Rental Summary</h2>
      <p className={styles.description}>
        Prices may change depending on the length of the rental and the price of
        your rental car.
      </p>

      {/* Display car information including image and name */}
      <div className={styles.carInfo}>
        <Image
          src={carData.car.primaryImageUrl} // URL for the car's primary image
          alt={carData.car.name} // Alternative text for accessibility
          width={132} // Fixed width for the image
          height={108} // Fixed height for the image
          className={styles.carImage} // CSS class for styling
        />
        <div className={styles.carDetails}>
          <h3 className={styles.carName}>{carData.car.name}</h3> {/* Display car name */}
        </div>
      </div>

      {/* Pricing details */}
      <div className={styles.pricing}>
        <div className={styles.priceRow}>
          <span>Subtotal</span> {/* Label for subtotal */}
          <span>₹{carData.pricePerDay}/day</span> {/* Display daily price */}
        </div>
        <div className={styles.priceRow}>
          <span>Tax</span> {/* Label for tax */}
          <span>₹0</span> {/* Display tax amount (currently static) */}
        </div>
      </div>

      {/* Total price display */}
      <div className={styles.totalPrice}>
        <span>Total Rental Price</span> {/* Label for total price */}
        <span className={styles.price}>₹{totalPrice}</span> {/* Display calculated total price */}
      </div>
      
      <p className={styles.footerText}>
        Overall price and includes rental discount {/* Footer note regarding price */}
      </p>
    </div>
  );
};

export default RentalSummary; // Exporting the component for use in other parts of the application
