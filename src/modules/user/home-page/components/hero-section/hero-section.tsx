"use client"; // Indicates that this is a client component in a Next.js application

import React from 'react';
import Image from 'next/image';
import styles from './hero-section.module.css';
import { useRouter } from 'next/navigation';

const Hero: React.FC = () => {
    const router = useRouter(); // Hook to programmatically navigate within the app

    return (
        <section className={styles.heroSection}> {/* Main section for the hero content */}
            <div className={`${styles.card} ${styles.cardOne}`}> {/* First card for the hero section */}
                <div className={styles.cardContent}> {/* Container for card content */}
                    <h2 className={styles.title}>The Best Platform <br/> for Car Rental</h2> {/* Title of the card */}
                    <p className={styles.description}>
                        Ease of doing a car rental safely and <br/> reliably. Of course at a low price.
                    </p>
                    <button className={`${styles.rentButton} ${styles.button1}`} onClick={() => router.push('/all-cars')}> {/* Button to navigate to the car rental page */}
                        Rental Car
                    </button>
                </div>
                <div className={styles.carImageWrapper}> {/* Wrapper for the car image */}
                    <Image
                        src="/icons/image 7.svg" // Source of the car image
                        alt="White Car" // Alt text for accessibility
                        width={400} // Width of the image
                        height={200} // Height of the image
                        className={styles.carImage} // CSS class for styling
                    />
                </div>
            </div>

            <div className={`${styles.card} ${styles.cardTwo}`}> {/* Second card for the hero section */}
                <div className={styles.cardContent}> {/* Container for card content */}
                    <h2 className={styles.title}>Easy way to rent a <br/> car at a low price</h2> {/* Title of the card */}
                    <p className={styles.description}>
                        Providing cheap car rental services<br/> and safe and comfortable facilities.
                    </p>
                    <button className={`${styles.rentButton} ${styles.button2}`} onClick={() => router.push('/all-cars')}> {/* Button to navigate to the car rental page */}
                        Rental Car
                    </button>
                </div>
                <div className={styles.carImageWrapper}> {/* Wrapper for the car image */}
                    <Image
                        src="/icons/image 8.svg" // Source of the car image
                        alt="Black Car" // Alt text for accessibility
                        width={400} // Width of the image
                        height={200} // Height of the image
                        className={styles.carImage} // CSS class for styling
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero; // Export the Hero component for use in other parts of the application
