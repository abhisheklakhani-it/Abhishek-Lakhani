import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GithubIcon, LinkedinIcon } from '@/components/icons'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

type FormErrors = Partial<Record<keyof ContactForm, string>>

const CONTACT_EMAIL = 'lakhaniabhi.it@gmail.com'

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: GithubIcon,
    label: 'GitHub',
    value: 'github.com/abhisheklakhani-it',
    href: 'https://github.com/abhisheklakhani-it',
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    value: 'linkedin.com/in/abhishek-lakhani',
    href: 'https://www.linkedin.com/in/abhishek-lakhani-4896271a6/',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Chemnitz, Germany',
  },
]

const SOCIAL_LINKS = [
  {
    icon: GithubIcon,
    href: 'https://github.com/abhisheklakhani-it',
    label: 'GitHub Profile',
  },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/in/abhishek-lakhani-4896271a6/',
    label: 'LinkedIn Profile',
  },
]

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1 text-sm text-destructive flex items-center gap-1">
      <AlertCircle size={14} />
      {message}
    </p>
  ) : null

const EMPTY_FORM: ContactForm = { name: '', email: '', subject: '', message: '' }

const Contact = () => {
  const { toast } = useToast()
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Name is required'

    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email'
    }

    if (!form.message.trim()) {
      next.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      next.message = 'Message must be at least 10 characters'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (field: keyof ContactForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // No backend configured: hand the message to the visitor's mail app instead.
    if (!supabase) {
      const subject = form.subject.trim() || `Portfolio contact from ${form.name}`
      const body = `${form.message}\n\n— ${form.name} (${form.email})`
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
      toast({
        title: 'Opening your email app',
        description: `If nothing opens, email me directly at ${CONTACT_EMAIL}.`,
      })
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: form,
      })
      if (error) throw error

      toast({
        title: 'Message sent',
        description: "Thanks for reaching out — I'll get back to you soon.",
      })
      setForm(EMPTY_FORM)
      setErrors({})
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description:
          error instanceof Error ? error.message : 'Please try again in a moment.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field?: keyof ContactForm) =>
    `w-full px-4 py-3 rounded-xl bg-secondary/50 border ${
      field && errors[field] ? 'border-destructive' : 'border-border/50'
    } focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`

  return (
    <section id="contact" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title gradient-text mb-4">
            Let's Build Something Together
          </h2>
          <p className="section-subtitle mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from
            you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {CONTACT_INFO.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-foreground font-medium hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-4 rounded-xl bg-accent/10 border border-accent/20"
            >
              <p className="text-sm font-medium text-accent">
                Open to: Internship · Working Student · Thesis · Full-time (AI/ML)
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                  className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  <social.icon size={24} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} noValidate className="glass-card p-6 md:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    className={inputClass('name')}
                    placeholder="Your name"
                  />
                  <FieldError message={errors.name} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    className={inputClass('email')}
                    placeholder="your@email.com"
                  />
                  <FieldError message={errors.email} />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  className={inputClass()}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange('message')}
                  className={`${inputClass('message')} resize-none`}
                  placeholder="Your message..."
                />
                <FieldError message={errors.message} />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
