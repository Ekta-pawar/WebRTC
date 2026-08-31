export default function Switch({ label, description, checked, onChange }) {
  return (
    <label className="switch-row">
      <span>
        <span className="switch-row__label">{label}</span>
        {description && <span className="switch-row__desc">{description}</span>}
      </span>
      <span className={`switch ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}>
        <span className="switch__thumb" />
      </span>
    </label>
  )
}
