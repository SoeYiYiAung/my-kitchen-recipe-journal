import { ArrowLeft, Award, Bookmark, Check, Clock, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CommentEntry, Language, Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  language: Language;
  isFeatured: boolean;
  showBackToRecipes: boolean;
  onBackToRecipes: () => void;
  activePhoto: number;
  completedSteps: Record<string, boolean>;
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: CommentEntry[];
  author: string;
  commentText: string;
  onPhotoChange: (index: number) => void;
  onToggleStep: (index: number) => void;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onAuthorChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onAddComment: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function RecipeDetail(props: RecipeDetailProps) {
  const { recipe, language, isFeatured, showBackToRecipes, onBackToRecipes, activePhoto, completedSteps, likes, liked, saved, comments, author, commentText, onPhotoChange, onToggleStep, onToggleLike, onToggleSave, onAuthorChange, onCommentChange, onAddComment } = props;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const stepKey = (index: number) => `${recipe.id}-${index}`;
  useEffect(() => setCopyStatus('idle'), [recipe.id]);

  const copyRecipeLink = async () => {
    const recipeUrl = new URL(window.location.href);
    recipeUrl.searchParams.set('recipe', recipe.id);
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(recipeUrl.href);
          setCopyStatus('copied');
          return;
        } catch {}
      }
      const textarea = document.createElement('textarea');
      textarea.value = recipeUrl.href;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      let copied = false;
      try {
        textarea.select();
        copied = document.execCommand('copy');
      } finally {
        textarea.remove();
      }
      setCopyStatus(copied ? 'copied' : 'error');
    } catch {
      setCopyStatus('error');
    }
  };
  return (
    <div className="space-y-3">
      {showBackToRecipes && <button onClick={onBackToRecipes} className="group inline-flex min-h-11 items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800 transition-colors group-hover:bg-amber-200"><ArrowLeft className="h-4 w-4" /></span>
        <span>{language === 'en' ? 'Back to recipes' : 'ဟင်းချက်နည်းများသို့ ပြန်သွားရန်'}</span>
      </button>}
      <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      <div className={`overflow-hidden ${isFeatured ? 'h-80 sm:h-[28rem]' : 'h-64 sm:h-80'}`}>
        <img src={recipe.gallery?.[activePhoto] || recipe.bannerImage} alt={recipe.titleEn} className="h-full w-full object-cover" />
      </div>
      <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{recipe.category}</span>
          <button onClick={onToggleSave} aria-label={saved ? 'Remove saved recipe' : 'Save recipe'} aria-pressed={saved} className={`rounded-full p-2 transition-colors ${saved ? 'bg-rose-500 text-white' : 'bg-rose-50 text-slate-700 hover:bg-rose-100'}`}><Bookmark className="h-4 w-4" /></button>
        </div>
        <h2 className="font-display text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{language === 'en' ? recipe.titleEn : recipe.titleMm}</h2>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">{language === 'en' ? recipe.subtitleEn : recipe.subtitleMm}</p>
      </div>
      {recipe.gallery?.length ? <div className="flex items-center gap-3 overflow-x-auto border-b border-amber-100/60 bg-amber-50/40 p-4"><span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-800"><Sparkles className="h-3.5 w-3.5 text-amber-500" />{language === 'en' ? 'Plating Gallery:' : 'ဓါတ်ပုံ ကြည့်ရန်:'}</span>{recipe.gallery.map((image, index) => <button key={image} onClick={() => onPhotoChange(index)} aria-label={`View recipe photo ${index + 1}`} aria-pressed={activePhoto === index} className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${activePhoto === index ? 'scale-105 border-amber-500 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'}`}><img src={image} alt="Plating view" className="h-full w-full object-cover" /></button>)}</div> : null}
      {[recipe.prepTime && ['Prep Time', recipe.prepTime], recipe.cookTime && ['Cook Time', recipe.cookTime], recipe.servings && ['Servings', `${recipe.servings} People`]].filter((item): item is string[] => Boolean(item)).length > 0 && <div className="grid divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50 py-3 text-center" style={{ gridTemplateColumns: `repeat(${[recipe.prepTime, recipe.cookTime, recipe.servings].filter(Boolean).length}, minmax(0, 1fr))` }}>{[[recipe.prepTime && ['Prep Time', recipe.prepTime]], [recipe.cookTime && ['Cook Time', recipe.cookTime]], [recipe.servings && ['Servings', `${recipe.servings} People`]]].flat().filter((item): item is string[] => Boolean(item)).map(([label, value]) => <div key={label}><span className="block text-[10px] font-medium uppercase text-slate-400">{label}</span><span className="text-xs font-semibold text-slate-700 sm:text-sm">{value}</span></div>)}</div>}
      <div className="space-y-6 p-5 sm:p-6">
        {recipe.ingredients?.length ? <section><h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800"><Award className="h-4 w-4 text-amber-500" />{language === 'en' ? 'Ingredients Checklist' : 'လိုအပ်သော ပါဝင်ပစ္စည်းများ'}</h3><div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">{recipe.ingredients.map((ingredient) => <div key={ingredient.nameEn} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs sm:text-sm"><span className="font-medium text-slate-700">{language === 'en' ? ingredient.nameEn : ingredient.nameMm}</span><span className="shrink-0 rounded-md bg-amber-100/60 px-2 py-0.5 text-xs font-semibold text-amber-700">{ingredient.amount}</span></div>)}</div></section> : null}
        {recipe.steps?.length ? <section><h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800"><Clock className="h-4 w-4 text-amber-500" />{language === 'en' ? 'Step-by-Step Cooking Steps' : 'အဆင့်ဆင့် ချက်ပြုတ်နည်း'}</h3><div className="space-y-3">{recipe.steps.map((step, index) => { const done = !!completedSteps[stepKey(index)]; return <button key={step.step} onClick={() => onToggleStep(index)} aria-pressed={done} className={`flex w-full cursor-pointer items-start gap-3.5 rounded-2xl border p-4 text-left transition-colors ${done ? 'border-emerald-200 bg-emerald-50/50 text-slate-600' : 'border-slate-200 bg-white hover:border-amber-300'}`}><span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-800'}`}>{done ? <Check className="h-3.5 w-3.5" /> : step.step}</span><span className="flex-1"><span className={`block text-sm font-bold ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{language === 'en' ? step.titleEn : step.titleMm}</span><span className={`mt-1 block text-xs leading-relaxed ${done ? 'text-slate-400' : 'text-slate-600'}`}>{language === 'en' ? step.descEn : step.descMm}</span></span></button>; })}</div></section> : null}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button onClick={onToggleLike} aria-pressed={liked} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${liked ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}><Heart className={`h-4 w-4 ${liked ? 'fill-white' : ''}`} />{likes} Likes</button>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-400 sm:inline">{language === 'en' ? 'Share Recipe:' : 'မျှဝေရန်:'}</span>
            <button onClick={() => void copyRecipeLink()} className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200">
              <Share2 className="h-3.5 w-3.5" />
              <span aria-live="polite">{copyStatus === 'copied' ? (language === 'en' ? 'Copied!' : 'ကူးယူပြီးပါပြီ') : copyStatus === 'error' ? (language === 'en' ? 'Copy failed' : 'ကူးယူ၍မရပါ') : language === 'en' ? 'Copy Link' : 'လင့်ခ်ကူးယူရန်'}</span>
            </button>
          </div>
        </div>
        <section className="border-t border-slate-100 pt-4"><h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800"><MessageCircle className="h-4 w-4 text-amber-500" />{language === 'en' ? 'Community Thoughts & Tips' : 'မှတ်ချက်များ'}</h3><form onSubmit={onAddComment} className="mb-4 space-y-2"><input value={author} onChange={(event) => onAuthorChange(event.target.value)} placeholder={language === 'en' ? 'Your Name (optional)' : 'သင့်အမည်'} className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300" /><div className="flex gap-2"><input value={commentText} onChange={(event) => onCommentChange(event.target.value)} placeholder={language === 'en' ? 'Write a friendly tip or thought...' : 'မှတ်ချက် ရေးရန်...'} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300" /><button type="submit" className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600">{language === 'en' ? 'Post' : 'တင်မည်'}</button></div></form><div className="space-y-2.5">{comments.map((comment) => <div key={comment.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs"><div className="mb-1 flex items-center justify-between"><span className="font-bold text-slate-800">{comment.author}</span><span className="text-[10px] text-slate-400">{comment.date}</span></div><p className="text-slate-600">{comment.text}</p></div>)}</div></section>
      </div>
      </article>
    </div>
  );
}