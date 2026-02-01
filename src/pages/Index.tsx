import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import AboutMe from '@/components/sections/AboutMe';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Hobbies from '@/components/sections/Hobbies';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
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
      <footer className="py-12 bg-background border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Portfolio. Built with{' '}
            <span className="text-gradient font-medium">passion</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
