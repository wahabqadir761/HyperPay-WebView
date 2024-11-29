import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import baseUrl from "../baseUrl";

const PaymentPage = () => {
  const [checkoutId, setCheckoutId] = useState(null);
  const [cardType, setCardType] = useState("");
  const {userId, bookingId, paramCardType, paymentType,fromWhere } = useParams();

  useEffect(() => {
    const fetchCheckoutId = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            cardType: paramCardType,
            paymentType,
          }),
        });
        const data = await response.json();
        console.log("Checkout ID fetched:", data.checkoutId);
        setCardType(
          paramCardType === "1"
            ? "VISA"
            : paramCardType === "2"
            ? "MASTER"
            : "MADA"
        );
        setCheckoutId(data.checkoutId);
      }catch (error) {
        console.error("Error fetching checkout ID:", error);
        alert(error.message); // Notify the user
    }
    };

    fetchCheckoutId();
  }, [bookingId, paramCardType, paymentType]);

   useEffect(() => {
    if (checkoutId) {
      console.log("Defining wpwlOptions and loading script...");
      // Define wpwlOptions globally
      if (!window.wpwlOptions) {
        // Here we use the checkoutId as the id
        window.wpwlOptions = {
          style: "card",
          locale: "en",
          redirectUrl,
          onReady: () => {
            console.log("Widget is ready!");
          },
        };
      }
      // Dynamically load the HyperPay script
      const script = document.createElement("script");
      script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
      script.async = true;
      script.onload = () => {
        console.log("HyperPay script loaded successfully");
      };
      script.onerror = () => {
        console.log("Failed to load HyperPay script");
      };

      document.body.appendChild(script);

      // Cleanup on component unmount
      return () => {
        console.log("Cleaning up script and wpwlOptions...");
        document.body.removeChild(script);
        delete window.wpwlOptions;
      };
    }
  }, [checkoutId, bookingId]);

  const resourcePath  = `/v1/checkouts/${checkoutId}/payment`; // Construct the resourcePath dynamically
  const redirectUrl= `${baseUrl}/api/payment/callback?id=${checkoutId}&resourcePath=${resourcePath}&bookingId=${bookingId}&fromWhere=${fromWhere}&userId=${userId}`
  return (

    <div className="hyper-card">
      {checkoutId ? (
        <form
          action={redirectUrl}
          className="paymentWidgets"
          data-brands={cardType}
        >
          {/* Payment widget will render here */}
        </form>
      ) : (
        <p>Loading payment widget...</p>
      )}
    </div>
    
  );
};

export default PaymentPage;
