/**
 * Image upload utility for converting image files to base64 data URLs
 * Useful for storing images in localStorage
 */

export const imageUploadUtils = {
  /**
   * Convert a file to a base64 data URL
   */
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Check if a file is a valid image
   */
  isValidImage: (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  },

  /**
   * Get validation error message
   */
  getValidationError: (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WebP images are allowed";
    }
    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }
    return null;
  },
};
