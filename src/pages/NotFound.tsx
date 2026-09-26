import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      '404: user attempted to access non-existent route:',
      location.pathname
    )
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-primary mb-2">404</p>
        <h1 className="text-3xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant="hero" asChild>
          <Link to="/">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
