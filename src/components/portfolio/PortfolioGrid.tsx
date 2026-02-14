import { useState, useMemo, useEffect } from 'react';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  thumbnail?: string;
  featured: boolean;
}

interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface Props {
  posts: Post[];
  categories: readonly CategoryDef[];
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];
const MONTHS_SHORT = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

function matchesDateQuery(dateStr: string, query: string): boolean {
  const date = new Date(dateStr);
  const year = date.getFullYear().toString();
  const monthIdx = date.getMonth();
  const monthFull = MONTHS[monthIdx];
  const monthShort = MONTHS_SHORT[monthIdx];
  const q = query.toLowerCase().trim();

  if (q === year) return true;
  if (q === monthFull || q === monthShort) return true;
  if (q.includes(monthFull) && q.includes(year)) return true;
  if (q.includes(monthShort) && q.includes(year)) return true;
  const slashMatch = q.match(/^(\d{1,2})\s*[\/\-]\s*(\d{4})$/);
  if (slashMatch) {
    const qMonth = parseInt(slashMatch[1]) - 1;
    const qYear = slashMatch[2];
    return monthIdx === qMonth && year === qYear;
  }
  return false;
}

export default function PortfolioGrid({ posts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && categories.some(c => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (activeTags.length > 0) {
      result = result.filter(p =>
        activeTags.some(tag => p.tags.includes(tag))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        matchesDateQuery(p.date, q)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, activeCategory, activeTags, searchQuery, sortBy]);

  const clearFilters = () => {
    setActiveCategory('all');
    setActiveTags([]);
    setSearchQuery('');
  };

  return (
    <div className="pg">
      <div className="pg__filters">
        <div className="pg__filter-row">
          <div className="pg__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search title, tags, or date (e.g. june 2024)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pg__search-input"
            />
            {searchQuery && (
              <button
                className="pg__search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="pg__sort"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        <div className="pg__pills">
          <button
            className={`pg__pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`pg__pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="pg__pill-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="pg__pills pg__pills--secondary">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`pg__pill pg__pill--sm ${activeTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
          {activeTags.length > 0 && (
            <button
              className="pg__pill pg__pill--sm pg__pill--clear"
              onClick={() => setActiveTags([])}
            >
              Clear tags ×
            </button>
          )}
        </div>
      </div>

      <div className="pg__results-count">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'piece' : 'pieces'}
        {activeCategory !== 'all' && (
          <span> in {categories.find(c => c.id === activeCategory)?.label}</span>
        )}
        {activeTags.length > 0 && (
          <span> tagged {activeTags.join(', ')}</span>
        )}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="pg__grid">
          {filteredPosts.map((post, i) => (
            <a
              key={post.slug}
              href={`/portfolio/${post.slug}`}
              className="pg__card"
              style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
            >
              <div className="pg__card-image">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="pg__card-placeholder">
                    <span>{post.category === 'films' ? '🎬' : post.category === 'cycling' ? '🚴' : '✍️'}</span>
                  </div>
                )}
              </div>
              <div className="pg__card-body">
                <div className="pg__card-tags">
                  <span className="pg__card-tag pg__card-tag--cat">{post.category.replace(/-/g, ' ')}</span>
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="pg__card-tag">{tag}</span>
                  ))}
                </div>
                <h3 className="pg__card-title">{post.title}</h3>
                <p className="pg__card-desc">{post.description}</p>
                <time className="pg__card-date">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </time>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="pg__empty">
          <p>No pieces match your filters.</p>
          <button onClick={clearFilters}>Clear all filters</button>
        </div>
      )}
    </div>
  );
}
