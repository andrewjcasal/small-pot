import { useState } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import './CustomOrders.css';

export default function CustomOrders() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactError, setContactError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get('email')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';

    if (!email && !phone) {
      setContactError(true);
      return;
    }

    setContactError(false);

    fetch('/custom-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
    })
      .then((response) => {
        if (response.ok) {
          setFormSubmitted(true);
        } else {
          console.error('Form submission failed:', response.status);
        }
      })
      .catch((error) => console.error('Form submission error:', error));
  };

  return (
    <div className="custom-orders-page">
      <div className="custom-orders-container">
        <div className="custom-orders-header">
          <h1>custom orders</h1>
          <p className="custom-orders-tagline">let's create something beautiful together</p>
        </div>

        {formSubmitted ? (
          <div className="success-message">
            <CheckCircle className="success-icon" />
            <h3>thank you!</h3>
            <p>your request has been submitted. i'll be in touch soon to discuss your project.</p>
          </div>
        ) : (
          <>
            <div className="form-intro">
              <Heart className="form-intro-icon" />
              <p>fill out the form below to tell me about your custom stained glass project. i'll get back to you within a few days.</p>
            </div>

            <form
              name="custom-request"
              method="POST"
              action="/custom-orders"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="request-form"
            >
              <input type="hidden" name="form-name" value="custom-request" />
              <p className="hidden">
                <label>
                  Don't fill this out: <input name="bot-field" />
                </label>
              </p>

              <div className="form-group">
                <label htmlFor="name">full name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="your name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>
              {contactError ? (
                <p className="form-error">please provide at least one contact method (email or phone).</p>
              ) : (
                <p className="form-hint">please provide at least one contact method.</p>
              )}

              <div className="form-group">
                <label htmlFor="description">project description *</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="tell me about your vision - size, colors, design ideas, where it will be displayed..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="delivery-date">preferred delivery date</label>
                <input
                  type="text"
                  id="delivery-date"
                  name="delivery-date"
                  placeholder="e.g., before december 2024, no rush, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="referral">how did you hear about me?</label>
                <input
                  type="text"
                  id="referral"
                  name="referral"
                  placeholder="instagram, friend, class, etc."
                />
              </div>

              <button type="submit" className="submit-button">
                submit request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
