"use client";

import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation"; // useParams from next/navigation
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie for handling cookies
import styles from "./display-details-component.module.css";
import { GET_RENTABLE_CAR_WITH_ID } from "@/graphql/queries/booking-cars"; // Adjust path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faCogs, faGasPump, faUserFriends } from '@fortawesome/free-solid-svg-icons'; // Import icons


const CarDetailsComponent: React.FC = () => {
  const { id } = useParams(); // Extract car ID from URL params
  const router = useRouter();


  // Fetch car details using the car ID
  const { data, loading, error } = useQuery(GET_RENTABLE_CAR_WITH_ID, {
    variables: { id }, // Pass the car ID to the query
    skip: !id, // Ensure we skip the query only if id is missing
  });


  // Initialize selected image with null or an empty string initially
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Update selected image whenever carData changes
  useEffect(() => {
    if (data?.getRentableCarsWithId) {
      setSelectedImage(data.getRentableCarsWithId.car.primaryImageUrl); // Set primary image once data is fetched
    }
  }, [data]);

  // Handle loading and error states
  if (loading) return <p>Loading car details...</p>;
  if (error) return <p>Error loading car details: {error.message}</p>;

  const carData = data?.getRentableCarsWithId;

  // Function to handle Rent Now button click
  const handleRentNowClick = () => {
    const token = Cookies.get("token");

    if (!token) {
      // Redirect to the registration page if no token is found
      router.push("/registration");
    } else {
      // Redirect to the billing page with the car ID
      router.push(`/billing/${id}`);
    }
  };

  return (
    <div className={styles.carPageContainer}>
      {carData ? (
        <>
          {/* Car Images Section */}
          <section className={styles.carImagesSection}>
            {/* Main Image */}
            <div className={styles.mainImage}>
              <Image
                src={selectedImage ?? carData.car.primaryImageUrl}
                alt={carData.car.name}
                width={500}
                height={300}
              />
            </div>

            {/* Thumbnail Images */}
            <div className={styles.thumbnailImages}>
              {/* Primary Image Thumbnail */}
              <div
                onClick={() => setSelectedImage(carData.car.primaryImageUrl)}
                className={`${styles.thumbnail} ${
                  selectedImage === carData.car.primaryImageUrl
                    ? styles.selectedThumbnail
                    : ""
                }`}
              >
                <Image
                  src={carData.car.primaryImageUrl}
                  alt={carData.car.name}
                  width={100}
                  height={60}
                />
              </div>

              {/* Secondary Images Thumbnails */}
              {carData.car.secondaryImagesUrls.map(
                (image: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`${styles.thumbnail} ${
                      selectedImage === image ? styles.selectedThumbnail : ""
                    }`}
                  >
                    <Image
                      src={image}
                      alt={carData.car.name}
                      width={100}
                      height={60}
                    />
                  </div>
                )
              )}
            </div>
          </section>

          {/* Car Details Section */}
          <section className={styles.carDetailsSection}>
            <h2 className={styles.carName}>{carData.car.name}</h2>

            {/* Manufacturer Name */}
            <div className={styles.carReviews}>
              <span className={styles.reviewsCount}>
                {carData.car.manufacturer.name}
              </span>
            </div>

            <p className={styles.carDescription}>{carData.car.description}</p>

            {/* Redesigned Car Specs with Icons */}
            <div className={styles.carSpecsGrid}>
              <div className={styles.carSpecItem}>
                <FontAwesomeIcon icon={faCarSide} className={styles.icon} />
                <p className={styles.specLabel}>Type</p>
                <p>{carData.car.type}</p>
              </div>

              <div className={styles.carSpecItem}>
                <FontAwesomeIcon icon={faUserFriends} className={styles.icon} />
                <p className={styles.specLabel}>Capacity</p>
                <p>{carData.car.numberOfSeats} Persons</p>
              </div>

              <div className={styles.carSpecItem}>
                <FontAwesomeIcon icon={faCogs} className={styles.icon} />
                <p className={styles.specLabel}>Transmission</p>
                <p>{carData.car.transmissionType}</p>
              </div>

              <div className={styles.carSpecItem}>
                <FontAwesomeIcon icon={faGasPump} className={styles.icon} />
                <p className={styles.specLabel}>Fuel</p>
                <p>{carData.car.fuelType}</p>
              </div>
            </div>

            {/* Price Section */}
            <div className={styles.carPrice}>
              <span className={styles.discountedPrice}>
              ₹{carData.pricePerDay}/day
              </span>
            </div>

            {/* Rent Button */}
            <button className={styles.rentNowBtn} onClick={handleRentNowClick}>
              Rent Now
            </button>
          </section>
        </>
      ) : (
        <p>No car data found</p>
      )}
    </div>
  );
};

export default CarDetailsComponent;
