export {}; // This makes the file a module
declare global {
  interface Window {
    Razorpay: any; // You can use 'any' or replace it with a specific type if available
  }
}
