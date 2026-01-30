import { z } from 'zod';

// Resume Content Types
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  profileImage: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, "School name is required"),
  degree: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
});

export const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationSchema),
  workExperience: z.array(workExperienceSchema),
  skills: z.array(skillSchema),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;

// Resume Type Definition
export const insertResumeSchema = z.object({
  title: z.string().default("My Resume"),
  templateId: z.string().default("modern"),
  accentColor: z.string().default("#3b82f6").optional(),
  content: resumeContentSchema,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;

export type Resume = {
  id: number;
  userId: string;
  title: string;
  templateId: string;
  accentColor: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
};

// API Types
export type UpdateResumeRequest = Partial<InsertResume>;
export type GenerateSummaryRequest = {
  currentRole: string;
  experience: string[];
  skills: string[];
};
export type GenerateSummaryResponse = {
  summary: string;
};

