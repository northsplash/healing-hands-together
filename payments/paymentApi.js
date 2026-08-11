export async function createCheckoutSession(payload){
  const base=import.meta.env.VITE_API_URL||'http://localhost:4242';
  const response=await fetch(`${base}/api/create-checkout-session`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await response.json();
  if(!response.ok) throw new Error(data.error||'Unable to create checkout session.');
  return data;
}

