import { Mail, Send } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  return (
    <div className="contact">
      <section className="contact-hero">
        <h1>Get In Touch</h1>
        <p className="subtitle">Questions about custom work or classes?</p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-group">
            <div className="info-item">
              <Mail className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>oursmallpot@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <p>
            Interested in a custom commission or have questions about our work?
            We'd love to hear from you.
          </p>

          <div className="contact-form-placeholder">
            <Send className="form-icon" />
            <h3>Contact Form</h3>
            <p>Form fields will go here</p>
            <button>Send Message</button>
          </div>
        </div>
      </section>
    </div>
  );
}
