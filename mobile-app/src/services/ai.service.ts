export interface AIDetectionResult {
  category: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste';
  materialName: string;
  confidenceScore: number; // e.g. 98.6
  estimatedWeightKg: number; // e.g. 2.5
  estimatedPoints: number; // e.g. 125
  recyclabilityRating: 'High' | 'Medium' | 'Low';
  tips: string;
}

const MATERIAL_DATABASE: Record<string, AIDetectionResult> = {
  Plastic: {
    category: 'Plastic',
    materialName: 'PET Bottles & Containers',
    confidenceScore: 98.6,
    estimatedWeightKg: 2.5,
    estimatedPoints: 125,
    recyclabilityRating: 'High',
    tips: 'Rinse bottles and cap tight before placing in collection bin.'
  },
  Paper: {
    category: 'Paper',
    materialName: 'Corrugated Paper & Cardboard',
    confidenceScore: 96.4,
    estimatedWeightKg: 3.5,
    estimatedPoints: 105,
    recyclabilityRating: 'High',
    tips: 'Flatten boxes flat to minimize storage space.'
  },
  Metal: {
    category: 'Metal',
    materialName: 'Aluminum Beverage Cans',
    confidenceScore: 99.2,
    estimatedWeightKg: 1.5,
    estimatedPoints: 150,
    recyclabilityRating: 'High',
    tips: 'Rinse cans clean to maximize payout rate.'
  },
  Glass: {
    category: 'Glass',
    materialName: 'Glass Bottles & Jars',
    confidenceScore: 95.0,
    estimatedWeightKg: 4.0,
    estimatedPoints: 120,
    recyclabilityRating: 'Medium',
    tips: 'Separate glass jars by clear vs. green glass.'
  },
  'E-Waste': {
    category: 'E-Waste',
    materialName: 'Electronic Appliances & Wiring',
    confidenceScore: 97.8,
    estimatedWeightKg: 2.0,
    estimatedPoints: 400,
    recyclabilityRating: 'High',
    tips: 'Keep e-waste dry and unexposed to rain.'
  }
};

export const aiWasteDetectionService = {
  /**
   * Analyzes photo using AI Vision (Google Gemini API simulation)
   */
  detectRecyclableWaste: async (imageUri?: string): Promise<AIDetectionResult> => {
    // Simulate AI inference delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Default to Plastic PET as standard vision detection
    return MATERIAL_DATABASE['Plastic'];
  },

  /**
   * Get metadata for specific category selection
   */
  getMaterialForCategory: (cat: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste'): AIDetectionResult => {
    return MATERIAL_DATABASE[cat] || MATERIAL_DATABASE['Plastic'];
  }
};

