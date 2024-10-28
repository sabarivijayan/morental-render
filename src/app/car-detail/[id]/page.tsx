"use client"
import DisplayDetailsPage from "@/modules/user/car-detail/views/display-details";
import Loader from "@/themes/loader/loader";
import { useEffect, useState } from "react";

const CarDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(true); // Manage loading state

  // Simulate loading with useEffect
  useEffect(() => {
    // Simulating content load with setTimeout, replace with actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer if component unmounts
  }, []);

  return (
    <div>
      {isLoading ? (
        // Show loader while loading
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div className="main">
          <DisplayDetailsPage/>
        </div>
      )}
      </div>
  );
};

export default CarDetailsPage;