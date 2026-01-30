import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeContentSchema, type ResumeContent, type Resume } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, GripVertical, Sparkles, Loader2 } from "lucide-react";
import { useGenerateSummary } from "@/hooks/use-resumes";
import { ImageUpload } from "./ImageUpload";
// import { motion, AnimatePresence } from "framer-motion"; // Disabled for performance

interface ResumeFormProps {
  initialData: ResumeContent;
  onChange: (data: ResumeContent) => void;
  isSaving?: boolean;
}

export function ResumeForm({ initialData, onChange, isSaving }: ResumeFormProps) {
  const form = useForm<ResumeContent>({
    resolver: zodResolver(resumeContentSchema),
    defaultValues: initialData,
    mode: "onChange",
  });

  const { generateSummaryMutation } = useGenerateAI(form);

  // Watch for changes and bubble up to parent
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Ensure we're passing complete data structure with proper empty values
      const validatedData = {
        personalInfo: {
          fullName: value.personalInfo?.fullName || '',
          email: value.personalInfo?.email || '',
          phone: value.personalInfo?.phone || '',
          location: value.personalInfo?.location || '',
          title: value.personalInfo?.title || '',
          summary: value.personalInfo?.summary || '',
          profileImage: value.personalInfo?.profileImage || undefined,
        },
        workExperience: value.workExperience || [],
        education: value.education || [],
        skills: value.skills || [],
      } as ResumeContent;
      
      onChange(validatedData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Keep form state in sync when external initialData changes
  useEffect(() => {
    // Deep comparison to avoid unnecessary resets
    const currentValues = form.getValues();
    const hasChanged = JSON.stringify(currentValues) !== JSON.stringify(initialData);
    
    if (hasChanged) {
      console.log('🔄 Form reset triggered with new data');
      form.reset(initialData, { keepDirtyValues: false });
    }
  }, [initialData]);

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  return (
    <Form {...form}>
      <form className="space-y-6 pb-20">
        <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-4">
          
          {/* PERSONAL INFO */}
          <AccordionItem value="personal" className="border rounded-xl bg-white shadow-sm px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Personal Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Jane Doe" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Senior Software Engineer" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input {...field} placeholder="jane@example.com" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input {...field} placeholder="+1 234 567 890" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="personalInfo.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input {...field} placeholder="San Francisco, CA" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Image Upload */}
              <FormField
                control={form.control}
                name="personalInfo.profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Profile Picture (Optional)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative">
                 <FormField
                  control={form.control}
                  name="personalInfo.summary"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Professional Summary</FormLabel>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary h-8 gap-1 hover:text-primary hover:bg-primary/10"
                          onClick={() => generateSummaryMutation.mutate({
                            currentRole: form.getValues("personalInfo.title") || "",
                            experience: form.getValues("workExperience")?.map(w => `${w.position} at ${w.company}`) || [],
                            skills: form.getValues("skills")?.map(s => s.name) || []
                          })}
                          disabled={generateSummaryMutation.isPending}
                        >
                          {generateSummaryMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          AI Generate
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief overview of your professional background..." 
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* EXPERIENCE */}
          <AccordionItem value="experience" className="border rounded-xl bg-white shadow-sm px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-400 rounded-full"></span>
                Experience
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="space-y-6">
                  {workFields.map((field, index) => (
                    <div 
                      key={field.id}
                    >
                      <Card className="relative overflow-hidden group">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-primary transition-colors" />
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeWork(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                         <CardContent className="pt-6 pl-6 pr-12 pb-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.position`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.company`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl><Input {...field} placeholder="MMM YYYY" /></FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl><Input {...field} placeholder="Present" /></FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                             <FormField
                                control={form.control}
                                name={`workExperience.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea {...field} className="min-h-[100px]" /></FormControl>
                                  </FormItem>
                                )}
                              />
                         </CardContent>
                      </Card>
                    </div>
                  ))}

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5"
                  onClick={() => appendWork({ id: crypto.randomUUID(), company: "", position: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Position
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* EDUCATION */}
          <AccordionItem value="education" className="border rounded-xl bg-white shadow-sm px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-400 rounded-full"></span>
                Education
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="space-y-6">
                  {eduFields.map((field, index) => (
                    <div 
                      key={field.id}
                    >
                      <Card className="relative overflow-hidden group">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 text-slate-400 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeEdu(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                         <CardContent className="pt-6 pl-6 pr-12 pb-6 space-y-4">
                            <FormField
                              control={form.control}
                              name={`education.${index}.school`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>School / University</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`education.${index}.degree`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Degree</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <FormField
                                  control={form.control}
                                  name={`education.${index}.startDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Start</FormLabel>
                                      <FormControl><Input {...field} placeholder="Year" /></FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`education.${index}.endDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>End</FormLabel>
                                      <FormControl><Input {...field} placeholder="Year" /></FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                         </CardContent>
                      </Card>
                    </div>
                  ))}

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed border-2 py-6 text-slate-500 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50"
                  onClick={() => appendEdu({ id: crypto.randomUUID(), school: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
           {/* SKILLS */}
          <AccordionItem value="skills" className="border rounded-xl bg-white shadow-sm px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-lg font-semibold flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-400 rounded-full"></span>
                Skills
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                 {skillFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`skills.${index}.name`}
                        render={({ field }) => (
                           <Input {...field} placeholder="Skill name" className="bg-white" />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-destructive"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                 ))}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-dashed border-2 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50"
                onClick={() => appendSkill({ id: crypto.randomUUID(), name: "" })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Skill
              </Button>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </form>
    </Form>
  );
}

// Hook to handle AI generation logic
function useGenerateAI(form: any) {
  const generateSummaryMutation = useGenerateSummary();

  useEffect(() => {
    if (generateSummaryMutation.isSuccess && generateSummaryMutation.data) {
       form.setValue("personalInfo.summary", generateSummaryMutation.data.summary, { shouldDirty: true });
    }
  }, [generateSummaryMutation.isSuccess, generateSummaryMutation.data, form]);

  return { generateSummaryMutation };
}
