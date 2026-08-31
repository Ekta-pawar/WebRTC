import { useEffect, useRef, useState } from 'react'

// Wraps the real browser getUserMedia API for the local "You" video tile.
// Remote participants are simulated (no signaling backend yet), but your
// own camera/mic preview is genuine WebRTC media capture.
export function useLocalMedia({ micEnabled, cameraEnabled }) {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    let activeStream
    let cancelled = false

    navigator.mediaDevices
      ?.getUserMedia({ audio: true, video: true })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        activeStream = s
        setStream(s)
      })
      .catch((err) => setError(err.message || 'Camera/microphone permission denied.'))

    return () => {
      cancelled = true
      activeStream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])

  useEffect(() => {
    stream?.getAudioTracks().forEach((t) => (t.enabled = micEnabled))
  }, [stream, micEnabled])

  useEffect(() => {
    stream?.getVideoTracks().forEach((t) => (t.enabled = cameraEnabled))
  }, [stream, cameraEnabled])

  return { stream, error, videoRef }
}
