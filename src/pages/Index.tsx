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
    <div className="min-h-screen bg-background">
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
      <footer className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
