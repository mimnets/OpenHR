import React, { useState, useEffect } from 'react';
import { Archive, Tag, Calendar, ChevronRight } from 'lucide-react';
import { blogService } from '../../services/blog.service';
import { BlogPost } from '../../types';
import { navigateTo } from '../../utils/seo';

interface ArchiveEntry {
  label: string;
  year: number;
  month: number;
  count: number;
}

interface BlogSidebarProps {
  onArchiveSelect?: (year: number, month: number) => void;
  onCategorySelect?: (category: string) => void;
  selectedArchive?: { year: number; month: number } | null;
  selectedCategory?: string | null;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  onArchiveSelect,
  onCategorySelect,
  selectedArchive,
  selectedCategory,
}) => {
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSidebarData();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await blogService.getCategories();
    setCategories(result);
  };

  const loadSidebarData = async () => {
    setIsLoading(true);
    const data = await blogService.getPublishedPosts(1, 50);
    const posts = data.posts;

    // Build archive from posts
    const archiveMap = new Map<string, ArchiveEntry>();
    posts.forEach(post => {
      const date = new Date(post.publishedAt || post.created);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      if (archiveMap.has(key)) {
        archiveMap.get(key)!.count++;
      } else {
        archiveMap.set(key, {
          label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          year,
          month,
          count: 1,
        });
      }
    });

    const sortedArchives = Array.from(archiveMap.values()).sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });

    setArchives(sortedArchives);
    setRecentPosts(posts.slice(0, 5));
    setIsLoading(false);
  };

  const navigateToPost = (slug: string) => {
    navigateTo(`/blog/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton */}
        <div className="bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1 p-6 animate-pulse">
          <div className="h-5 bg-dl-hair-soft rounded-dl-sm w-1/2 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-dl-hair-soft rounded-dl-sm w-full" />
            <div className="h-4 bg-dl-hair-soft rounded-dl-sm w-4/5" />
            <div className="h-4 bg-dl-hair-soft rounded-dl-sm w-3/4" />
          </div>
        </div>
        <div className="bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1 p-6 animate-pulse">
          <div className="h-5 bg-dl-hair-soft rounded-dl-sm w-1/2 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-dl-hair-soft rounded-dl-sm w-full" />
            <div className="h-4 bg-dl-hair-soft rounded-dl-sm w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1 p-6">
          <h3 className="text-sm font-bold text-dl-ink uppercase tracking-dl-label mb-4 flex items-center gap-2">
            <BookmarkIcon /> Recent Posts
          </h3>
          <ul className="space-y-3">
            {recentPosts.map(post => (
              <li key={post.id}>
                <button
                  onClick={() => navigateToPost(post.slug)}
                  className="group w-full text-left"
                >
                  <p className="text-sm font-semibold text-dl-ink group-hover:text-dl-teal transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  <p className="text-xs text-dl-muted mt-1 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(post.publishedAt || post.created).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Blog Archive */}
      {archives.length > 0 && (
        <div className="bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1 p-6">
          <h3 className="text-sm font-bold text-dl-ink uppercase tracking-dl-label mb-4 flex items-center gap-2">
            <Archive size={14} className="text-dl-teal" /> Archive
          </h3>
          <ul className="space-y-1">
            {archives.map(entry => {
              const isActive =
                selectedArchive?.year === entry.year &&
                selectedArchive?.month === entry.month;
              return (
                <li key={`${entry.year}-${entry.month}`}>
                  <button
                    onClick={() => onArchiveSelect?.(entry.year, entry.month)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-dl-md text-sm transition-all ${
                      isActive
                        ? 'bg-dl-teal/10 text-dl-teal font-bold'
                        : 'text-dl-muted hover:bg-dl-surface-2 hover:text-dl-teal font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronRight size={12} className={isActive ? 'text-dl-teal' : 'text-dl-soft'} />
                      {entry.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-dl-teal text-dl-surface' : 'bg-dl-hair-soft text-dl-muted'
                    }`}>
                      {entry.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {selectedArchive && (
            <button
              onClick={() => onArchiveSelect?.(0, 0)}
              className="mt-3 w-full text-xs text-center text-dl-teal hover:text-dl-teal-deep font-semibold transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-dl-surface rounded-dl-lg border border-dl-hair-soft shadow-dl-1 p-6">
          <h3 className="text-sm font-bold text-dl-ink uppercase tracking-dl-label mb-4 flex items-center gap-2">
            <Tag size={14} className="text-dl-teal" /> Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategorySelect?.('')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !selectedCategory
                  ? 'bg-dl-teal text-dl-surface shadow-dl-1'
                  : 'bg-dl-hair-soft text-dl-muted hover:bg-dl-teal/10 hover:text-dl-teal'
              }`}
            >
              All Posts
            </button>
            {categories.map(({ category, count }) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onCategorySelect?.(isActive ? '' : category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 max-w-[160px] ${
                    isActive
                      ? 'bg-dl-teal text-dl-surface shadow-dl-1'
                      : 'bg-dl-hair-soft text-dl-muted hover:bg-dl-teal/10 hover:text-dl-teal'
                  }`}
                  title={category}
                >
                  <span className="truncate">{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-dl-surface/25 text-dl-surface' : 'bg-dl-surface text-dl-muted'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Small icon component for Recent Posts header
const BookmarkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dl-teal">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

export default BlogSidebar;
