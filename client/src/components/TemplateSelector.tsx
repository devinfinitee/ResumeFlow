import { type ResumeContent } from "@shared/schema";
import { ModernTemplate, MinimalTemplate } from "./TemplatePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Eye, ZoomIn } from "lucide-react";
import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion"; // Disabled for performance

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
  previewContent: ResumeContent;
  accentColor?: string;
}

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Sidebar layout with professional design",
    component: ModernTemplate,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and centered layout",
    component: MinimalTemplate,
  },
];

export function TemplateSelector({ selectedTemplate, onSelect, previewContent, accentColor = "#3b82f6" }: TemplateSelectorProps) {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Select Template</h3>
        <p className="text-xs text-slate-500 mt-1">Choose how your resume looks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => {
          const TemplateComponent = template.component;
          const isSelected = selectedTemplate === template.id;

          return (
            <div key={template.id} className="space-y-2">
              <Card
                className={`overflow-hidden transition-all cursor-pointer border-2 ${
                  isSelected ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" : "border-slate-200 hover:border-primary/50 hover:shadow-md"
                }`}
                onClick={() => {
                  onSelect(template.id);
                }}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                {/* Mini Preview */}
                <div className="bg-slate-100 p-4 min-h-[280px] overflow-hidden relative">
                  <div className="scale-[0.28] origin-top-left transform-gpu shadow-lg">
                    <TemplateComponent content={previewContent} accentColor={accentColor} />
                  </div>
                  
                  {/* Zoom overlay on hover */}
                  {hoveredTemplate === template.id && (
                    <div
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTemplate(expandedTemplate === template.id ? null : template.id);
                      }}
                    >
                      <Button variant="secondary" size="sm" className="gap-2">
                        <ZoomIn className="w-4 h-4" /> Preview Full Template
                      </Button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">{template.name}</h4>
                      <p className="text-xs text-slate-500">{template.description}</p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Full Preview Toggle */}
              {expandedTemplate === template.id && (
                <div className="bg-white p-6 rounded-lg border-2 border-primary shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900">Full Template Preview</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedTemplate(null)}
                    >
                      Close Preview
                    </Button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded max-h-[600px] overflow-y-auto custom-scrollbar">
                    <div className="scale-[0.6] origin-top transform-gpu shadow-2xl">
                      <TemplateComponent content={previewContent} accentColor={accentColor} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
