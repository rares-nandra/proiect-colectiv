import React, { useState, useEffect } from "react";
import { CartItem } from "../../Types/CartItem.type";
import styles from "./CheckoutForm.module.css";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface BillingData {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
}

interface FormData {
  shipping: ShippingData;
  billing: BillingData;
  payment: PaymentData;
  paymentMethod: string;
}

const initialFormData: FormData = {
  shipping: {
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    phone: "",
  },
  billing: {
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  },
  payment: {
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
  },
  paymentMethod: "credit_card",
};

interface ErrorState {
  [key: string]: string; // key is field name, value is error message
}

const steps = ["Shipping Information", "Billing Information", "Payment Information", "Review Order"];

// Simple validation helpers
const allowedCountries = ["Romania", "United States", "United Kingdom", "Germany", "France"];
// City: letters and spaces only
const cityRegex = /^[A-Za-z\s]+$/;
// Country: must be in allowedCountries
// ZIP Code: digits only, length 5 for demo
const zipRegex = /^\d{5}$/;
// Phone: must start with + and be at least 10 chars total for demonstration
const phoneRegex = /^\+\d{9,}$/;

// Luhn check for credit card
function luhnCheck(cardNum: string) {
  let sum = 0;
  let shouldDouble = false;
  // Remove spaces
  cardNum = cardNum.replace(/\s+/g, '');
  
  for (let i = cardNum.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNum[i], 10);
    if (shouldDouble) {
      digit = digit * 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10) === 0;
}

// Expiry date check: MM/YY
function validateExpiryDate(expiry: string) {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);

  if (month < 1 || month > 12) return false;

  // Assume year "20YY"
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    // Already expired
    return false;
  }

  return true;
}

const CheckoutForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    fetch("http://localhost:5000/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCartItems(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (section: keyof FormData, field: string, value: string) => {
    if (section === "paymentMethod") {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }

    // Clear errors for this field when user types
    setErrors((prev) => {
      const { [field]: removedError, ...rest } = prev;
      return rest;
    });
  };

  const validateFields = (stepIndex: number): boolean => {
    let newErrors: ErrorState = {};

    if (stepIndex === 0) {
      // Validate shipping with more rules:
      const { fullName, address, city, zipCode, country, phone } = formData.shipping;
      if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
      if (!address.trim()) newErrors.address = "Address is required.";
      if (!city.trim()) {
        newErrors.city = "City is required.";
      } else if (!cityRegex.test(city)) {
        newErrors.city = "City must contain only letters and spaces.";
      }

      if (!zipCode.trim()) {
        newErrors.zipCode = "ZIP Code is required.";
      } else if (!zipRegex.test(zipCode)) {
        newErrors.zipCode = "ZIP Code must be 5 digits.";
      }

      if (!country.trim()) {
        newErrors.country = "Country is required.";
      } else if (!allowedCountries.includes(country)) {
        newErrors.country = "Country not recognized. Try: Romania, United States, UK, Germany, France.";
      }

      if (!phone.trim()) {
        newErrors.phone = "Phone is required.";
      } else if (!phoneRegex.test(phone)) {
        newErrors.phone = "Phone must start with '+' and have at least 10 digits (e.g. +40712345678).";
      }
    }

    if (stepIndex === 1) {
      // Validate billing similarly
      const { fullName, address, city, zipCode, country } = formData.billing;
      if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
      if (!address.trim()) newErrors.address = "Address is required.";

      if (!city.trim()) {
        newErrors.city = "City is required.";
      } else if (!cityRegex.test(city)) {
        newErrors.city = "City must contain only letters and spaces.";
      }

      if (!zipCode.trim()) {
        newErrors.zipCode = "ZIP Code is required.";
      } else if (!zipRegex.test(zipCode)) {
        newErrors.zipCode = "ZIP Code must be 5 digits.";
      }

      if (!country.trim()) {
        newErrors.country = "Country is required.";
      } else if (!allowedCountries.includes(country)) {
        newErrors.country = "Country not recognized.";
      }
    }

    if (stepIndex === 2) {
      // Validate payment fields more strictly
      const { cardNumber, cardName, expiryDate, cvc } = formData.payment;
      if (!cardNumber.trim()) {
        newErrors.cardNumber = "Card Number is required.";
      } else {
        // Remove spaces from card number for validation
        const cleanCard = cardNumber.replace(/\s+/g, '');
        if (cleanCard.length !== 16 || !/^\d{16}$/.test(cleanCard)) {
          newErrors.cardNumber = "Card Number must be 16 digits.";
        } else if (!luhnCheck(cardNumber)) {
          newErrors.cardNumber = "Invalid card number.";
        }
      }

      if (!cardName.trim()) {
        newErrors.cardName = "Name on Card is required.";
      }

      if (!expiryDate.trim()) {
        newErrors.expiryDate = "Expiry Date is required.";
      } else if (!validateExpiryDate(expiryDate)) {
        newErrors.expiryDate = "Invalid or expired expiry date. Use MM/YY.";
      }

      if (!cvc.trim()) {
        newErrors.cvc = "CVC is required.";
      } else if (!/^\d{3}$/.test(cvc)) {
        newErrors.cvc = "CVC must be 3 digits.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateFields(currentStep)) {
      if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // Final validation before submit
    // Since last step is review, we validate step 2 (payment)
    if (validateFields(2)) {
      const token = localStorage.getItem("jwt_token");
      fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipping: { ...formData.shipping },
          billing: { ...formData.billing },
          payment: { ...formData.payment },
          paymentMethod: formData.paymentMethod,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Order failed");
          navigate("/thank-you");
        })
        .catch((err) => console.error(err));
    }
  };

  const updateQuantityInDB = (product_id: string, newQuantity: number) => {
    const token = localStorage.getItem("jwt_token");

    fetch("http://localhost:5000/cart/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product_id,
        quantity: newQuantity,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        if (newQuantity > 0) {
          setCartItems((prev) =>
            prev.map((item) =>
              item.product_id === product_id ? { ...item, quantity: newQuantity } : item
            )
          );
        } else {
          setCartItems((prev) => prev.filter((item) => item.product_id !== product_id));
        }
      })
      .catch((err) => console.error(err));
  };

  const incrementQuantity = (product_id: string) => {
    const item = cartItems.find((i) => i.product_id === product_id);
    if (item) {
      updateQuantityInDB(product_id, item.quantity + 1);
    }
  };

  const decrementQuantity = (product_id: string) => {
    const item = cartItems.find((i) => i.product_id === product_id);
    if (item && item.quantity > 0) {
      updateQuantityInDB(product_id, item.quantity - 1);
    }
  };

  const fieldHasError = (fieldName: string): boolean => {
    return Boolean(errors[fieldName]);
  };

  const errorClass = (fieldName: string) =>
    fieldHasError(fieldName) ? styles.errorInput : "";

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.header}>
        <Link to="/" className={styles.homeLink}>Home</Link>
      </div>
      <h1 className={styles.mainTitle}>Checkout</h1>
      <div className={styles.cartOverview}>
        <h2>Your Cart Items</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.product_id} className={styles.cartItem}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>{item.price} RON</span>
              <div className={styles.quantityContainer}>
                <button
                  className={styles.quantityButton}
                  onClick={() => decrementQuantity(item.product_id)}
                >
                  <FaMinus />
                </button>
                <input
                  className={styles.quantityInput}
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateQuantityInDB(item.product_id, Number(e.target.value))}
                />
                <button
                  className={styles.quantityButton}
                  onClick={() => incrementQuantity(item.product_id)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.stepIndicator}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${index === currentStep ? styles.activeStep : ""}`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Shipping Step */}
      {currentStep === 0 && (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Shipping Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="shippingFullName">Full Name</label>
            <input
              id="shippingFullName"
              type="text"
              placeholder="John Doe"
              className={errorClass("fullName")}
              value={formData.shipping.fullName}
              onChange={(e) => handleChange("shipping", "fullName", e.target.value)}
            />
            {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="shippingAddress">Address</label>
            <input
              id="shippingAddress"
              type="text"
              placeholder="123 Main St"
              className={errorClass("address")}
              value={formData.shipping.address}
              onChange={(e) => handleChange("shipping", "address", e.target.value)}
            />
            {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="shippingCity">City</label>
              <input
                id="shippingCity"
                type="text"
                placeholder="Bucharest"
                className={errorClass("city")}
                value={formData.shipping.city}
                onChange={(e) => handleChange("shipping", "city", e.target.value)}
              />
              {errors.city && <p className={styles.errorMessage}>{errors.city}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="shippingZipCode">ZIP Code</label>
              <input
                id="shippingZipCode"
                type="text"
                placeholder="010101"
                className={errorClass("zipCode")}
                value={formData.shipping.zipCode}
                onChange={(e) => handleChange("shipping", "zipCode", e.target.value)}
              />
              {errors.zipCode && <p className={styles.errorMessage}>{errors.zipCode}</p>}
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="shippingCountry">Country</label>
              <input
                id="shippingCountry"
                type="text"
                placeholder="Romania"
                className={errorClass("country")}
                value={formData.shipping.country}
                onChange={(e) => handleChange("shipping", "country", e.target.value)}
              />
              {errors.country && <p className={styles.errorMessage}>{errors.country}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="shippingPhone">Phone</label>
              <input
                id="shippingPhone"
                type="tel"
                placeholder="+40 712 345 678"
                className={errorClass("phone")}
                value={formData.shipping.phone}
                onChange={(e) => handleChange("shipping", "phone", e.target.value)}
              />
              {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button onClick={nextStep} className={styles.primaryButton}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Billing Step */}
      {currentStep === 1 && (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Billing Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="billingFullName">Full Name</label>
            <input
              id="billingFullName"
              type="text"
              placeholder="John Doe"
              className={errorClass("fullName")}
              value={formData.billing.fullName}
              onChange={(e) => handleChange("billing", "fullName", e.target.value)}
            />
            {errors.fullName && <p className={styles.errorMessage}>{errors.fullName}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="billingAddress">Address</label>
            <input
              id="billingAddress"
              type="text"
              placeholder="456 Independence St"
              className={errorClass("address")}
              value={formData.billing.address}
              onChange={(e) => handleChange("billing", "address", e.target.value)}
            />
            {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="billingCity">City</label>
              <input
                id="billingCity"
                type="text"
                placeholder="Cluj-Napoca"
                className={errorClass("city")}
                value={formData.billing.city}
                onChange={(e) => handleChange("billing", "city", e.target.value)}
              />
              {errors.city && <p className={styles.errorMessage}>{errors.city}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="billingZipCode">ZIP Code</label>
              <input
                id="billingZipCode"
                type="text"
                placeholder="400000"
                className={errorClass("zipCode")}
                value={formData.billing.zipCode}
                onChange={(e) => handleChange("billing", "zipCode", e.target.value)}
              />
              {errors.zipCode && <p className={styles.errorMessage}>{errors.zipCode}</p>}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="billingCountry">Country</label>
            <input
              id="billingCountry"
              type="text"
              placeholder="Romania"
              className={errorClass("country")}
              value={formData.billing.country}
              onChange={(e) => handleChange("billing", "country", e.target.value)}
            />
            {errors.country && <p className={styles.errorMessage}>{errors.country}</p>}
          </div>
          <div className={styles.buttonRow}>
            <button onClick={prevStep} className={styles.secondaryButton}>
              Back
            </button>
            <button onClick={nextStep} className={styles.primaryButton}>
              Next
            </button>
          </div>
        </div>
      )}

      {/* Payment Step */}
      {currentStep === 2 && (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Payment Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              className={errorClass("cardNumber")}
              value={formData.payment.cardNumber}
              onChange={(e) => handleChange("payment", "cardNumber", e.target.value)}
            />
            {errors.cardNumber && <p className={styles.errorMessage}>{errors.cardNumber}</p>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cardName">Name on Card</label>
            <input
              id="cardName"
              type="text"
              placeholder="John Doe"
              className={errorClass("cardName")}
              value={formData.payment.cardName}
              onChange={(e) => handleChange("payment", "cardName", e.target.value)}
            />
            {errors.cardName && <p className={styles.errorMessage}>{errors.cardName}</p>}
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
              <input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                className={errorClass("expiryDate")}
                value={formData.payment.expiryDate}
                onChange={(e) => handleChange("payment", "expiryDate", e.target.value)}
              />
              {errors.expiryDate && <p className={styles.errorMessage}>{errors.expiryDate}</p>}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                type="text"
                placeholder="123"
                className={errorClass("cvc")}
                value={formData.payment.cvc}
                onChange={(e) => handleChange("payment", "cvc", e.target.value)}
              />
              {errors.cvc && <p className={styles.errorMessage}>{errors.cvc}</p>}
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button onClick={prevStep} className={styles.secondaryButton}>
              Back
            </button>
            <button onClick={nextStep} className={styles.primaryButton}>
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* Review Step */}
      {currentStep === 3 && (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Review Order</h2>
          <p>Please review all details before placing the order.</p>
          <div className={styles.buttonRow}>
            <button onClick={prevStep} className={styles.secondaryButton}>
              Back
            </button>
            <button onClick={handleSubmit} className={styles.primaryButton}>
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
