import { useState, type FormEvent } from 'react'

const ACCESS_KEY = import.meta.env.VITE_FORM_ACCESS_KEY as string | undefined

type Status = 'idle' | 'sending' | 'success' | 'error' | 'unconfigured'

export function BookingForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (String(data.get('company')).trim()) {
      setStatus('success')
      return
    }

    if (!ACCESS_KEY) {
      setStatus('unconfigured')
      return
    }

    setStatus('sending')
    setError('')

    const payload = {
      access_key: ACCESS_KEY,
      subject: "Fo' Deep booking request",
      from_name: String(data.get('name') ?? ''),
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      event_type: String(data.get('eventType') ?? ''),
      event_date: String(data.get('date') ?? ''),
      venue: String(data.get('venue') ?? ''),
      message: String(data.get('message') ?? ''),
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as { success?: boolean; message?: string }
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not send booking request.')
      }
      form.reset()
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send booking request.')
      setStatus('error')
    }
  }

  return (
    <form className="book-form" onSubmit={onSubmit}>
      <div className="honeypot" hidden aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label>
        Name
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label>
        Event type
        <select name="eventType" required defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option>Club / venue</option>
          <option>Festival</option>
          <option>Private party</option>
          <option>College / school</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Date
        <input name="date" type="date" />
      </label>
      <label>
        City / venue
        <input name="venue" type="text" placeholder="Oceanside, CA" />
      </label>
      <label className="full">
        Message
        <textarea name="message" rows={5} required placeholder="Set length, crowd, budget…" />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send booking request'}
        </button>
      </div>

      {status === 'success' && (
        <p className="form-note ok" role="status">
          Request sent. Fo&apos; Deep will get back to you.
        </p>
      )}
      {status === 'unconfigured' && (
        <p className="form-note" role="status">
          Booking inbox is not connected yet. DM{' '}
          <a href="https://www.instagram.com/fodeep760/" target="_blank" rel="noreferrer">
            @fodeep760
          </a>{' '}
          on Instagram for now.
        </p>
      )}
      {status === 'error' && (
        <p className="form-note err" role="alert">
          {error} You can also DM{' '}
          <a href="https://www.instagram.com/fodeep760/" target="_blank" rel="noreferrer">
            @fodeep760
          </a>
          .
        </p>
      )}
    </form>
  )
}
