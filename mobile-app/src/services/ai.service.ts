import { apiPost } from './api';

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
    materialName: 'Laptop / Electronic Appliance',
    confidenceScore: 98.9,
    estimatedWeightKg: 2.4,
    estimatedPoints: 480,
    recyclabilityRating: 'High',
    tips: 'Store dry. Unplug power supplies before placing in collection bin.'
  }
};

interface ClassifyResponse {
  category: string;
  materialName: string;
  confidence: string;
  confidenceScore?: number;
  estimatedWeightKg?: number;
  pointsPerKg: number;
  instructions: string;
}

export const aiWasteDetectionService = {
  /**
   * Classifies an uploaded/captured photo using AI Vision (Google Gemini / Neural Matcher) and prices it with live DB rates.
   */
  async detectImage(imageUri?: string, base64?: string, categoryOverride?: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste', customMaterialName?: string): Promise<AIDetectionResult> {
    const filename = imageUri ? imageUri.split('/').pop() : undefined;
    const payload: any = {};
    if (categoryOverride) payload.category = categoryOverride.toLowerCase();
    if (customMaterialName) payload.materialName = customMaterialName;
    if (base64) payload.imageBase64 = base64;
    if (filename) payload.filename = filename;

    const res = await apiPost<ClassifyResponse>('/ai/classify-material', payload);
    const catFormatted = (res.category.charAt(0).toUpperCase() + res.category.slice(1)) as any;
    const base = MATERIAL_DATABASE[catFormatted] || MATERIAL_DATABASE['Plastic'];
    const estWeight = res.estimatedWeightKg || base.estimatedWeightKg;

    return {
      category: catFormatted,
      materialName: customMaterialName || res.materialName || base.materialName,
      confidenceScore: res.confidenceScore || parseFloat(res.confidence) || 98.4,
      estimatedWeightKg: estWeight,
      estimatedPoints: Math.round(estWeight * res.pointsPerKg),
      recyclabilityRating: base.recyclabilityRating || 'High',
      tips: res.instructions || base.tips
    };
  },

  /**
   * Classifies the material via category selection.
   */
  async getMaterialForCategory(cat: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste', customMaterialName?: string): Promise<AIDetectionResult> {
    return this.detectImage(undefined, undefined, cat, customMaterialName);
  }
};
