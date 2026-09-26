import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import profile from '@/assets/profile.png'
import Highlights from '@/components/Highlights'

const About = () => {
  return (
    <section id="about" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">About Me</h2>
          <p className="section-subtitle mx-auto">
            Building AI solutions that make a difference
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative mx-auto lg:mx-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary opacity-20 blur-2xl animate-pulse" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-primary/30 glass-card">
                <img
                  src={profile}
                  alt="Abhishek Lakhani"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                  <span className="text-3xl font-bold gradient-text">AI</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm an AI/ML engineer with hands-on experience in{' '}
              <span className="text-foreground font-medium">Deep Learning</span>,
              <span className="text-foreground font-medium"> LLMs/RAG systems</span>,
              and <span className="text-foreground font-medium">MLOps</span>. My
              work focuses on building practical, production-ready AI solutions
              that solve real-world problems.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              I recently wrapped up a Machine Learning internship at TU Chemnitz,
              where I worked on{' '}
              <span className="text-foreground font-medium">
                decentralized ML with Solid PODs
              </span>
              , focusing on privacy-preserving data workflows and user-controlled
              storage. I'm comfortable with
              <span className="text-primary"> TensorFlow</span>,{' '}
              <span className="text-primary">PyTorch</span>,
              <span className="text-primary"> LangChain</span>,{' '}
              <span className="text-primary">FastAPI</span>,
              <span className="text-primary"> Docker</span>,{' '}
              <span className="text-primary">MLflow</span>, and building
              end-to-end ML pipelines.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Looking for{' '}
              <span className="text-accent font-medium">
                Internship / Working Student / Master's Thesis roles
              </span>
              , with potential for full-time AI/ML positions in Germany.
            </p>

            <Highlights />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <Button variant="hero-outline" size="lg" asChild>
                <a href={`${import.meta.env.BASE_URL}resume-abhishek-lakhani.pdf`} download>
                  <Download size={18} className="mr-2" />
                  Download Resume
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
