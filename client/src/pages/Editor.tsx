import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import gsap from "gsap";
import { useResume, useUpdateResume } from "@/hooks/use-resumes";
import { ResumeForm } from "@/components/ResumeForm";
import { ModernTemplate, MinimalTemplate } from "@/components/TemplatePreview";
import { ColorPicker } from "@/components/ColorPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ChevronLeft, Save, Printer, Download } from "lucide-react";
import { type ResumeContent } from "@shared/schema";
import { useReactToPrint } from "react-to-print";
import { useToast } from "@/hooks/use-toast";
// import { motion } from "framer-motion"; // Disabled for performance

// Auto-save delay
const AUTOSAVE_DELAY = 2000;

export default function Editor() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const resumeId = Number(id);
  
  const { data: resume, isLoading, error, refetch } = useResume(resumeId);
  const updateResumeMutation = useUpdateResume();
  const { toast } = useToast();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  const [content, setContent] = useState<ResumeContent | null>(null);
  const [template, setTemplate] = useState<string>("modern");
  const [accentColor, setAccentColor] = useState<string>("#3b82f6");
  const [title, setTitle] = useState<string>("My Resume");
  const [isSaving, setIsSaving] = useState(false);

  // Print ref
  const componentRef = useRef<HTMLDivElement>(null);

  // Force refetch from localStorage when component mounts
  useEffect(() => {
    console.log('📝 Editor mounted - refetching resume data');
    refetch();
  }, []);
  
  // Generate safe filename from title
  const getSafeFilename = (title: string) => {
    const safeName = title
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .substring(0, 50); // Limit length
    
    return safeName || 'Resume'; // Provide fallback
  };
  
  // Configure react-to-print with proper filename
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: getSafeFilename(title),
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        html, body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    onBeforePrint: () => {
      console.log(`Preparing to export: ${getSafeFilename(title)}.pdf`);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      toast({
        title: "Resume Downloaded",
        description: `${title} has been saved as PDF`,
      });
    },
  });

  // Initialize state from fetched data
  useEffect(() => {
    if (resume) {
      setContent(resume.content);
      setTemplate(resume.templateId);
      setAccentColor(resume.accentColor);
      setTitle(resume.title);
    }
  }, [resume]);

  // Subtle fade-in animation on mount
  useEffect(() => {
    if (!editorContainerRef.current || isLoading) return;
    
    gsap.fromTo(
      editorContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [isLoading]);

  // Handle content changes from the form
  const handleContentChange = (newContent: ResumeContent) => {
    setContent(newContent);
  };

  // Immediate localStorage save + Debounced mutation save
  useEffect(() => {
    if (!content || isLoading || !resume) return;

    // Immediately save to localStorage for persistence
    const updatedResume = {
      ...resume,
      content,
      templateId: template,
      accentColor,
      title,
      updatedAt: new Date().toISOString(),
    };
    
    try {
      const resumes = JSON.parse(localStorage.getItem('resumeflow_resumes') || '[]');
      const index = resumes.findIndex((r: any) => r.id === resumeId);
      if (index !== -1) {
        resumes[index] = updatedResume;
        localStorage.setItem('resumeflow_resumes', JSON.stringify(resumes));
        console.log('✅ Saved to localStorage:', { id: resumeId, title, updatedAt: updatedResume.updatedAt });
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }

    // Debounced mutation for query invalidation and cache update
    const timer = setTimeout(() => {
      setIsSaving(true);
      updateResumeMutation.mutate(
        { 
          id: resumeId, 
          content,
          templateId: template,
          accentColor,
          title
        }, 
        {
          onSettled: () => {
            setIsSaving(false);
            console.log('✅ Mutation complete, cache updated');
          },
          onError: () => toast({ title: "Auto-save failed", variant: "destructive" })
        }
      );
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [content, template, accentColor, title, resumeId, resume, isLoading, updateResumeMutation, toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="ml-4 text-slate-500 font-medium">Loading Editor...</span>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume Not Found</h2>
        <Button variant="outline" onClick={() => setLocation("/")}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div ref={editorContainerRef} className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 relative">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* HEADER */}
      <header
        className="h-14 sm:h-16 bg-gradient-to-r from-white via-blue-50/30 to-white border-b flex items-center justify-between px-2 sm:px-3 md:px-6 shrink-0 no-print z-20 shadow-sm backdrop-blur-sm relative"
      >
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-1 min-w-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/")} 
            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-8 w-8 sm:h-9 sm:w-9 shrink-0 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1 md:mx-2" />
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="border-none shadow-none text-sm sm:text-base md:text-lg font-bold bg-transparent focus-visible:ring-0 px-0 min-w-0 flex-1 focus:text-blue-700 transition-colors"
            placeholder="Resume Title"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
          <div
            className="hidden lg:flex text-xs font-medium items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
            style={{
              color: isSaving ? '#3b82f6' : '#10b981',
              backgroundColor: isSaving ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            }}
          >
            {isSaving ? (
               <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
            ) : (
               <><Save className="w-3 h-3" /> Saved</>
            )}
          </div>
          <div className="hidden lg:block h-6 w-px bg-slate-200 mx-2" />
          
          {/* Template Switcher */}
          <Tabs value={template} onValueChange={setTemplate} className="w-[120px] sm:w-[160px] md:w-[200px]">
            <TabsList className="grid w-full grid-cols-2 h-8 sm:h-9">
              <TabsTrigger value="modern" className="text-[10px] sm:text-xs">
                <span className="hidden sm:inline">Template 1</span>
                <span className="sm:hidden">T1</span>
              </TabsTrigger>
              <TabsTrigger value="minimal" className="text-[10px] sm:text-xs">
                <span className="hidden sm:inline">Template 2</span>
                <span className="sm:hidden">T2</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div>
            <Button 
              onClick={handlePrint} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 md:px-4 h-8 sm:h-10 transition-all duration-300 active:scale-95 sm:hover:scale-105"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              <span className="hidden xs:inline">PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* EDITOR WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* LEFT PANEL: FORM EDITOR */}
        <div
          className="w-full lg:w-1/2 lg:max-w-[600px] border-b lg:border-b-0 lg:border-r bg-gradient-to-br from-slate-50 to-blue-50/20 no-print flex flex-col h-[45vh] lg:h-full"
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-3 sm:p-4 md:p-6 pb-16 sm:pb-20 md:pb-24">
               <div className="mb-4 sm:mb-6 md:mb-8">
                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Editor</h2>
                 <p className="text-slate-600 text-[10px] sm:text-xs md:text-sm flex items-center gap-1.5 sm:gap-2 mt-1">
                   <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                   Update your information below
                 </p>
               </div>

               {/* Accent Color Picker */}
               <div className="mb-6 md:mb-8 pb-4 md:pb-6 border-b">
                 <ColorPicker
                   value={accentColor}
                   onChange={setAccentColor}
                   label="Accent Color"
                 />
               </div>

               {/* Resume Form */}
               <ResumeForm 
                 initialData={content!} 
                 onChange={handleContentChange}
                 isSaving={isSaving}
               />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE PREVIEW */}
        <div className="flex-1 bg-slate-200/50 overflow-hidden print:p-0 print:bg-white h-[50vh] md:h-full">
          <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar print:overflow-visible">
            <div className="min-h-full w-full flex items-start justify-center p-4 md:p-6 lg:p-8 print:p-0">
              <div ref={componentRef} className="w-full max-w-[210mm]">
                {template === "modern" ? (
                  <ModernTemplate content={content} accentColor={accentColor} />
                ) : (
                  <MinimalTemplate content={content} accentColor={accentColor} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
