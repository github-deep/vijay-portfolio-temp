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
  description: string;
}

interface Props {
  posts: Post[];
  categories: readonly CategoryDef[];
}

const POSTS_PER_PAGE = 12;

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Read initial category from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat && categories.some(c => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
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
  }, [posts, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="pg">
      {/* Filter Bar */}
      <div className="pg__filters">
        {/* Search + Sort row */}
        <div className="pg__filter-row">
          <div className="pg__search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search title, tags, date..."
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
          <button
            className="pg__sort-btn"
            onClick={() => setSortBy(prev => prev === 'newest' ? 'oldest' : 'newest')}
            title={sortBy === 'newest' ? 'Showing newest first' : 'Showing oldest first'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: sortBy === 'oldest' ? 'scaleY(-1)' : 'none' }}>
              <path d="M3 8l4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/>
            </svg>
            <span className="pg__sort-label">{sortBy === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

        {/* Category pills */}
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
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="pg__results-count">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'piece' : 'pieces'}
        {activeCategory !== 'all' && (
          <span> in {categories.find(c => c.id === activeCategory)?.label}</span>
        )}
        {totalPages > 1 && (
          <span> · page {currentPage} of {totalPages}</span>
        )}
      </div>

      {/* Grid */}
      {paginatedPosts.length > 0 ? (
        <>
          <div className="pg__grid">
            {paginatedPosts.map((post, i) => (
              <a
                key={post.slug}
                href={`/portfolio/${post.slug}`}
                className="pg__card"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pg__pagination">
              <button
                className="pg__page-btn pg__page-prev"
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                ‹ Prev
              </button>
              <div className="pg__page-numbers">
                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <span key={`dots-${i}`} className="pg__page-dots">…</span>
                  ) : (
                    <button
                      key={page}
                      className={`pg__page-btn pg__page-num ${currentPage === page ? 'active' : ''}`}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                className="pg__page-btn pg__page-next"
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="pg__empty">
          <p>No pieces match your filters.</p>
          <button onClick={clearFilters}>Clear all filters</button>
        </div>
      )}
    </div>
  );
}
