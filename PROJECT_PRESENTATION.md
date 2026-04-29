# The Ghost Cart: North Embedded Checkout Demo
*Hackathon Implementation: Redefining Service Payments*

---

## Slide 1: The Goal
**The Ghost Cart** is a hackathon project designed to showcase the power and simplicity of the new **North Embedded Checkout**.
- **The Mission:** Demonstrate how easy it is to implement a high-conversion payment flow.
- **The Prototype:** A mock "HVAC Dispatch Engine" that acts as a real-world wrapper for the API.

---

## Slide 2: Why "Ghost Cart"?
Traditional e-commerce uses "Carts" designed for products. Services don't need carts.
- **The Problem:** 70% of users drop off during multi-step checkout processes.
- **The Solution:** Eliminate the cart entirely. When a user is qualified for a service, the payment form *is* the next step, not a new page.

---

## Slide 3: Services vs. Products
This implementation is optimized for **Service-based businesses**:
- Emergency Dispatch, Consultations, and Digital Bookings.
- No "Add to Cart," no "View Cart," no "Proceed to Checkout."
- Just **Qualify** -> **Pay** -> **Confirm**.

---

## Slide 4: Extreme Ease of Implementation
Setting up the North Embedded Checkout was the fastest part of this project:
- **Developer Friendly:** The API logic is intuitive and requires minimal boilerplate.
- **Fast Setup:** We went from zero to a live, secure payment iFrame in minutes.
- **Embedded, Not Redirected:** No context-switching for the user.

---

## Slide 5: The "Aha!" Moment
How it works under the hood:
1. **Gatekeeper:** A simple Express backend validates the user's "Service Grid" (Zip Code).
2. **Session Creation:** One API call to North generates a secure token.
3. **Ghost Reveal:** The frontend mounts the North iFrame directly into the existing UI.
*Zero redirects. Zero friction.*

---

## Slide 6: Technical Core
- **Frontend:** React (TypeScript) + Vite.
- **Backend:** Node.js (Express) managing the North API Handshake.
- **UI:** Framer Motion providing the "Reveal" experience that makes the checkout feel native to the app.

---

## Slide 7: Conclusion
**North Embedded Checkout** is the future of service payments.
- **Useful:** Perfect for high-urgency services.
- **Simple:** Built by developers, for developers.
- **High Conversion:** The "Ghost Cart" ensures users stay focused on the solution, not the transaction.
