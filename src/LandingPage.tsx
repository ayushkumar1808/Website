import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  Github,
  Mail,
  FileText,
  Shield,
  Sparkles,
  Timer,
  Lightbulb,
  Layers,
  Cpu,
  Code,
  Zap,
  Linkedin,
  Target,
  TrendingUp,
  Play
} from 'lucide-react';

function LandingPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && company && country) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch('https://api.sheetbest.com/sheets/02cfb160-f9be-4d41-be5e-4295dbb5ed8b', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Name: name,
            Email: email,
            Company: company,
            Country: country,
            Timestamp: new Date().toISOString()
          }),
        });
        
        if (response.ok) {
          setIsSubmitted(true);
        } else {
          console.error('Failed to submit form');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Spline Background - Fixed on the right side */}
      <div className="fixed right-0 top-0 w-1/2 h-full z-0">
        <iframe 
          src='https://my.spline.design/fnxbotrobotcharacterconcept-MD88atcTdN2LDWrQngpeT3ka/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          className="w-full h-full"
          title="Interactive 3D Hardware Model"
          style={{ 
            pointerEvents: 'auto'
          }}
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] pointer-events-none"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 py-6 backdrop-blur-md bg-black/30 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/image.png" 
                alt="ConfigAI Logo" 
                className="h-8 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-white/80 hover:text-cyan-400 transition-colors duration-300">How it Works</a>
              <a href="#product" className="text-white/80 hover:text-cyan-400 transition-colors duration-300">Product</a>
              <a href="#about" className="text-white/80 hover:text-cyan-400 transition-colors duration-300">Team</a>
              <a href="#waitlist" className="text-white/80 hover:text-cyan-400 transition-colors duration-300">Join Waitlist</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-12 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10">
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-cyan-400/30">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white/90">The future of hardware development</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                  From <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Idea</span> to{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Hardware</span>
                  <br />
                  <span className="text-4xl md:text-6xl text-white">Design.</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-12 leading-relaxed">
                  Describe your hardware vision in plain English. ConfigAI transforms it into RTL designs. 
                  Perfect for processors and embedded systems.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#waitlist" 
                  className="group relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-400 hover:via-red-400 hover:to-pink-400 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center space-x-2 shadow-2xl shadow-red-500/50 animate-pulse hover:animate-none border-2 border-yellow-400/50"
                  style={{ 
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <span className="text-lg">🚀 Join the Waitlist NOW!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => navigate('/demo')}
                  className="text-white/80 hover:text-white font-medium px-8 py-4 border border-white/30 hover:border-cyan-400 rounded-full transition-all duration-300 backdrop-blur-sm bg-black/30"
                >
                  Try Demo
                </button>
              </div>
            </div>

            {/* Right - Space for Spline interaction */}
            <div className="flex items-center justify-center">
              {/* This space allows interaction with the Spline model behind */}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">How It Works</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Three simple steps to transform your concepts into hardware reality
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
                    <Lightbulb className="w-8 h-8 text-black" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 rounded-2xl blur-md opacity-40"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">1. Describe Your Vision</h3>
                <p className="text-white/80 leading-relaxed">
                  Simply describe your hardware concept in natural language. No technical specifications required.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-black" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-2xl blur-md opacity-40"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">2. AI Processes</h3>
                <p className="text-white/80 leading-relaxed">
                  Advanced AI analyzes your requirements and generates optimized hardware designs instantly.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-8 border border-white/10 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center">
                    <Layers className="w-8 h-8 text-black" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 to-purple-400 rounded-2xl blur-md opacity-40"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">3. Get Your Design</h3>
                <p className="text-white/80 leading-relaxed">
                  Receive funtionally correct hardware designs and schematics ready for manufacturing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section id="product" className="px-4 py-20 bg-gradient-to-b from-black via-gray-900/50 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Product</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                A revolutionary compiler that brings FPGA acceleration to every engineer
              </p>
            </div>

            {/* The Problem */}
            <div className="backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10 mb-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">The Challenge</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Moore's Law is effectively dead. We no longer get performance boosts just by waiting for smaller transistors.
                    The next leap in compute performance will come from reconfigurable hardware, especially FPGAs, which strike a balance
                    between flexibility, performance density, and power efficiency.
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    FPGAs can deliver up to <span className="text-cyan-400 font-bold">100× speedups</span>, but they're notoriously hard to program.
                    HDL design is tedious, time-consuming, and fundamentally different from the way software engineers think.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Solution */}
            <div className="backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-cyan-400/30 mb-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Our Solution</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    We're building a compiler that <span className="text-cyan-400 font-bold">automatically maps any PyTorch model onto an FPGA</span>,
                    eliminating the need for hardware expertise and making FPGA acceleration accessible to every engineer.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-black/50 rounded-xl p-4 border border-cyan-400/20">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">100×</div>
                      <div className="text-white/70">Performance Speedup</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 border border-cyan-400/20">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">Zero</div>
                      <div className="text-white/70">Hardware Expertise</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-4 border border-cyan-400/20">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">PyTorch</div>
                      <div className="text-white/70">Native Integration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Video */}
            <div className="backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white">See It In Action</h3>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/20">
                <video
                  controls
                  className="w-full h-auto"
                  poster="/image.png"
                >
                  <source src="/Demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-white/70 text-center mt-4">
                Watch our proof of concept demonstrating Spec-2-RTL (Natural Language to RTL)
              </p>
            </div>

            {/* Target Market */}
            <div className="backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Who We Serve</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Our typical customers are <span className="text-purple-400 font-bold">hyperscalers and cloud providers</span> (AWS, Azure, Google Cloud)
                    that already offer FPGA instances but struggle with low adoption due to the complexity of HDL design.
                  </p>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Our compiler makes FPGAs accessible to a much broader developer base, which directly increases utilization of their existing FPGA infrastructure.
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    Longer term, <span className="text-purple-400 font-bold">enterprise AI teams and startups</span> will also benefit from faster,
                    cheaper inference without hiring specialized hardware engineers.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Stage */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-6 border border-cyan-400/30 text-center">
                <div className="text-lg font-bold text-cyan-400 mb-2">Current Stage</div>
                <div className="text-2xl font-bold text-white">MVP Development</div>
                <p className="text-white/70 mt-2">Building on our successful PoC</p>
              </div>
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-6 border border-purple-400/30 text-center">
                <div className="text-lg font-bold text-purple-400 mb-2">Market Size</div>
                <div className="text-2xl font-bold text-white">Tens of Billions</div>
                <p className="text-white/70 mt-2">AI acceleration market globally</p>
              </div>
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-6 border border-blue-400/30 text-center">
                <div className="text-lg font-bold text-blue-400 mb-2">Next Milestone</div>
                <div className="text-2xl font-bold text-white">Hyperscaler Launch</div>
                <p className="text-white/70 mt-2">Deploying on major cloud platforms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="about" className="px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Meet Our Team</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                World-class researchers and engineers from Max Planck Institute for Informatics
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Ayush Kumar */}
              <div className="backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <img
                      src="/Ayush.png"
                      alt="Ayush Kumar"
                      className="w-40 h-40 rounded-full object-cover border-4 border-cyan-400/30"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 blur-xl opacity-20"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ayush Kumar</h3>
                  <div className="text-cyan-400 font-semibold mb-4">CEO & Co-Founder</div>
                  <p className="text-white/80 leading-relaxed mb-6">
                    Ayush brings deep expertise in FPGA development and hardware acceleration. As a HiWi (Research Assistant) at
                    Max Planck Institute for Informatics, he works at the intersection of HCI,
                    pioneering new approaches to making FPGAs accessible to software engineers.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/ayushkumar1808/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Sagnik Dutta */}
              <div className="backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <img
                      src="/Sagnik.png"
                      alt="Sagnik Dutta"
                      className="w-40 h-40 rounded-full object-cover border-4 border-purple-400/30"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 blur-xl opacity-20"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Sagnik Dutta</h3>
                  <div className="text-purple-400 font-semibold mb-4">CTO & Co-Founder</div>
                  <p className="text-white/80 leading-relaxed mb-6">
                    Sagnik is a PhD student at Max Planck Institute for Informatics, specializing in algorithms and complexity.
                    With a strong foundation in theoretical computer science, he architects the compiler technology that transforms
                    PyTorch models into optimized FPGA implementations.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/sagnik-dutta-aa08211b5/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Credentials */}
            <div className="mt-12 backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Why We're Uniquely Positioned</h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Cpu className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Hardware Expertise</h4>
                  <p className="text-white/70">Deep FPGA experience and HCI research background</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-purple-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Theoretical Foundation</h4>
                  <p className="text-white/70">PhD-level algorithms and complexity theory expertise</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="px-4 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 backdrop-blur-md bg-black/50 rounded-3xl p-8 border border-white/10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Perfect For</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Whether you're building breakthrough technology or rapid prototypes, ConfigAI accelerates your hardware development
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-8 border border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300">
                <Timer className="w-12 h-12 text-cyan-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">Rapid Prototyping</h3>
                <p className="text-white/80 leading-relaxed">
                  Go from concept to working prototype in minutes. Perfect for iterative design and testing cycles.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-8 border border-purple-400/20 hover:border-purple-400/50 transition-all duration-300">
                <Cpu className="w-12 h-12 text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">Smart Processors</h3>
                <p className="text-white/80 leading-relaxed">
                  Design intelligent processors, AI chips, and embedded systems with optimized performance and efficiency.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-black/50 rounded-2xl p-8 border border-blue-400/20 hover:border-blue-400/50 transition-all duration-300">
                <Code className="w-12 h-12 text-blue-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4 text-white">Less Design Time</h3>
                <p className="text-white/80 leading-relaxed">
                  Focus on innovation, not implementation. Spend time on breakthrough ideas, not tedious design work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Form */}
        <section id="waitlist" className="px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="backdrop-blur-md bg-black/50 rounded-3xl p-12 border border-white/10 relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Join the Revolution</h2>
              <p className="text-xl text-white/90 mb-12">
                Be among the first to experience the next generation of hardware design. 
                Get early access and exclusive updates.
              </p>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-black/70 border border-white/30 rounded-full focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-black/70 border border-white/30 rounded-full focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-black/70 border border-white/30 rounded-full focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-black/70 border border-white/30 rounded-full focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-400 hover:via-red-400 hover:to-pink-400'} text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl shadow-red-500/50 border-2 border-yellow-400/50 text-lg`}
                    style={{ 
                      boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.4)',
                      textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    <span>{isSubmitting ? '⏳ SUBMITTING...' : '🚀 JOIN THE WAITLIST NOW!'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-sm text-white/60">
                    No spam. Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              ) : (
                <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="relative mb-4 mx-auto w-16 h-16">
                    <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-cyan-400">Welcome to the Future!</h3>
                  <p className="text-white/90">
                    Thanks for joining our waitlist. We'll keep you updated on our progress and let you know when ConfigAI is ready.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-12 border-t border-white/10 backdrop-blur-md bg-black/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="/image.png" 
                    alt="ConfigAI Logo" 
                    className="h-6 w-auto"
                  />
                </div>
                <p className="text-white/70 mb-4 max-w-md">
                  Transforming ideas into hardware designs instantly. The future of hardware development is here.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com" className="text-white/60 hover:text-cyan-400 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="mailto:contact@configai.co" className="text-white/60 hover:text-cyan-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-cyan-400">Company</h4>
                <ul className="space-y-2 text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="mailto:contact@configai.co" className="hover:text-cyan-400 transition-colors underline">contact@configai.co</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-purple-400">Legal</h4>
                <ul className="space-y-2 text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </a></li>
                  <li><a href="#" className="hover:text-white transition-colors flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
              <p>&copy; 2025 ConfigAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
