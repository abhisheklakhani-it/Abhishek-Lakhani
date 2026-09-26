import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  as?: 'button' | 'div'
}

const MagneticButton = ({
  children,
  className,
  strength = 0.35,
  onClick,
  as = 'div',
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    setOffset({ x: x * strength, y: y * strength })
  }

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 })

  const Tag = as

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.2 }}
      className={cn('inline-block', className)}
    >
      <Tag>{children}</Tag>
    </motion.div>
  )
}

export default MagneticButton
