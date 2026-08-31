export default function Input({ label, hint, error, id, className = '', ...rest }) {
  const inputId = id || rest.name

  return (
    <div className="field">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={`input ${error ? 'input--error' : ''} ${className}`} {...rest} />
      {error ? <span className="error-text">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}
