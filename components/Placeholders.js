export function Placeholders({number, loadingStyle}) {
  const rows = []
  for (let i = 0; i < number; i ++) {
    rows.push(
      <div
        className = {loadingStyle}
        key={i}
      />
    )
  }
  return rows
}