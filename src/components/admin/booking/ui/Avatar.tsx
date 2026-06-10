interface AvatarProps {
  initials: string
  size?:    number
  color?:   string
}

export function Avatar({ initials, size = 32, color = "#b89a6a" }: AvatarProps) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{
        width:      size,
        height:     size,
        background: color,
        fontSize:   size * 0.35,
        fontFamily: "'Montserrat',sans-serif",
      }}
    >
      {initials}
    </div>
  )
}