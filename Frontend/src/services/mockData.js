// Static/fake data used by the mock service layer (services/*.js).
// Swap these out once a real REST API exists — the function signatures
// in auth.js / meeting.js / notes.js are written to match a real contract.

export const mockUser = {
  id: 'u_1001',
  name: 'Ekta Sharma',
  email: 'ekta@example.com',
  avatarColor: '#1552e8',
  role: 'Product Engineer',
  timezone: 'Asia/Kolkata',
}

export const mockUpcomingMeetings = [
  {
    id: 'mtg_2001',
    title: 'Backend Discussion',
    description: 'Sync on the payments service API contract.',
    date: new Date().toISOString().slice(0, 10),
    time: '14:00',
    duration: 30,
    host: 'Ekta Sharma',
    status: 'confirmed',
    code: 'BKD-772-QXR',
  },
  {
    id: 'mtg_2002',
    title: 'Team Meeting',
    description: 'Weekly stand-up and sprint planning.',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: '11:00',
    duration: 45,
    host: 'Rahul Verma',
    status: 'confirmed',
    code: 'TMW-113-PLN',
  },
  {
    id: 'mtg_2003',
    title: 'Design Review',
    description: 'Walkthrough of the new onboarding flow.',
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    time: '16:30',
    duration: 60,
    host: 'Priya Nair',
    status: 'pending',
    code: 'DSR-908-VWX',
  },
]

export const mockPreviousMeetings = [
  {
    id: 'mtg_1001',
    title: 'Project Discussion',
    date: '2026-08-31',
    duration: 45,
    participants: ['Ekta Sharma', 'Rahul Verma', 'Priya Nair'],
    hasNotes: true,
    hasTranscript: true,
  },
  {
    id: 'mtg_1002',
    title: 'Client Onboarding Call',
    date: '2026-08-27',
    duration: 32,
    participants: ['Ekta Sharma', 'Amit Kulkarni'],
    hasNotes: true,
    hasTranscript: true,
  },
  {
    id: 'mtg_1003',
    title: 'Sprint Retrospective',
    date: '2026-08-21',
    duration: 50,
    participants: ['Ekta Sharma', 'Rahul Verma', 'Priya Nair', 'Amit Kulkarni'],
    hasNotes: true,
    hasTranscript: false,
  },
]

export const mockNotes = [
  {
    id: 'note_1',
    meetingId: 'mtg_1001',
    title: 'Project Discussion',
    date: '2026-08-31',
    summary:
      'Team aligned on shipping the payment integration this week and confirmed Friday as the deployment date.',
    topics: ['Payment integration', 'Deployment pipeline', 'QA coverage'],
    decisions: ['Deploy to production on Friday', 'Use staged rollout for payments'],
    actionItems: [
      { id: 'ai_1', assignee: 'Priya', text: 'Test payment flow end-to-end', due: 'Friday', done: false },
      { id: 'ai_2', assignee: 'Rahul', text: 'Prepare deployment checklist', due: 'Thursday', done: true },
    ],
    questions: ['Which server handles the deployment?'],
    transcript: [
      { id: 't1', speaker: 'Rahul', time: '10:31', text: 'We should deploy Friday if QA signs off.' },
      { id: 't2', speaker: 'Priya', time: '10:32', text: 'Payment testing is almost finished, I can wrap it up tomorrow.' },
      { id: 't3', speaker: 'Ekta', time: '10:33', text: 'Sounds good, let’s lock Friday as the release date.' },
    ],
  },
  {
    id: 'note_2',
    meetingId: 'mtg_1002',
    title: 'Client Onboarding Call',
    date: '2026-08-27',
    summary: 'Walked the client through initial setup; follow-up demo scheduled for next week.',
    topics: ['Account setup', 'Data migration'],
    decisions: ['Schedule follow-up demo next Tuesday'],
    actionItems: [
      { id: 'ai_3', assignee: 'Ekta', text: 'Send migration checklist to client', due: 'Monday', done: false },
    ],
    questions: [],
    transcript: [
      { id: 't4', speaker: 'Amit', time: '09:02', text: 'Can you walk us through the import process?' },
      { id: 't5', speaker: 'Ekta', time: '09:03', text: 'Sure, it starts with the CSV upload screen.' },
    ],
  },
  {
    id: 'note_3',
    meetingId: 'mtg_1003',
    title: 'Sprint Retrospective',
    date: '2026-08-21',
    summary: 'Discussed velocity dips and agreed to reduce in-flight work-in-progress limits.',
    topics: ['Sprint velocity', 'WIP limits'],
    decisions: ['Lower WIP limit to 3 per engineer'],
    actionItems: [
      { id: 'ai_4', assignee: 'Rahul', text: 'Update board WIP limits', due: 'Monday', done: true },
    ],
    questions: ['Should QA have its own WIP limit?'],
    transcript: [],
  },
]

export const mockParticipants = [
  { id: 'p_you', name: 'You', isYou: true, isHost: true, micOn: true, cameraOn: true, color: '#1552e8' },
  { id: 'p_rahul', name: 'Rahul', isYou: false, isHost: false, micOn: true, cameraOn: true, color: '#0ea5e9' },
  { id: 'p_priya', name: 'Priya', isYou: false, isHost: false, micOn: false, cameraOn: true, color: '#178a4c' },
  { id: 'p_amit', name: 'Amit', isYou: false, isHost: false, micOn: true, cameraOn: false, color: '#b5760a' },
]

export const mockChatSeed = [
  { id: 'c1', author: 'Rahul', text: 'Hello everyone', time: '10:30' },
  { id: 'c2', author: 'Priya', text: 'Hi! Just joined.', time: '10:30' },
]

export const mockChatAutoReplies = [
  { author: 'Rahul', text: 'Sounds good to me.' },
  { author: 'Priya', text: 'I’ll share the doc in a bit.' },
  { author: 'Amit', text: 'Can everyone hear me okay?' },
]

// Scripted "live meeting" script that drives the live AI notes + transcript
// simulation in useAiAssistant. Each entry fires `delay` ms after the
// previous one. `note` (optional) is what the AI derives from that line.
export const meetingScript = [
  {
    delay: 1800,
    speaker: 'Rahul',
    text: 'Let’s get started — first topic is payment integration status.',
    note: { type: 'topic', value: 'Payment integration' },
  },
  {
    delay: 4200,
    speaker: 'Priya',
    text: 'Payment testing is almost finished, should be done by tomorrow.',
    note: { type: 'topic', value: 'QA testing' },
  },
  {
    delay: 4600,
    speaker: 'Rahul',
    text: 'Great. Let’s deploy on Friday then.',
    note: { type: 'decision', value: 'Deploy on Friday' },
  },
  {
    delay: 5200,
    speaker: 'Ekta',
    text: 'Priya, can you test the payment system end-to-end before Friday?',
    note: { type: 'actionItem', assignee: 'Priya', value: 'Test payment system', due: 'Friday' },
  },
  {
    delay: 5000,
    speaker: 'Amit',
    text: 'Quick question — which server handles the deployment?',
    note: { type: 'question', value: 'Which server handles the deployment?' },
  },
  {
    delay: 5600,
    speaker: 'Rahul',
    text: 'We’ll use the staging cluster, I’ll confirm the exact node.',
    note: { type: 'topic', value: 'Deployment infrastructure' },
  },
  {
    delay: 5400,
    speaker: 'Priya',
    text: 'I’ll also prepare a rollback plan just in case.',
    note: { type: 'actionItem', assignee: 'Priya', value: 'Prepare rollback plan', due: 'Friday' },
  },
]
