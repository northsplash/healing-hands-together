import React, {
  useEffect,
  useState
} from "react";

import {
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";


/* =========================================================
   SCROLL ANIMATION
========================================================= */

function Reveal({
  children,
  className = ""
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12
      }
    );

    const element =
      document.querySelector(
        `[data-reveal="${crypto.randomUUID()}"]`
      );

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      ref={(node) => {
        if (!node) return;

        const observer =
          new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
              }
            },
            {
              threshold: 0.12
            }
          );

        observer.observe(node);
      }}
    >
      {children}
    </div>
  );
}


/* =========================================================
   PAGE TRANSITION
========================================================= */

function PageTransition({
  children
}) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location.pathname]);

  return (
    <div
      key={location.pathname}
      className="page-transition"
    >
      {children}
    </div>
  );
}


/* =========================================================
   NAVIGATION
========================================================= */

function Navigation() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const closeMenu = () =>
    setMenuOpen(false);

  return (
    <header className="site-header">

      <div className="nav-container">

        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >

          <img
            src="/images/healing-hands-logo.png"
            alt="Healing Hands Together"
            className="brand-logo"
          />

          <div className="brand-text">
            <strong>
              Healing Hands
            </strong>

            <span>
              Together
            </span>
          </div>

        </Link>


        <button
          className={`mobile-menu ${
            menuOpen ? "active" : ""
          }`}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >

          <span></span>
          <span></span>
          <span></span>

        </button>


        <nav
          className={`main-nav ${
            menuOpen ? "nav-open" : ""
          }`}
        >

          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
          >
            About Us
          </Link>

          <Link
            to="/programs"
            onClick={closeMenu}
          >
            Programs
          </Link>

          <Link
            to="/why-choose-us"
            onClick={closeMenu}
          >
            Why Choose Us
          </Link>

          <Link
            to="/enrollment"
            className="nav-button"
            onClick={closeMenu}
          >
            Get Started
          </Link>

        </nav>

      </div>

    </header>
  );
}


/* =========================================================
   MUSIC PLAYER
========================================================= */

function MusicPlayer() {

  const [playing, setPlaying] =
    useState(false);

  const [audio] =
    useState(() => {
      if (typeof window !== "undefined") {
        return new Audio(
          "/music/healing-hands-background.mp3"
        );
      }

      return null;
    });


  useEffect(() => {

    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.15;

    return () => {
      audio.pause();
    };

  }, [audio]);


  const toggleMusic = () => {

    if (!audio) return;

    if (playing) {

      audio.pause();
      setPlaying(false);

    } else {

      audio.play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          setPlaying(false);
        });

    }
  };


  return (
    <button
      className={`music-button ${
        playing ? "music-playing" : ""
      }`}
      onClick={toggleMusic}
      aria-label="Toggle background music"
    >

      <span>
        {playing ? "♫" : "♪"}
      </span>

      <small>
        {playing
          ? "Music On"
          : "Music Off"}
      </small>

    </button>
  );
}


/* =========================================================
   FOOTER
========================================================= */

function Footer() {

  return (
    <footer className="footer">

      <div className="footer-wave"></div>

      <div className="footer-container">

        <div className="footer-brand">

          <img
            src="/images/healing-hands-logo.png"
            alt="Healing Hands Together logo"
          />

          <h3>
            Healing Hands Together
          </h3>

          <p>
            Empowering future healthcare
            professionals through hands-on
            education, confidence, and
            compassionate instruction.
          </p>

        </div>


        <div className="footer-column">

          <h4>
            Explore
          </h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/programs">
            Programs
          </Link>

          <Link to="/why-choose-us">
            Why Choose Us
          </Link>

        </div>


        <div className="footer-column">

          <h4>
            Training
          </h4>

          <Link to="/programs/phlebotomy">
            Phlebotomy
          </Link>

          <Link to="/programs/ekg">
            EKG Skills
          </Link>

          <Link to="/programs/poct">
            POCT
          </Link>

          <Link to="/programs/blood-pressure">
            Blood Pressure
          </Link>

        </div>


        <div className="footer-column">

          <h4>
            Start Your Journey
          </h4>

          <p>
            Ready to build your healthcare
            skills?
          </p>

          <Link
            to="/enrollment"
            className="footer-button"
          >
            Begin Enrollment
          </Link>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()}
          {" "}
          Healing Hands Together.
          All rights reserved.
        </p>

        <p className="powered">
          Powered by NS Venture Works
        </p>

      </div>

    </footer>
  );
}


