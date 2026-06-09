/**
 * Unit tests for the null-safe name/description search predicate shared by
 * WardrobeScreen and OutfitsScreen.
 *
 * Both screens use the same pattern (inline):
 *   (item.name && item.name.toLowerCase().includes(query)) ||
 *   (item.description && item.description.toLowerCase().includes(query))
 *
 * We test the predicate in isolation so there's no component rendering or
 * Firebase dependency.
 */

// ---------------------------------------------------------------------------
// Pure re-implementation (mirrors both WardrobeScreen and OutfitsScreen)
// ---------------------------------------------------------------------------

/**
 * @param {object[]} items
 * @param {string}   searchQuery
 * @returns {object[]}
 */
function filterByNameOrDescription(items, searchQuery) {
  if (!searchQuery) return [...items];
  const query = searchQuery.toLowerCase();
  return items.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
  );
}

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const items = [
  { id: '1', name: 'Blue Jeans',   description: 'Slim fit denim'      },
  { id: '2', name: 'White Tee',    description: undefined              },
  { id: '3', name: undefined,      description: 'Comfy running shoes'  },
  { id: '4', name: null,           description: null                   },
  { id: '5', name: 'SUMMER DRESS', description: 'Floral print'         },
  { id: '6', name: 'Rain Jacket',  description: 'Waterproof DENIM look'},
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('filterByNameOrDescription', () => {
  it('empty query returns all items unchanged', () => {
    expect(filterByNameOrDescription(items, '')).toHaveLength(items.length);
  });

  it('matches name case-insensitively', () => {
    const results = filterByNameOrDescription(items, 'blue');
    expect(results.map((i) => i.id)).toContain('1');
  });

  it('matches name with uppercase input', () => {
    const results = filterByNameOrDescription(items, 'JEANS');
    expect(results.map((i) => i.id)).toContain('1');
  });

  it('matches name stored in uppercase', () => {
    const results = filterByNameOrDescription(items, 'summer');
    expect(results.map((i) => i.id)).toContain('5');
  });

  it('matches description case-insensitively', () => {
    const results = filterByNameOrDescription(items, 'denim');
    const ids = results.map((i) => i.id);
    expect(ids).toContain('1'); // name has no "denim", description does
    expect(ids).toContain('6'); // description uppercase "DENIM"
  });

  it('matches item that has description but no name', () => {
    const results = filterByNameOrDescription(items, 'running');
    expect(results.map((i) => i.id)).toContain('3');
  });

  it('does NOT throw when item.name is undefined', () => {
    expect(() => filterByNameOrDescription(items, 'shoes')).not.toThrow();
  });

  it('does NOT throw when item.name is null', () => {
    expect(() => filterByNameOrDescription(items, 'anything')).not.toThrow();
  });

  it('does NOT throw when both name and description are null', () => {
    expect(() => filterByNameOrDescription(items, 'query')).not.toThrow();
  });

  it('item with null name and null description is excluded from results (no crash)', () => {
    const results = filterByNameOrDescription(items, 'jeans');
    expect(results.map((i) => i.id)).not.toContain('4');
  });

  it('no match returns empty array', () => {
    expect(filterByNameOrDescription(items, 'zzznomatch')).toHaveLength(0);
  });

  it('partial substring match works', () => {
    const results = filterByNameOrDescription(items, 'slim');
    expect(results.map((i) => i.id)).toContain('1');
  });
});
