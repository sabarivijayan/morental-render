"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ProfilePage from "../components/profile-section/profile-section";
import { bookings } from "../../../../../public/data/booking-data";
import styles from "./user-dashboard.module.css";

const DashboardPage = () => {
  const router = useRouter(); // For redirecting to another page
  const [isClient, setIsClient] = useState(false); // Track if the component is mounted on the client

  useEffect(() => {
    // Only set client state after the component has mounted
    setIsClient(true);

    // Check if token exists in cookies after component mounts
    const token = Cookies.get("token");

    if (!token) {
      // If no token is found, redirect to login
      router.push("/registration");
    }
  }, [router]);

  if (!isClient) {
    return null; // Prevent rendering on server-side
  }

  return (
    <div>
      <ProfilePage/>
    </div>
  );
};

export default DashboardPage;
