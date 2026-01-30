import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
// import { motion } from "framer-motion"; // Disabled for performance
import { useResumes, useCreateResume, useDeleteResume } from "@/hooks/use-resumes";
import { TemplateSelectionDialog } from "@/components/TemplateSelectionDialog";
import { ResumeNameDialog } from "@/components/ResumeNameDialog";
import { ModernTemplate, MinimalTemplate } from "@/components/TemplatePreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Plus, FileText, Trash2, Loader2, PenLine } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { data: resumes, isLoading, refetch } = useResumes();
  const createResumeMutation = useCreateResume();
  const deleteResumeMutation = useDeleteResume();
  const [, setLocation] = useLocation();
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [selectedTemplateData, setSelectedTemplateData] = useState<{
    templateId: string;
    accentColor: string;
    presetContent: any;
  } | null>(null);

  // Refetch data when dashboard mounts to ensure fresh data from localStorage
  useEffect(() => {
    console.log('📋 Dashboard mounted - refetching data from localStorage');
    refetch();
  }, []);

  // Subtle GSAP animations for cards
  useEffect(() => {
    if (!cardsRef.current || isLoading) return;
    
    const cards = cardsRef.current.querySelectorAll('.resume-card, .create-card');
    
    // Fade in and slide up animation
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );

    // Add hover animation listeners
    cards.forEach((card) => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -5,
          duration: 0.3,
          ease: "power2.out",
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  }, [resumes, isLoading]);

  const handleTemplateSelect = (templateId: string, accentColor: string, presetContent: any) => {
    setSelectedTemplateData({ templateId, accentColor, presetContent });
    setShowTemplateDialog(false);
    setShowNameDialog(true);
  };

  const handleNameConfirm = (name: string) => {
    if (!selectedTemplateData) return;
    
    createResumeMutation.mutate(
      {
        title: name,
        templateId: selectedTemplateData.templateId,
        accentColor: selectedTemplateData.accentColor,
        content: selectedTemplateData.presetContent
      },
      {
        onSuccess: (newResume) => {
          setLocation(`/editor/${newResume.id}`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Template Selection Dialog */}
      <TemplateSelectionDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelectTemplate={handleTemplateSelect}
      />
      
      {/* Resume Name Dialog */}
      <ResumeNameDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        onConfirm={handleNameConfirm}
      />

      <header className="bg-gradient-to-r from-white via-blue-50/30 to-white border-b sticky top-0 z-10 shadow-sm backdrop-blur-sm relative">
        <div
          className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-600 via-primary to-blue-700 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="text-base sm:text-xl md:text-2xl font-display font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">ResumeFlow</span>
              <p className="text-[9px] sm:text-[10px] text-slate-500 -mt-0.5 sm:-mt-1 hidden xs:block">Build Your Future</p>
            </div>
          </div>
          <div>
            <Button 
              onClick={() => setShowTemplateDialog(true)} 
              disabled={createResumeMutation.isPending} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10 transition-all duration-300 active:scale-95 sm:hover:scale-105"
            >
              {createResumeMutation.isPending ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span className="hidden xs:inline font-medium">New Resume</span>
              <span className="xs:hidden font-medium">New</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 relative z-10">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-1 sm:mb-2">My Resumes</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 flex items-center gap-1.5 sm:gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
            Manage and edit your resume versions
          </p>
        </div>

        {resumes && resumes.length > 0 ? (
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className="h-full resume-card"
              >
                <Card className="group hover:shadow-2xl hover:-translate-y-1 active:scale-98 transition-all duration-300 border-slate-200 hover:border-blue-200 overflow-hidden cursor-pointer h-full flex flex-col bg-white relative touch-manipulation">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
                  <Link href={`/editor/${resume.id}`} className="relative z-10">
                    <div className="aspect-[210/297] bg-slate-50 relative border-b overflow-hidden">
                      {/* Actual Template Preview - Scaled down to fit */}
                      <div className="dashboard-preview-container">
                        <div className="dashboard-preview-wrapper">
                          {resume.templateId === "modern" ? (
                            <ModernTemplate 
                              content={resume.content} 
                              accentColor={resume.accentColor}
                            />
                          ) : (
                            <MinimalTemplate 
                              content={resume.content} 
                              accentColor={resume.accentColor}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                
                <CardContent className="p-3 sm:p-4 pt-4 sm:pt-5">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate pr-2 mb-1 group-hover:text-blue-700 transition-colors">{resume.title}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1 sm:gap-1.5">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-400">Updated</span>
                    <span className="hidden xs:inline">{resume.updatedAt ? format(new Date(resume.updatedAt), "MMM d, yyyy") : "Never"}</span>
                    <span className="xs:hidden">{resume.updatedAt ? format(new Date(resume.updatedAt), "MMM d") : "Never"}</span>
                  </p>
                </CardContent>

                <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between gap-2 mt-auto">
                   <Link href={`/editor/${resume.id}`} className="flex-1">
                      <Button variant="outline" className="w-full gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group/btn active:scale-95">
                        <PenLine className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" /> 
                        <span>Edit</span>
                      </Button>
                   </Link>
                   
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-destructive hover:bg-destructive/10 shrink-0 h-8 w-8 sm:h-9 sm:w-9 active:scale-95">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base sm:text-lg">Delete Resume?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs sm:text-sm">
                          This action cannot be undone. This will permanently delete your resume.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="mt-0 text-xs sm:text-sm h-9">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteResumeMutation.mutate(resume.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm h-9 active:scale-95"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
                </Card>
              </div>
            ))}
            
            {/* Create New Card (Empty State) */}
            <button
              onClick={() => setShowTemplateDialog(true)}
              disabled={createResumeMutation.isPending}
              className="create-card flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50/50 hover:to-blue-100/50 active:from-blue-100/60 active:to-blue-100/70 hover:border-blue-400 hover:shadow-xl active:scale-98 transition-all duration-300 aspect-[210/297] gap-3 sm:gap-4 group text-slate-500 hover:text-blue-600 relative overflow-hidden touch-manipulation"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 via-blue-50/0 to-blue-100/0 group-hover:from-blue-100/30 group-hover:via-blue-50/20 group-hover:to-blue-100/30 transition-all duration-500"></div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 group-hover:scale-110 active:scale-105 transition-all duration-300 shadow-lg relative z-10">
                {createResumeMutation.isPending ? (
                  <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-blue-600 group-hover:text-white" />
                ) : (
                  <Plus className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 group-hover:text-white transition-colors" />
                )}
              </div>
              <div className="text-center px-3 sm:px-4 relative z-10">
                <span className="font-bold text-sm sm:text-base block mb-0.5 sm:mb-1 group-hover:text-blue-700 transition-colors">Create New Resume</span>
                <span className="text-[10px] sm:text-xs text-slate-400 group-hover:text-blue-600/80 transition-colors">Start building your professional resume</span>
              </div>
            </button>
          </div>
        ) : (
          <div
            className="text-center py-12 sm:py-16 md:py-24 bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
             <div className="relative z-10 px-4">
               <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 shadow-lg shadow-blue-200/50 animate-pulse">
                 <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
               </div>
               <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2 sm:mb-3">No resumes yet</h2>
               <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-md mx-auto mb-6 sm:mb-8 md:mb-10">Create your first professional resume in minutes with our AI-powered builder and beautiful templates.</p>
               <div>
                 <Button 
                   onClick={() => setShowTemplateDialog(true)} 
                   size="lg" 
                   className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 gap-2 text-sm sm:text-base h-10 sm:h-11 px-4 sm:px-6 transition-all duration-300 active:scale-95 sm:hover:scale-105"
                 >
                   <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Create My First Resume
                 </Button>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
