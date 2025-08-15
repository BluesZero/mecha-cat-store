// src/components/checkout/CheckoutFlow.jsx
import React, { useEffect, useMemo, useState } from "react";
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

export default function CheckoutFlow({
  cart,
  user,
  onClearCart,
  onRemoveItem,
  onUpdateCartQuantity,
}) {
  const { orderId: urlOrderId } = useParams();
  const [step, setStep] = useState(urlOrderId ? "payment" : "summary");
  const [orderId, setOrderId] = useState(urlOrderId || null);
  const [error, setError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const navigate = useNavigate();

  const stripeOptions = useMemo(
    () => ({
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#ff3881",
          colorBackground: "#1e1f26",
          colorText: "#ffffff",
          colorDanger: "#ff6fa1",
          borderRadius: "12px",
        },
        rules: {
          ".Input": { borderColor: "#3a3f45" },
          ".Label": { color: "#cfd2d8" },
        },
      },
      paymentElementOptions: { layout: "accordion" },
    }),
    []
  );

  const stepIndex = { summary: 0, shipping: 1, payment: 2, confirmation: 3 };
  const goToStep = (nextStep) => setStep(nextStep);

  const createOrder = async () => {
    try {
      if (!user) {
        alert("Debes iniciar sesión para finalizar tu compra.");
        return;
      }

      const { data: address } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .single();

      if (!address) {
        console.warn("No hay dirección predeterminada. Se pedirá en el paso de Envío.");
      }

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

      if (orderError || !order) {
        console.error(orderError);
        alert("Error al crear el pedido.");
        return;
      }

      const itemsToInsert = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);
      if (itemsError) {
        console.error(itemsError);
        alert("Error al guardar los productos del pedido.");
        return;
      }

      setOrderId(order.id);
      setStep("shipping");
      navigate(`/checkout/${order.id}`);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un problema al crear tu pedido.");
    }
  };

  useEffect(() => {
    const updateOrderAddress = async () => {
      if (!orderId || !shippingAddress?.id) return;
      const { error: updErr } = await supabase
        .from("orders")
        .update({ shipping_address_id: shippingAddress.id })
        .eq("id", orderId);
      if (updErr) console.error("No se pudo actualizar la dirección del pedido:", updErr);
    };
    updateOrderAddress();
  }, [orderId, shippingAddress]);

  const handlePaymentSuccess = async () => {
    try {
      if (orderId) {
        await supabase
          .from("orders")
          .update({ status: "Pagado", paid_at: new Date().toISOString() })
          .eq("id", orderId);
      }
    } catch (e) {
      console.error("No se pudo actualizar estado a Pagado:", e);
    } finally {
      goToStep("confirmation");
    }
  };

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
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
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateCartQuantity}
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
                onSuccess={handlePaymentSuccess}
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

        {error && (
          <p style={{ color: "tomato", textAlign: "center", marginTop: 16 }}>
            {error}
          </p>
        )}
      </div>
    </Elements>
  );
}
