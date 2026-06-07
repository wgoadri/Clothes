# 🎨 Complete Styling Architecture for Your Closet App

## 📁 Proposed Structure

```
src/
├── styles/
│   ├── theme.js                    # ✨ Core theme (colors, spacing, typography)
│   ├── globalStyles.js             # ✨ Global reusable styles
│   ├── components/                 # ✨ NEW: Component-specific styles
│   │   ├── buttons.js
│   │   ├── cards.js
│   │   ├── inputs.js
│   │   └── layout.js
│   └── mixins.js                   # ✨ Style utilities & helpers
│
├── components/
│   └── [component].js              # Local styles only for unique elements
```

---

## 🎯 Philosophy: The 3-Tier System

### **Tier 1: Theme (Foundation)**
**File**: `styles/theme.js`  
**Purpose**: Single source of truth for design tokens  
**Usage**: Import everywhere

### **Tier 2: Global Styles (Reusable Patterns)**
**Files**: `styles/globalStyles.js`, `styles/components/*.js`  
**Purpose**: Common UI patterns used across multiple screens  
**Usage**: Import when you need these patterns

### **Tier 3: Component Styles (Unique)**
**Location**: Inside component files  
**Purpose**: Styles specific to that component only  
**Usage**: Keep in same file for colocation

---

## 📐 Implementation

### 1️⃣ Core Theme (Most Important!)

```javascript
// src/styles/theme.js

export const colors = {
  // Primary Palette
  primary: {
    cream: '#FAF8F5',
    lightBeige: '#F5EDE5',
    beige: '#E8DED2',
    warmBrown: '#C9A07A',
    mediumBrown: '#A47E5C',
    darkBrown: '#8B7355',
    richBrown: '#6B5B4D',
  },
  
  // Neutrals
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F0EBE3',
    gray: '#A89888',
    darkGray: '#6B5B4D',
  },
  
  // Semantic Colors
  semantic: {
    success: '#7CB342',
    error: '#D97757',
    warning: '#F9A825',
    info: '#42A5F5',
  },
  
  // Accent
  accent: {
    gold: '#D4AF37',
    rose: '#D97757',
  },
  
  // Opacity helpers
  overlay: (color, opacity) => `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const typography = {
  // Font sizes
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.3,
    wider: 0.5,
  },
};

export const borderRadius = {
  sm: 8,
  base: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const shadows = {
  sm: {
    shadowColor: colors.primary.darkBrown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primary.darkBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.primary.darkBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const gradients = {
  primary: [colors.primary.warmBrown, colors.primary.mediumBrown],
  secondary: [colors.primary.lightBeige, colors.primary.beige],
  background: [colors.primary.cream, colors.primary.lightBeige],
  overlay: ['rgba(250, 248, 245, 0.95)', colors.primary.cream],
};

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  gradients,
};
```

---

### 2️⃣ Global Reusable Styles

```javascript
// src/styles/globalStyles.js

import { StyleSheet } from 'react-native';
import theme from './theme';

export const globalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.cream,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary.cream,
  },
  
  scrollContent: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.base,
  },
  
  // Text Styles
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.light,
    color: theme.colors.primary.richBrown,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral.gray,
    lineHeight: 20,
  },
  
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.richBrown,
    marginBottom: theme.spacing.base,
  },
  
  bodyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.darkBrown,
    lineHeight: 22,
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Spacing
  mb8: { marginBottom: theme.spacing.sm },
  mb12: { marginBottom: theme.spacing.md },
  mb16: { marginBottom: theme.spacing.base },
  mb20: { marginBottom: theme.spacing.lg },
  mb24: { marginBottom: theme.spacing.xl },
  
  mt8: { marginTop: theme.spacing.sm },
  mt12: { marginTop: theme.spacing.md },
  mt16: { marginTop: theme.spacing.base },
  mt20: { marginTop: theme.spacing.lg },
  mt24: { marginTop: theme.spacing.xl },
  
  // Cards
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    ...theme.shadows.sm,
  },
  
  cardLight: {
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.primary.beige,
  },
});
```

---

### 3️⃣ Component-Specific Reusable Styles

```javascript
// src/styles/components/buttons.js

import { StyleSheet } from 'react-native';
import theme from '../theme';

