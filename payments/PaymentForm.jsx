import React, { useState } from "react";
import PaymentPlans from "./PaymentPlans.jsx";
import { createCheckoutSession } from "./paymentApi.js";

export default function PaymentForm({ student, onComplete }) {
 const [plan,setPlan]=useState("weekly"); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 async function submit(e){e.preventDefault();setLoading(true);setError("");try{const data=await createCheckoutSession({firstName:student.firstName,lastName:student.lastName,email:student.email,phone:student.phone,payment:plan==="full"?"full":"deposit",frequency:plan==="weekly"?"weekly":plan==="biweekly"?"biweekly":"none",plan});if(data.url) window.location.href=data.url; else onComplete?.(data)}catch(err){setError(err.message)}finally{setLoading(false)}}
 return <form onSubmit={submit}><PaymentPlans value={plan} onChange={setPlan}/>{error&&<div className="form-error">{error}</div>}<button className="primary-button full-button" disabled={loading}>{loading?"Preparing checkoutâ€¦":"Continue to Secure Payment â†’"}</button></form>;
}
