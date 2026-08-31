import { useState } from 'react'
import AiNotesPanel from './AiNotesPanel.jsx'
import TranscriptPanel from './TranscriptPanel.jsx'

export default function AiPanel({ status, notes, transcript, onStart, onStop, onRetry }) {
  const [tab, setTab] = useState('notes')

  return (
    <div className="ai-panel-wrap">
      <div className="ai-panel-tabs">
        <button className={tab === 'notes' ? 'is-active' : ''} onClick={() => setTab('notes')}>Live Notes</button>
        <button className={tab === 'transcript' ? 'is-active' : ''} onClick={() => setTab('transcript')}>Transcript</button>
      </div>

      {tab === 'notes' ? (
        <AiNotesPanel status={status} notes={notes} onStart={onStart} onStop={onStop} onRetry={onRetry} />
      ) : (
        <TranscriptPanel lines={transcript} />
      )}
    </div>
  )
}
