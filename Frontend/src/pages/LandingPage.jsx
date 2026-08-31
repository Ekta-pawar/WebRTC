import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '../components/ui/Button.jsx'
import '../styles/landing.css'

const features = [
  { icon: '🎥', title: 'Crystal-clear meetings', desc: 'Reliable, low-latency video and audio powered by WebRTC.' },
  { icon: '✨', title: 'Live AI meeting notes', desc: 'Topics, decisions and action items appear while you talk — no waiting for a summary.' },
  { icon: '🖥️', title: 'Share, chat, record', desc: 'Screen sharing, in-call chat and recording, built right into the room.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)

  const handleStartMeeting = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login')
  }

  return (
    <div>
      <nav className="landing-nav">
        <div className="brand">
          <span className="brand__mark">N</span>
          Nexus
        </div>
        <div className="landing-nav__actions">
          {isAuthenticated ? (
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">Login</Button>
              <Button as={Link} to="/register" variant="primary" size="sm">Get Started</Button>
            </>
          )}
        </div>
      </nav>

      <section className="landing-hero">
        <span className="landing-hero__eyebrow">SMART VIDEO MEETINGS</span>
        <h1>Meet. Collaborate. Let AI take the notes.</h1>
        <p>
          Nexus brings crystal-clear video calls together with a live AI assistant that quietly captures
          topics, decisions and action items as your meeting happens.
        </p>
        <div className="landing-hero__actions">
          <Button variant="primary" block onClick={handleStartMeeting}>Start Meeting</Button>
          <Button as={Link} to="/join" variant="outline" block>Join Meeting</Button>
        </div>
        <div className="landing-hero__tags">
          <span>WebRTC</span>
          <span>•</span>
          <span>Live AI</span>
          <span>•</span>
          <span>Real-time</span>
        </div>
      </section>

      <div className="landing-preview">
        <div className="landing-preview__frame">
          <div className="landing-preview__grid">
            <div className="landing-preview__tile">Rahul</div>
            <div className="landing-preview__tile">Priya</div>
            <div className="landing-preview__tile">You</div>
            <div className="landing-preview__tile">Amit</div>
          </div>
        </div>
      </div>

      <section className="landing-features">
        {features.map((f) => (
          <div className="landing-feature" key={f.title}>
            <div className="landing-feature__icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer">© {new Date().getFullYear()} Nexus. All rights reserved.</footer>
    </div>
  )
}
