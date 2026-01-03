/**
 * Get the base URL for media files
 */
export const getMediaBaseURL = (): string => {
  return process.env.EXPO_PUBLIC_MEDIA_BASE_URL || 'https://staging.bayzati.com';
};
