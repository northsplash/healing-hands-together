import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const storeFile = path.join(dataDir, "store.json");
fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(storeFile)) fs.writeFileSync(storeFile, JSON.stringify({ students: [], enrollments: [], payments: [], sessions: [] }, null, 2));

function readStore() { return JSON.parse(fs.readFileSync(storeFile, "utf8")); }
function writeStore(store) { fs.writeFileSync(storeFile, JSON.stringify(store, null, 2)); }
function id(prefix) { return `${prefix}_${crypto.randomBytes(10).toString("hex")}`; }
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) { return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`; }
function verifyPassword(password, stored) { const [salt, hash] = String(stored).split(":"); if (!salt || !hash) return false; const candidate = crypto.scryptSync(password, salt, 64).toString("hex"); return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex")); }
function createSession(store, userId, role = "student") { const token = crypto.randomBytes(32).toString("hex"); store.sessions = store.sessions.filter(s => new Date(s.expiresAt) > new Date()); store.sessions.push({ token, userId, role, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() }); return token; }
function auth(req, res, next) { const header = req.headers.authorization || ""; const token = header.startsWith("Bearer ") ? header.slice(7) : ""; const store = readStore(); const session = store.sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date()); if (!session) return res.status(401).json({ error: "Please sign in again." }); req.session = session; req.store = store; next(); }
function dollarsToCents(value) { return Math.round(Number(value) * 100); }

const app = express();
const port = Number(process.env.PORT || 4242);
const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_") ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const plans = { weekly: { amount: 10000, count: 7, interval: "week", interval_count: 1 }, biweekly: { amount: 17500, count: 4, interval: "week", interval_count: 2 } };

app.use(cors({ origin: true }));
// Stripe webhook MUST receive the raw body before express.json().
app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: "Stripe webhook is not configured." });
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  const store = readStore();
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const student = store.students.find(s => s.email.toLowerCase() === String(metadata.email || session.customer_email || "").toLowerCase());
      if (student) {
        const enrollment = store.enrollments.find(e => e.studentId === student.id);
        if (enrollment) {
          enrollment.status = "enrolled";
          enrollment.stripeCheckoutSessionId = session.id;
          const checkoutAmount = session.mode === "payment" ? Number(session.amount_total || 0) : 70000;
          const paymentType = session.mode === "payment" ? "Tuition — Paid in Full" : "Enrollment Deposit";
          if (checkoutAmount > 0 && !store.payments.some(p => p.stripeCheckoutSessionId === session.id)) {
            store.payments.push({ id: id("pay"), studentId: student.id, enrollmentId: enrollment.id, amount: checkoutAmount, type: paymentType, status: "paid", stripeCheckoutSessionId: session.id, createdAt: new Date().toISOString() });
            enrollment.amountPaid = (enrollment.amountPaid || 0) + checkoutAmount / 100;
            if (session.mode === "payment") enrollment.status = "paid-in-full";
          }
          enrollment.stripeCustomerId = session.customer || null;
          enrollment.stripeSubscriptionId = session.subscription || null;
          enrollment.paymentPlan = metadata.plan || metadata.frequency || "full";
          enrollment.updatedAt = new Date().toISOString();
        }
      }
    }
    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
      const enrollment = store.enrollments.find(e => e.stripeSubscriptionId === subscriptionId);
      if (enrollment) {
        const invoiceTotal = Number(invoice.amount_paid || 0);
        const plan = plans[enrollment.paymentPlan];
        const firstSubscriptionInvoiceIncludesDeposit = (enrollment.installmentsPaid || 0) === 0 && invoiceTotal > (plan?.amount || 0);
        const amount = Math.max(0, invoiceTotal - (firstSubscriptionInvoiceIncludesDeposit ? 70000 : 0));
        if (amount > 0 && !store.payments.some(p => p.stripeInvoiceId === invoice.id)) {
          store.payments.push({ id: id("pay"), studentId: enrollment.studentId, enrollmentId: enrollment.id, amount, type: "Installment", status: "paid", stripeInvoiceId: invoice.id, createdAt: new Date().toISOString() });
          enrollment.amountPaid = (enrollment.amountPaid || 0) + amount / 100;
          enrollment.installmentsPaid = (enrollment.installmentsPaid || 0) + 1;
        }
        if (plan && (enrollment.installmentsPaid || 0) >= plan.count) enrollment.status = "paid-in-full";
        if (stripe && plan && enrollment.installmentsPaid >= plan.count && enrollment.stripeSubscriptionId) await stripe.subscriptions.cancel(enrollment.stripeSubscriptionId);
      }
    }
    writeStore(store);
    return res.json({ received: true });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Webhook processing failed." }); }
});
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "Healing Hands Together", stripeConfigured: Boolean(stripe) }));

app.post("/api/auth/register", (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body || {};
  if (!firstName || !lastName || !email || !phone || !password) return res.status(400).json({ error: "Please complete all required fields." });
  if (String(password).length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
  const store = readStore();
  if (store.students.some(s => s.email.toLowerCase() === String(email).toLowerCase())) return res.status(409).json({ error: "An account with that email already exists. Please sign in." });
  const student = { id: id("stu"), firstName: String(firstName).trim(), lastName: String(lastName).trim(), email: String(email).trim().toLowerCase(), phone: String(phone).trim(), passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
  store.students.push(student);
  const token = createSession(store, student.id, "student"); writeStore(store);
  res.status(201).json({ token, role: "student", student: { id: student.id, firstName: student.firstName, lastName: student.lastName, email: student.email } });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {}; const store = readStore(); const student = store.students.find(s => s.email === String(email || "").toLowerCase());
  if (!student || !verifyPassword(password || "", student.passwordHash)) return res.status(401).json({ error: "Invalid email or password." });
  const token = createSession(store, student.id, "student"); writeStore(store); res.json({ token, role: "student", student: { id: student.id, firstName: student.firstName, lastName: student.lastName, email: student.email } });
});
app.get("/api/auth/me", auth, (req, res) => { const s = req.store.students.find(x => x.id === req.session.userId); res.json({ role: req.session.role, student: s ? { id: s.id, firstName: s.firstName, lastName: s.lastName, email: s.email } : null }); });

app.post("/api/enrollments", auth, (req, res) => {
  const { plan = "weekly", tuition = 1400 } = req.body || {}; const store = req.store; if (!store.students.some(s => s.id === req.session.userId)) return res.status(404).json({ error: "Student account not found." });
  let enrollment = store.enrollments.find(e => e.studentId === req.session.userId);
  if (!enrollment) { enrollment = { id: id("enr"), studentId: req.session.userId, program: "6-Week Healthcare Skills Training", skills: ["Phlebotomy", "EKG Skills", "POCT", "Blood Pressure"], tuition: Number(tuition), amountPaid: 0, installmentsPaid: 0, paymentPlan: plan, status: "pending-payment", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; store.enrollments.push(enrollment); }
  else { enrollment.paymentPlan = plan; enrollment.updatedAt = new Date().toISOString(); }
  writeStore(store); res.json({ enrollment });
});

app.get("/api/student/dashboard", auth, (req, res) => {
  if (req.session.role !== "student") return res.status(403).json({ error: "Student access required." }); const store = req.store; const student = store.students.find(s => s.id === req.session.userId); const enrollment = store.enrollments.find(e => e.studentId === req.session.userId) || null; const payments = store.payments.filter(p => p.studentId === req.session.userId).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); res.json({ student: { id: student.id, firstName: student.firstName, lastName: student.lastName, email: student.email, phone: student.phone }, enrollment, payments });
});

app.post("/api/admin/login", (req, res) => { const { email, password } = req.body || {}; const adminEmail = process.env.ADMIN_EMAIL || "admin@healinghandstogether.com"; const adminPassword = process.env.ADMIN_PASSWORD || "change-this-password"; if (email !== adminEmail || password !== adminPassword) return res.status(401).json({ error: "Invalid administrator credentials." }); const store = readStore(); const token = createSession(store, "admin", "admin"); writeStore(store); res.json({ token, role: "admin" }); });
app.get("/api/admin/dashboard", auth, (req, res) => { if (req.session.role !== "admin") return res.status(403).json({ error: "Administrator access required." }); const store=req.store; const students=store.students.map(s=>({...s,passwordHash:undefined,enrollment:store.enrollments.find(e=>e.studentId===s.id)||null})); const collected=store.payments.filter(p=>p.status==="paid").reduce((n,p)=>n+Number(p.amount||0),0); res.json({ stats:{students:store.students.length,enrolled:store.enrollments.filter(e=>e.status!=="pending-payment").length,collected},students }); });

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to the server environment." });
    const { firstName, lastName, email, phone, payment, frequency, plan, token } = req.body || {};
    if (!firstName || !lastName || !email || !phone) return res.status(400).json({ error: "Please complete all required fields." });
    const store = readStore(); const student = store.students.find(s=>s.email===String(email).toLowerCase()); const enrollment = student ? store.enrollments.find(e=>e.studentId===student.id) : null;
    const base = process.env.CLIENT_URL || "http://localhost:5173";
    const metadata = { firstName, lastName, email, phone, plan: plan || "full", frequency: frequency || "none", program: "6-Week Healthcare Skills Training", tuition: "1400", enrollmentId: enrollment?.id || "" };
    let session;
    if (payment === "full") {
      session = await stripe.checkout.sessions.create({ mode:"payment", customer_email:email, line_items:[{price_data:{currency:"usd",product_data:{name:"Healing Hands Together — 6-Week Healthcare Skills Training",description:"Phlebotomy · EKG Skills · POCT · Blood Pressure"},unit_amount:140000},quantity:1}], metadata, success_url:`${base}/student-portal?payment=success`, cancel_url:`${base}/enrollment?payment=cancelled`, phone_number_collection:{enabled:true} });
    } else {
      const selected=plans[frequency]; if(!selected) return res.status(400).json({error:"Choose a valid weekly or bi-weekly payment plan."});
      session = await stripe.checkout.sessions.create({ mode:"subscription", customer_email:email, line_items:[{price_data:{currency:"usd",product_data:{name:"Healing Hands Together — Enrollment Deposit",description:"Initial enrollment deposit"},unit_amount:70000},quantity:1},{price_data:{currency:"usd",product_data:{name:`Healing Hands Together — ${frequency==="weekly"?"Weekly":"Bi-Weekly"} Tuition`,description:`Remaining $700 balance · ${selected.count} installments`},unit_amount:selected.amount,recurring:{interval:selected.interval,interval_count:selected.interval_count}},quantity:1}], subscription_data:{metadata:{...metadata,installments:String(selected.count),installment_amount:String(selected.amount)}}, metadata, success_url:`${base}/student-portal?payment=success`, cancel_url:`${base}/enrollment?payment=cancelled`, phone_number_collection:{enabled:true} });
    }
    if (enrollment) { enrollment.stripeCheckoutSessionId=session.id; enrollment.paymentPlan=plan || frequency || "full"; enrollment.updatedAt=new Date().toISOString(); writeStore(store); }
    res.json({ url: session.url, sessionId: session.id });
  } catch (err) { console.error(err); res.status(500).json({ error: err.message || "Unable to create checkout session." }); }
});

app.listen(port, () => console.log(`Healing Hands Together API running on ${port}`));
