export interface Breed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  origin: string;
  life_span: string;
  weight: {
    imperial: string;
    metric: string;
  };
  wikipedia_url?: string;
  adaptability: number;
  affection_level: number;
  child_friendly: number;
  dog_friendly: number;
  energy_level: number;
  grooming: number;
  health_issues: number;
  intelligence: number;
  social_needs: number;
  stranger_friendly: number;
}

export interface BreedImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
  breeds?: Breed[];
}
