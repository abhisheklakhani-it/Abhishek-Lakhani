import { motion } from 'framer-motion'
import { MapPin, Calendar, Microscope, Code2, Server } from 'lucide-react'

type ExperienceType = 'research' | 'development' | 'engineering'

interface ExperienceItem {
  title: string
  company: string
  location: string
  period: string
  type: ExperienceType
  description: string[]
}

const EXPERIENCE: ExperienceItem[] = [
  {
    title: 'Machine Learning Intern',
    company: 'Technische Universität Chemnitz',
    location: 'Chemnitz, Germany',
    period: 'Jun 2025 – Jan 2026',
    type: 'research',
    description: [
      'Designed a privacy-focused image classification pipeline in TensorFlow, running federated learning experiments across decentralized Solid POD data sources',
      'Set up modular Python components — structured logging, custom exceptions, and CSV-based result tracking — for reproducible experiments',
    ],
  },
  {
    title: 'Software Development Intern',
    company: 'Wokontech IT Solution',
    location: 'Surat, India',
    period: 'Oct 2021 – Mar 2022',
    type: 'development',
    description: [
      'Built and trained object detection pipelines on 5K+ images, improving robustness through data curation',
      'Evaluated models against standard metrics and managed annotation workflows with CVAT',
    ],
  },
  {
    title: 'Backend Development Intern',
    company: 'White Orange Software',
    location: 'Surat, India',
    period: 'Dec 2020 – May 2021',
    type: 'engineering',
    description: [
      'Built and maintained backend features in Core PHP, tuning MySQL queries to improve application performance',
      'Took part in code reviews and documentation alongside a multidisciplinary team',
    ],
  },
]

const TYPE_COLORS: Record<ExperienceType, string> = {
  research: 'from-cyan-500 to-teal-500',
  development: 'from-blue-500 to-cyan-500',
  engineering: 'from-orange-500 to-yellow-500',
}

const TYPE_ICONS: Record<ExperienceType, typeof Microscope> = {
  research: Microscope,
  development: Code2,
  engineering: Server,
}

const Experience = () => {
  return (
    <section id="experience" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">Experience</h2>
          <p className="section-subtitle mx-auto">My professional journey in tech and AI</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/30" />

          {EXPERIENCE.map((item, index) => {
            const Icon = TYPE_ICONS[item.type]
            const even = index % 2 === 0

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: even ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-start gap-8 mb-12 ${even ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${TYPE_COLORS[item.type]} ring-4 ring-background`}
                  />
                </div>

                <div className={`flex-1 ml-16 md:ml-0 ${even ? 'md:mr-8' : 'md:ml-8'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card p-6 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                        <p className="text-primary font-medium">{item.company}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${TYPE_COLORS[item.type]}`}>
                        <Icon size={20} className="text-white" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {item.period}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {item.description.map((line) => (
                        <li key={line} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
