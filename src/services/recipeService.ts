import { recipes } from '../data/recipes';
import type { Recipe } from '../types';

export async function getRecipes(): Promise<Recipe[]> {
  return [...recipes].reverse();
}