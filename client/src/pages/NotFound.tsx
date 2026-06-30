/**
 * NotFound Page — SRS
 * 404 error page, landing aesthetic.
 */

import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-background text-foreground">
      <img
        src="/images/whale.png"
        alt=""
        className="absolute right-0 bottom-0 w-[55%] max-w-2xl opacity-25 pointer-events-none select-none object-contain"
        style={{ maskImage: 'linear-gradient(to top, black 40%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 95%)' }}
      />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full pointer-events-none bg-fuchsia-500 blur-[140px] opacity-[0.07]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md relative z-10"
      >
        <p className="text-xs uppercase tracking-widest mb-4 text-muted-foreground font-mono">Off the map</p>
        <h1 className="text-8xl font-display mb-4">404</h1>
        <h2 className="text-xl font-medium mb-3 text-foreground/80">Page not found</h2>
        <p className="text-sm leading-relaxed mb-9 text-muted-foreground">
          The page you're looking for doesn't exist, moved, or was never here to begin with.
        </p>
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer bg-foreground text-background"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </motion.span>
        </Link>
      </motion.div>
    </div>
  )
}
