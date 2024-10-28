"use client"
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import HomePage from "@/modules/user/home-page/views/home";
import Loader from "@/themes/loader/loader";

export default function Home() {
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader />
        </div>
      ) : (
        // Show the page content after loading
        <main className={styles.mainsub}>
          <HomePage/>
        </main>
      )}
    </div>
  );
};
