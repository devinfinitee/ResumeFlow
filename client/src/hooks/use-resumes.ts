import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import type { InsertResume, Resume } from "@shared/schema";

const RESUMES_QUERY_KEY = ["resumes"];
const RESUME_QUERY_KEY = (id: number) => ["resume", id];

export function useResumes() {
  return useQuery({
    queryKey: RESUMES_QUERY_KEY,
    queryFn: () => storage.getResumes(),
  });
}

export function useResume(id: number) {
  return useQuery({
    queryKey: RESUME_QUERY_KEY(id),
    queryFn: () => storage.getResume(id),
    enabled: !isNaN(id),
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertResume) => {
      return storage.createResume(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
      toast({ title: "Success", description: "Resume created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create resume",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertResume>) => {
      return storage.updateResume(id, updates);
    },
    onSuccess: (data) => {
      // Invalidate and refetch queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: RESUME_QUERY_KEY(data.id) });
      
      // Also update the cache directly for immediate UI update
      queryClient.setQueryData(RESUME_QUERY_KEY(data.id), data);
      queryClient.setQueryData(RESUMES_QUERY_KEY, (old: Resume[] | undefined) => {
        if (!old) return [data];
        return old.map(resume => resume.id === data.id ? data : resume);
      });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save resume",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      return storage.deleteResume(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
      toast({ title: "Deleted", description: "Resume has been permanently deleted" });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete resume",
        variant: "destructive",
      });
    },
  });
}

export function useGenerateSummary() {
  return useMutation({
    mutationFn: async (data: {
      currentRole: string;
      experience: string[];
      skills: string[];
    }) => {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const result = await response.json();
      return { summary: result.summary };
    },
  });
}
