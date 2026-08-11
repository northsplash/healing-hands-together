import React from 'react';
export default function PaymentPlans({value,onChange}){
  const plans=[['full','Pay in full','$1,400 today'],['weekly','Weekly plan','$700 deposit + $100 × 7'],['biweekly','Bi-weekly plan','$700 deposit + $175 × 4']];
  return <div className="payment-plans">{plans.map(([id,label,desc])=><label className={`plan-option ${value===id?'selected':''}`} key={id}><input type="radio" name="payment-plan" value={id} checked={value===id} onChange={e=>onChange?.(e.target.value)}/><span><b>{label}</b><small>{desc}</small></span></label>)}</div>;
}


