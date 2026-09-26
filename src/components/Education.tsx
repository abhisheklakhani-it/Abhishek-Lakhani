import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react'

interface EducationItem {
  degree: string
  institution: string
  location: string
  period: string
  courses?: string[]
  current?: boolean
}

const EDUCATION: EducationItem[] = [
  {
    degree: "Master's in Automotive Software Engineering",
    institution: 'Technische Universität Chemnitz',
    location: 'Germany',
    period: '2022 – Present',
    courses: ['Computer Vision', 'Software Engineering', 'Embedded Systems'],
    current: true,
  },
  {
    degree: 'Bachelor of Engineering in Computer Science',
    institution: 'Government Engineering College Dahod',
    location: 'India',
    period: '2017 – 2021',
  },
]

const Education = () => {
  return (
    <section id="education" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">Education</h2>
          <p className="section-subtitle mx-auto">My academic journey</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {EDUCATION.map((item, index) => (
            <motion.div
              key={item.degree}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    item.current ? 'bg-gradient-to-br from-primary to-accent' : 'bg-secondary'
                  }`}
                >
                  <GraduationCap
                    size={24}
                    className={item.current ? 'text-white' : 'text-muted-foreground'}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.degree}</h3>
                      <p className="text-primary font-medium">{item.institution}</p>
                    </div>
                    {item.current && (
                      <span className="px-3 py-1 text-xs font-semibold bg-primary/20 text-primary border border-primary/30 rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {item.period}
                    </span>
                  </div>

                  {item.courses && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <BookOpen size={14} />
                        <span>Key Courses:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.courses.map((course) => (
                          <span
                            key={course}
                            className="px-3 py-1 text-xs font-medium bg-secondary/50 text-muted-foreground rounded-full border border-border/50"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education
