/**
 * Unit tests for the clothes-filter predicate used in OutfitItemSelector.
 *
 * The predicate is inline in the component, so we replicate it here verbatim
 * and test the logic directly — no component render required.
 *
 * Predicate (from OutfitItemSelector.js filterItems):
 *   By search query: matches item.name OR item.brand (case-insensitive, null-safe)
 *   By category:     "All" = no filter; otherwise exact match on item.category
 */

// ---------------------------------------------------------------------------
// Pure re-implementation of the filter logic (mirrors OutfitItemSelector.js)
// ---------------------------------------------------------------------------

/**
 * @param {object[]} items
 * @param {string}   searchQuery
 * @param {string}   categoryFilter
 * @returns {object[]}
 */
function filterWardrobe(items, searchQuery, categoryFilter) {
  let filtered = [...items];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.brand && item.brand.toLowerCase().includes(query))
    );
  }

  if (categoryFilter !== 'All') {
    filtered = filtered.filter((item) => item.category === categoryFilter);
  }

  return filtered;
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const items = [
  { id: '1', name: 'Blue Jeans',    brand: 'Levi\'s',   category: 'Bottoms' },
  { id: '2', name: 'White Tee',     brand: undefined,    category: 'Tops'    },
  { id: '3', name: undefined,       brand: 'Nike',       category: 'Shoes'   },
  { id: '4', name: null,            brand: null,         category: 'Tops'    },
  { id: '5', name: 'Running Shoes', brand: 'Adidas',     category: 'Shoes'   },
  { id: '6', name: 'BLUE HOODIE',   brand: 'Gap',        category: 'Tops'    },
];

// ---------------------------------------------------------------------------
// Search query tests
// ---------------------------------------------------------------------------

describe('filterWardrobe — search query', () => {
  it('empty query returns all items', () => {
    expect(filterWardrobe(items, '', 'All')).toHaveLength(items.length);
  });

  it('matches name case-insensitively', () => {
    const results = filterWardrobe(items, 'blue', 'All');
    const ids = results.map((i) => i.id);
    expect(ids).toContain('1'); // "Blue Jeans"
    expect(ids).toContain('6'); // "BLUE HOODIE"
  });

  it('matches brand case-insensitively', () => {
    const results = filterWardrobe(items, 'nike', 'All');
    expect(results.map((i) => i.id)).toContain('3');
  });

  it('does NOT throw when item.name is undefined', () => {
    expect(() => filterWardrobe(items, 'nike', 'All')).not.toThrow();
  });

  it('does NOT throw when item.name is null', () => {
    expect(() => filterWardrobe(items, 'anything', 'All')).not.toThrow();
  });

  it('item with null name AND null brand is excluded from search results (no crash)', () => {
    const results = filterWardrobe(items, 'jeans', 'All');
    expect(results.map((i) => i.id)).not.toContain('4');
  });

  it('no match returns empty array', () => {
    expect(filterWardrobe(items, 'zzznomatch', 'All')).toHaveLength(0);
  });

  it('matches partial brand substring', () => {
    const results = filterWardrobe(items, 'evi', 'All'); // "Levi's"
    expect(results.map((i) => i.id)).toContain('1');
  });
});

// ---------------------------------------------------------------------------
// Category filter tests
// ---------------------------------------------------------------------------

describe('filterWardrobe — category filter', () => {
  it('"All" category returns every item', () => {
    expect(filterWardrobe(items, '', 'All')).toHaveLength(items.length);
  });

  it('filters to only matching category', () => {
    const results = filterWardrobe(items, '', 'Tops');
    expect(results.every((i) => i.category === 'Tops')).toBe(true);
    expect(results).toHaveLength(3); // ids 2, 4, 6
  });

  it('category + search both applied', () => {
    const results = filterWardrobe(items, 'blue', 'Tops');
    expect(results.map((i) => i.id)).toEqual(['6']); // "BLUE HOODIE" in Tops
  });

  it('non-matching category returns empty array', () => {
    expect(filterWardrobe(items, '', 'Hats')).toHaveLength(0);
  });
});
