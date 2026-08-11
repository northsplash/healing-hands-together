import React, { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4242";

const training = [
  { icon: "🩸", title: "Phlebotomy", text: "Build confidence with hands-on blood collection skills, safety, equipment, and patient care." },
  { icon: "💗", title: "EKG Skills", text: "Learn foundational EKG skills and how to prepare patients and equipment." },
  { icon: "🧪", title: "POCT", text: "Develop practical point-of-care testing skills used in healthcare environments." },
  { icon: "🩺", title: "Blood Pressure", text: "Practice accurate blood-pressure measurement and patient-centered technique." }
];

const included = ["Scrubs", "Textbook", "Binder", "Training supplies", "Resume help", "Job placement support"];

function App() {
  const [menu, setMenu] = useState(false);
  const [payment, setPayment] = useState("deposit");
  const [frequency, setFrequency] = useState("weekly");
  const [enrollOpen, setEnrollOpen] = useState(false);

  const plan = useMemo(() => {
    if (payment === "full") return { today: 1400, remaining: 0, label: "Paid in full" };
    return frequency === "weekly"
      ? { today: 700, remaining: 700, label: "$100 weekly × 7 payments" }
      : { today: 700, remaining: 700, label: "$175 bi-weekly × 4 payments" };
  }, [payment, frequency]);

  const scrollTo = (id) => {
    setMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site">
      <header className="nav">
        <button className="brand" onClick={() => scrollTo("home")} aria-label="Healing Hands Together home">
          <span className="brand-mark">HH</span>
          <span><strong>Healing Hands</strong><small>Together LLC</small></span>
        </button>
        <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle menu">☰</button>
        <nav className={menu ? "nav-links open" : "nav-links"}>
          <button onClick={() => scrollTo("program")}>Program</button>
          <button onClick={() => scrollTo("training")}>Training</button>
          <button onClick={() => scrollTo("included")}>Included</button>
          <button onClick={() => scrollTo("tuition")}>Tuition</button>
          <button className="nav-cta" onClick={() => setEnrollOpen(true)}>Enroll Now</button>
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-glow one"></div><div className="hero-glow two"></div>
          <div className="hero-copy">
            <p className="eyebrow">HANDS-ON HEALTHCARE TRAINING · CARY, NC</p>
            <h1>Turn your calling into a <em>career.</em></h1>
            <p className="hero-text">Build real healthcare skills through compassionate instruction, hands-on practice, and a six-week accelerated training experience.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setEnrollOpen(true)}>Start Your Enrollment <span>↗</span></button>
              <button className="secondary" onClick={() => scrollTo("program")}>Explore the Program</button>
            </div>
            <div className="hero-proof"><span>✓ Small class sizes</span><span>✓ Hands-on training</span><span>✓ Career support</span></div>
          </div>
          <div className="hero-card">
            <div className="pulse">✚</div>
            <p>6-WEEK ACCELERATED PROGRAM</p>
            <h3>Phlebotomy + Healthcare Skills</h3>
            <div className="card-line"></div>
            <div className="mini-row"><span>Tuition</span><strong>$1,400</strong></div>
            <div className="mini-row"><span>Deposit</span><strong>$700</strong></div>
            <button onClick={() => setEnrollOpen(true)}>Reserve Your Seat</button>
          </div>
        </section>

        <section className="stats">
          <div><strong>6</strong><span>Weeks</span></div>
          <div><strong>2</strong><span>Class days / week</span></div>
          <div><strong>8–2</strong><span>Tuesday + Thursday</span></div>
          <div><strong>$1,400</strong><span>Total tuition</span></div>
        </section>

        <section id="program" className="section split">
          <div>
            <p className="eyebrow">THE PROGRAM</p>
            <h2>Learn the skills that move you forward.</h2>
          </div>
          <div>
            <p className="lead">Our six-week accelerated program is designed around practical healthcare skills, confidence-building instruction, and career readiness.</p>
            <p>Classes begin on a date to be announced. Once the first class begins, instruction is held every Tuesday and Thursday from 8:00 AM to 2:00 PM.</p>
            <div className="schedule-box"><span>CLASS START</span><strong>To Be Determined</strong><small>Tuesday & Thursday · 8:00 AM–2:00 PM</small></div>
          </div>
        </section>

        <section id="training" className="section pink-section">
          <div className="center-heading"><p className="eyebrow">HANDS-ON TRAINING</p><h2>More than a textbook.</h2><p>Practice skills in a focused, supportive learning environment.</p></div>
          <div className="training-grid">{training.map(x => <article className="feature" key={x.title}><div className="feature-icon">{x.icon}</div><h3>{x.title}</h3><p>{x.text}</p></article>)}</div>
        </section>

        <section id="included" className="section included">
          <div className="included-image"><div className="image-placeholder"><span>HEALING HANDS</span><strong>Everything you need<br/>to get started.</strong></div></div>
          <div className="included-copy"><p className="eyebrow">EVERYTHING INCLUDED</p><h2>Come ready to learn. We help with the rest.</h2><div className="check-grid">{included.map(item => <div key={item}>✓ <span>{item}</span></div>)}</div><button className="text-button" onClick={() => setEnrollOpen(true)}>See Enrollment Options ↗</button></div>
        </section>

        <section id="tuition" className="section tuition">
          <div className="center-heading"><p className="eyebrow">TUITION & PAYMENT OPTIONS</p><h2>$1,400. Choose what works for you.</h2><p>Reserve your seat with a $700 deposit or pay tuition in full.</p></div>
          <div className="payment-layout">
            <div className="payment-options">
              <button className={payment === "full" ? "payment-card selected" : "payment-card"} onClick={() => setPayment("full")}><span className="radio"></span><div><small>OPTION 01</small><h3>Pay in Full</h3><strong>$1,400</strong><p>One payment. Tuition paid in full.</p></div></button>
              <button className={payment === "deposit" ? "payment-card selected" : "payment-card"} onClick={() => setPayment("deposit")}><span className="radio"></span><div><small>OPTION 02</small><h3>$700 Deposit + Plan</h3><strong>$700 today</strong><p>Reserve your seat and pay the remaining $700 over time.</p></div></button>
              {payment === "deposit" && <div className="frequency"><p>Choose your schedule</p><button className={frequency==="weekly"?"freq active":"freq"} onClick={()=>setFrequency("weekly")}>Weekly<br/><b>$100 × 7</b></button><button className={frequency==="biweekly"?"freq active":"freq"} onClick={()=>setFrequency("biweekly")}>Bi-weekly<br/><b>$175 × 4</b></button></div>}
            </div>
            <aside className="summary"><span>YOUR PLAN</span><h3>{plan.label}</h3><div className="summary-total"><small>Due today</small><strong>${plan.today.toLocaleString()}</strong></div><div className="balance"><span>Remaining balance</span><b>${plan.remaining.toLocaleString()}</b></div><button className="primary wide" onClick={() => setEnrollOpen(true)}>Continue to Enrollment →</button><small className="secure">🔒 Secure payment processing · Payment details handled by our payment processor</small></aside>
          </div>
        </section>

        <section className="scripture"><div className="scripture-mark">“</div><p className="eyebrow">A WORD FOR YOUR JOURNEY</p><blockquote>“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”</blockquote><cite>Jeremiah 29:11</cite></section>

        <section className="section contact" id="contact"><div><p className="eyebrow">LET'S GET YOU STARTED</p><h2>Your next chapter can begin here.</h2><p>Have questions before enrolling? Reach out to Healing Hands Together.</p></div><div className="contact-card"><strong>Healing Hands Together LLC</strong><span>7406 Chapel Hill Rd, Suite K<br/>Cary, NC 27513</span><a href="tel:9105944497">910-594-4497</a><a href="mailto:biagi@healinghandstogethernc.com">biagi@healinghandstogethernc.com</a><button className="primary" onClick={() => setEnrollOpen(true)}>Enroll Now →</button></div></section>
      </main>

      <footer><div className="footer-brand"><span className="brand-mark">HH</span><div><strong>Healing Hands Together</strong><small>Healthcare Training · Cary, NC</small></div></div><span>© {new Date().getFullYear()} Healing Hands Together LLC</span></footer>

      {enrollOpen && <Enrollment payment={payment} frequency={frequency} plan={plan} close={() => setEnrollOpen(false)} api={API}/>}
    </div>
  );
}

function Enrollment({ close, payment, frequency, plan, api }) {
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const res = await fetch(`${api}/api/create-checkout-session`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form,payment,frequency}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start checkout.");
      window.location.href = data.url;
    } catch (err) { setError(err.message); setBusy(false); }
  };

  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="modal"><button className="close" onClick={close}>×</button><p className="eyebrow">START YOUR ENROLLMENT</p><h2>Let's reserve your seat.</h2><p className="modal-intro">You're selecting <strong>{payment==="full" ? "$1,400 paid in full" : `$700 deposit · ${frequency==="weekly" ? "$100 weekly × 7" : "$175 bi-weekly × 4"}`}</strong>.</p><form onSubmit={submit}><div className="form-grid"><label>First name<input required value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/></label><label>Last name<input required value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})}/></label></div><label>Email address<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Phone number<input type="tel" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>{error&&<div className="error">{error}</div>}<button className="primary wide" disabled={busy}>{busy?"Preparing secure checkout…":`Continue · $${plan.today.toLocaleString()} today →`}</button><small className="secure">By continuing, you agree to complete enrollment and the selected tuition payment plan.</small></form></div></div>;
}

export default App;


