"use client";
import React, { useState, useEffect } from 'react';
import styles from './navbar.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import { Input, Dropdown, Spin, Menu } from 'antd';
import { FETCH_USER } from '@/graphql/queries/auth';
import { GET_RENTABLE_CARS } from '@/graphql/queries/booking-cars';
import type { RentableCar } from '@/interfaces/cars';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(Cookies.get('token') ?? null);
  const { data: userData, refetch } = useQuery(FETCH_USER, {
    skip: !token,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<RentableCar[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);  // Control visibility of search dropdown
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);  // Control visibility of profile dropdown

  // Query to get rentable cars
  const { loading: carLoading, data: carData } = useQuery(GET_RENTABLE_CARS);

  // Effect to track token changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = Cookies.get('token') ?? null;
      if (newToken !== token) {
        setToken(newToken);
        if (newToken) {
          refetch();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [token, refetch]);

  // Filter cars based on search input
  useEffect(() => {
    if (carData && searchQuery) {
      const cars = carData.getRentableCars || [];
      const filtered = cars.filter((car: RentableCar) =>
        car.car.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCars(filtered);
      setDropdownVisible(filtered.length > 0); // Show dropdown if there are filtered results
    } else {
      setFilteredCars([]);
      setDropdownVisible(false); // Hide dropdown when there are no results
    }
  }, [searchQuery, carData]);

  const handleLogout = () => {
    Cookies.remove('token');
    setToken(null);
    setProfileDropdownVisible(false); // Hide profile dropdown on logout
    router.push('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCarSelect = (carId: string) => {
    setDropdownVisible(false); // Hide dropdown after selecting an option
    router.push(`/car-detail/${carId}`);
  };

  const handleProfileOptionClick = (path: string) => {
    setProfileDropdownVisible(false); // Hide profile dropdown after selecting an option
    router.push(path);
  };

  const searchMenu = (
    <Menu>
      {carLoading ? (
        <Spin />
      ) : filteredCars.length > 0 ? (
        filteredCars.map((rentableCar: RentableCar) => (
          <Menu.Item key={rentableCar.id} onClick={() => handleCarSelect(rentableCar.id)}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src={rentableCar.car.primaryImageUrl || '/default-car.png'}
                alt={rentableCar.car.name}
                width={40}
                height={40}
                style={{ marginRight: '10px' }}
              />
              <span>{rentableCar.car.name}</span>
            </div>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>No results found</Menu.Item>
      )}
    </Menu>
  );

  const profileMenu = (
    <Menu>
      <Menu.Item onClick={() => handleProfileOptionClick('/user-dashboard')}>
        User Dashboard
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => router.push('/')}>MORENT</div>

      <div className={styles.searchContainer}>
        <Dropdown
          overlay={searchMenu}
          visible={dropdownVisible} // Control visibility based on dropdownVisible state
          onVisibleChange={(visible) => setDropdownVisible(visible)}  // Sync dropdown visibility
        >
          <Input
            className={styles.searchInput}
            placeholder="Search something here"
            onChange={handleSearchChange}
            value={searchQuery}
            prefix={<Image src="/icons/search-normal.svg" alt="Search" width={20} height={20} />}
          />
        </Dropdown>
        
      </div>

      <div className={styles.actions}>
        {token ? (
          <div className={styles.profileContainer}>
            <Dropdown
              overlay={profileMenu}
              visible={profileDropdownVisible} // Control visibility of profile dropdown
              onVisibleChange={(visible) => setProfileDropdownVisible(visible)} // Sync dropdown visibility
            >
              <Image
                src={userData?.fetchUser?.data?.profileImage || '/default-profile.png'}
                alt="User Profile"
                className={styles.profileIcon}
                width={40}
                height={40}
                onClick={() => setProfileDropdownVisible(!profileDropdownVisible)} // Toggle dropdown visibility
              />
            </Dropdown>
          </div>
        ) : (
          <button className={styles.signupButton} onClick={() => router.push('/registration')}>Sign up</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
