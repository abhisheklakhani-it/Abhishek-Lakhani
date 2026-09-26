import { motion } from 'framer-motion'
import { Mail, Heart } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/icons'

const SOCIAL_LINKS = [
  { icon: GithubIcon, href: 'https://github.com/abhisheklakhani-it', label: 'GitHub' },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/in/abhishek-lakhani-4896271a6/',
    label: 'LinkedIn',
  },
  { icon: Mail, href: 'mailto:lakhaniabhi.it@gmail.com', label: 'Email' },
]

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="relative py-12 overflow-hidden border-t border-border/50">
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5">
              © {year} Abhishek Lakhani. Built with React, TypeScript, and a lot of
              <Heart size={14} className="text-primary inline fill-current" />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2.5 rounded-lg bg-secondary/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <social.icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
