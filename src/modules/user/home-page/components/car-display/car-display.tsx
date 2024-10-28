"use client";
import { useQuery } from "@apollo/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CarCard from "../car-display/car-card/car-card";
import styles from "./car-display.module.css";
import { GET_RENTABLE_CARS } from "@/graphql/queries/booking-cars"; // Assuming the query file is in the right path
import { useRouter } from "next/navigation";
import { RentableCar } from "@/interfaces/cars";

const CarDisplay = () => {
  const router = useRouter();

  // Fetch all rentable cars with the query
  const { data, loading, error } = useQuery(GET_RENTABLE_CARS);

  if (loading) return <p>Loading cars, please wait...</p>;
  if (error) return <p>Error loading cars: {error.message}</p>;

  // Define rentableCars with RentableCar type or an empty array
  const rentableCars: RentableCar[] = data?.getRentableCars || [];

  // Handler to navigate to the car-detail page
  const handleRentNowClick = (carId: string) => {
    router.push(`/car-detail/${carId}`); // Redirect to the car-detail page with carId
  };

  // Render car cards in Swiper for smaller screens
  const renderCarCardsInSwiper = rentableCars.map((rentableCar: RentableCar) => (
    <SwiperSlide key={rentableCar.id}>
      <CarCard
        title={rentableCar.car.name}
        category={rentableCar.car.type}
        imageUrl={rentableCar.car.primaryImageUrl}
        fuelCapacity={rentableCar.car.fuelType}
        transmission={rentableCar.car.transmissionType}
        capacity={rentableCar.car.numberOfSeats}
        price={`₹${rentableCar.pricePerDay}`}
        onRentNow={() => handleRentNowClick(rentableCar.id)} // Pass the car ID to the handler
      />
    </SwiperSlide>
  ));

  // Render car cards in grid for larger screens
  const renderCarCardsInGrid = rentableCars.map((rentableCar: RentableCar) => (
    <CarCard
      key={rentableCar.id}
      title={rentableCar.car.name}
      category={rentableCar.car.type}
      imageUrl={rentableCar.car.primaryImageUrl}
      fuelCapacity={rentableCar.car.fuelType}
      transmission={rentableCar.car.transmissionType}
      capacity={rentableCar.car.numberOfSeats}
      price={`₹${rentableCar.pricePerDay}`}
      onRentNow={() => handleRentNowClick(rentableCar.id)} // Pass the car ID to the handler
    />
  ));

  const handleViewAllClick = () => {
    router.push("/all-cars"); // Redirect to the all cars page
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>Popular Cars</h2>
        <div className={styles.viewAllLink} onClick={handleViewAllClick}>
          View All <span className={styles.arrow}>→</span>
        </div>
      </div>

      {/* Swiper for small screens */}
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={16}
          slidesPerView={1}
          centeredSlides={true}
          navigation
          breakpoints={{
            0: {
              slidesPerView: 1,
              centeredSlides: false,
            },
            480:{
              slidesPerView: 1,
              centeredSlides: true,
            },
            640: {
              slidesPerView: 2,
              centeredSlides: false,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {renderCarCardsInSwiper}
        </Swiper>
      </div>

      {/* Grid layout for larger screens */}
      <div className={styles.carGrid}>
        {renderCarCardsInGrid}
      </div>
    </div>
  );
};

export default CarDisplay;
