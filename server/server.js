mport "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const app=express();
const port=process.env.PORT||4242;
const clientUrl=process.env.CLIENT_URL||"http://localhost:5173";
const stripe=process.env.STRIPE_SECRET_KEY?new Stripe(process.env.STRIPE_SECRET_KEY):null;
const dataDir=path.join(process.cwd(),"server","data");
const dataFile=path.join(dataDir,"enrollments.json");
const plans={weekly:{amount:10000,count:7,interval_count:1,label:"$100 weekly × 7"},biweekly:{amount:17500,count:4,interval_count:2,label:"$175 bi-weekly × 4"}};
async function readData(){try{return JSON.parse(await fs.readFile(dataFile,"utf8"));}catch{return []}}
async function writeData(data){await fs.mkdir(dataDir,{recursive:true});await fs.writeFile(dataFile,JSON.stringify(data,null,2));}
app.use(cors({origin:true}));
app.get('/api/health',(_req,res)=>res.json({ok:true,service:'Healing Hands Together API'}));

// Stripe webhook must receive the raw body before express.json().
app.post('/api/stripe-webhook',express.raw({type:'application/json'}),async(req,res)=>{
 if(!stripe)return res.sendStatus(503);
 let event;try{event=stripe.webhooks.constructEvent(req.body,req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET);}catch(err){return res.status(400).send(`Webhook Error: ${err.message}`)}
 const enrollments=await readData();
 if(event.type==='checkout.session.completed'){
  const s=event.data.object;const meta=s.metadata||{};const existing=enrollments.find(e=>e.email===meta.email);
  const record=existing||{id:crypto.randomUUID(),createdAt:new Date().toISOString(),paid:0,history:[]};
  Object.assign(record,{firstName:meta.firstName,lastName:meta.lastName,email:meta.email,phone:meta.phone,status:'Enrolled',plan:meta.payment||'full',stripeCustomerId:s.customer||null,stripeSessionId:s.id});
  const paidNow=s.amount_total?Math.round(s.amount_total/100):0;record.paid=Math.max(record.paid||0,paidNow);record.history.push({date:new Date().toISOString().slice(0,10),amount:paidNow,status:'Paid',source:'checkout'});if(!existing)enrollments.push(record);await writeData(enrollments);
 }
 if(event.type==='invoice.paid'){
  const invoice=event.data.object;const customer=invoice.customer;const record=enrollments.find(e=>e.stripeCustomerId===customer);if(record){const amount=Math.round((invoice.amount_paid||0)/100);record.paid=(record.paid||0)+amount;record.history.push({date:new Date().toISOString().slice(0,10),amount,status:'Paid',source:'invoice'});
   const targetInstallments=record.plan==='weekly'?7:record.plan==='biweekly'?4:0;
   const installmentPayments=record.history.filter(h=>h.source==='invoice').length;
   if(targetInstallments && installmentPayments>=targetInstallments){record.paid=1400;record.status='Paid in full'; if(invoice.subscription){try{await stripe.subscriptions.cancel(invoice.subscription)}catch(e){console.error('Subscription cancellation failed',e.message)}}}
   await writeData(enrollments);}
 }
 res.json({received:true});
});
app.use(express.json());

app.post('/api/create-checkout-session',async(req,res)=>{try{
 if(!stripe)return res.status(503).json({error:'Stripe is not configured. Add STRIPE_SECRET_KEY to .env before using live checkout.'});
 const {firstName,lastName,email,phone,payment}=req.body;if(!firstName||!lastName||!email||!phone||!payment)return res.status(400).json({error:'Please complete all required fields.'});
 const metadata={firstName,lastName,email,phone,payment,program:'6-Week Healthcare Skills Training',tuition:'1400'};
 if(payment==='full'){
  const s=await stripe.checkout.sessions.create({mode:'payment',customer_email:email,line_items:[{price_data:{currency:'usd',product_data:{name:'Healing Hands Together — Full Tuition',description:'6-week healthcare skills training program'},unit_amount:140000},quantity:1}],metadata,success_url:`${clientUrl}/student-portal?payment=success`,cancel_url:`${clientUrl}/enrollment?payment=cancelled`,phone_number_collection:{enabled:true}});return res.json({url:s.url});
 }
 const p=plans[payment];if(!p)return res.status(400).json({error:'Choose weekly or bi-weekly.'});
 const s=await stripe.checkout.sessions.create({mode:'subscription',customer_email:email,line_items:[{price_data:{currency:'usd',product_data:{name:'Healing Hands Together — $700 Deposit',description:'Non-recurring enrollment deposit'},unit_amount:70000},quantity:1},{price_data:{currency:'usd',product_data:{name:`Healing Hands Together — ${payment==='weekly'?'Weekly':'Bi-weekly'} Tuition`,description:`Remaining $700 balance · ${p.label}`},unit_amount:p.amount,recurring:{interval:'week',interval_count:p.interval_count}},quantity:1}],subscription_data:{metadata:{...metadata,installments:String(p.count),installment_amount:String(p.amount/100)}},metadata,success_url:`${clientUrl}/student-portal?payment=success`,cancel_url:`${clientUrl}/enrollment?payment=cancelled`,phone_number_collection:{enabled:true}});return res.json({url:s.url});
}catch(err){console.error(err);res.status(500).json({error:err.message||'Unable to create checkout session.'})}});

app.get('/api/admin/enrollments',async(req,res)=>{if(!process.env.ADMIN_KEY||req.query.key!==process.env.ADMIN_KEY)return res.status(401).json({error:'Unauthorized'});res.json({enrollments:await readData()});});
app.listen(port,()=>console.log(`Healing Hands Together API running on ${port}`));