/* =========================================================
   HERO
========================================================= */

function Hero() {

  return (
    <section className="hero">

      <div className="hero-background"></div>

      <div className="hero-content">

        <div className="hero-badge">
          Healthcare Skills Training
        </div>

        <h1>
          Learn.
          <span>
            Practice.
          </span>
          <strong>
            Become.
          </strong>
        </h1>

        <p>
          Build confidence through hands-on
          healthcare training designed to
          help you become more knowledgeable,
          capable, and prepared for your
          future in the medical field.
        </p>


        <div className="hero-buttons">

          <Link
            to="/programs"
            className="primary-button"
          >
            Explore Programs
            <span>→</span>
          </Link>

          <Link
            to="/about"
            className="secondary-button"
          >
            Meet Healing Hands
          </Link>

        </div>

      </div>


      <div className="hero-floating-card">

        <div className="floating-icon">
          🩸
        </div>

        <div>
          <strong>
            Hands-On Training
          </strong>

          <span>
            Skills you can practice
          </span>
        </div>

      </div>


      <div className="scroll-indicator">
        <span></span>
        Scroll to explore
      </div>

    </section>
  );
}


/* =========================================================
   HOME PROGRAM TEASERS
========================================================= */

const programs = [
  {
    icon: "🩸",
    title: "Phlebotomy",
    path: "/programs/phlebotomy",
    image: "/images/phlebotomy.jpg",
    text:
      "Build confidence with hands-on blood collection skills, safety, equipment, specimen handling, and patient care."
  },

  {
    icon: "💗",
    title: "EKG Skills",
    path: "/programs/ekg",
    image: "/images/ekg.jpg",
    text:
      "Learn foundational EKG skills, patient preparation, equipment setup, lead placement, and professional technique."
  },

  {
    icon: "🧪",
    title: "POCT",
    path: "/programs/poct",
    image: "/images/poct.jpg",
    text:
      "Develop practical point-of-care testing skills used in healthcare environments while learning accuracy and safety."
  },

  {
    icon: "🩺",
    title: "Blood Pressure",
    path: "/programs/blood-pressure",
    image: "/images/blood-pressure.jpg",
    text:
      "Practice accurate blood-pressure measurement, patient positioning, equipment use, and patient-centered technique."
  }
];


function ProgramTeasers() {

  return (
    <section className="section programs-preview">

      <Reveal>

        <div className="section-heading">

          <span className="eyebrow">
            What We Teach
          </span>

          <h2>
            Skills That
            <span>
              Make a Difference
            </span>
          </h2>

          <p>
            Explore our healthcare skills
            training programs and discover
            where your next opportunity can
            begin.
          </p>

        </div>

      </Reveal>


      <div className="program-grid">

        {programs.map(
          (program, index) => (

            <Reveal
              key={program.title}
            >

              <Link
                to={program.path}
                className="program-card"
              >

                <div className="program-image">

                  <img
                    src={program.image}
                    alt={program.title}
                  />

                  <div className="program-icon">
                    {program.icon}
                  </div>

                </div>


                <div className="program-card-content">

                  <span className="program-number">
                    0{index + 1}
                  </span>

                  <h3>
                    {program.title}
                  </h3>

                  <p>
                    {program.text}
                  </p>

                  <span className="learn-more">
                    Explore Program →
                  </span>

                </div>

              </Link>

            </Reveal>

          )
        )}

      </div>

    </section>
  );
}


/* =========================================================
   HOME ABOUT TEASER
========================================================= */

function AboutTeaser() {

  return (
    <section className="section about-preview">

      <div className="split-section">

        <Reveal className="image-side">

          <div className="about-image-wrapper">

            <img
              src="/images/founder-rashida.jpg"
              alt="Rashida Biagi"
            />

            <div className="experience-card">

              <strong>
                20+
              </strong>

              <span>
                Years of
                Healthcare Experience
              </span>

            </div>

          </div>

        </Reveal>


        <Reveal className="text-side">

          <span className="eyebrow">
            About Healing Hands Together
          </span>

          <h2>
            Education With
            <span>
              Purpose.
            </span>
          </h2>

          <p>
            Healing Hands Together was founded
            by Rashida Biagi, a dedicated
            healthcare professional with more
            than 20 years of experience in the
            medical field.
          </p>

          <p>
            Her career began in phlebotomy,
            where she worked for 16 years and
            spent an additional 6 years teaching
            and training future phlebotomists.
          </p>

          <Link
            to="/about"
            className="text-link"
          >
            Read Our Story →
          </Link>

        </Reveal>

      </div>

    </section>
  );
}


