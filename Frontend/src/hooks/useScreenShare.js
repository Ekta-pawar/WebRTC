import { useCallback, useRef, useState } from 'react'

// Wraps the real getDisplayMedia browser API for screen sharing.
export function useScreenShare({ onStart, onStop } = {}) {
  const [sharing, setSharing] = useState(false)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setSharing(true)
      onStart?.()

      // Stops the share if the user clicks the browser's native "Stop sharing" UI.
      stream.getVideoTracks()[0].addEventListener('ended', () => stop())
    } catch (err) {
      setError(err.message || 'Screen share was cancelled.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStart])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setSharing(false)
    onStop?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onStop])

  return { sharing, error, videoRef, start, stop }
}
