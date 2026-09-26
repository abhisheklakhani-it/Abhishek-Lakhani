import { motion } from 'framer-motion'
import { Globe, Calendar, Heart } from 'lucide-react'

const ITEMS = [
  {
    icon: Globe,
    title: 'Erasmus+ Youth Exchange',
    description:
      'Co-created a board game promoting gender equality during a youth exchange program in France.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Calendar,
    title: 'Event Organization',
    description: 'Helped organize cultural, sports, and technical events at GEC Dahod.',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    icon: Heart,
    title: 'Persistence & Growth',
    description:
      'Recovered from medical challenges, self-studied AI/ML & Cloud, and worked part-time while continuing studies.',
    color: 'from-rose-500 to-orange-500',
  },
]

const BeyondCode = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">Beyond Code</h2>
          <p className="section-subtitle mx-auto">What makes me who I am</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-6 text-center hover:border-primary/30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-4`}
              >
                <item.icon size={24} className="text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BeyondCode
