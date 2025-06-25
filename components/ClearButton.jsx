//components/ClearButton

export default function ClearButton({onClick}) {
  return (
    <button type="button" className="btn btn-secondary rounded-full" onClick={onClick}>
      reset
      <span className="ml-2">🗑️</span>
      </button>
  )
}