/* =========================================================
   WHY CHOOSE TEASER
========================================================= */

function WhyChooseTeaser() {

  const benefits = [
    {
      icon: "🎓",
      title: "Hands-On Training",
      text:
        "Practice real-world healthcare skills through practical instruction."
    },

    {
      icon: "📚",
      title: "Everything Included",
      text:
        "Training materials, supplies, scrubs, textbook, and binder are included."
    },

    {
      icon: "💼",
      title: "Career Support",
      text:
        "Receive resume assistance and job placement support as you prepare for your next step."
    },

    {
      icon: "💳",
      title: "Payment Plans",
      text:
        "$700 deposit with weekly or bi-weekly payment options available."
    }
  ];


  return (
    <section className="section why-preview">

      <Reveal>

        <div className="section-heading centered">

          <span className="eyebrow">
            Why Choose Us
          </span>

          <h2>
            Welcome to
            <span>
              Our World
            </span>
          </h2>

          <p>
            We believe in empowering future
            healthcare professionals through
            hands-on training, compassionate
            instruction, and meaningful career
            opportunities.
          </p>

        </div>

      </Reveal>


      <div className="benefit-grid">

        {benefits.map(
          (benefit) => (

            <Reveal
              key={benefit.title}
            >

              <div className="benefit-card">

                <div className="benefit-icon">
                  {benefit.icon}
                </div>

                <h3>
                  {benefit.title}
                </h3>

                <p>
                  {benefit.text}
                </p>

              </div>

            </Reveal>

          )
        )}

      </div>


      <div className="center-button">

        <Link
          to="/why-choose-us"
          className="primary-button"
        >
          Discover Why Students Choose Us
          <span>→</span>
        </Link>

      </div>

    </section>
  );
}


/* =========================================================
   CTA
========================================================= */

function EnrollmentCTA() {

  return (
    <section className="cta-section">

      <div className="cta-inner">

        <span className="eyebrow">
          Your Next Chapter Starts Here
        </span>

        <h2>
          Ready to Build
          <span>
            Your Healthcare Skills?
          </span>
        </h2>

        <p>
          Let us help you begin your journey
          with confidence.
        </p>

        <Link
          to="/enrollment"
          className="white-button"
        >
          Get Started Today
          <span>→</span>
        </Link>

      </div>

    </section>
  );
}


/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {

  return (
    <>
      <Hero />

      <ProgramTeasers />

      <AboutTeaser />

      <WhyChooseTeaser />

      <EnrollmentCTA />
    </>
  );
}


/* =========================================================
   ABOUT PAGE
========================================================= */

function AboutPage() {

  return (
    <>

      <PageHero
        eyebrow="About Us"
        title="Healing Hands"
        accent="Together"
        text="Education, experience, compassion, and opportunity come together here."
      />


      <section className="section about-full">

        <div className="split-section">

          <Reveal className="image-side">

            <div className="founder-image">

              <img
                src="/images/founder-rashida.jpg"
                alt="Rashida Biagi, founder of Healing Hands Together"
              />

            </div>

          </Reveal>


          <Reveal className="text-side">

            <span className="eyebrow">
              Our Mission
            </span>

            <h2>
              Helping People
              <span>
                Become More Confident
              </span>
            </h2>

            <p>
              Healing Hands Together was founded
              by Rashida Biagi, a dedicated
              healthcare professional with more
              than 20 years of experience in the
              medical field.
            </p>

            <p>
              Her career began in phlebotomy,
              where she worked for 16 years and
              spent an additional 6 years teaching
              and training future phlebotomists.
            </p>

            <p>
              Continuing her passion for patient
              care and education, she earned her
              Bachelor’s degree in Nursing and
              became a Registered Nurse (RN) in
              2015.
            </p>

            <p>
              In 2021, she established Healing
              Hands Together to provide quality
              healthcare training and education.
            </p>

            <p>
              While building the organization,
              she further advanced her career by
              graduating from Chamberlain
              University as a Family Nurse
              Practitioner (FNP) in 2024.
            </p>

            <p>
              Today, Healing Hands Together has
              been revamped to offer expanded
              healthcare skills training designed
              to make students more knowledgeable,
              confident, and employable in the
              medical field.
            </p>

          </Reveal>

        </div>

      </section>


      <section className="mission-banner">

        <div>

          <span>
            Our Vision
          </span>

          <h2>
            Knowledge builds confidence.
            Confidence creates opportunity.
          </h2>

        </div>

      </section>

    </>
  );
}


