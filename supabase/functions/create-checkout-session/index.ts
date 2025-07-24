// supabase/functions/create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { orderId, items, email } = await req.json();
  const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
    httpClient: Stripe.createFetchHttpClient(),
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${Deno.env.get("BASE_URL")}/success?orderId=${orderId}`,
      cancel_url: `${Deno.env.get("BASE_URL")}/checkout/${orderId}`,
      metadata: { orderId },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
