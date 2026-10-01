import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Flame, Search, Star, Utensils } from 'lucide-react';
import type { Language, Recipe } from '../types';

interface RecipeBrowserProps {
  language: Language;
  recipes: Recipe[];
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  activeRecipeId: string;
  isLoading?: boolean;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onSelectRecipe: (id: string) => void;
}

export function RecipeFilters({ language, categories, selectedCategory, searchQuery, onCategoryChange, onSearchChange }: Pick<RecipeBrowserProps, 'language' | 'categories' | 'selectedCategory' | 'searchQuery' | 'onCategoryChange' | 'onSearchChange'>) {
  return (
    <section className="border-b border-slate-100 bg-gradient-to-b from-amber-50/60 via-orange-50/20 to-transparent py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <span className="mb-3 inline-flex items-center rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800">{language === 'en' ? 'Recipes from My Kitchen' : 'ကျွန်မရဲ့ မီးဖိုချောင်မှ ဟင်းလျာများ'}</span>
        <h2 className="mx-auto max-w-2xl font-display text-2xl font-bold leading-snug text-slate-900 sm:text-4xl">{language === 'en' ? 'Made with Love, Shared with Joy' : 'မေတ္တာနဲ့ချက်၊ ပျော်ရွှင်စွာမျှဝေ'}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 sm:text-base">{language === 'en' ? 'A little collection of the delicious dishes I love to make and share.' : 'ကိုယ်တိုင်နှစ်သက်စွာ ချက်ပြုတ်ပြီး မျှဝေထားတဲ့ အရသာရှိသော ဟင်းလျာလေးများ။'}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => <button key={category} onClick={() => onCategoryChange(category)} aria-pressed={selectedCategory === category} className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${selectedCategory === category ? 'bg-amber-500 text-white shadow-md shadow-amber-200' : 'border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-100'}`}>{category === 'All' ? (language === 'en' ? 'Latest' : 'နောက်ဆုံး') : category}</button>)}
        </div>
        {selectedCategory !== 'All' && <div className="relative mx-auto mt-4 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input aria-label="Search recipes" placeholder={language === 'en' ? 'Search dishes, e.g. Mohinga, Tempura, Rice...' : 'ရှာဖွေရန်... ဥပမာ - မုန့်ဟင်းခါး၊ အကြော်၊ ထမင်း'} value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
        </div>}
      </div>
    </section>
  );
}

export default function RecipeBrowser({ language, recipes, selectedCategory, searchQuery, activeRecipeId, isLoading = false, onSelectRecipe }: RecipeBrowserProps) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(recipes.length / pageSize));
  const pageRecipes = recipes.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [recipes, selectedCategory, searchQuery]);

  return (
    <section className="space-y-4">
      <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-slate-800"><Utensils className="h-4 w-4 text-amber-500" />{selectedCategory === 'All' ? (language === 'en' ? 'Latest Recipe' : 'နောက်ဆုံးထည့်ထားသော ဟင်းချက်နည်း') : (language === 'en' ? 'Recipes' : 'ဟင်းချက်နည်းများ')} <span className="text-xs font-normal text-slate-400">({isLoading ? '...' : recipes.length})</span></h3>
      {isLoading ? <div className="space-y-3" aria-label={language === 'en' ? 'Loading recipes' : 'ဟင်းချက်နည်းများ ဖွင့်နေသည်'}>{Array.from({ length: pageSize }, (_, index) => <div key={index} className="flex animate-pulse items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800"><div className="h-20 w-20 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-700" /><div className="min-w-0 flex-1 space-y-2"><div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" /><div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" /><div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" /></div></div>)}</div> : recipes.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">{language === 'en' ? 'No recipes found matching your search.' : 'ရှာဖွေမှုနှင့် ကိုက်ညီသော ဟင်းချက်နည်း မရှိပါ။'}</div> : pageRecipes.map((recipe, index) => (
        <button key={recipe.id} type="button" onClick={() => onSelectRecipe(recipe.id)} aria-current={recipe.id === activeRecipeId ? 'true' : undefined} style={{ animationDelay: `${index * 70}ms` }} className={`recipe-card-enter block w-full cursor-pointer rounded-2xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${recipe.id === activeRecipeId ? 'border-amber-400 bg-white shadow-md ring-2 ring-amber-100' : 'border-slate-200/80 bg-white/70 hover:bg-white hover:shadow-sm'}`}>
          <div className="flex items-center gap-3.5">
            <img src={recipe.bannerImage} alt={recipe.titleEn} className="h-20 w-20 shrink-0 rounded-xl border border-slate-100 object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">{recipe.category}</span>{recipe.isPopular && <span className="flex items-center gap-0.5 text-[10px] font-medium text-rose-600"><Flame className="h-3 w-3 fill-rose-500" />Popular</span>}</div>
              <h4 className="mt-1 truncate text-sm font-bold text-slate-800 sm:text-base">{language === 'en' ? recipe.titleEn : recipe.titleMm}</h4>
              <p className="mt-0.5 truncate text-xs text-slate-500">{language === 'en' ? recipe.subtitleEn : recipe.subtitleMm}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">{recipe.cookTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{recipe.cookTime}</span>}<span className="flex items-center gap-1 font-medium text-amber-600"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{recipe.rating}</span></div>
            </div>
          </div>
        </button>
      ))}
      {!isLoading && pageCount > 1 && <nav aria-label={language === 'en' ? 'Recipe pages' : 'ဟင်းချက်နည်း စာမျက်နှာများ'} className="flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-xs text-slate-500">{language === 'en' ? `Page ${page} of ${pageCount}` : `${page} / ${pageCount} စာမျက်နှာ`}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label={language === 'en' ? 'Previous page' : 'ယခင်စာမျက်နှာ'} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} aria-label={language === 'en' ? 'Next page' : 'နောက်စာမျက်နှာ'} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </nav>}
    </section>
  );
}

export function FeaturedRecipeSkeleton() {
  return <div aria-label="Loading latest recipe" className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div className="h-80 bg-slate-200 dark:bg-slate-700 sm:h-[28rem]" />
    <div className="space-y-3 p-6">
      <div className="h-5 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="h-8 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-700" />
    </div>
  </div>;
}