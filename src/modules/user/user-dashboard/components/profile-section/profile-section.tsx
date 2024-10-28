import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Tabs,
  Table,
  Checkbox,
  Upload,
  message,
  Avatar,
  Button,
  Form,
  Input,
  Spin,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FETCH_BOOKINGS } from "@/graphql/queries/booking-cars";
import { FETCH_USER } from "@/graphql/queries/auth";
import { UPDATE_PASSWORD, UPDATE_PROFILE_IMAGE, UPDATE_USER_PROFILE } from "@/graphql/mutations/auth";
import styles from "./profile-section.module.css";
import Cookies from 'js-cookie'
// Interface for booking data structure
interface BookingData {
  id: string;
  carId: number;
  userId: number;
  pickUpDate: string;
  pickUpTime: string;
  dropOffDate: string;
  dropOffTime: string;
  pickUpLocation: string;
  dropOffLocation: string;
  address: string;
  totalPrice: number;
  status: string;
  rentable: {
    car: {
      name: string;
      type: string;
      numberOfSeats: string;
      fuelType: string;
      transmissionType: string;
      primaryImageUrl: string;
      manufacturer: {
        name: string;
      };
    };
  };
}

// Interface for user information structure
interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  profileImage: string;
}

const UserDashboard: React.FC = () => {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]); // State for tracking selected bookings
  const [isEditing, setIsEditing] = useState(false); // State for tracking edit mode
  const [passwordModalVisible, setPasswordModalVisible] = useState(false); // State for tracking password modal visibility

  const [profileForm] = Form.useForm(); // Form instance for profile editing
  const [passwordForm] = Form.useForm(); // Form instance for password editing
  const token = Cookies.get("token")
  // Fetch bookings data with authorization header
  const { data: bookingData, loading: bookingLoading } = useQuery(FETCH_BOOKINGS, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // Fetch user data
  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser, // Function to refetch user data
  } = useQuery(FETCH_USER);

  // Define mutations for updating user data
  const [updateProfileImage] = useMutation(UPDATE_PROFILE_IMAGE);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);
  const [updatePassword] = useMutation(UPDATE_PASSWORD);

  // Handle password update
  const handlePasswordUpdate = async () => {
    try {
      const values = await passwordForm.validateFields(); // Validate password form
      const response = await updatePassword({
        variables: {
          userId: userData?.fetchUser?.data?.id, // Get user ID
          input: {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmNewPassword,
          },
        },
      });

      // Check response status and show appropriate message
      if (response.data?.updatePassword?.status === "success") {
        message.success("Password updated successfully!");
        setPasswordModalVisible(false); // Close the modal
        passwordForm.resetFields(); // Reset the form fields
      } else {
        message.error(response.data?.updatePassword?.message || "Failed to update password");
      }
    } catch (error: any) {
      message.error(error.message || "Error updating password");
    }
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    try {
      const values = await profileForm.validateFields(); // Validate profile form
      const response = await updateUserProfile({
        variables: {
          userId: userData?.fetchUser?.data?.id, // Get user ID
          input: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            city: values.city,
            state: values.state,
            country: values.country,
            pincode: values.pincode,
          },
        },
      });

      // Check response status and show appropriate message
      if (response.data?.updateUserProfile?.status === "success") {
        message.success("Profile updated successfully!");
        setIsEditing(false); // Exit edit mode
        refetchUser(); // Refetch user data
      } else {
        message.error(response.data?.updateUserProfile?.message || "Failed to update profile");
      }
    } catch (error: any) {
      message.error(error.message || "Error updating profile");
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (file: File) => {
    try {
      const response = await updateProfileImage({
        variables: {
          userId: userData?.fetchUser?.data?.id, // Get user ID
          profileImage: file,
        },
      });

      // Check response status and show appropriate message
      if (response.data?.updateProfileImage?.status === "success") {
        message.success("Profile image updated successfully!");
        refetchUser(); // Refetch user data
      } else {
        message.error(response.data?.updateProfileImage?.message || "Failed to update profile image");
      }
    } catch (error: any) {
      message.error(error.message || "Error uploading profile image");
    }
  };

  // Handle editing of user profile
  const handleEditProfile = () => {
    setIsEditing(true); // Enter edit mode
    const user = userData?.fetchUser?.data; // Get user data
    if (user) {
      // Set form fields with user data
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        city: user.city,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
      });
    }
  };

  // Handle booking selection in the table
  const handleBookingSelection = (bookingId: string, checked: boolean) => {
    setSelectedBookings((prevSelected) =>
      checked
        ? [...prevSelected, bookingId] // Add booking ID if checked
        : prevSelected.filter((id) => id !== bookingId) // Remove booking ID if unchecked
    );
  };

  // Show loading spinner if user or booking data is still loading
  if (userLoading || bookingLoading) return <Spin />;

  // Define columns for the bookings table
  const columns = [
    {
      title: "Car",
      dataIndex: ["rentable", "car"], // Access car data
      key: "car",
      render: (_: any, record: BookingData) => {
        const car = record.rentable?.car;
        return car ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar src={car.primaryImageUrl} size={64} /> {/* Display car image */}
            <span style={{ marginLeft: "8px", whiteSpace: "nowrap", textOverflow:"ellipsis", overflow: "hidden" }}>{car.name}</span> {/* Display car name */}
          </div>
        ) : (
          <span>No car data</span>
        );
      },
    },
    {
      title: "Pick-up Date",
      dataIndex: "pickUpDate",
      key: "pickUpDate",
      render: (text: string) => new Date(text).toLocaleDateString("en-GB"), // Format date
    },
    {
      title: "Drop-off Date",
      dataIndex: "dropOffDate",
      key: "dropOffDate",
      render: (text: string) => new Date(text).toLocaleDateString("en-GB"), // Format date
    },
    {
      title: "Location",
      key: "location",
      render: (_: any, record: BookingData) => (
        <>
          {record.pickUpLocation} to {record.dropOffLocation} {/* Show pick-up and drop-off locations */}
        </>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price: number) => `₹${price.toFixed(2)}`, // Format price
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ellipsis: true, // Enable text ellipsis
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true, // Enable text ellipsis
    },
    {
      title: "Select",
      key: "select",
      render: (_: any, record: BookingData) => (
        <Checkbox
          checked={selectedBookings.includes(record.id)} // Check if booking is selected
          onChange={(e) => handleBookingSelection(record.id, e.target.checked)} // Handle checkbox change
        />
      ),
    },
  ];

  const user: UserInfo | undefined = userData?.fetchUser?.data; // Get user data
  const bookings: BookingData[] | undefined = bookingData?.fetchBookings?.data; // Get bookings data

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.avatarContainer}>
        <Avatar size={128} src={user?.profileImage} /> {/* Display user avatar */}
      </div>
      <Upload
        beforeUpload={(file) => {
          handleImageUpload(file); // Handle image upload
          return false; // Prevent automatic upload
        }}
        showUploadList={false} // Hide upload list
      >
        <Button className={styles.uploadButton} icon={<UploadOutlined />}>
          Change Profile Image
        </Button>
      </Upload>

      <Tabs className={styles.tabsContainer} defaultActiveKey="1">
        <Tabs.TabPane tab="Profile Information" key="1">
          <Form
            form={profileForm}
            layout="vertical"
            className={styles.formContainer}
          >
            <Form.Item label="First Name" name="firstName">
              <Input disabled={!isEditing} /> {/* Input field for first name */}
            </Form.Item>
            <Form.Item label="Last Name" name="lastName">
              <Input disabled={!isEditing} /> {/* Input field for last name */}
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled={!isEditing} /> {/* Input field for email */}
            </Form.Item>
            <Form.Item label="Phone Number" name="phoneNumber">
              <Input disabled readOnly /> {/* Input field for phone number, read-only */}
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input disabled={!isEditing} /> {/* Input field for city */}
            </Form.Item>
            <Form.Item label="State" name="state">
              <Input disabled={!isEditing} /> {/* Input field for state */}
            </Form.Item>
            <Form.Item label="Country" name="country">
              <Input disabled={!isEditing} /> {/* Input field for country */}
            </Form.Item>
            <Form.Item label="Pincode" name="pincode">
              <Input disabled={!isEditing} /> {/* Input field for pincode */}
            </Form.Item>
          </Form>

          <div className={styles.actionButtons}>
            {isEditing ? (
              <>
                <Button type="primary" onClick={handleSaveProfile}> {/* Save profile button */}
                  Save Profile
                </Button>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button> {/* Cancel editing */}
                <Button onClick={() => setPasswordModalVisible(true)}> {/* Change password button */}
                  Change Password
                </Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEditProfile}> {/* Edit profile button */}
                Edit Profile
              </Button>
            )}
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Bookings" key="2">
          <Table
            dataSource={bookings} // Data source for bookings table
            columns={columns} // Column definitions
            rowKey="id" // Unique key for rows
            className={styles.tableContainer}
            scroll={{x: "100%"}}
          />
        </Tabs.TabPane>
      </Tabs>

      {/* Modal for changing password */}
      <Modal
        title="Change Password"
        open={passwordModalVisible} // Control modal visibility
        onOk={handlePasswordUpdate} // Handle password update on OK
        onCancel={() => {
          setPasswordModalVisible(false); // Close modal
          passwordForm.resetFields(); // Reset form fields
        }}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: "Please enter your current password" }]} // Validation rule
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter your new password" }, // Validation rule
              { min: 8, message: "Password must be at least 8 characters long" } // Password length rule
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmNewPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve(); // Passwords match
                  }
                  return Promise.reject(new Error("Passwords do not match")); // Passwords do not match
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDashboard;
