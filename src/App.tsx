import { BookingForm } from './BookingForm'
import { artists, gallery } from './content/site'
import './App.css'

const IG = 'https://www.instagram.com/fodeep760/'
const RIDE = 'https://music.apple.com/us/album/ride/1779505713?i=1779505715'
const NOVOCAINE = 'https://music.apple.com/us/album/novocaine/1867064043?i=1867064258'
const ARTIST = 'https://music.apple.com/us/artist/fodeep/1779200663'

function App() {
  return (
    <>
      <header className="nav">
        <a className="nav-brand" href="#top">
          <span className="script">Fo&apos; Deep</span>
        </a>
        <nav>
          <a href="#crew">Crew</a>
          <a href="#music">Music</a>
          <a href="#photos">Photos</a>
          <a href="#book">Book</a>
          <a href={IG} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-media">
            <img src="/photos/hero-group.jpg" alt="Fo' Deep walking in Oceanside, CA" />
            <div className="hero-overlay" />
          </div>
          <div className="hero-inner">
            <p className="eyebrow">Oceanside, CA · 760</p>
            <h1>
              F<span className="o">O</span>&apos; DEEP
            </h1>
            <p className="lede">
              West Coast hip-hop out of Oceanside. Stream the singles, meet the crew, lock a date.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#book">
                Book the group
              </a>
              <a className="btn ghost" href="#music">
                Listen
              </a>
            </div>
          </div>
        </section>

        <section id="crew" className="section crew">
          <div className="section-head">
            <p className="eyebrow">The 760</p>
            <h2>The Crew</h2>
          </div>
          <div className="crew-grid">
            {artists.map((member) => (
              <a
                key={member.handle}
                className="crew-card"
                href={member.ig}
                target="_blank"
                rel="noreferrer"
              >
                <div className="crew-photo">
                  <img src={member.photo} alt={member.name} />
                </div>
                <div className="crew-meta">
                  <h3>{member.name}</h3>
                  <p>@{member.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="music" className="section music">
          <div className="section-head">
            <p className="eyebrow">Singles</p>
            <h2>Listen</h2>
          </div>
          <div className="tracks">
            <article className="track">
              <a href={RIDE} target="_blank" rel="noreferrer">
                <img src="/photos/ride.jpg" alt="Ride — Fo'Deep" />
              </a>
              <div className="track-body">
                <h3>Ride</h3>
                <p>Single · 2024 · Fo&apos;Deep Records</p>
                <a className="text-link" href={RIDE} target="_blank" rel="noreferrer">
                  Open in Apple Music
                </a>
                <iframe
                  title="Ride on Apple Music"
                  allow="autoplay *; encrypted-media *; clipboard-write"
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                  src="https://embed.music.apple.com/us/album/ride/1779505713?i=1779505715"
                />
              </div>
            </article>
            <article className="track">
              <a href={NOVOCAINE} target="_blank" rel="noreferrer">
                <img src="/photos/novocaine.jpg" alt="Novocaine — Fo'Deep" />
              </a>
              <div className="track-body">
                <h3>Novocaine</h3>
                <p>Single · 2026 · Fo&apos;Deep Records</p>
                <a className="text-link" href={NOVOCAINE} target="_blank" rel="noreferrer">
                  Open in Apple Music
                </a>
                <iframe
                  title="Novocaine on Apple Music"
                  allow="autoplay *; encrypted-media *; clipboard-write"
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                  src="https://embed.music.apple.com/us/album/novocaine/1867064043?i=1867064258"
                />
              </div>
            </article>
          </div>
        </section>

        <section id="photos" className="section photos">
          <div className="section-head">
            <p className="eyebrow">From the 760</p>
            <h2>Photos</h2>
          </div>
          <div className="photo-grid">
            {gallery.map((shot) => (
              <figure key={shot.src} className={shot.wide ? 'wide' : undefined}>
                <img src={shot.src} alt={shot.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <section id="book" className="section book">
          <div className="section-head">
            <p className="eyebrow">Shows · sessions · events</p>
            <h2>Book Fo&apos; Deep</h2>
            <p className="lede">
              Oceanside-based. Tell us the date, the room, and what you need on stage.
            </p>
          </div>
          <BookingForm />
        </section>
      </main>

      <footer className="footer">
        <p className="script">Fo&apos; Deep</p>
        <p>Oceanside, California</p>
        <p className="footer-links">
          <a href={IG} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={ARTIST} target="_blank" rel="noreferrer">
            Apple Music
          </a>
          <a href={RIDE} target="_blank" rel="noreferrer">
            Ride
          </a>
          <a href={NOVOCAINE} target="_blank" rel="noreferrer">
            Novocaine
          </a>
        </p>
      </footer>
    </>
  )
}

export default App
