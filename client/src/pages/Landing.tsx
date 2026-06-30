/**
 * Landing Page — SRS
 * Ported from the standalone Landing- (Next.js) design into the Vite/wouter app.
 */

import { useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { InfrastructureSection } from '@/components/landing/infrastructure-section'
import { MetricsSection } from '@/components/landing/metrics-section'
import { IntegrationsSection } from '@/components/landing/integrations-section'
import { SecuritySection } from '@/components/landing/security-section'
import { DevelopersSection } from '@/components/landing/developers-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CtaSection } from '@/components/landing/cta-section'
import { FooterSection } from '@/components/landing/footer-section'

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const [, navigate] = useLocation()

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <SecuritySection />
      <DevelopersSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </main>
  )
}
