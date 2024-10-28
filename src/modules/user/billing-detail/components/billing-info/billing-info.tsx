import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./billing-info.module.css";
import { FETCH_USER } from "@/graphql/queries/auth";
import { Button, message } from "antd";

interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

interface BillingInfoFormProps {
  onInputChange: (field: string, isValid: boolean, data?: any) => void; // Callback for parent component
  prefillData?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address?: string;
  };
}

const BillingInfoForm: React.FC<BillingInfoFormProps> = ({ onInputChange, prefillData }) => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    // Notify the parent component of the current billing info's validity and content
    const { firstName, lastName, phoneNumber, address } = userData;
    onInputChange("billingInfo", !!firstName && !!lastName && !!phoneNumber && !!address, userData);
  }, [userData, onInputChange]);

  const [isEditing, setIsEditing] = useState(false);
  const token = Cookies.get("token"); // Get authentication token from cookies

  // Fetch user data only if the token exists
  const { data, loading, error } = useQuery(FETCH_USER, {
    skip: !token, // Skip query if token is not present
  });

  useEffect(() => {
    // Set user data from prefillData or fetched user data
    if (prefillData) {
      setUserData({
        firstName: prefillData.firstName || "",
        lastName: prefillData.lastName || "",
        phoneNumber: prefillData.phoneNumber || "",
        address: prefillData.address || "",
      });
    } else if (data?.fetchUser?.status === "success") {
      const { firstName, lastName, phoneNumber, address } = data.fetchUser.data;
      setUserData({ firstName, lastName, phoneNumber, address: address || "" });
    }
  }, [data, prefillData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Update user data based on input field changes
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const toggleEdit = () => {
    // Toggle between editing and viewing modes
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    // Show success message on save
    message.success("Changes saved successfully!");
    setIsEditing(false); // Exit editing mode after saving
  };

  if (loading) return <p>Loading billing info...</p>; // Loading state
  if (error) {
    console.error("Error loading billing info:", error);
    return <p>Error loading billing info: {error.message}</p>; // Error handling
  }

  return (
    <div className={styles.billingFormContainer}>
      <div className={styles.header}>
        <h2>Billing Info</h2>
        <p className={styles.stepInfo}>Step 1 of 4</p>
      </div>
      <p className={styles.subHeading}>Please enter your billing info</p>

      {/* Form starts here */}
      <form className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="First name"
            value={userData.firstName}
            onChange={handleInputChange}
            readOnly={!isEditing} // Input is editable only in editing mode
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder="Last name"
            value={userData.lastName}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            placeholder="Phone number"
            value={userData.phoneNumber}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={userData.address} // Address remains editable regardless of editing mode
            onChange={handleInputChange}
          />
        </div>
      </form>

      <div className={styles.buttonContainer}>
        <Button className={styles.editSaveButton} type="primary" onClick={toggleEdit}>
          {isEditing ? "Save Changes" : "Edit Info"} {/*Button text changes based on editing state*/}
        </Button>
      </div>
    </div>
  );
};

export default BillingInfoForm;
