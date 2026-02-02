import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import AboutMe from '@/components/sections/AboutMe';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Hobbies from '@/components/sections/Hobbies';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';
import { Gamepad2, Heart } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden crt-effect">
      <Navbar />
      <main>
        <Hero />
        <AboutMe />
        <Hobbies />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      <footer className="py-12 bg-background border-t border-neon-cyan/30 relative">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-game opacity-10" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-neon-cyan/50" />
            <Gamepad2 className="w-6 h-6 text-neon-cyan" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-neon-cyan/50" />
          </div>
          <p className="text-muted-foreground font-body">
            © {new Date().getFullYear()} Portfolio. Built with{' '}
            <span className="inline-flex items-center gap-1">
              <Heart className="w-4 h-4 text-neon-pink" />
              <span className="text-gradient-game font-game">PASSION</span>
            </span>
          </p>
          <p className="font-pixel text-[8px] text-muted-foreground/50 mt-2">
            PRESS START TO CONTINUE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