/* =========================================================
   PAGE HERO
========================================================= */

function PageHero({
  eyebrow,
  title,
  accent,
  text
}) {

  return (
    <section className="page-hero">

      <div className="page-hero-content">

        <span className="eyebrow">
          {eyebrow}
        </span>

        <h1>
          {title}
          <span>
            {accent}
          </span>
        </h1>

        <p>
          {text}
        </p>

      </div>

    </section>
  );
}


/* =========================================================
   PROGRAMS PAGE
========================================================= */

function ProgramsPage() {

  return (
    <>

      <PageHero
        eyebrow="Healthcare Skills Training"
        title="Explore Our"
        accent="Programs"
        text="Build practical skills through focused healthcare training designed for confidence and career readiness."
      />


      <section className="section all-programs">

        <div className="program-list">

          {programs.map(
            (program, index) => (

              <Reveal
                key={program.title}
              >

                <Link
                  to={program.path}
                  className="large-program-card"
                >

                  <div className="large-program-image">

                    <img
                      src={program.image}
                      alt={program.title}
                    />

                  </div>


                  <div className="large-program-content">

                    <span className="program-number">
                      0{index + 1}
                    </span>

                    <div className="large-icon">
                      {program.icon}
                    </div>

                    <h2>
                      {program.title}
                    </h2>

                    <p>
                      {program.text}
                    </p>

                    <span className="text-link">
                      Learn More →
                    </span>

                  </div>

                </Link>

              </Reveal>

            )
          )}

        </div>

      </section>

    </>
  );
}


/* =========================================================
   INDIVIDUAL PROGRAM PAGE
========================================================= */

const programDetails = {

  phlebotomy: {

    icon: "🩸",

    title: "Phlebotomy",

    subtitle:
      "Build confidence in blood collection and patient care.",

    image:
      "/images/phlebotomy.jpg",

    intro:
      "Phlebotomy training introduces students to the knowledge, techniques, safety practices, and patient-care skills needed when collecting blood specimens in healthcare environments.",

    sections: [

      {
        title: "What You’ll Learn",
        items: [
          "Venipuncture fundamentals",
          "Capillary collection techniques",
          "Patient identification and preparation",
          "Equipment and supply selection",
          "Collection tube knowledge",
          "Specimen labeling and handling",
          "Infection prevention and safety",
          "Professional patient communication"
        ]
      },

      {
        title: "Hands-On Practice",
        items: [
          "Preparing a patient for collection",
          "Setting up a safe collection area",
          "Practicing proper technique",
          "Handling equipment correctly",
          "Following safety procedures",
          "Maintaining a professional environment"
        ]
      }

    ]

  },


  ekg: {

    icon: "💗",

    title: "EKG Skills",

    subtitle:
      "Learn foundational EKG skills and patient preparation.",

    image:
      "/images/ekg.jpg",

    intro:
      "Our EKG skills training focuses on foundational knowledge and practical techniques for preparing patients, setting up equipment, placing leads, and obtaining quality EKG recordings.",

    sections: [

      {
        title: "What You’ll Learn",
        items: [
          "Basic cardiac terminology",
          "Patient preparation",
          "Equipment setup",
          "Lead placement",
          "Skin preparation",
          "Proper positioning",
          "Obtaining a quality tracing",
          "Patient communication"
        ]
      },

      {
        title: "Professional Skills",
        items: [
          "Maintaining patient privacy",
          "Following safety procedures",
          "Using equipment properly",
          "Communicating professionally",
          "Recognizing common technical issues"
        ]
      }

    ]

  },


  poct: {

    icon: "🧪",

    title: "Point-of-Care Testing",

    subtitle:
      "Develop practical skills used in healthcare environments.",

    image:
      "/images/poct.jpg",

    intro:
      "Point-of-care testing, or POCT, introduces students to practical testing processes performed close to or at the point of patient care. Students learn the importance of accuracy, safety, documentation, and proper procedures.",

    sections: [

      {
        title: "What You’ll Learn",
        items: [
          "Understanding point-of-care testing",
          "Equipment preparation",
          "Patient identification",
          "Specimen collection basics",
          "Testing procedures",
          "Quality and accuracy",
          "Documentation",
          "Safety and infection prevention"
        ]
      },

      {
        title: "Why It Matters",
        items: [
          "Timely information",
          "Accurate testing practices",
          "Patient-centered care",
          "Professional responsibility",
          "Healthcare team communication"
        ]
      }

    ]

  },


  "blood-pressure": {

    icon: "🩺",

    title: "Blood Pressure Skills",

    subtitle:
      "Practice accurate blood-pressure measurement and patient-centered technique.",

    image:
      "/images/blood-pressure.jpg",

    intro:
      "Blood pressure measurement is a foundational healthcare skill. Students learn how to prepare patients, select appropriate equipment, position the patient correctly, and obtain accurate readings.",

    sections: [

      {
        title: "What You’ll Learn",
        items: [
          "Patient preparation",
          "Proper positioning",
          "Cuff selection",
          "Manual measurement basics",
          "Equipment use",
          "Accurate documentation",
          "Professional communication",
          "Common measurement mistakes"
        ]
      },

      {
        title: "Patient-Centered Technique",
        items: [
          "Creating a comfortable environment",
          "Explaining the procedure",
          "Protecting patient privacy",
          "Using calm communication",
          "Recording measurements accurately"
        ]
      }

    ]

  }

};


