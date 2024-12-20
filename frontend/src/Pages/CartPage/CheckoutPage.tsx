import React, { useState, useEffect } from "react";
import { CartItem } from "../../Types/CartItem.type";
import styles from "./CheckoutForm.module.css";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";

interface FormData {
  shipping: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billing: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  payment: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvc: string;
  };
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
};

const steps = ["Shipping Information", "Billing Information", "Payment Information", "Review Order"];

const CheckoutForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // When the order is submitted, send all shipping, billing, and payment info
  // to the backend. After a successful response, redirect to the thank-you page.
  const handleSubmit = () => {
    const token = localStorage.getItem("jwt_token");
    fetch("http://localhost:5000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.shipping.fullName,
        address: formData.shipping.address,
        phone: formData.shipping.phone,
        paymentMethod: "credit_card",
        billing: { ...formData.billing },
        payment: { ...formData.payment },
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Order failed");
        navigate("/thank-you");
      })
      .catch((err) => console.error(err));
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

      {currentStep === 0 && (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Shipping Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="shippingFullName">Full Name</label>
            <input
              id="shippingFullName"
              type="text"
              placeholder="John Doe"
              value={formData.shipping.fullName}
              onChange={(e) => handleChange("shipping", "fullName", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="shippingAddress">Address</label>
            <input
              id="shippingAddress"
              type="text"
              placeholder="123 Main St"
              value={formData.shipping.address}
              onChange={(e) => handleChange("shipping", "address", e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="shippingCity">City</label>
              <input
                id="shippingCity"
                type="text"
                placeholder="Bucharest"
                value={formData.shipping.city}
                onChange={(e) => handleChange("shipping", "city", e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="shippingZipCode">ZIP Code</label>
              <input
                id="shippingZipCode"
                type="text"
                placeholder="010101"
                value={formData.shipping.zipCode}
                onChange={(e) => handleChange("shipping", "zipCode", e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="shippingCountry">Country</label>
              <input
                id="shippingCountry"
                type="text"
                placeholder="Romania"
                value={formData.shipping.country}
                onChange={(e) => handleChange("shipping", "country", e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="shippingPhone">Phone</label>
              <input
                id="shippingPhone"
                type="tel"
                placeholder="+40 712 345 678"
                value={formData.shipping.phone}
                onChange={(e) => handleChange("shipping", "phone", e.target.value)}
              />
            </div>
          </div>
          <div className={styles.buttonRow}>
            <button onClick={nextStep} className={styles.primaryButton}>
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Billing Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="billingFullName">Full Name</label>
            <input
              id="billingFullName"
              type="text"
              placeholder="John Doe"
              value={formData.billing.fullName}
              onChange={(e) => handleChange("billing", "fullName", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="billingAddress">Address</label>
            <input
              id="billingAddress"
              type="text"
              placeholder="456 Independence St"
              value={formData.billing.address}
              onChange={(e) => handleChange("billing", "address", e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="billingCity">City</label>
              <input
                id="billingCity"
                type="text"
                placeholder="Cluj-Napoca"
                value={formData.billing.city}
                onChange={(e) => handleChange("billing", "city", e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="billingZipCode">ZIP Code</label>
              <input
                id="billingZipCode"
                type="text"
                placeholder="400000"
                value={formData.billing.zipCode}
                onChange={(e) => handleChange("billing", "zipCode", e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="billingCountry">Country</label>
            <input
              id="billingCountry"
              type="text"
              placeholder="Romania"
              value={formData.billing.country}
              onChange={(e) => handleChange("billing", "country", e.target.value)}
            />
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

      {currentStep === 2 && (
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Payment Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.payment.cardNumber}
              onChange={(e) => handleChange("payment", "cardNumber", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cardName">Name on Card</label>
            <input
              id="cardName"
              type="text"
              placeholder="John Doe"
              value={formData.payment.cardName}
              onChange={(e) => handleChange("payment", "cardName", e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
              <input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={formData.payment.expiryDate}
                onChange={(e) => handleChange("payment", "expiryDate", e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cvc">CVC</label>
              <input
                id="cvc"
                type="text"
                placeholder="123"
                value={formData.payment.cvc}
                onChange={(e) => handleChange("payment", "cvc", e.target.value)}
              />
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
