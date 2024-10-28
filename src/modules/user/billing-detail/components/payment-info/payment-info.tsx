import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RazorpayLogo from '../../../../../../public/images/razorpay.svg'; // Path to your Razorpay SVG file
import styles from './payment-info.module.css';

interface PaymentFormProps {
  onInputChange: (field: string, isValid: boolean) => void; // Callback for validation
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onInputChange }) => {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  useEffect(() => {
    onInputChange("paymentMethod", !!paymentMethod); // Ensure payment method is selected
  }, [paymentMethod]);

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <div className={styles.paymentContainer}>
      {/* Header with Step Info */}
      <div className={styles.header}>
        <h2 className={styles.title}>Payment Method</h2>
        <span className={styles.stepInfo}>Step 3 of 4</span>
      </div>
      <p className={styles.subtitle}>Please enter your payment method</p>

      <form className={styles.form}>
        {/* Razorpay Payment Option */}
        <div className={styles.paymentOption}>
          <input
            type="radio"
            id="razorpay"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === 'razorpay'}
            onChange={handlePaymentChange}
            className={styles.radioInput}
          />
          <label htmlFor="razorpay" className={styles.radioLabel}>
            <span className={styles.razorpayLabel}>Razorpay</span>
            <Image
              src={RazorpayLogo}
              alt="Razorpay Logo"
              width={100}
              height={30}
              className={styles.razorpayIcon}
            />
          </label>
        </div>

        {/* Razorpay Message */}
        {paymentMethod === 'razorpay' && (
          <p className={styles.paymentMessage}>
            You will be redirected to Razorpay for payment.
          </p>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