function ProgramDetailPage({
  programKey
}) {

  const program =
    programDetails[programKey];


  if (!program) {
    return null;
  }


  return (
    <>

      <PageHero
        eyebrow={`${program.icon} Healthcare Skills Training`}
        title={program.title}
        accent=""
        text={program.subtitle}
      />


      <section className="section detail-page">

        <Reveal>

          <div className="detail-hero-image">

            <img
              src={program.image}
              alt={program.title}
            />

            <div className="detail-icon">
              {program.icon}
            </div>

          </div>

        </Reveal>


        <Reveal>

          <div className="detail-intro">

            <span className="eyebrow">
              Program Overview
            </span>

            <h2>
              Learn Skills You Can
              <span>
                Carry Forward
              </span>
            </h2>

            <p>
              {program.intro}
            </p>

          </div>

        </Reveal>


        <div className="detail-grid">

          {program.sections.map(
            (section) => (

              <Reveal
                key={section.title}
              >

                <div className="detail-card">

                  <h3>
                    {section.title}
                  </h3>

                  <ul>

                    {section.items.map(
                      (item) => (

                        <li key={item}>

                          <span>
                            ✓
                          </span>

                          {item}

                        </li>

                      )
                    )}

                  </ul>

                </div>

              </Reveal>

            )
          )}

        </div>


        <div className="program-cta">

          <h2>
            Ready to Learn More?
          </h2>

          <p>
            Take the next step toward
            strengthening your healthcare
            skills.
          </p>

          <Link
            to="/enrollment"
            className="primary-button"
          >
            Get Started
            <span>→</span>
          </Link>

        </div>

      </section>

    </>
  );
}


/* =========================================================
   WHY CHOOSE US
========================================================= */

function WhyChoosePage() {

  return (
    <>

      <PageHero
        eyebrow="Why Healing Hands Together"
        title="Welcome to"
        accent="Our World"
        text="We believe healthcare education should be practical, supportive, and designed to build confidence."
      />


      <section className="section why-full">

        <Reveal>

          <div className="section-heading centered">

            <span className="eyebrow">
              What Sets Us Apart
            </span>

            <h2>
              Training Designed
              <span>
                Around You
              </span>
            </h2>

          </div>

        </Reveal>


        <div className="why-feature-grid">

          <Reveal>

            <div className="why-feature">

              <div className="feature-icon">
                🎓
              </div>

              <h3>
                Hands-On Training
              </h3>

              <p>
                Phlebotomy, EKGs, POCT,
                and Blood Pressure skills
                give students opportunities
                to learn through practical
                instruction.
              </p>

            </div>

          </Reveal>


          <Reveal>

            <div className="why-feature">

              <div className="feature-icon">
                🎒
              </div>

              <h3>
                Everything Included
              </h3>

              <p>
                Students receive the materials
                and resources needed to support
                their learning experience.
              </p>

              <div className="included-list">

                <span>
                  ✓ Scrubs
                </span>

                <span>
                  ✓ Textbook
                </span>

                <span>
                  ✓ Binder
                </span>

                <span>
                  ✓ Supplies
                </span>

              </div>

            </div>

          </Reveal>


          <Reveal>

            <div className="why-feature">

              <div className="feature-icon">
                💼
              </div>

              <h3>
                Career Support
              </h3>

              <p>
                Students can receive resume
                assistance and job placement
                support as they prepare for
                healthcare opportunities.
              </p>

              <div className="included-list">

                <span>
                  ✓ Resume help
                </span>

                <span>
                  ✓ Job placement support
                </span>

              </div>

            </div>

          </Reveal>


          <Reveal>

            <div className="why-feature">

              <div className="feature-icon">
                💳
              </div>

              <h3>
                Flexible Payments
              </h3>

              <p>
                We understand that investing
                in education is a big decision.
                Payment options can make it
                easier to plan for your training.
              </p>

              <div className="payment-highlight">

                <strong>
                  $700
                </strong>

                <span>
                  Deposit
                </span>

                <small>
                  Weekly or bi-weekly
                  payments available
                </small>

              </div>

            </div>

          </Reveal>

        </div>

      </section>


      <EnrollmentCTA />

    </>
  );
}


