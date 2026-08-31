import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import { scheduleMeeting, updateMeeting, getMeetingById } from '../../services/meeting.js'

const TEXTAREA_STYLE = { minHeight: 96, resize: 'vertical', fontFamily: 'inherit' }

export default function ScheduleMeetingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState({ title: '', date: '', time: '', description: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!editId) return
    getMeetingById(editId).then((m) =>
      setForm({ title: m.title || '', date: m.date || '', time: m.time || '', description: m.description || '' })
    )
  }, [editId])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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
      if (editId) {
        await updateMeeting(editId, form)
      } else {
        await scheduleMeeting(form)
      }
      navigate('/upcoming')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      {formError && <div className="form-error-banner" style={{ marginBottom: 14 }}>{formError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Meeting Title"
          name="title"
          placeholder="e.g. Backend Discussion"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
        />
        <Input label="Date" type="date" name="date" value={form.date} onChange={handleChange} error={errors.date} />
        <Input label="Time" type="time" name="time" value={form.time} onChange={handleChange} error={errors.time} />

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="input"
            style={TEXTAREA_STYLE}
            placeholder="What’s this meeting about?"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" variant="primary" block loading={submitting}>
          {editId ? 'Save Changes' : 'Schedule Meeting'}
        </Button>
      </form>
    </div>
  )
}
