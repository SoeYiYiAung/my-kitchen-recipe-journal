export type Language = 'en' | 'mm';

export interface Ingredient {
  nameEn: string;
  nameMm: string;
  amount: string;
}

export interface RecipeStep {
  step: number;
  titleEn: string;
  titleMm: string;
  descEn: string;
  descMm: string;
}

export interface Recipe {
  id: string;
  titleEn: string;
  titleMm: string;
  subtitleEn: string;
  subtitleMm: string;
  category: string;
  tags: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviewsCount: number;
  isPopular: boolean;
  bannerImage: string;
  gallery?: string[];
  ingredients?: Ingredient[];
  steps?: RecipeStep[];
}

export interface CommentEntry {
  id: number;
  author: string;
  text: string;
  date: string;
}