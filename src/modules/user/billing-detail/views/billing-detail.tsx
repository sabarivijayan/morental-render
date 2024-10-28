import { useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GET_RENTABLE_CAR_WITH_ID } from "@/graphql/queries/booking-cars";
import { GENERATE_PAYMENT_ORDER, VERIFY_PAYMENT_AND_CREATE_BOOKING } from "@/graphql/mutations/booking-cars";
import { FETCH_USER } from "@/graphql/queries/auth";
import BillingInfoForm from "../components/billing-info/billing-info";
import Confirmation from "../components/confirmation-info/confirmation-info";
import PaymentForm from "../components/payment-info/payment-info";
import RentalInfoForm from "../components/rental-info/rental-info";
import RentalSummary from "../components/summary-info/summary-info";
import styles from "./billing-detail.module.css";
import { CarData } from "@/interfaces/cars";
import Cookies from "js-cookie"; // Library for handling cookies
import confetti from "canvas-confetti"; // Library for confetti effect
import Swal from "sweetalert2"; // Library for displaying alerts

const BillingDetailPage = () => {
  const [rentalDays, setRentalDays] = useState(1); // State to track the number of rental days
  const { id } = useParams() as {id: string}; // Get the car ID from URL parameters
  const router = useRouter(); // Next.js router for navigation
  const [carData, setCarData] = useState<CarData | null>(null); // State to hold car data
  const [isBillingInfoComplete, setBillingInfoComplete] = useState(false); // State to track billing info completion
  const [isRentalInfoComplete, setRentalInfoComplete] = useState(false); // State to track rental info completion
  const [isPaymentInfoComplete, setPaymentInfoComplete] = useState(false); // State to track payment info completion
  const [isConfirmationComplete, setConfirmationComplete] = useState(false); // State to track confirmation completion
  
  // State to hold billing information
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  // State to hold rental information
  const [rentalInfo, setRentalInfo] = useState({
    pickUpDate: new Date(),
    pickUpTime: '',
    dropOffDate: new Date(),
    dropOffTime: '',
    pickUpLocation: '',
    dropOffLocation: ''
  });

  // Check for authentication token in cookies; redirect to registration if not found
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/registration"); // Redirect if not authenticated
    }
  }, [router]);

  // Fetch user data using GraphQL query
  const { data: userData, loading: userLoading } = useQuery(FETCH_USER);
  const userInfo = userData?.fetchUser?.data; // Extract user info from fetched data

  // Handle input changes for various forms
  const handleInputChange = (field: string, isValid: boolean, data?: any) => {
    switch (field) {
      case "billingInfo":
        setBillingInfoComplete(isValid); // Update billing info completion status
        if (data) {
          setBillingInfo(data); // Update billing info data
        }
        break;
      case "rentalInfo":
        setRentalInfoComplete(isValid); // Update rental info completion status
        if (data) {
          setRentalInfo(data); // Update rental info data
        }
        break;
      case "paymentMethod":
        setPaymentInfoComplete(isValid); // Update payment method completion status
        break;
      case "confirmation":
        setConfirmationComplete(isValid); // Update confirmation status
        break;
    }
  };

  // Check if all forms are complete
  const isFormComplete = isBillingInfoComplete && isRentalInfoComplete && isPaymentInfoComplete && isConfirmationComplete;

  // Fetch car data using GraphQL query
  const { data, loading, error } = useQuery(GET_RENTABLE_CAR_WITH_ID, {
    variables: { id },
    skip: !id, // Skip query if ID is not present
  });

  // Update car data state when query data is received
  useEffect(() => {
    if (data) {
      setCarData(data.getRentableCarsWithId);
    }
  }, [data]);

  // Mutations for generating payment order and verifying payment
  const [generatePaymentOrder] = useMutation(GENERATE_PAYMENT_ORDER);
  const [verifyPaymentAndCreateBooking] = useMutation(VERIFY_PAYMENT_AND_CREATE_BOOKING);

  // Load Razorpay script for payment processing
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true); // Resolve if script loads successfully
      script.onerror = () => resolve(false); // Resolve with false if script fails to load
      document.body.appendChild(script); // Append script to body
    });
  };

  // Handle Rent Now button click
  const handleRentNow = async () => {
    const audio = new Audio("/car-rev.mp3"); // Play car rev sound
    audio.play();

    // Ensure all forms are complete and necessary data is available
    if (!isFormComplete || !carData || !userInfo) return;

    try {
      const scriptLoaded = await loadRazorpayScript(); // Load Razorpay script
      if (!scriptLoaded) {
        // Show alert if script fails to load
        Swal.fire({
          icon: "error",
          title: "SDK Load Failure",
          text: "Failed to load Razorpay SDK. Please check your internet connection.",
        });
        return;
      }

      const totalPrice = carData.pricePerDay * rentalDays; // Calculate total price
      // Generate payment order
      const { data: paymentData } = await generatePaymentOrder({
        variables: {
          totalPrice,
          bookingInput: {
            rentableId: parseInt(id, 10),
            carId: parseInt(carData.car.id, 10),
            pickUpDate: rentalInfo.pickUpDate.toISOString(),
            pickUpTime: rentalInfo.pickUpTime,
            dropOffDate: rentalInfo.dropOffDate.toISOString(),
            dropOffTime: rentalInfo.dropOffTime,
            pickUpLocation: rentalInfo.pickUpLocation,
            dropOffLocation: rentalInfo.dropOffLocation,
            totalPrice,
            userInfo: `${billingInfo.firstName} ${billingInfo.lastName}`,
            phoneNumber: billingInfo.phoneNumber,
            address: billingInfo.address,
          },
        },
      });

      const { razorpayOrderId, currency } = paymentData.generatePaymentOrder; // Extract payment order ID and currency

      // Razorpay payment options
      const options = {
        key: "rzp_test_Zil1iQWrfDtlkH", // Your Razorpay key
        amount: totalPrice * 100, // Amount in paise (Razorpay accepts amount in smallest currency unit)
        currency,
        order_id: razorpayOrderId, // Order ID
        name: "Car Rental",
        description: "Payment for car rental",
        handler: async function (response: any) {
          try {
            // Verify payment and create booking upon successful payment
            const { data: verifyData } = await verifyPaymentAndCreateBooking({
              variables: {
                paymentDetails: {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
                bookingInput: {
                  carId: parseInt(carData.car.id, 10),
                  rentableId: parseInt(id, 10),
                  pickUpDate: rentalInfo.pickUpDate.toISOString(),
                  pickUpTime: rentalInfo.pickUpTime,
                  dropOffDate: rentalInfo.dropOffDate.toISOString(),
                  dropOffTime: rentalInfo.dropOffTime,
                  pickUpLocation: rentalInfo.pickUpLocation,
                  dropOffLocation: rentalInfo.dropOffLocation,
                  totalPrice,
                  userInfo: `${billingInfo.firstName} ${billingInfo.lastName}`,
                  phoneNumber: billingInfo.phoneNumber,
                  address: billingInfo.address,
                },
              },
            });
  
            // Check payment verification status
            if (verifyData.verifyPaymentAndCreateBooking.status === "success") {
              // Play success sound and show confetti on successful booking
              const successAudio = new Audio("/success.mp3");
              successAudio.play();
              confetti({
                particleCount: 500,         // Increases the number of confetti particles
                spread: 120,                // Widens the spread of the particles
                startVelocity: 45,          // Higher velocity for more energy
                decay: 0.9,                 // Slows the rate at which confetti fades
                scalar: 1.2,                // Scales up the confetti size
                origin: { x: 0.5, y: 0.6 }, // Start position of the confetti
                ticks: 200,                 // Keeps confetti on the screen longer
                colors: ["#BB0000", "#FFFFFF", "#0000FF"], // Customize colors for variation
              });
              
  
              // Redirect to user dashboard
              router.push("/user-dashboard");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            // Handle errors during payment verification
            if (error.message.includes("")) {
              Swal.fire({
                icon: "error",
                title: "Car Unavailable",
                text: "The car is not available for the selected dates. Please try other dates or cars.",
              });
            } else {
              const errorAudio = new Audio("/error-sound.mp3");
              errorAudio.play();
              Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: "Payment verification failed. Please try again.",
              });
            }
          }
        },
        prefill: {
          name: `${billingInfo.firstName} ${billingInfo.lastName}`, // Prefill name in payment form
          email: userInfo.email, // Prefill email from user info
          contact: billingInfo.phoneNumber, // Prefill phone number
        },
        theme: {
          color: "#3563E9", // Theme color for Razorpay checkout
        },
      };

      const rzp = new window.Razorpay(options); // Create Razorpay instance
      rzp.open(); // Open Razorpay payment modal
    } catch (error) {
      console.error("Error processing payment:", error);
      // Show alert for payment processing errors
      Swal.fire({
        icon: "error",
        title: "Car Unavailable",
        text: "The car is not available for the selected dates. Please try other dates or cars.",
      });
    }
  };

  // Display loading state or error message while fetching data
  if (loading || userLoading) return <p>Loading details...</p>;
  if (error) return <p>Error loading car details: {error.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        {/* Render forms for billing, rental, payment, and confirmation */}
        <BillingInfoForm onInputChange={handleInputChange} prefillData={userInfo} />
        <RentalInfoForm onInputChange={handleInputChange} setRentalDays={setRentalDays} />
        <PaymentForm onInputChange={handleInputChange} />
        <Confirmation onInputChange={handleInputChange} />
      </div>
      <div className={styles.rightColumn}>
        {carData && <RentalSummary carData={carData} rentalDays={rentalDays} />} {/* Render rental summary if carData is available */}
        <div className={styles.rentButtonContainer}>
          <button className={styles.rentButton} disabled={!isFormComplete} onClick={handleRentNow}>
            Rent Now
          </button> {/* Rent Now button, disabled if forms are incomplete */}
        </div>
      </div>
    </div>
  );
};

export default BillingDetailPage; // Exporting the component for use in other parts of the application