export const buttonStyles = StyleSheet.create({
  // Base button
  base: {
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Primary button
  primary: {
    borderRadius: theme.borderRadius.base,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.lg,
  },
  
  primaryText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral.white,
  },
  
  // Secondary button
  secondary: {
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.darkBrown,
  },
  
  // Icon button
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.lightBeige,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

```javascript
// src/styles/components/inputs.js

import { StyleSheet } from 'react-native';
import theme from '../theme';

export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.base,
  },
  
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.richBrown,
    marginBottom: theme.spacing.sm,
  },
  
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary.beige,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    backgroundColor: theme.colors.neutral.white,
    color: theme.colors.primary.richBrown,
  },
  
  inputFocused: {
    borderColor: theme.colors.primary.warmBrown,
    borderWidth: 2,
  },
  
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.richBrown,
  },
});
```

```javascript
// src/styles/components/cards.js

import { StyleSheet } from 'react-native';
import theme from '../theme';

export const cardStyles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.lightBeige,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  selectedCard: {
    borderColor: theme.colors.primary.warmBrown,
    backgroundColor: '#FFF8F0',
  },
  
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.neutral.white,
  },
  
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  
  itemInfo: {
    flex: 1,
  },
  
  itemName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.richBrown,
    marginBottom: 2,
  },
  
  itemCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.darkBrown,
  },
});
```

---

### 4️⃣ Style Mixins (Helpers)

```javascript
// src/styles/mixins.js

import theme from './theme';

// Create consistent shadows
export const shadow = (level = 'md') => theme.shadows[level];

// Create gradient background props
export const gradient = (type = 'primary') => ({
  colors: theme.gradients[type],
});

// Responsive spacing
export const spacing = (multiplier = 1) => theme.spacing.base * multiplier;

// Conditional styles helper
export const when = (condition, styles) => (condition ? styles : {});

// Combine multiple style objects
export const combine = (...styles) => Object.assign({}, ...styles);

// Create flex layout helpers
export const flex = {
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  center: { justifyContent: 'center', alignItems: 'center' },
  between: { justifyContent: 'space-between' },
  around: { justifyContent: 'space-around' },
  start: { justifyContent: 'flex-start', alignItems: 'flex-start' },
  end: { justifyContent: 'flex-end', alignItems: 'flex-end' },
};

// Create absolute positioning helpers
export const absolute = {
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  top: { position: 'absolute', top: 0, left: 0, right: 0 },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  topLeft: { position: 'absolute', top: 0, left: 0 },
  topRight: { position: 'absolute', top: 0, right: 0 },
  bottomLeft: { position: 'absolute', bottom: 0, left: 0 },
  bottomRight: { position: 'absolute', bottom: 0, right: 0 },
};
```

---

## 🎯 Usage Examples

### Example 1: Using Theme in Components

```javascript
// ❌ BAD - Hardcoded values
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C9A07A',
    padding: 16,
    borderRadius: 12,
  },
});

// ✅ GOOD - Using theme
import theme from '../styles/theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary.warmBrown,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
  },
});
```

### Example 2: Using Global Styles

```javascript
// ❌ BAD - Recreating common styles
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#6B5B4D',
  },
});

// ✅ GOOD - Using global styles
import { globalStyles } from '../styles/globalStyles';

// Then in your component:
<View style={globalStyles.container}>
  <Text style={globalStyles.title}>My Title</Text>
</View>
```

### Example 3: Combining Styles

```javascript
import { globalStyles } from '../styles/globalStyles';
import { buttonStyles } from '../styles/components/buttons';
import theme from '../styles/theme';

const MyComponent = () => (
  <View style={globalStyles.container}>
    <Text style={[globalStyles.title, { color: theme.colors.accent.gold }]}>
      Special Title
    </Text>
    <TouchableOpacity style={buttonStyles.primary}>
      <LinearGradient
        colors={theme.gradients.primary}
        style={buttonStyles.primaryGradient}
      >
        <Text style={buttonStyles.primaryText}>Click Me</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);
```

### Example 4: Using Mixins

```javascript
import theme from '../styles/theme';
import { shadow, when, flex } from '../styles/mixins';

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
    ...shadow('lg'),
    ...flex.center,
  },
  
  conditionalStyle: {
    ...when(isActive, {
      backgroundColor: theme.colors.primary.warmBrown,
    }),
  },
});
```

---

## 📊 Decision Tree: Where to Put Styles?

```
Is it a design token (color, spacing, font)?
  ├─ YES → Put in theme.js
  └─ NO ↓

Is it used in 3+ different components?
  ├─ YES → Put in globalStyles.js or styles/components/
  └─ NO ↓

Is it a common UI pattern (button, card, input)?
  ├─ YES → Put in styles/components/[pattern].js
  └─ NO ↓

Is it specific to one component?
  └─ YES → Keep in component file
```

---

## 🎨 Component Structure Example

```javascript
// src/components/outfit-creator/OutfitImageUploader.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { buttonStyles } from '../../styles/components/buttons';

export default function OutfitImageUploader() {
  return (
    <View style={globalStyles.container}>
      {/* Use global title style */}
      <Text style={globalStyles.title}>Upload Picture</Text>
      
      {/* Use component button styles */}
      <TouchableOpacity style={buttonStyles.primary}>
        <Text style={buttonStyles.primaryText}>Choose Photo</Text>
      </TouchableOpacity>
      
      {/* Use local unique styles */}
      <View style={styles.uniqueUploadArea}>
        <Text>Drag & Drop</Text>
      </View>
    </View>
  );
}

// Only unique styles stay here
const styles = StyleSheet.create({
  uniqueUploadArea: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary.beige,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
});
```

---

## ✅ Best Practices

### DO ✅

1. **Use theme for all design tokens**
   ```javascript
   color: theme.colors.primary.warmBrown
   ```

2. **Extract repeated patterns**
   ```javascript
   // If used 3+ times, move to globalStyles
   ```

3. **Name semantically**
   ```javascript
   primaryButton, cardLight, titleLarge
   ```

4. **Use destructuring for cleaner code**
   ```javascript
   const { colors, spacing } = theme;
   ```

5. **Keep component styles minimal**
   ```javascript
   // Only truly unique styles in component
   ```

### DON'T ❌

1. **Don't hardcode colors**
   ```javascript
   ❌ backgroundColor: '#C9A07A'
   ✅ backgroundColor: theme.colors.primary.warmBrown
   ```

2. **Don't duplicate styles**
   ```javascript
   ❌ Creating same button style in 5 files
   ✅ Import buttonStyles
   ```

3. **Don't mix concerns**
   ```javascript
   ❌ Putting business logic in style files
   ✅ Keep styles pure
   ```

4. **Don't use magic numbers**
   ```javascript
   ❌ marginTop: 37
   ✅ marginTop: theme.spacing.xl + theme.spacing.base
   ```

---

## 🚀 Migration Strategy

### Phase 1: Create Foundation (Day 1)
1. Create `theme.js`
2. Extract all colors from existing code
3. Define spacing scale
4. Set up typography

### Phase 2: Build Globals (Day 2)
1. Create `globalStyles.js`
2. Identify repeated patterns
3. Extract common styles

### Phase 3: Component Styles (Day 3-4)
1. Create `styles/components/` folder
2. Move button styles
3. Move card styles
4. Move input styles

### Phase 4: Refactor Existing (Ongoing)
1. Update one component at a time
2. Replace hardcoded values with theme
3. Remove duplicated styles

---

## 💡 Pro Tips

1. **Use TypeScript** (Optional but recommended)
   ```typescript
   // theme.ts with full autocomplete!
   ```

2. **Create style snippets** in your editor
   ```javascript
   // Snippet: "st" → const styles = StyleSheet.create({})
   ```

3. **Document your design system**
   ```javascript
   // Add JSDoc comments to theme.js
   ```

4. **Review styles monthly**
   - Remove unused styles
   - Consolidate similar patterns
   - Update theme as design evolves

---

## 🎯 Summary

| Category | Location | Example |
|----------|----------|---------|
| **Design Tokens** | `theme.js` | Colors, spacing, typography |
| **Reusable Patterns** | `globalStyles.js` | Containers, text styles |
| **Component Patterns** | `styles/components/` | Buttons, cards, inputs |
| **Unique Styles** | Component file | Specific to that component |
| **Utilities** | `mixins.js` | Helper functions |

**Golden Rule**: If you use it twice, consider theme. If you use it three times, extract it!