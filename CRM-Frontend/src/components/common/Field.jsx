function Field({ label, placeholder, type = 'text', value, onChange, name, required = false }) {
  return (
    <label className="inputGroup">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        required={required}
      />
    </label>
  )
}

export default Field
