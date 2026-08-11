import React from 'react';
import PaymentPlans from './PaymentPlans';
export default function PaymentForm({plan,setPlan}){return <div><h3>Payment option</h3><PaymentPlans value={plan} onChange={setPlan}/></div>}


