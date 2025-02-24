import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Menu, X, Upload, Clock, Zap, Bot, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-white">
              D Block
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                Testimonials
              </a>
              <Link to="/signup">
                <Button className="bg-white text-navy hover:bg-white/90">
                  Submit an RFQ
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "md:hidden absolute top-full left-0 right-0 bg-navy/95 backdrop-blur-sm border-b border-white/10 transition-all duration-300",
              isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                Testimonials
              </a>
              <Link to="/signup">
                <Button className="w-full bg-white text-navy hover:bg-white/90">
                  Submit an RFQ
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
                Ultra-Fast CNC Machining
                <span className="block text-primary">Custom Parts in 1-4 Days</span>
              </h1>
              <p className="text-lg text-gray-600">
                High-precision parts delivered within days. Trusted by R&D teams worldwide.
              </p>
              <Link to="/signup">
                <Button size="lg" className="group">
                  Get a Quote Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                alt="High-precision CNC Machined Part"
                className="relative z-10 w-full h-auto rounded-lg shadow-2xl animate-float object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">
            Why Choose D Block Manufacturing?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Rapid Prototyping",
                description: "Get parts in 1-4 days with fast turnaround",
              },
              {
                icon: Upload,
                title: "High Precision",
                description: "Achieve micron-level tolerances for complex designs",
              },
              {
                icon: Bot,
                title: "Instant Online Quotes",
                description: "AI-powered pricing delivered within 1 hour",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="relative w-12 h-12 mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg group-hover:bg-primary/20 transition-colors" />
                  <div className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Upload Files",
                description: "Upload STEP and PDF files with our simple drag-and-drop system",
              },
              {
                step: 2,
                title: "Get Quote",
                description: "Receive an instant AI-powered quote within 1 hour",
              },
              {
                step: 3,
                title: "Manufacturing",
                description: "We manufacture your parts with high-precision CNC machines",
              },
              {
                step: 4,
                title: "Fast Delivery",
                description: "Your order gets shipped to you with fast and reliable delivery",
              },
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white p-6 rounded-lg relative z-10">
                  <div className="text-4xl font-bold text-primary/20 mb-4">
                    {step.step.toString().padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ChevronRight className="w-8 h-8 text-primary/20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Your Custom Parts Fast
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            High-quality CNC machining with industry-leading turnaround times.
            Trusted by innovators and engineers worldwide.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-navy hover:bg-white/90">
              Submit an RFQ
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-navy text-center mb-12">
            Contact Us
          </h2>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Your phone number"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder="How can we help you?"
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-white/80 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white">CNC Machining</a></li>
                <li><a href="#" className="text-white/80 hover:text-white">Prototyping</a></li>
                <li><a href="#" className="text-white/80 hover:text-white">Custom Parts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white">FAQs</a></li>
                <li><a href="#" className="text-white/80 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-white/80 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-white/80">info@dblock.com</li>
                <li className="text-white/80">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
            © 2024 D Block Manufacturing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
