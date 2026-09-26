import { MapPin, Sparkles, Languages } from 'lucide-react'
import { motion } from 'framer-motion'

const HIGHLIGHTS = [
  { icon: MapPin, label: 'Chemnitz, Germany' },
  { icon: Sparkles, label: 'Open to Roles' },
  { icon: Languages, label: 'English, German B1' },
]

const Highlights = () => {
  return (
    <div className="flex flex-wrap gap-4 pt-4">
      {HIGHLIGHTS.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50"
        >
          <item.icon size={18} className="text-primary" />
          <span className="text-sm font-medium">{item.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default Highlights
