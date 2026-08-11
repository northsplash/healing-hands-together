import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
const port = process.env.PORT || 4242;
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

app.use(cors({ origin: true }));
app.use(express.json());

const plans = {
  weekly: { amount: 10000, count: 7, label: "$100 weekly × 7 payments" },
  biweekly: { amount: 17500, count: 4, label: "$175 bi-weekly × 4 payments" }
};

app.get("/api/health", (_req,res) => res.json({ ok:true, service:"Healing Hands Together payments" }));

app.post("/api/create-checkout-session", async (req,res) => {
  try {
    if (!stripe) return res.status(500).json({ error:"Stripe is not configured yet. Add STRIPE_SECRET_KEY to the server environment." });
    const { firstName,lastName,email,phone,payment,frequency } = req.body;
    if (!firstName || !lastName || !email || !phone) return res.status(400).json({ error:"Please complete all required fields." });

    const base = process.env.CLIENT_URL || "http://localhost:5173";
    const metadata = { firstName,lastName,email,phone,payment,frequency: frequency || "none", program:"6-Week Phlebotomy Training", tuition:"1400" };

    if (payment === "full") {
      const session = await stripe.checkout.sessions.create({
        mode:"payment",
        customer_email:email,
        line_items:[{ price_data:{ currency:"usd", product_data:{ name:"Healing Hands Together - Phlebotomy Training", description:"6-week accelerated healthcare training program" }, unit_amount:140000 }, quantity:1 }],
        metadata,
        success_url:`${base}/?payment=success`,
        cancel_url:`${base}/?payment=cancelled`,
        phone_number_collection:{enabled:true}
      });
      return res.json({ url:session.url });
    }

    const selected = plans[frequency];
    if (!selected) return res.status(400).json({ error:"Choose a valid weekly or bi-weekly payment plan." });

    const session = await stripe.checkout.sessions.create({
      mode:"subscription",
      customer_email:email,
      line_items:[
        { price_data:{ currency:"usd", product_data:{ name:"Healing Hands Together - Enrollment Deposit", description:"$700 non-recurring enrollment deposit" }, unit_amount:70000 }, quantity:1 },
        { price_data:{ currency:"usd", product_data:{ name:`Healing Hands Together - ${frequency==="weekly"?"Weekly":"Bi-weekly"} Tuition Payment`, description:`Remaining $700 tuition balance · ${selected.label}` }, unit_amount:selected.amount, recurring:{ interval:frequency==="weekly"?"week":"week", interval_count:frequency==="weekly"?1:2 } }, quantity:1 }
      ],
      subscription_data:{ metadata:{...metadata, installments:String(selected.count), installment_amount:String(selected.amount)} },
      metadata,
      success_url:`${base}/?payment=success`,
      cancel_url:`${base}/?payment=cancelled`,
      phone_number_collection:{enabled:true}
    });
    return res.json({ url:session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:err.message || "Unable to create checkout session." });
  }
});

app.post("/api/stripe-webhook", express.raw({type:"application/json"}), async (req,res) => {
  if (!stripe) return res.sendStatus(503);
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }

  if (event.type === "checkout.session.completed") {
    console.log("Enrollment completed:", event.data.object.id, event.data.object.customer_email);
    // Production next step: persist enrollment + customer/subscription IDs in your database.
  }
  if (event.type === "invoice.paid") {
    console.log("Payment received:", event.data.object.id);
    // Production next step: increment installment count and cancel subscription after final installment.
  }
  res.json({received:true});
});

app.listen(port,()=>console.log(`Healing Hands Together API running on ${port}`));
