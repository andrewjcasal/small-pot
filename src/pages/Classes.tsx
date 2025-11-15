import { GraduationCap, Calendar, Clock, Users } from 'lucide-react';
import './Classes.css';

export default function Classes() {
  return (
    <div className="classes">
      <section className="classes-hero">
        <h1>Classes & Workshops</h1>
        <p className="subtitle">Learn the art of stained glass in our hands-on studio</p>
      </section>

      <section className="classes-content">
        <div className="workshop-overview">
          <div className="class-card main-workshop">
            <div className="class-header">
              <h2>Beginner Workshop</h2>
              <span className="class-level">Beginner Friendly</span>
            </div>
            <div className="class-details">
              <div className="class-detail">
                <Clock className="detail-icon" />
                <span>6 hours total (2 sessions)</span>
              </div>
              <div className="class-detail">
                <Users className="detail-icon" />
                <span>Max 6 students</span>
              </div>
            </div>
            <p>
              Perfect for first-time students. Learn essential stained glass techniques
              while creating your own stained glass piece. No experience necessary. All materials and tools are provided.
            </p>

            <div className="skills-section">
              <h3>Skills You'll Learn</h3>
              <ul className="skills-list">
                <li>Cutting</li>
                <li>Grinding</li>
                <li>Taping</li>
                <li>Soldering</li>
                <li>Polishing</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="upcoming-sessions">
          <h2>
            <Calendar className="section-icon" />
            Upcoming Sessions
          </h2>

          <div className="sessions-list">
            <div className="session-item">
              <div className="session-date">
                <span className="month">November</span>
                <span className="day">8</span>
              </div>
              <div className="session-info">
                <h3>Acorn Design</h3>
                <div className="session-details">
                  <Clock className="detail-icon" />
                  <span>6:00 PM - 9:00 PM</span>
                </div>
                <p>Create a beautiful autumn-themed acorn stained glass piece</p>
              </div>
              <button>Register</button>
            </div>

            <div className="session-item">
              <div className="session-date">
                <span className="month">December</span>
                <span className="day">5</span>
              </div>
              <div className="session-info">
                <h3>Snowflake Design</h3>
                <div className="session-details">
                  <Clock className="detail-icon" />
                  <span>1:00 PM - 4:00 PM</span>
                </div>
                <p>Craft an elegant winter snowflake ornament perfect for the holidays</p>
              </div>
              <button>Register</button>
            </div>

            <div className="session-item">
              <div className="session-date">
                <span className="month">December</span>
                <span className="day">13</span>
              </div>
              <div className="session-info">
                <h3>Snowflake Design</h3>
                <div className="session-details">
                  <Clock className="detail-icon" />
                  <span>1:00 PM - 4:00 PM</span>
                </div>
                <p>Craft an elegant winter snowflake ornament perfect for the holidays</p>
              </div>
              <button>Register</button>
            </div>
          </div>
        </div>

        <div className="class-info-section">
          <h2>
            <GraduationCap className="section-icon" />
            What to Expect
          </h2>
          <div className="info-grid">
            <div className="info-card">
              <h4>All Materials Included</h4>
              <p>Glass, tools, safety equipment, and supplies are provided for all classes</p>
            </div>
            <div className="info-card">
              <h4>Small Class Sizes</h4>
              <p>Limited enrollment ensures personalized attention and guidance</p>
            </div>
            <div className="info-card">
              <h4>Take Home Your Work</h4>
              <p>Every student completes and takes home their finished piece</p>
            </div>
            <div className="info-card">
              <h4>Safe Environment</h4>
              <p>Comprehensive safety instruction and well-maintained equipment</p>
            </div>
          </div>
        </div>

        <div className="registration-cta">
          <h3>Ready to Get Started?</h3>
          <p>Contact us to learn about upcoming class dates and registration</p>
          <button>Contact Us</button>
        </div>
      </section>
    </div>
  );
}
