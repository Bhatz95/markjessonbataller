/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

  menuBtn.addEventListener("click", () => {

    const open = navLinks.classList.toggle("open");

    menuBtn.setAttribute(
      "aria-expanded",
      String(open)
    );

  });


  document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("open");

      menuBtn.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}


/* =========================================
   FOOTER YEAR
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   INQUIRY FORM
========================================= */

const form = document.getElementById("leadForm");

const generated = document.getElementById("generated");

const generatedText =
  document.getElementById("generatedText");

const copyBtn =
  document.getElementById("copyBtn");

const submitStatus =
  document.getElementById("submitStatus");

const submitBtn =
  document.getElementById("submitBtn");


/* =========================================
   N8N WEBHOOK
========================================= */

const inquiryWebhookUrl =
  "https://bhatzn8n.bhatz.site/webhook/mark-jesson-bataller-website-inquiry";


/* =========================================
   FORM SUBMISSION
========================================= */

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();


    /* -----------------------------------------
       GET FORM VALUES
    ----------------------------------------- */

    const name =
      document.getElementById("name")
        .value
        .trim();

    const email =
      document.getElementById("email")
        .value
        .trim();

    const phone =
      document.getElementById("phone")
        .value
        .trim();

    const preferredContact =
      document.getElementById("preferredContact")
        .value
        .trim();

    const country =
      document.getElementById("country")
        .value
        .trim();

    const location =
      document.getElementById("location")
        .value
        .trim();

    const budget =
      document.getElementById("budget")
        .value
        .trim();

    const message =
      document.getElementById("message")
        .value
        .trim();

    const consent =
      document.getElementById("consent")
        .checked;


    /* -----------------------------------------
       BASIC VALIDATION
    ----------------------------------------- */

    if (!name) {

      submitStatus.textContent =
        "Please enter your name.";

      submitStatus.dataset.state =
        "error";

      document.getElementById("name").focus();

      return;
    }


    if (!email && !phone) {

      submitStatus.textContent =
        "Please provide at least an email address or mobile/WhatsApp/Viber number.";

      submitStatus.dataset.state =
        "error";

      document.getElementById("email").focus();

      return;
    }


    if (!consent) {

      submitStatus.textContent =
        "Please agree to the Privacy Policy before sending your inquiry.";

      submitStatus.dataset.state =
        "error";

      document.getElementById("consent").focus();

      return;
    }


    /* -----------------------------------------
       DEFAULT MESSAGE
    ----------------------------------------- */

    const needs =
      message ||
      "I'd like to know more about available house & lot options.";


    /* -----------------------------------------
       GENERATE MESSAGE
    ----------------------------------------- */

    const text =
`Hi Mark!

My name is ${name || "—"}.

Email: ${email || "—"}

Mobile / WhatsApp / Viber: ${phone || "—"}

Preferred contact method: ${preferredContact || "—"}

I am currently based in ${country || "—"}.

Preferred Philippine location: ${location || "—"}.

Budget / payment preference: ${budget || "—"}.

What I'm looking for:
${needs}

Please send me available options and the next steps.

Thank you!`;


    /* -----------------------------------------
       DISPLAY GENERATED MESSAGE
    ----------------------------------------- */

    generatedText.textContent =
      text;

    generated.hidden =
      false;

    generated.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });


    /* -----------------------------------------
       DATA FOR N8N
    ----------------------------------------- */

      const payload = {
    yourName: name,
    emailAddress: email,
    phoneNumber: phone,
    mobileWhatsappViber: phone,
    preferredContactMethod: preferredContact,
    contactInfo: phone || email,
    currentLocation: country,
    preferredPhilippineLocation: location,
    budgetPaymentPreference: budget,
    tellMeWhatYouNeed: needs,
    privacyConsent: consent,
    source: "Mark Jesson Bataller Website",
    pageUrl: window.location.href,
    submittedAt: new Date().toISOString()
  };


    /* -----------------------------------------
       UI: SENDING
    ----------------------------------------- */

    submitStatus.textContent =
      "Sending your inquiry…";

    submitStatus.dataset.state =
      "pending";

    submitBtn.disabled =
      true;

    submitBtn.textContent =
      "Sending inquiry…";


    /* -----------------------------------------
       SEND TO N8N
    ----------------------------------------- */

    try {

      const response =
        await fetch(
          inquiryWebhookUrl,
          {
            method:"POST",

            headers:{
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(payload)
          }
        );


      /* ---------------------------------------
         TRY TO READ RESPONSE
      --------------------------------------- */

      let result = {};

      const responseText =
        await response.text();


      if (responseText) {

        try {

          result =
            JSON.parse(responseText);

        } catch {

          result = {};

        }

      }


      /* ---------------------------------------
         CHECK RESPONSE
      --------------------------------------- */

      if (!response.ok) {

        throw new Error(
          result.message ||
          "Your inquiry could not be sent. Please try again."
        );

      }


      /* ---------------------------------------
         SUCCESS
      --------------------------------------- */

      submitStatus.textContent =
        result.message ||
        "Your inquiry has been sent successfully. Thank you!";

      submitStatus.dataset.state =
        "success";


      /* Reset form after successful submission */

      form.reset();


    } catch (error) {

      console.error(
        "Inquiry submission error:",
        error
      );


      submitStatus.textContent =
        error.message ||
        "There was a problem sending your inquiry. Please try again.";

      submitStatus.dataset.state =
        "error";


    } finally {

      submitBtn.disabled =
        false;

      submitBtn.textContent =
        "Send My Inquiry";

    }

  });

}


/* =========================================
   COPY GENERATED MESSAGE
========================================= */

if (copyBtn) {

  copyBtn.addEventListener(
    "click",
    async () => {

      try {

        await navigator.clipboard.writeText(
          generatedText.textContent
        );

        copyBtn.textContent =
          "Copied!";


        setTimeout(() => {

          copyBtn.textContent =
            "Copy message";

        }, 1600);


      } catch {

        copyBtn.textContent =
          "Select & copy manually";

      }

    }
  );

}
