import { useCallback, useEffect, useRef, useState } from 'react'

// Wraps the real browser MediaRecorder API. Recording is intentionally
// independent from the AI pipeline — it captures the local stream only,
// with no dependency on whether Live AI Notes is running.
export function useMeetingRecorder(stream) {
  const [active, setActive] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const start = useCallback(() => {
    if (!stream || active) return
    chunksRef.current = []
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `webrtc-recording-${Date.now()}.webm`
      a.click()
      URL.revokeObjectURL(url)
    }
    recorder.start()
    recorderRef.current = recorder
    setSeconds(0)
    setActive(true)
  }, [stream, active])

  const stop = useCallback(() => {
    recorderRef.current?.stop()
    recorderRef.current = null
    setActive(false)
  }, [])

  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [active])

  return { active, seconds, start, stop }
}
