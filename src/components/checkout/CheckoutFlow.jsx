// src/components/checkout/CheckoutFlow.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CartSummary from "./CartSummary";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import ConfirmationStep from "./ConfirmationStep";
import CheckoutStepBar from "./CheckoutStepBar";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function CheckoutFlow({ cart, user, onClearCart }) {
  const { orderId: urlOrderId } = useParams();
  const [step, setStep] = useState(urlOrderId ? "payment" : "summary");
  const [orderId, setOrderId] = useState(urlOrderId || null);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const navigate = useNavigate();

  const createOrder = async () => {
    if (!user) return alert("Debes iniciar sesión para finalizar tu compra.");

    const { data: address } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single();

    if (!address) return alert("Debes registrar una dirección predeterminada.");

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        status: "Pendiente",
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (orderError || !order) return alert("Error al crear el pedido");

    const itemsToInsert = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);
    if (itemsError) return alert("Error al guardar los productos del pedido");

    setOrderId(order.id);
    setStep("shipping");
    navigate(`/checkout/${order.id}`);
  };

  const goToStep = (nextStep) => setStep(nextStep);
  const stepIndex = { summary: 0, shipping: 1, payment: 2, confirmation: 3 };

  return (
    <Elements stripe={stripePromise}>
      <div style={{ paddingTop: "60px" }}>
        <CheckoutStepBar current={stepIndex[step]} />

        <AnimatePresence mode="wait">
          {step === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CartSummary
                cart={cart}
                onRemove={(id) => alert("Remover producto no implementado aquí.")}
                onUpdateQuantity={(id, qty) => alert("Actualizar cantidad no implementado aquí.")}
                onContinue={createOrder}
              />
            </motion.div>
          )}

          {step === "shipping" && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <ShippingStep
                user={user}
                orderId={orderId}
                onNext={() => goToStep("payment")}
                setShippingAddress={setShippingAddress}
              />
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <PaymentStep
                user={user}
                cart={cart}
                orderId={orderId}
                onSuccess={() => goToStep("confirmation")}
              />
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <ConfirmationStep
                orderId={orderId}
                user={user}
                shippingAddress={shippingAddress}
                onClearCart={onClearCart}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </Elements>
  );
}
