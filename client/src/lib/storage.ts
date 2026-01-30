import type { Resume, InsertResume } from "@shared/schema";

const STORAGE_KEY = "resumeflow_resumes";
let nextId = 1;

export const storage = {
  getResumes: async (): Promise<Resume[]> => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const resumes = JSON.parse(data);
      // Update nextId based on existing resumes
      if (resumes.length > 0) {
        nextId = Math.max(...resumes.map((r: Resume) => r.id)) + 1;
      }
      return resumes;
    } catch {
      return [];
    }
  },

  getResume: async (id: number): Promise<Resume | null> => {
    try {
      const resumes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return resumes.find((r: Resume) => r.id === id) || null;
    } catch {
      return null;
    }
  },

  createResume: async (data: InsertResume): Promise<Resume> => {
    try {
      const resumes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newResume: Resume = {
        id: nextId++,
        userId: "demo-user",
        title: data.title || "My Resume",
        templateId: data.templateId || "modern",
        accentColor: data.accentColor || "#3b82f6",
        content: data.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resumes.push(newResume);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      return newResume;
    } catch {
      throw new Error("Failed to create resume");
    }
  },

  updateResume: async (id: number, updates: Partial<InsertResume>): Promise<Resume> => {
    try {
      const resumes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const index = resumes.findIndex((r: Resume) => r.id === id);
      
      if (index === -1) {
        throw new Error("Resume not found");
      }

      const existing = resumes[index];
      resumes[index] = {
        ...existing,
        ...updates,
        id: existing.id,
        userId: existing.userId,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      return resumes[index];
    } catch (error) {
      throw new Error("Failed to update resume");
    }
  },

  deleteResume: async (id: number): Promise<void> => {
    try {
      const resumes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const filtered = resumes.filter((r: Resume) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      throw new Error("Failed to delete resume");
    }
  },
};
