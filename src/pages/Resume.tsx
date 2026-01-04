import { usePortfolio } from '@/contexts/PortfolioContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Resume = () => {
  const { data, loading } = usePortfolio();
  const { t } = useLanguage();

  const isPdf = data.resumeUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            {t.resume.title}
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground">{t.common.loading}</p>
            </div>
          ) : data.resumeUrl ? (
            <div className="max-w-4xl mx-auto">
              {isPdf ? (
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <iframe
                      src={data.resumeUrl}
                      className="w-full h-[80vh]"
                      title="Resume PDF"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button asChild>
                      <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-4 h-4 mr-2" />
                        {t.resume.downloadPdf}
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <motion.img
                    src={data.resumeUrl}
                    alt="Resume"
                    className="max-w-full h-auto rounded-lg shadow-lg border border-border"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">{t.resume.noResume}</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Resume;