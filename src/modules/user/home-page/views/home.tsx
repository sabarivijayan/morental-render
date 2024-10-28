import React from 'react';
import Hero from '../components/hero-section/hero-section';
import PickupForm from '../components/location-selector/location-selector';
import CarDisplay from '../components/car-display/car-display';
import styles from './home.module.css'
const HomePage = () => {
  return (
    <div className={styles.container}>
      <Hero />
      <PickupForm/>
      <CarDisplay/>
    </div>
  )
}

export default HomePage;