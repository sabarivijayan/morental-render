import Image from "next/image";
import styles from "./car-card.module.css";
import { CarCardProps } from "../../../../../../interfaces/cars"; // Import the interface

// Adding 'onRentNow' as a prop for the CarCard component
const CarCard: React.FC<CarCardProps> = ({
  title,
  category,
  imageUrl,
  fuelCapacity,
  transmission,
  capacity,
  price,
  discountedPrice,
  onRentNow, // Accepting onRentNow function to handle navigation
}) => {
  return (
    <div className={styles.carCard}>
      <h3 className={styles.carTitle}>{title}</h3>
      <p className={styles.carCategory}>{category}</p>
      {/* The image container enforces the aspect ratio */}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={`${title} car`}
          layout="fill"
          objectFit="cover"
          className={styles.carImage}
        />
      </div>

      <div className={styles.carInfo}>
        <div className={styles.infoItem}>
          <Image
            src="/icons/gas-station.svg"
            alt="Fuel"
            width={16}
            height={16}
          />
          <span>{fuelCapacity}</span>
        </div>
        <div className={styles.infoItem}>
          <Image
            src="/icons/steering.svg"
            alt="Transmission"
            width={16}
            height={16}
          />
          <span>{transmission}</span>
        </div>
        <div className={styles.infoItem}>
          <Image
            src="/icons/profile-2user.svg"
            alt="Capacity"
            width={16}
            height={16}
          />
          <span>{capacity}</span>
        </div>
      </div>

      <div className={styles.carPrice}>
        <span>{price}</span>
        <small>/day</small>
      </div>

      {/* Rent Now button triggering the onRentNow function when clicked */}
      <button className={styles.rentButton} onClick={onRentNow}>
        Rent Now
      </button>
    </div>
  );
};

export default CarCard;
