import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import SiteHeader from './components/SiteHeader';
import RecipeBrowser, { FeaturedRecipeSkeleton, RecipeFilters } from './components/RecipeBrowser';
import RecipeDetail from './components/RecipeDetail';
import { getComments, saveComments } from './services/commentService';
import { getRecipes } from './services/recipeService';
import type { CommentEntry, Language, Recipe } from './types';

function getRecipeIdFromUrl(recipes: Recipe[]) {
  const recipeId = new URLSearchParams(window.location.search).get('recipe');
  return recipes.find((recipe) => recipe.id === recipeId)?.id ?? recipes[0]?.id ?? '';
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('happy-yum-diary-theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [hasRecipeLoadError, setHasRecipeLoadError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeRecipeId, setActiveRecipeId] = useState('');
  const [isCompactDetailOpen, setIsCompactDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activePhoto, setActivePhoto] = useState(0);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({ 'mohinga-classic': 342, 'crispy-tempura-gourd': 189 });
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [savedRecipes, setSavedRecipes] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, CommentEntry[]>>(getComments);
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const recipeListRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => ['All', ...Array.from(new Set(recipes.map((recipe) => recipe.category))).sort()], [recipes]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem('happy-yum-diary-theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // Theme switching still works for this session if storage is unavailable.
    }
  }, [isDarkMode]);

  useEffect(() => {
    let isCurrent = true;
    getRecipes().then((loadedRecipes) => {
      if (!isCurrent) return;
      setRecipes(loadedRecipes);
      setActiveRecipeId(getRecipeIdFromUrl(loadedRecipes));
      setIsLoadingRecipes(false);
    }).catch(() => {
      if (!isCurrent) return;
      setHasRecipeLoadError(true);
      setIsLoadingRecipes(false);
    });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    if (recipes.length === 0) return;
    const handlePopState = () => {
      setActiveRecipeId(getRecipeIdFromUrl(recipes));
      setActivePhoto(0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [recipes]);

  const filteredRecipes = useMemo(() => recipes.filter((recipe) => {
    const normalizedSearch = searchQuery.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory || recipe.tags.includes(selectedCategory);
    const matchesSearch = recipe.titleEn.toLowerCase().includes(normalizedSearch) || recipe.titleMm.includes(searchQuery) || recipe.category.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  }), [recipes, selectedCategory, searchQuery]);
  const displayedRecipes = selectedCategory === 'All' ? filteredRecipes.slice(0, 1) : filteredRecipes;
  const activeRecipe = recipes.find((recipe) => recipe.id === activeRecipeId);

  const toggleStep = (index: number) => {
    if (!activeRecipe) return;
    const key = `${activeRecipe.id}-${index}`;
    setCompletedSteps((previous) => ({ ...previous, [key]: !previous[key] }));
  };
  const toggleLike = () => {
    if (!activeRecipe) return;
    const wasLiked = !!hasLiked[activeRecipe.id];
    setHasLiked((previous) => ({ ...previous, [activeRecipe.id]: !wasLiked }));
    setLikesCount((previous) => ({ ...previous, [activeRecipe.id]: (previous[activeRecipe.id] ?? 0) + (wasLiked ? -1 : 1) }));
  };
  const selectRecipe = (recipeId: string, openCompactDetail = true) => {
    if (!recipes.some((recipe) => recipe.id === recipeId)) return;
    setActiveRecipeId(recipeId);
    setActivePhoto(0);
    setIsCompactDetailOpen(openCompactDetail);
    const url = new URL(window.location.href);
    url.searchParams.set('recipe', recipeId);
    window.history.pushState({}, '', url);
  };
  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') setSearchQuery('');
    const normalizedSearch = searchQuery.toLowerCase();
    const nextRecipe = category === 'All' ? recipes[0] : recipes.find((recipe) =>
      (recipe.category === category || recipe.tags.includes(category)) &&
      (recipe.titleEn.toLowerCase().includes(normalizedSearch) || recipe.titleMm.includes(searchQuery) || recipe.category.toLowerCase().includes(normalizedSearch))
    );
    setIsCompactDetailOpen(false);
    if (nextRecipe) selectRecipe(nextRecipe.id, false);
  };
  const backToRecipes = () => {
    setIsCompactDetailOpen(false);
    requestAnimationFrame(() => recipeListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeRecipe || !newCommentText.trim()) return;
    const entry: CommentEntry = {
      id: Date.now(),
      author: newCommentAuthor.trim() || (language === 'en' ? 'Foodie Friend' : 'ဧည့်သည်'),
      text: newCommentText,
      date: language === 'en' ? 'Just now' : 'ခုနလေးက',
    };
    setComments((previous) => ({ ...previous, [activeRecipe.id]: [entry, ...(previous[activeRecipe.id] ?? [])] }));
    saveComments({ ...comments, [activeRecipe.id]: [entry, ...(comments[activeRecipe.id] ?? [])] });
    setNewCommentText('');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-slate-800 selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader language={language} darkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode((current) => !current)} onToggleLanguage={() => setLanguage((current) => current === 'en' ? 'mm' : 'en')} />
      <RecipeFilters language={language} categories={categories} selectedCategory={selectedCategory} searchQuery={searchQuery} onCategoryChange={changeCategory} onSearchChange={setSearchQuery} />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        {isLoadingRecipes ? selectedCategory === 'All' ? <FeaturedRecipeSkeleton /> : <RecipeBrowser language={language} recipes={[]} categories={categories} selectedCategory={selectedCategory} searchQuery={searchQuery} activeRecipeId="" isLoading onSelectRecipe={selectRecipe} onCategoryChange={changeCategory} onSearchChange={setSearchQuery} /> : hasRecipeLoadError || !activeRecipe ? <p className="text-sm text-rose-600">{language === 'en' ? 'Recipes could not be loaded.' : 'ဟင်းချက်နည်းများ ဖွင့်၍မရပါ။'}</p> : <>
          {selectedCategory !== 'All' && <div ref={recipeListRef} className={`scroll-mt-20 ${isCompactDetailOpen ? 'hidden' : 'block'}`}><RecipeBrowser language={language} recipes={displayedRecipes} categories={categories} selectedCategory={selectedCategory} searchQuery={searchQuery} activeRecipeId={activeRecipe.id} onSelectRecipe={selectRecipe} onCategoryChange={changeCategory} onSearchChange={setSearchQuery} /></div>}
          <div className={`scroll-mt-20 ${selectedCategory !== 'All' && !isCompactDetailOpen ? 'hidden' : 'block'}`}>
            <RecipeDetail key={activeRecipe.id} isFeatured={selectedCategory === 'All'} showBackToRecipes={selectedCategory !== 'All' && isCompactDetailOpen} onBackToRecipes={backToRecipes} recipe={activeRecipe} language={language} activePhoto={activePhoto} completedSteps={completedSteps} likes={likesCount[activeRecipe.id] ?? 0} liked={!!hasLiked[activeRecipe.id]} saved={!!savedRecipes[activeRecipe.id]} comments={comments[activeRecipe.id] ?? []} author={newCommentAuthor} commentText={newCommentText} onPhotoChange={setActivePhoto} onToggleStep={toggleStep} onToggleLike={toggleLike} onToggleSave={() => setSavedRecipes((previous) => ({ ...previous, [activeRecipe.id]: !previous[activeRecipe.id] }))} onAuthorChange={setNewCommentAuthor} onCommentChange={setNewCommentText} onAddComment={addComment} />
          </div>
        </>}
      </main>
      <footer className="mt-12 border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500"><div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 sm:flex-row"><p>© 2026 Happy Yum Diary. Warm homemade Burmese & global recipes.</p></div></footer>
    </div>
  );
}