import React from "react";

export const PAYMENT_PLANS = [
  { id:"full", title:"Pay in Full", amount:"$1,400", detail:"One payment" },
  { id:"weekly", title:"Weekly", amount:"$700 deposit", detail:"Then $100 weekly × 7" },
  { id:"biweekly", title:"Bi-Weekly", amount:"$700 deposit", detail:"Then $175 every 2 weeks × 4" },
];

export default function PaymentPlans({ value, onChange }) {
  return <div className="plan-options">{PAYMENT_PLANS.map(plan => <button type="button" key={plan.id} className={`plan-option ${value===plan.id?"selected":""}`} onClick={()=>onChange(plan.id)}><span><strong>{plan.title}</strong><small>{plan.detail}</small></span><b>{plan.amount}</b></button>)}</div>;
}