/* =========================================================
   ENROLLMENT
========================================================= */

function EnrollmentPage() {

  return (
    <>

      <PageHero
        eyebrow="Start Your Journey"
        title="Let's Build"
        accent="Your Future"
        text="Take the first step toward expanding your healthcare skills."
      />


      <section className="section enrollment-page">

        <div className="enrollment-grid">

          <Reveal>

            <div className="enrollment-info">

              <span className="eyebrow">
                Your Next Step
              </span>

              <h2>
                Ready to Begin?
              </h2>

              <p>
                Whether you are beginning your
                healthcare journey or adding new
                skills to your professional
                toolbox, Healing Hands Together
                is here to help.
              </p>


              <div className="enrollment-step">

                <span>
                  01
                </span>

                <div>

                  <h3>
                    Choose Your Training
                  </h3>

                  <p>
                    Explore our healthcare skills
                    programs.
                  </p>

                </div>

              </div>


              <div className="enrollment-step">

                <span>
                  02
                </span>

                <div>

                  <h3>
                    Connect With Us
                  </h3>

                  <p>
                    Reach out for enrollment
                    information and next steps.
                  </p>

                </div>

              </div>


              <div className="enrollment-step">

                <span>
                  03
                </span>

                <div>

                  <h3>
                    Start Learning
                  </h3>

                  <p>
                    Begin building practical
                    healthcare skills.
                  </p>

                </div>

              </div>

            </div>

          </Reveal>


          <Reveal>

            <div className="enrollment-card">

              <div className="enrollment-card-icon">
                🩷
              </div>

              <h2>
                Get Started
              </h2>

              <p>
                Enrollment information,
                upcoming classes, and payment
                options can be provided here.
              </p>


              <div className="price-box">

                <span>
                  Starting Deposit
                </span>

                <strong>
                  $700
                </strong>

                <small>
                  Weekly or bi-weekly
                  payment options available
                </small>

              </div>


              <button
                className="primary-button full-button"
                onClick={() =>
                  window.location.href =
                    "mailto:info@healinghandstogether.com"
                }
              >
                Contact Us
                <span>→</span>
              </button>

            </div>

          </Reveal>

        </div>

      </section>

    </>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return (
    <>

      <Navigation />

      <main>

        <Routes>

          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />

          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            }
          />

          <Route
            path="/programs"
            element={
              <PageTransition>
                <ProgramsPage />
              </PageTransition>
            }
          />

          <Route
            path="/programs/phlebotomy"
            element={
              <PageTransition>
                <ProgramDetailPage
                  programKey="phlebotomy"
                />
              </PageTransition>
            }
          />

          <Route
            path="/programs/ekg"
            element={
              <PageTransition>
                <ProgramDetailPage
                  programKey="ekg"
                />
              </PageTransition>
            }
          />

          <Route
            path="/programs/poct"
            element={
              <PageTransition>
                <ProgramDetailPage
                  programKey="poct"
                />
              </PageTransition>
            }
          />

          <Route
            path="/programs/blood-pressure"
            element={
              <PageTransition>
                <ProgramDetailPage
                  programKey="blood-pressure"
                />
              </PageTransition>
            }
          />

          <Route
            path="/why-choose-us"
            element={
              <PageTransition>
                <WhyChoosePage />
              </PageTransition>
            }
          />

          <Route
            path="/enrollment"
            element={
              <PageTransition>
                <EnrollmentPage />
              </PageTransition>
            }
          />

        </Routes>

      </main>


      <Footer />

      <MusicPlayer />

    </>
  );
}
