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
    materialName: 'Electronic Appliances & Wiring',
    confidenceScore: 97.8,
    estimatedWeightKg: 2.0,
    estimatedPoints: 400,
    recyclabilityRating: 'High',
    tips: 'Keep e-waste dry and unexposed to rain.'
  }
};

interface ClassifyResponse { category: string; materialName: string; confidence: string; pointsPerKg: number; instructions: string }

export const aiWasteDetectionService = {
  /**
   * Classifies the material via the backend (simulated vision model) and prices it with live DB rates.
   */
  async getMaterialForCategory(cat: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-Waste'): Promise<AIDetectionResult> {
    const base = MATERIAL_DATABASE[cat] || MATERIAL_DATABASE['Plastic'];
    const res = await apiPost<ClassifyResponse>('/ai/classify-material', { category: cat.toLowerCase() });
    return {
      ...base,
      materialName: res.materialName,
      confidenceScore: parseFloat(res.confidence),
      estimatedPoints: Math.round(base.estimatedWeightKg * res.pointsPerKg),
      tips: res.instructions
    };
  }
};
