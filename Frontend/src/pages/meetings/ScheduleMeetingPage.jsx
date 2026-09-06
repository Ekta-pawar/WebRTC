import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiFileText, FiCalendar, FiLock, FiVideo, FiMicOff, FiUserCheck } from 'react-icons/fi'
import { MdOutlineTimer } from 'react-icons/md'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Switch from '../../components/ui/Switch.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { scheduleMeeting, updateMeeting, getMeetingById } from '../../services/meeting.js'
import { formatDateLabel, formatTimeLabel, formatDuration } from '../../utils/formatDate.js'
import { notifySuccess } from '../../utils/toast.jsx'
import '../../styles/schedule.css'

const TEXTAREA_STYLE = { minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }
const DURATIONS = [15, 30, 45, 60, 90]
const DESCRIPTION_MAX = 300

export default function ScheduleMeetingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState({ title: '', date: '', time: '', description: '', duration: 30 })
  const [security, setSecurity] = useState({ requirePasscode: false, waitingRoom: true })
  const [videoOptions, setVideoOptions] = useState({ hostVideoOn: true, participantVideoOn: false, muteOnEntry: true })
  const [passcode] = useState(() => String(Math.floor(100000 + Math.random() * 900000)))

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!editId) return
    getMeetingById(editId).then((m) =>
      setForm({
        title: m.title || '',
        date: m.date || '',
        time: m.time || '',
        description: m.description || '',
        duration: m.duration || 30,
      })
    )
  }, [editId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Give your meeting a title.'
    if (!form.date) errs.date = 'Pick a date.'
    if (!form.time) errs.time = 'Pick a time.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    setFormError('')
    try {
      const payload = { ...form, options: { ...security, ...videoOptions } }
      if (editId) {
        await updateMeeting(editId, payload)
        notifySuccess('Meeting updated.')
      } else {
        await scheduleMeeting(payload)
        notifySuccess('Meeting scheduled.')
      }
      navigate('/upcoming')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const hasWhen = form.date && form.time

  return (
    <div className="schedule-layout">
      <form className="schedule-form" onSubmit={handleSubmit} noValidate>
        {formError && <div className="form-error-banner">{formError}</div>}

        <section className="schedule-section">
          <div className="schedule-section__title">
            <span className="schedule-section__title-icon"><FiFileText /></span>
            Meeting Details
          </div>
          <Input
            label="Meeting Title"
            name="title"
            placeholder="e.g. Backend Discussion"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="input"
              style={TEXTAREA_STYLE}
              placeholder="What's this meeting about?"
              value={form.description}
              maxLength={DESCRIPTION_MAX}
              onChange={handleChange}
            />
            <div className="field-counter">{form.description.length}/{DESCRIPTION_MAX}</div>
          </div>
        </section>

        <section className="schedule-section">
          <div className="schedule-section__title">
            <span className="schedule-section__title-icon"><FiCalendar /></span>
            Date &amp; Time
          </div>
          <div className="schedule-row">
            <Input label="Date" type="date" name="date" value={form.date} onChange={handleChange} error={errors.date} />
            <Input label="Time" type="time" name="time" value={form.time} onChange={handleChange} error={errors.time} />
          </div>
          <div className="field">
            <label>Duration</label>
            <div className="duration-chips">
              {DURATIONS.map((mins) => (
                <button
                  type="button"
                  key={mins}
                  className={`duration-chip ${form.duration === mins ? 'is-active' : ''}`}
                  onClick={() => setForm({ ...form, duration: mins })}
                >
                  {formatDuration(mins)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="schedule-section">
          <div className="schedule-section__title">
            <span className="schedule-section__title-icon"><FiLock /></span>
            Security
          </div>
          <Switch
            label="Require meeting passcode"
            description="Participants need a passcode to join"
            checked={security.requirePasscode}
            onChange={(v) => setSecurity({ ...security, requirePasscode: v })}
          />
          {security.requirePasscode && (
            <div className="passcode-reveal">
              <span className="passcode-reveal__code">{passcode}</span>
              <span className="passcode-reveal__hint">Shared automatically with invited guests</span>
            </div>
          )}
          <hr className="settings-divider" />
          <Switch
            label="Enable waiting room"
            description="Approve participants before they can join"
            checked={security.waitingRoom}
            onChange={(v) => setSecurity({ ...security, waitingRoom: v })}
          />
        </section>

        <section className="schedule-section">
          <div className="schedule-section__title">
            <span className="schedule-section__title-icon"><FiVideo /></span>
            Video &amp; Audio
          </div>
          <Switch
            label="Host video on entry"
            checked={videoOptions.hostVideoOn}
            onChange={(v) => setVideoOptions({ ...videoOptions, hostVideoOn: v })}
          />
          <hr className="settings-divider" />
          <Switch
            label="Participant video on entry"
            checked={videoOptions.participantVideoOn}
            onChange={(v) => setVideoOptions({ ...videoOptions, participantVideoOn: v })}
          />
          <hr className="settings-divider" />
          <Switch
            label="Mute participants on entry"
            checked={videoOptions.muteOnEntry}
            onChange={(v) => setVideoOptions({ ...videoOptions, muteOnEntry: v })}
          />
        </section>

        <Button type="submit" variant="primary" block loading={submitting}>
          {editId ? 'Save Changes' : 'Schedule Meeting'}
        </Button>
      </form>

      <aside className="schedule-summary">
        <div className="schedule-summary__title">Preview</div>
        <div className={`schedule-summary__topic ${!form.title.trim() ? 'schedule-summary__topic--placeholder' : ''}`}>
          {form.title.trim() || 'Untitled meeting'}
        </div>

        <div className="schedule-summary__row">
          <FiCalendar /> {hasWhen ? `${formatDateLabel(form.date)} · ${formatTimeLabel(form.time)}` : 'Pick a date & time'}
        </div>
        <div className="schedule-summary__row"><MdOutlineTimer /> {formatDuration(form.duration)}</div>

        <hr className="schedule-summary__divider" />

        <div className="schedule-summary__badges">
          {security.requirePasscode && <Badge variant="primary"><FiLock /> Passcode</Badge>}
          {security.waitingRoom && <Badge variant="neutral"><FiUserCheck /> Waiting Room</Badge>}
          {videoOptions.muteOnEntry && <Badge variant="neutral"><FiMicOff /> Muted on entry</Badge>}
          {videoOptions.hostVideoOn && <Badge variant="success"><FiVideo /> Host video on</Badge>}
        </div>
      </aside>
    </div>
  )
}
