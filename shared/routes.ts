import { z } from 'zod';
import { insertResumeSchema } from './schema';

// Type definitions for API requests/responses
export type UpdateResumeRequest = Partial<z.infer<typeof insertResumeSchema>>;

export type GenerateSummaryRequest = {
  currentRole: string;
  experience: string[];
  skills: string[];
};

export type GenerateSummaryResponse = {
  summary: string;
};

