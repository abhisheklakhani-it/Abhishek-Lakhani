import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import GitHubRepos from '@/components/GitHubRepos'

interface Project {
  title: string
  description: string
  tags: string[]
  github: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    title: 'SmartVisual.ai',
    description:
      'AI analytics assistant that turns natural-language questions into SQL, analyzes data, and auto-builds dashboards with interactive charts and insights.',
    tags: ['LLM', 'SQL', 'Data Viz', 'MLOps'],
    github: 'https://github.com/abhisheklakhani-it',
    featured: true,
  },
  {
    title: 'LLM-Powered Resume ATS Analyzer',
    description:
      'Compares resumes with job descriptions using Google Gemini Pro Vision, scores similarity, detects missing ATS keywords, and suggests improvements.',
    tags: ['LLM', 'Gemini', 'Streamlit', 'ATS'],
    github: 'https://github.com/abhisheklakhani-it',
  },
  {
    title: 'AI Chatbot (NLP)',
    description:
      'Deep Learning & NLP chatbot achieving ~80% accuracy for intent classification and natural language understanding.',
    tags: ['NLP', 'Deep Learning', 'Text Classification'],
    github: 'https://github.com/abhisheklakhani-it',
  },
  {
    title: 'Bird Species Classification',
    description:
      'Image classifier for bird species using CNN architecture with strong evaluation accuracy.',
    tags: ['Computer Vision', 'CNN', 'TensorFlow'],
    github: 'https://github.com/abhisheklakhani-it',
  },
  {
    title: 'Sentiment Analysis',
    description:
      'Sentiment model that classifies text into positive/negative/neutral categories with high accuracy.',
    tags: ['NLP', 'Sentiment', 'ML'],
    github: 'https://github.com/abhisheklakhani-it',
  },
]

const TAG_COLORS: Record<string, string> = {
  LLM: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  SQL: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Data Viz': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  MLOps: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Gemini: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Streamlit: 'bg-red-500/20 text-red-300 border-red-500/30',
  ATS: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  NLP: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Deep Learning': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'Text Classification': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Computer Vision': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  CNN: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  TensorFlow: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Sentiment: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  ML: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
}

const DEFAULT_TAG = 'bg-secondary/50 text-muted-foreground border-border/50'

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    className={`group relative glass-card p-6 hover:border-primary/40 transition-all duration-300 ${
      project.featured ? 'md:col-span-2 lg:col-span-1' : ''
    }`}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {project.featured && (
      <div className="flex items-center gap-2 mb-4">
        <Star size={16} className="text-accent" />
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">
          Flagship Project
        </span>
      </div>
    )}

    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
      {project.title}
    </h3>
    <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>

    <div className="flex flex-wrap gap-2 mb-6">
      {project.tags.map((tag) => (
        <span
          key={tag}
          className={`px-2.5 py-1 text-xs font-medium rounded-full border ${TAG_COLORS[tag] ?? DEFAULT_TAG}`}
        >
          {tag}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-3 mt-auto">
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <a href={project.github} target="_blank" rel="noopener noreferrer">
          <GithubIcon size={16} />
          View Code
        </a>
      </Button>
    </div>

    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl" />
  </motion.div>
)

const Projects = () => {
  return (
    <section id="projects" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/15 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">Featured Projects</h2>
          <p className="section-subtitle mx-auto">Practical AI solutions I've built</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <GitHubRepos />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="hero-outline" size="lg" asChild className="group">
            <a
              href="https://github.com/abhisheklakhani-it"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon size={20} className="mr-2" />
              More on GitHub
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
