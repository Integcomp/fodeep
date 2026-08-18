import { BookingForm } from './BookingForm'
import './App.css'

const IG = 'https://www.instagram.com/fodeep760/'
const RIDE = 'https://music.apple.com/us/album/ride/1779505713?i=1779505715'
const NOVOCAINE = 'https://music.apple.com/us/album/novocaine/1867064043?i=1867064258'
const ARTIST = 'https://music.apple.com/us/artist/fodeep/1779200663'

const gallery = [
  { src: '/photos/gallery-studio.jpg', alt: "Fo' Deep studio portrait", className: 'wide' },
  { src: '/photos/gallery-live.jpg', alt: "Fo' Deep live on stage" },
  { src: '/photos/crop-flyer-group.jpg', alt: "Fo' Deep concert flyer" },
  { src: '/photos/gallery-crew.jpg', alt: "Fo' Deep crew" },
  { src: '/photos/gallery-novocaine.jpg', alt: 'Novocaine promo art' },
  { src: '/photos/gallery-outdoors.jpg', alt: "Fo' Deep outdoors" },
  { src: '/photos/gallery-token.jpg', alt: "Fo' Deep — Token" },
  { src: '/photos/gallery-flyer.jpg', alt: 'Fo Deep Concert flyer' },
]

function App() {
  return (
    <>
      <header className="nav">
        <a className="nav-brand" href="#top">
          <img src="/photos/cutout-profile.png" alt="" width={36} height={36} />
          <span className="script">Fo&apos; Deep</span>
        </a>
        <nav>
          <a href="#music">Music</a>
          <a href="#gallery">Gallery</a>
          <a href="#book">Book</a>
          <a href={IG} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <img src="/photos/crop-live.jpg" alt="" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Oceanside, CA · 760</p>
            <h1>
              F<span className="o">O</span>&apos; DEEP
            </h1>
            <p className="lede">
              West Coast hip-hop from Oceanside. Catch the singles, then lock a date.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#book">
                Book the group
              </a>
              <a className="btn ghost" href="#music">
                Listen
              </a>
            </div>
            <p className="crew">
              <a href="https://www.instagram.com/scurvy._.dogg/" target="_blank" rel="noreferrer">
                @scurvy._.dogg
              </a>
              <a href="https://www.instagram.com/doctorleyva/" target="_blank" rel="noreferrer">
                @doctorleyva
              </a>
              <a href="https://www.instagram.com/mike.new.760/" target="_blank" rel="noreferrer">
                @mike.new.760
              </a>
              <a href="https://www.instagram.com/jsmoke760/" target="_blank" rel="noreferrer">
                @jsmoke760
              </a>
            </p>
          </div>
          <div className="hero-art">
            <img src="/photos/cutout-outdoors.png" alt="Fo' Deep" />
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

        <section id="gallery" className="section gallery">
          <div className="section-head">
            <p className="eyebrow">From the 760</p>
            <h2>Gallery</h2>
          </div>
          <div className="grid">
            {gallery.map((shot) => (
              <figure key={shot.src} className={shot.className}>
                <img src={shot.src} alt={shot.alt} />
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
