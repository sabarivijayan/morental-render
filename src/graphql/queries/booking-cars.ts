import { gql } from '@apollo/client';

// Queries

export const GET_RENTABLE_CAR_WITH_ID = gql`
  query GetRentableCarWithId($id: ID!) {
    getRentableCarsWithId(id: $id) {
      id
      carId
      pricePerDay
      availableQuantity
      car {
        id
        name
        type
        numberOfSeats
        fuelType
        transmissionType
        description
        quantity
        manufacturerId
        primaryImageUrl
        secondaryImagesUrls
        year
        manufacturer {
          id
          name
          country
        }
      }
    }
  }
`;

export const GET_AVAILABLE_CARS = gql`
  query GetAvailableCars(
    $pickUpDate: String!
    $dropOffDate: String!
    $query: String
    $transmissionType: [String]
    $fuelType: [String]
    $numberOfSeats: [Int]
    $priceSort: String
    $maxPrice: Float
  ) {
    getAvailableCars(
      pickUpDate: $pickUpDate
      dropOffDate: $dropOffDate
      query: $query
      transmissionType: $transmissionType
      fuelType: $fuelType
      numberOfSeats: $numberOfSeats
      priceSort: $priceSort
      maxPrice: $maxPrice
    ) {
      status
      message
      data {
        id
        carId
        pricePerDay
        availableQuantity
        car {
          id
          name
          type
          numberOfSeats
          fuelType
          transmissionType
          description
          quantity
          manufacturerId
          primaryImageUrl
          secondaryImagesUrls
          year
          manufacturer {
            id
            name
            country
          }
        }
      }
    }
  }
`;


export const GET_RENTABLE_CARS = gql`
  query GetRentableCars {
    getRentableCars {
      id
      carId
      pricePerDay
      availableQuantity
      car {           
        id
        name
        type
        description
        year
        transmissionType
        fuelType
        numberOfSeats
        primaryImageUrl
        manufacturer {
          id
          name
          country
        }
      }
    }
  }
`;

export const FETCH_BOOKINGS = gql`
  query FetchBookings {
    fetchBookings {
      status
      message
      data {
        id
        carId
        userId
        pickUpDate
        pickUpTime
        dropOffDate
        dropOffTime
        pickUpLocation
        dropOffLocation
        address
        phoneNumber
        totalPrice
        status
        rentable {
          id
          car {
            id
            name
            type
            numberOfSeats
            fuelType
            transmissionType
            primaryImageUrl
            manufacturer {
              id
              name
            }
          }
        }
      }
    }
  }
`;
