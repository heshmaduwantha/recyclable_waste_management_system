export interface CapturedPhoto {
  uri: string;
  timestamp: string;
  fileSizeBytes: number;
}

export const cameraService = {
  /**
   * Mock photo capture helper for waste proof verification
   */
  captureWasteProofPhoto: async (): Promise<CapturedPhoto> => {
    // Simulate camera hardware capture delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      uri: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      timestamp: new Date().toISOString(),
      fileSizeBytes: 1024 * 450
    };
  }
};
