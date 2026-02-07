import { Shield, Users, Server, Lock, ChevronRight, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-10 w-10 text-primary" />
              <div className="absolute -inset-1 bg-primary/20 blur-lg" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              Shi<span className="text-primary">Phy</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="hidden sm:flex">
                Employee Portal
              </Button>
            </Link>
            <Link to="/login">
              <Button className="gap-2">
                <Lock className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Terminal className="h-4 w-4" />
                Enterprise Security Solutions
              </div>
              
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Secure Software
                <br />
                <span className="text-gradient-primary">Infrastructure</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                ShiPhy delivers enterprise-grade software solutions with 
                military-level security protocols. Trusted by Fortune 500 companies 
                for critical infrastructure deployment.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="gap-2 animate-pulse-glow">
                    Access Portal
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="status-indicator status-online" />
                  Systems Operational
                </div>
                <div>ISO 27001 Certified</div>
                <div>SOC 2 Compliant</div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl blur-3xl" />
              <div className="relative corporate-card glow-border h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Shield className="mx-auto h-24 w-24 text-primary/50 mb-4" />
                  <p className="text-muted-foreground">Secure Infrastructure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Enterprise <span className="text-primary">Solutions</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Comprehensive software infrastructure designed for security-first organizations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="corporate-card glow-border group hover:border-primary/50 transition-colors"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 lg:px-12 bg-card/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display font-semibold">ShiPhy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ShiPhy Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Advanced Security',
    description: 'Multi-layer authentication with real-time threat monitoring and automated response systems.',
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: 'Cloud Infrastructure',
    description: 'Scalable cloud solutions with 99.99% uptime guarantee and global distribution.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Team Collaboration',
    description: 'Role-based access control with comprehensive audit trails and compliance reporting.',
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: 'Data Encryption',
    description: 'End-to-end encryption for all data at rest and in transit using AES-256.',
  },
  {
    icon: <Terminal className="h-6 w-6" />,
    title: 'API Integration',
    description: 'RESTful APIs with OAuth 2.0 and comprehensive SDK support.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Compliance Ready',
    description: 'Pre-configured templates for GDPR, HIPAA, and industry-specific regulations.',
  },
];

const stats = [
  { value: '500+', label: 'Enterprise Clients' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '24/7', label: 'Security Monitoring' },
  { value: '50+', label: 'Countries Served' },
];
