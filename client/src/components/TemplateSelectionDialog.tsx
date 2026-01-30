import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { ModernTemplate, MinimalTemplate } from "./TemplatePreview";
import { type ResumeContent } from "@shared/schema";
// import { motion, AnimatePresence } from "framer-motion"; // Disabled for performance

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: string, accentColor: string, presetContent: ResumeContent) => void;
}

// Template 1 - Modern Sidebar (Emily Carter) matching RapidApply Resume image exactly
// Uses amber (#f4b400) accent - all data matches the provided image
const MODERN_PRESET: ResumeContent = {
  personalInfo: {
    fullName: "Emily Carter",
    email: "hello@reallygreatsite.com",
    phone: "+123-456-7890",
    location: "www.reallygreatsite.com",
    title: "Graphic Designer",
    summary:
      "Creative and detail-oriented Graphic Designer with experience producing visually compelling digital and print assets for marketing, branding, and social media. Skilled in translating concepts into clean, engaging designs while meeting deadlines and brand guidelines. Collaborative team player with strong visual storytelling skills.",
  },
  education: [
    {
      id: "edu-1",
      school: "University of California, Los Angeles",
      degree: "Bachelor of Fine Arts (BFA) in Graphic Design", 
      startDate: "2016",
      endDate: "2020",
      location: "Los Angeles",
      description: "GPA: 3.9/4.0",
    },
  ],
  workExperience: [
    {
      id: "we-1",
      company: "Brightwave Creative Agency",
      position: "Graphic Designer",
      startDate: "2022",
      endDate: "Present",
      location: "",
      description:
        "Designed digital and print marketing materials including social media graphics, flyers, brochures, and web assets\nCollaborated with marketing and content teams to develop visual concepts aligned with brand strategy\nCreated design systems and templates to ensure brand consistency across platforms\nDelivered multiple projects simultaneously while meeting tight deadlines\nRevised designs based on client and stakeholder feedback",
    },
    {
      id: "we-2", 
      company: "Urban Media Studio",
      position: "Junior Graphic Designer",
      startDate: "2020",
      endDate: "2022",
      location: "",
      description:
        "Assisted senior designers with branding, logo development, and campaign visuals\nDesigned promotional graphics for social media, email campaigns, and presentations\nPrepared final artwork files for print and digital distribution\nMaintained organized design files and asset libraries\nSupported creative brainstorming sessions and concept development",
    },
  ],
  skills: [
    { id: "sk-1", name: "Figma & Canva" },
    { id: "sk-2", name: "Branding & Visual Identity" },
    { id: "sk-3", name: "Social Media Graphics" },
    { id: "sk-4", name: "Adobe Photoshop" },
    { id: "sk-5", name: "Basic Motion Graphics" },
    { id: "sk-6", name: "Cert: Adobe Certified Professional (Graphic Design & Illustration)" },
    { id: "sk-7", name: "Cert: Google UX Design Fundamentals" },
  ],
};

