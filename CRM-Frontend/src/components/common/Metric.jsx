function Metric({ title, value, change }) {
  return (
    <div className="metric">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{change}</small>
    </div>
  )
}

export default Metric
