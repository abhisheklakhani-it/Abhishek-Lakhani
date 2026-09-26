import { motion } from 'framer-motion'
import {
  Languages as LanguagesIcon,
  BrainCircuit,
  Cog,
  Cloud,
  Wrench,
} from 'lucide-react'

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    icon: LanguagesIcon,
    color: 'from-blue-500 to-cyan-500',
    skills: ['Python', 'SQL', 'C++'],
  },
  {
    title: 'ML / AI',
    icon: BrainCircuit,
    color: 'from-cyan-500 to-teal-500',
    skills: [
      'TensorFlow',
      'PyTorch',
      'Scikit-learn',
      'CNNs',
      'NLP',
      'LLM Fine-tuning',
      'RAG',
      'Transfer Learning',
    ],
  },
  {
    title: 'MLOps & Deployment',
    icon: Cog,
    color: 'from-orange-500 to-red-500',
    skills: [
      'Docker',
      'Kubernetes',
      'MLflow',
      'Weights & Biases',
      'GitHub Actions',
      'DVC',
      'FastAPI',
      'ONNX',
    ],
  },
  {
    title: 'Data & Cloud',
    icon: Cloud,
    color: 'from-emerald-500 to-teal-500',
    skills: ['Pandas', 'NumPy', 'BigQuery', 'NoSQL', 'AWS', 'GCP', 'Azure'],
  },
  {
    title: 'Tools & Frameworks',
    icon: Wrench,
    color: 'from-sky-500 to-cyan-500',
    skills: ['Streamlit', 'React', 'REST APIs', 'Linux', 'Git/GitHub'],
  },
]

const SkillChip = ({ name, index }: { name: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, transition: { duration: 0.2 } }}
    className="group relative px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-default"
    style={{ transformStyle: 'preserve-3d' }}
  >
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
    <span className="relative text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
      {name}
    </span>
  </motion.div>
)

const Skills = () => {
  return (
    <section id="skills" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">Skills &amp; Tech Stack</h2>
          <p className="section-subtitle mx-auto">
            Technologies and tools I work with to build AI solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILL_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                  <category.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <SkillChip key={skill} name={skill} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