// Template 2 - Professional Minimal (Alex Johnson) matching provided resume exactly
// Uses muted gold (#B1963B) accent
const MINIMAL_PRESET: ResumeContent = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alexjohnson@email.com", 
    phone: "(555) 321-9876",
    location: "456 Oak Avenue, New York, NY",
    title: "Administrative Assistant",
    summary:
      "Highly organized and reliable Administrative Assistant with experience supporting daily office operations, managing schedules, handling correspondence, and maintaining accurate records. Known for strong communication skills, attention to detail, and the ability to multitask in fast-paced office environments.",
  },
  education: [
    {
      id: "edu-1",
      school: "City College of Chicago",
      degree: "Bachelor of Science in Marketing",
      startDate: "2018",
      endDate: "2022",
      location: "Chicago, IL",
      description: "3.7/4.0 GPA",
    },
    {
      id: "edu-2", 
      school: "City College of Chicago",
      degree: "Associate Degree in Business Administration",
      startDate: "2018",
      endDate: "2022",
      location: "Chicago, IL",
      description: "GPA: 3.7/4.0",
    },
  ],
  workExperience: [
    {
      id: "we-1",
      company: "Clearpoint Consulting Group",
      position: "Administrative Assistant",
      startDate: "March 2022",
      endDate: "Present",
      location: "Chicago, IL",
      description:
        "Provided administrative support to managers and team members\nManaged calendars, scheduled meetings, and coordinated appointments\nHandled incoming calls, emails, and general office correspondence\nPrepared documents, reports, and presentations using Microsoft Office\nMaintained organized filing systems and confidential records\nAssisted with office supplies management and vendor coordination",
    },
    {
      id: "we-2",
      company: "Northbridge Services",
      position: "Office Assistant",
      startDate: "July 2020",
      endDate: "February 2022",
      location: "Evanston, IL",
      description:
        "Supported front-office operations and greeted visitors\nAssisted with data entry, document preparation, and filing\nScheduled meetings and updated internal calendars\nHelped maintain office organization and workflow efficiency\nProvided general clerical support to multiple departments",
    },
  ],
  skills: [
    { id: "sk-1", name: "Office Administration" },
    { id: "sk-2", name: "Calendar & Schedule Management" },
    { id: "sk-3", name: "Email & Phone Correspondence" },
  ],
};

const TEMPLATES = [
  {
    id: "modern",
    name: "Template 1 - Sidebar Design",
    description: "Elegant sidebar layout with profile image and yellow accent colors. Perfect for creative professionals.",
    defaultColor: "#f4b400", // amber/yellow matching design
    preset: MODERN_PRESET,
    component: ModernTemplate,
    features: ["Profile Image", "Sidebar Layout", "Yellow Accents", "Professional Design"],
  },
  {
    id: "minimal", 
    name: "Template 2 - Professional Centered",
    description: "Clean centered layout with muted gold accents and professional design. Perfect for administrative professionals.",
    defaultColor: "#B1963B", // muted gold matching design
    preset: MINIMAL_PRESET,
    component: MinimalTemplate,
    features: ["Centered Header", "Muted Gold Accents", "Clean Layout", "Professional Style"],
  },
];

export function TemplateSelectionDialog({ open, onOpenChange, onSelectTemplate }: TemplateSelectionDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedTemplate) {
      const template = TEMPLATES.find((t) => t.id === selectedTemplate);
      if (template) {
        onSelectTemplate(selectedTemplate, template.defaultColor, template.preset);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choose Your Resume Template</DialogTitle>
          <DialogDescription>
            Select a template to get started. You can customize colors and switch templates later.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-4">
            {TEMPLATES.map((template, index) => {
              const TemplateComponent = template.component;
              const isSelected = selectedTemplate === template.id;
              const isHovered = hoveredTemplate === template.id;

              return (
                <div key={template.id}>
                  <Card
                    className={`cursor-pointer transition-all border-2 overflow-hidden ${
                      isSelected
                        ? "border-primary shadow-xl shadow-primary/30 scale-[1.02]"
                        : "border-slate-200 hover:border-primary/50 hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    {/* Template Preview - Full container scaling */}
                    <div className="bg-slate-100 aspect-[210/297] overflow-hidden relative">
                      <div className="template-preview-container">
                        <div className="template-preview-wrapper">
                          <TemplateComponent content={template.preset} accentColor={template.defaultColor} />
                        </div>
                      </div>
                      
                      {/* Selection Overlay */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg z-10">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                      
                      {/* Hover Indicator */}
                      {isHovered && !isSelected && (
                        <div className="absolute inset-0 bg-primary/5 border-2 border-primary/30 rounded-lg pointer-events-none" />
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="p-6 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-slate-900">{template.name}</h3>
                            {isSelected && (
                              <Badge variant="default" className="gap-1">
                                <Sparkles className="w-3 h-3" /> Selected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{template.description}</p>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full border-2 border-slate-200 flex-shrink-0 ml-3"
                          style={{ backgroundColor: template.defaultColor }}
                          title="Default accent color"
                        />
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {template.features.map((feature, idx) => (
                          <span
                            key={feature}
                            className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            className="gap-2"
            size="lg"
          >
            Continue with Template
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
