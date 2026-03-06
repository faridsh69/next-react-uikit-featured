# Coding Guidelines 🍷

## Table of Contents

- [Enums, Union Types & Alternatives](#enums-union-types--alternatives-)
- [Documentation](#documentation-)
- [Naming Conventions](#naming-conventions-)
- [Component Development](#component-development-)

---

## Enums, Union Types & Alternatives 🍇

There is no single solution that is appropriate for typing. In this section you will find advice and examples that will help you determine what may be the most appropriate choice for your use case.

We **prefer String Union Types** over other alternatives, but there are valid use cases for each approach.

### Union Types

For simple values that are self-explanatory and are unlikely to change.

#### Examples

```ts
// BAD ❌ unclear values
type WineType = 1 | 2 | 3 // what do these values mean?

// GOOD ✅ self-explanatory
type WineType = 'red' | 'white' | 'rosé'
type WineRegion = 'bordeaux' | 'burgundy' | 'tuscany' | 'napa'
type ServingTemperature = 'room-temperature' | 'chilled' | 'ice-cold'
```

#### Evaluation

- ✅ **Good** - Low compiled footprint
- ✅ **Good** - Readable and self-explanatory
- ✅ **Good** - Type-safe refactors
- ❌ **Bad** - Refactoring is cumbersome across large codebases

#### Caveats

If you want to reuse parts of a union type you will need to use [Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion) instead of [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys). This is because the `Omit` utility type works on object types or interfaces to omit key-value pairs. `Exclude` only works on union literals to exclude properties.

### `const enum`

For values that benefit from being mapped to simple keys or when you need computed values.

#### Examples

```ts
// BAD ❌ This is a bad use case for `const enum` because it provides no benefit over a string union type or a `const` object.
const enum WineType {
  RED = 'red',
  WHITE = 'white',
  ROSE = 'rosé'
}

// GOOD ✅ use case(s) - when you need computed values
const enum WineCategory {
  Premium = 100,
  Standard = 50,
  Budget = 25
}

const enum ServingTemperature {
  RoomTemp = 'room-temperature',
  Chilled = 'chilled',
  IceCold = 'ice-cold'
}
```

#### Evaluation

- ✅ **Good** - Low compiled footprint
- ✅ **Good** - Supports computed values
- ❌ **Bad** - Import issues in some bundlers
- ❌ **Bad** - Only use string enums because numerical enums are not type-safe

### Object with `const` Assertion

For values that need to be available at runtime, iterated on, type-safe and/or readonly.

#### Examples

```ts
// GOOD ✅ when you need runtime access and iteration
const WineType = {
  RED: 'red',
  WHITE: 'white',
  ROSE: 'rosé'
} as const

const WineRegion = {
  BORDEAUX: 'bordeaux',
  BURGUNDY: 'burgundy',
  TUSCANY: 'tuscany',
  NAPA: 'napa'
} as const

type WineType = (typeof WineType)[keyof typeof WineType]
type WineRegion = (typeof WineRegion)[keyof typeof WineRegion]
```

#### Evaluation

- ✅ **Good** - Available at runtime
- ✅ **Good** - Can be iterated over
- ✅ **Good** - Type-safe and readonly
- ❌ **Bad** - Higher compiled footprint than union types
- ❌ **Bad** - Requires helper type for type usage

### When to Use Each Approach

| Use Case                        | Recommended Approach | Example                                      |
| ------------------------------- | -------------------- | -------------------------------------------- |
| Simple, self-explanatory values | Union Types          | `type WineType = 'red' \| 'white' \| 'rosé'` |
| Need computed values            | `const enum`         | `const enum WineCategory { Premium = 100 }`  |
| Need runtime access/iteration   | Object with `const`  | `const WineType = { RED: 'red' } as const`   |
| Complex mappings                | Object with `const`  | Wine region to country mappings              |

---

## Documentation 📖

More time is spent reading code than writing it. Focus on having clearly named methods, classes and variables.

We have to make a distinction between **commenting** the code and **documenting** the code, which have different target audiences.

**Documentation** should express the **purpose** of a piece of code, how it should be used, and how it behaves when used. It is meant to give users a general overview of the source code. We use [JSDoc](https://jsdoc.app) to document our code.

**Comments** are meta commentary scattered throughout the code base, localized in specific locations of the source code. They are meant to help users understand punctual decisions that were taken on those places.

### Comments vs Documentation

#### When to Use Comments

There are some scenarios in which comments would be useful:

- **Clarifying details.** Sometimes you need to write small clarifications for input arguments or data returned from a function, in this case, a comment might make things easier to understand. It's also useful for summarizing a series of complicated operations, or why a certain algorithm has been chosen.
- **Warning about side effects.** Some lines of code carry 'dangerous' side effects that we should warn against.
- **TODO comments.** You can add little reminders for things you need to improve or refactor later. Don't forget to relate the TODO to a ticket on your JIRA board. Please, add a `:` afterwards, so it will be like `TODO: Fix this`. By using that consistent approach, we can find them more easily (and our IDE can highlight them better).

#### Example of Comment vs Documentation

```tsx
export interface Wine {
  /** ✅ This is correct documentation - describes the wine's color type */
  readonly color: WineColor

  /** ✅ This is also documentation - explains the vintage year significance */
  readonly vintageYear: number

  // ℹ️ This is a comment, NOT documentation.
  // Used for special pricing calculations during wine festivals
  readonly isFestivalSpecial?: boolean

  /* ❌ Single asterisk, this is neither documentation nor comment. Discouraged */
  readonly isOrganic?: boolean
}
```

### Documentation Guidelines

#### How to Document

Follow the guidelines defined in [https://jsdoc.app](https://jsdoc.app).

On TypeScript files, we **can omit** the type definition on the arguments since TypeScript already provides this information:

```ts
/**
 * Calculates the total price for a wine order including taxes and discounts.
 * @param wines - Array of wine items in the order
 * @param [discountCode] - Optional discount code to apply
 * @param [shippingMethod='standard'] - Shipping method with default value
 *
 * @example
 *     const total = calculateOrderTotal([
 *       { id: 'wine-1', price: 25.99, quantity: 2 },
 *       { id: 'wine-2', price: 45.50, quantity: 1 }
 *     ], 'WELCOME10')
 *
 * @returns The total price including taxes and applied discounts
 */
function calculateOrderTotal(
  wines: WineOrderItem[],
  discountCode?: string,
  shippingMethod: ShippingMethod = 'standard'
): number {
  // Implementation details...
}

/**
 * Validates wine inventory availability before processing an order.
 * We can use {@link https://jsdoc.app/tags-inline-link.html} to put links.
 * @see calculateOrderTotal To calculate the final order total.
 *
 * @param order.wines - Array of wines to validate
 * @param [order.priority='normal'] - Order priority level
 * @throws {InsufficientStockError} When requested quantity exceeds available stock
 */
function validateWineInventory({ wines, priority = 'normal' }: OrderValidationOptions): void {
  // Implementation details...
}
```

The hyphen between the `@param` and the description is optional, but if you include it, make sure to put a space surrounding the hyphen.

#### Wine Shop Specific Examples

```ts
/**
 * Represents a wine bottle with all its characteristics and metadata.
 */
export interface Wine {
  /** Unique identifier for the wine */
  readonly id: string

  /** The wine's name as displayed to customers */
  readonly name: string

  /** Wine color type (red, white, rosé, sparkling) */
  readonly color: WineColor

  /** The year the grapes were harvested */
  readonly vintageYear: number

  /** Wine region where grapes were grown */
  readonly region: WineRegion

  /** Primary grape variety used in the wine */
  readonly grapeVariety: string

  /** Alcohol content percentage (e.g., 13.5) */
  readonly alcoholContent: number

  /** Price in USD */
  readonly price: number

  /** Expert rating from wine critics (1-100 scale) */
  readonly expertRating?: number

  /** Average user rating (1-5 stars) */
  readonly userRating?: number

  /** Detailed tasting notes and description */
  readonly description: string

  /** URL to the wine's bottle image */
  readonly imageUrl: string

  /** Whether this wine is currently in stock */
  readonly isInStock: boolean

  /** Number of bottles available in inventory */
  readonly stockQuantity: number

  /** Special attributes like organic, biodynamic, etc. */
  readonly attributes?: WineAttribute[]
}

/**
 * Calculates the optimal serving temperature for a wine based on its type.
 * @param wine - The wine to calculate serving temperature for
 * @returns Recommended serving temperature in Celsius
 *
 * @example
 *     const temp = getServingTemperature({ color: 'red', region: 'bordeaux' })
 *     // Returns: 18 (room temperature for red Bordeaux)
 */
function getServingTemperature(wine: Pick<Wine, 'color' | 'region'>): number {
  // Implementation details...
}

/**
 * Filters wines based on customer preferences and availability.
 * @param wines - Array of wines to filter
 * @param filters - Filtering criteria
 * @param [filters.maxPrice] - Maximum price threshold
 * @param [filters.minRating] - Minimum rating requirement
 * @param [filters.onlyInStock=true] - Whether to show only available wines
 *
 * @example
 *     const filteredWines = filterWines(allWines, {
 *       maxPrice: 50,
 *       minRating: 4,
 *       color: 'red'
 *     })
 *
 * @returns Filtered array of wines matching the criteria
 */
function filterWines(wines: Wine[], filters: WineFilters, options: { onlyInStock?: boolean } = {}): Wine[] {
  // Implementation details...
}
```

### F.A.Q.

#### Should I document the class or the interface?

At the _minimum_, [JSDoc](https://jsdoc.app/) is present for every `public` class, and every `public` or `protected` member of a class.

If a _class_ implements attributes or methods already defined on an _interface_, we only write the JSDoc once in the interface, keeping the DRY (_don't repeat yourself_) principle.

```ts
// BAD ❌ - Duplicate documentation
interface IWineService {
  /** Fetches wine details by ID from the API */
  getWineById(id: string): Promise<Wine>
}

class WineService implements IWineService {
  /** Fetches wine details by ID from the API */
  getWineById(id: string): Promise<Wine> {
    // Implementation...
  }
}

// GOOD ✅ - Document once in interface
interface IWineService {
  /** Fetches wine details by ID from the API */
  getWineById(id: string): Promise<Wine>
}

class WineService implements IWineService {
  getWineById(id: string): Promise<Wine> {
    // Implementation...
  }
}
```

#### Can I skip documenting X method or attribute?

We suggest documenting all of your code. This is especially the case for libraries and public APIs.

Documentation can help future developers understand what you were thinking when writing a particular piece of code.

Some code is self-explanatory and _its purpose_ is clear (e.g., `wine.incrementStock()`), so documentation could be minimal.

However, in a broad sense, documentation helps other developers comprehend the code faster.

#### Should I comment interface attributes?

We encourage documenting every attribute in our interfaces. Sometimes, the name of the attribute is explicit enough, but for consistency (and to avoid subjective notions such as "_it is clear for me!_"), we document them anyway.

```ts
// GOOD ✅ - Well documented interface
export interface WineOrder {
  /** Unique order identifier */
  readonly orderId: string

  /** Customer who placed the order */
  readonly customerId: string

  /** List of wines in this order */
  readonly items: WineOrderItem[]

  /** Total order amount before taxes */
  readonly subtotal: number

  /** Applied discount amount */
  readonly discountAmount: number

  /** Final total including taxes and shipping */
  readonly total: number

  /** Order status (pending, confirmed, shipped, delivered) */
  readonly status: OrderStatus

  /** When the order was placed */
  readonly createdAt: Date

  /** Expected delivery date */
  readonly estimatedDelivery: Date
}
```

#### Should I sort interface attributes?

We sort every attribute in our interfaces alphabetically from A-Z regardless of it being mandatory or optional. This way we can locate each attribute easily and homogeneously across all interfaces.

```tsx
// GOOD ✅ - Alphabetically sorted attributes
export interface WineReview {
  /** Review content and tasting notes */
  content: string

  /** When the review was written */
  createdAt: Date

  /** ID of the wine being reviewed */
  wineId: string

  /** Rating given by the reviewer (1-5 stars) */
  rating: number

  /** ID of the user who wrote the review */
  userId: string

  /** Whether the review is verified (user actually purchased the wine) */
  isVerified?: boolean

  /** Number of helpful votes this review received */
  helpfulVotes?: number
}
```

#### Should I add a default attribute in the interface?

We use `@default` attributes in the interface **only** when we are documenting an interface that's the response of an API, because the extra information might be useful when dealing with the implementation side of the API client.

```tsx
// GOOD ✅ - API response interface with defaults
export interface WineApiResponse {
  /** Wine identifier */
  readonly id: string

  /** Wine name */
  readonly name: string

  /** Current stock quantity */
  readonly stockQuantity: number

  /**
   * Whether the wine is currently available for purchase
   * @default true
   */
  readonly isAvailable: boolean

  /**
   * Number of days until restock (if out of stock)
   * @default 0
   */
  readonly daysUntilRestock: number
}
```

However, for interfaces used in multiple implementations, define defaults in the class itself:

```tsx
// GOOD ✅ - Default defined in implementation
interface IWineStorage {
  /** Storage temperature in Celsius */
  temperature: number

  /** Maximum storage capacity */
  capacity: number
}

class WineCellar implements IWineStorage {
  constructor(
    public temperature = 12, // Default for red wines
    public capacity = 1000
  ) {}
}

class WineRefrigerator implements IWineStorage {
  constructor(
    public temperature = 4, // Default for white wines
    public capacity = 50
  ) {}
}
```

### Real-World Wine Shop Examples

#### API Service Documentation

```ts
/**
 * Service for managing wine inventory and operations.
 * Handles CRUD operations for wines, stock management, and availability checks.
 */
class WineInventoryService {
  /**
   * Retrieves a wine by its unique identifier.
   * @param wineId - The unique wine identifier
   * @returns Promise resolving to wine details or null if not found
   * @throws {WineNotFoundError} When wine doesn't exist
   *
   * @example
   *     const wine = await wineService.getWineById('wine-123')
   *     if (wine) {
   *       console.log(`Found: ${wine.name} from ${wine.region}`)
   *     }
   */
  async getWineById(wineId: string): Promise<Wine | null> {
    // Implementation...
  }

  /**
   * Updates wine stock quantity after a purchase or restock.
   * @param wineId - Wine to update
   * @param quantityChange - Positive for restock, negative for sale
   * @param [reason='sale'] - Reason for stock change (sale, restock, damage, etc.)
   *
   * @example
   *     // Record a sale of 2 bottles
   *     await wineService.updateStock('wine-123', -2, 'sale')
   *
   *     // Record a restock of 50 bottles
   *     await wineService.updateStock('wine-123', 50, 'restock')
   */
  async updateStock(wineId: string, quantityChange: number, reason: StockChangeReason = 'sale'): Promise<void> {
    // Implementation...
  }
}
```

#### React Component Documentation

```tsx
/**
 * Displays a wine card with image, details, and purchase options.
 * Supports different display variants and handles user interactions.
 */
interface WineCardProps {
  /** Wine data to display */
  wine: Wine

  /** Callback when user clicks "Add to Cart" */
  onAddToCart?: (wineId: string) => void

  /** Callback when user clicks "View Details" */
  onViewDetails?: (wineId: string) => void

  /** Display variant affecting layout and information shown */
  variant?: 'default' | 'compact' | 'featured'

  /** Whether to show purchase actions */
  showActions?: boolean

  /** Whether the wine is currently being added to cart */
  isAddingToCart?: boolean
}

/**
 * WineCard component for displaying wine information in a card format.
 *
 * @example
 *     <WineCard
 *       wine={selectedWine}
 *       variant="featured"
 *       onAddToCart={(id) => addToCart(id)}
 *       onViewDetails={(id) => navigateToWine(id)}
 *     />
 */
function WineCard({
  wine,
  onAddToCart,
  onViewDetails,
  variant = 'default',
  showActions = true,
  isAddingToCart = false
}: WineCardProps) {
  // Component implementation...
}
```

**Further reading:**

- [Why should I document code?](https://softwareengineering.stackexchange.com/a/121787)
- [How to Write Good Documentation](https://www.freecodecamp.org/news/how-to-write-good-documentation/)
- [Should I document my private methods?](https://stackoverflow.com/q/1743538/1104116)

---

## Naming Conventions 🍇

### Booleans

Avoid negative names for booleans

```ts
// BAD ❌ use case(s)
if (!user.hasNoWineClubMembership) {
    ...
}

// GOOD ✅ use case(s)
if (user.hasWineClubMembership) {
    ...
}
```

A name should reflect the expected result.

```ts
/* Bad */
const isEnabled = wineCount > 3;
return <Button isDisabled={!isEnabled} />;

/* Good */
const isDisabled = wineCount <= 3;
return <Button isDisabled={isDisabled} />;
```

#### "is" prefix

"The color is green".

```ts
// BAD ❌ use case(s)
const red = wineType === 'red'

// GOOD ✅ use case(s)
const isRed = wineType === 'red'
```

_examples:_
isVisible, isEnabled, isActive, isOpen, isRed, isChilled, isPremium

#### "has" prefix

"The wine shop has special offers."

```ts
// BAD ❌ use case(s)
const isOffersExist = offersCount > 0
const areOffersPresent = offersCount > 0

// GOOD ✅ use case(s)
const hasOffers = offersCount > 0
```

_examples:_
hasCancelButton, hasHeader, hasDiscount, hasWineClubMembership

#### "can" prefix

Can be used for feature-flags. In case the condition is coupled with a certain action,
[should](#should) would be the better prefix of choice.

"The user can purchase wines"

```ts
// BAD ❌ use case(s)
user.isAbleToBuyWines = true
// GOOD ✅ use case(s)
user.canBuyWines = true
```

_examples:_
canToggle, canExpand, canHaveCancelButton, canPurchase, canJoinWineClub

#### "should" prefix

Reflects a conditional statement coupled with a certain action.

```ts
// BAD ❌ use case(s)
const updateWineList = (wineCount, prevWineCount) => wineCount !== prevWineCount

// GOOD ✅ use case(s)
const shouldUpdateWineList = (wineCount, prevWineCount) => wineCount !== prevWineCount
```

### Numbers

To indicate numbers, postfix with "Count" or "Index"

```ts
// BAD ❌ use case(s)
const pages = 5
const wine = 3

// GOOD ✅ use case(s)
const pageCount = 5
const wineIndex = 3
```

### Singular & Plurals

Ending depends on whether they hold a single value or multiple values.

```ts
// BAD ❌ use case(s)
const wineTypes = 'red'
const wineType = ['red', 'white', 'rosé']

// GOOD ✅ use case(s)
const wineType = 'red'
const wineTypes = ['red', 'white', 'rosé']
// also good
const wineTypeList = ['red', 'white', 'rosé']
```

### min/max

Should been used in case of boundaries where a minimum and a maximum is needed.

```ts
// BAD ❌ unclear
function getWines(prices, lower, upper) {}

// GOOD ✅ clear min/max
function getWines(prices, minPrice, maxPrice) {}
```

### File Types and Naming

#### General

Files containing `JSX` should be of the file type `.tsx`. Any TypeScript file will simply be a `.ts`. As an example, React component files will be in the format `[ComponentName].tsx`.

**File Naming Examples:**

- React components: `WineCard.tsx`, `ShoppingCart.tsx`, `UserProfile.tsx`
- Non-React utilities: `formatPrice.ts`, `validateEmail.ts`, `apiClient.ts`
- Next.js App Router files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Test files: `WineCard.test.tsx`, `formatPrice.test.ts`, `apiClient.test.ts`
- Storybook stories: `WineCard.stories.tsx`, `Button.stories.tsx`
- Styled components: `WineCard.styled.ts`, `Button.styled.ts`

#### Folder Naming

Use lowercase with dashes for folder names. Group by feature/domain and place components close to their usage (colocation).

**Folder Naming Examples:**

- Feature-based: `/features/wine-list`, `/features/shopping-cart`, `/features/user-profile`
- Component groups: `/components/wine-card`, `/components/navigation`, `/components/forms`
- Utility groups: `/utils/formatting`, `/utils/validation`, `/utils/api-clients`
- Page-specific: `/pages/wine-details`, `/pages/checkout`, `/pages/user-settings`

**Colocation Examples:**

```
/components/wine-card/
  ├── WineCard.tsx
  ├── WineCard.stories.tsx
  ├── WineCard.test.tsx
  └── WineCard.styled.ts

/features/shopping-cart/
  ├── ShoppingCart.tsx
  ├── CartItem.tsx
  ├── cart-utils.ts
  └── cart-types.ts
```

#### Storybook Story Files

Files containing Storybook stories are suffixed with `.stories.tsx`.

### Acronyms

When dealing with acronyms, we have adopted the [Google Style](https://google.github.io/styleguide/jsguide.html#naming-camel-case-defined), which points out an algorithm which can be summarized for acronyms as:

- lowercase everything, then uppercase only the first character of:
  - … each word, to yield upper camel case, or
  - … each word except the first, to yield lower camel case

#### Component and Variable Naming

| Example               | Correct ✅        | Incorrect ❌      |
| --------------------- | ----------------- | ----------------- |
| XML HTTP request      | XmlHttpRequest    | XMLHTTPRequest    |
| new customer ID       | newCustomerId     | newCustomerID     |
| supports IPv6 on iOS? | supportsIpv6OnIos | supportsIPv6OnIOS |
| HTML to XML           | htmlToXml         | htmlToXML         |
| XML to JS             | xmlToJs           | XMLtoJS           |
| AdWords JS plugin     | adWordsJsPlugin   | adwordsJsPlugin\* |

\*Acceptable, but not recommended.

```ts
// BAD ❌ all caps
const XMLHTTPRequest = ...;
const APIClient = ...;
const JSONParser = ...;

// GOOD ✅ Google style
const XmlHttpRequest = ...;
const ApiClient = ...;
const JsonParser = ...;
```

#### File and Folder Naming

For filenames and folder names, use lowercase with dashes, even when containing acronyms.

| Example        | Correct ✅       | Incorrect ❌    |
| -------------- | ---------------- | --------------- |
| API client     | api-client.ts    | APIClient.ts    |
| HTTP service   | http-service.ts  | HTTPService.ts  |
| JSON parser    | json-parser.ts   | JSONParser.ts   |
| XML validator  | xml-validator.ts | XMLValidator.ts |
| iOS components | ios-components/  | iOSComponents/  |
| PDF generator  | pdf-generator/   | PDFGenerator/   |
| CSV export     | csv-export/      | CSVExport/      |

**File and Folder Examples:**

```ts
// BAD ❌ mixed case in filenames
APIClient.ts
HTTPService.ts
JSONParser.ts
XMLValidator.ts

// GOOD ✅ lowercase with dashes
api-client.ts
http-service.ts
json-parser.ts
xml-validator.ts

// BAD ❌ mixed case in folders
API/
HTTP/
JSON/
XML/

// GOOD ✅ lowercase with dashes
api/
http/
json/
xml/
```

**Real-world Examples:**

- Component files: `ApiClient.tsx`, `HttpService.tsx`, `JsonParser.tsx`
- Utility files: `api-client.ts`, `http-service.ts`, `json-parser.ts`
- Folder names: `api-clients/`, `http-services/`, `json-utils/`
- Feature folders: `pdf-generation/`, `csv-export/`, `xml-validation/`

---

## Component Development 🍷

### Custom Hooks

Extract `useEffect` and state logic into custom hooks for cleaner, more reusable components.

#### Examples

```ts
// BAD ❌ - Logic mixed in component
function WineList() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true)
      try {
        const response = await api.getWines()
        setWines(response.data)
      } catch (err) {
        setError('Failed to load wines')
      } finally {
        setLoading(false)
      }
    }
    fetchWines()
  }, [])

  if (loading) return <div>Loading wines...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {wines.map(wine => <WineCard key={wine.id} wine={wine} />)}
    </div>
  )
}

// GOOD ✅ - Logic extracted to custom hook
function useWines() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true)
      try {
        const response = await api.getWines()
        setWines(response.data)
      } catch (err) {
        setError('Failed to load wines')
      } finally {
        setLoading(false)
      }
    }
    fetchWines()
  }, [])

  return { wines, loading, error }
}

function WineList() {
  const { wines, loading, error } = useWines()

  if (loading) return <div>Loading wines...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {wines.map(wine => <WineCard key={wine.id} wine={wine} />)}
    </div>
  )
}
```

#### Benefits

- ✅ **Reusability**: Hook can be used in multiple components
- ✅ **Testability**: Logic can be tested independently
- ✅ **Separation of Concerns**: Component focuses on rendering, hook handles logic
- ✅ **Cleaner Components**: Reduced complexity in component files

### Client vs Server Components (Next.js)

Default to Server Components for better performance. Add `'use client'` only when interactivity is required.

#### When to Use Server Components

```ts
// GOOD ✅ - Server Component (default)
// No 'use client' directive needed
function WineDetails({ wineId }: { wineId: string }) {
  // This runs on the server
  const wine = await getWineById(wineId)

  return (
    <div>
      <h1>{wine.name}</h1>
      <p>{wine.description}</p>
      <WineImage src={wine.imageUrl} alt={wine.name} />
    </div>
  )
}
```

#### When to Use Client Components

```ts
// GOOD ✅ - Client Component (when interactivity needed)
'use client'

import { useState } from 'react'

function WineSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Wine[]>([])

  const handleSearch = async (term: string) => {
    const wines = await searchWines(term)
    setResults(wines)
  }

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
        placeholder="Search wines..."
      />
      <div>
        {results.map(wine => <WineCard key={wine.id} wine={wine} />)}
      </div>
    </div>
  )
}
```

#### Decision Matrix

| Feature                | Server Component | Client Component | Reason                       |
| ---------------------- | ---------------- | ---------------- | ---------------------------- |
| Static wine display    | ✅               | ❌               | No interactivity needed      |
| Wine search with input | ❌               | ✅               | Requires user input handling |
| Wine filtering         | ❌               | ✅               | State management needed      |
| Wine details page      | ✅               | ❌               | Static content, better SEO   |
| Add to cart button     | ❌               | ✅               | User interaction required    |
| Wine recommendations   | ✅               | ❌               | Can be pre-computed          |

### Component Composition

Prefer composition over complex props and conditional rendering.

#### Examples

```ts
// BAD ❌ - Complex conditional rendering
function WineCard({ wine, showPrice, showRating, showDescription }: WineCardProps) {
  return (
    <div className="wine-card">
      <img src={wine.image} alt={wine.name} />
      <h3>{wine.name}</h3>
      {showDescription && <p>{wine.description}</p>}
      {showPrice && <span className="price">${wine.price}</span>}
      {showRating && <WineRating rating={wine.rating} />}
    </div>
  )
}

// GOOD ✅ - Composition approach
function WineCard({ wine, children }: { wine: Wine; children?: React.ReactNode }) {
  return (
    <div className="wine-card">
      <img src={wine.image} alt={wine.name} />
      <h3>{wine.name}</h3>
      {children}
    </div>
  )
}

// Usage with composition
function WineCardWithPrice({ wine }: { wine: Wine }) {
  return (
    <WineCard wine={wine}>
      <WinePrice price={wine.price} />
    </WineCard>
  )
}

function WineCardWithRating({ wine }: { wine: Wine }) {
  return (
    <WineCard wine={wine}>
      <WineRating rating={wine.rating} />
      <WineDescription description={wine.description} />
    </WineCard>
  )
}
```

### Props Interface Design

Use clear, descriptive prop interfaces with proper TypeScript typing.

#### Examples

```ts
// BAD ❌ - Unclear props
interface WineCardProps {
  data: any
  config: object
  handlers: Record<string, Function>
}

// GOOD ✅ - Clear, typed props
interface WineCardProps {
  wine: Wine
  onAddToCart?: (wineId: string) => void
  onViewDetails?: (wineId: string) => void
  showActions?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

function WineCard({
  wine,
  onAddToCart,
  onViewDetails,
  showActions = true,
  variant = 'default'
}: WineCardProps) {
  return (
    <div className={`wine-card wine-card--${variant}`}>
      <WineImage src={wine.imageUrl} alt={wine.name} />
      <WineInfo wine={wine} />
      {showActions && (
        <WineActions
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  )
}
```

### Error Boundaries

Implement error boundaries for graceful error handling in component trees.

#### Example

```ts
'use client'

import { Component, ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

class WineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Wine component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="wine-error">
          <h2>Something went wrong loading the wine</h2>
          <p>Please try refreshing the page</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
function WineSection() {
  return (
    <WineErrorBoundary>
      <WineList />
      <WineFilters />
      <WineRecommendations />
    </WineErrorBoundary>
  )
}
```

### Rest of clean code principles

#### Right place for Interface or type

Interface or type can be inside component file or can be seperated, if we have more than 200 lines of code there then we should extract that ts codes to a ts file

#### 1 file 1 component

In each component file we should only and only export or define 1 component, for new components we should create new file

#### Define a component in body of another component is prohibited

What will happen, first DRY will not be followed, second it will be hard to understand the variables value as child component is using parent component data, third we will have a lot of waste rerendering

```ts
const Component = () => {
const renderContent = () => {...}

return <div>{renderContent()}</div>
}
```

#### Avoid as much as possible using else

we should most of the time we can have if (condition) {... return} then we can skip using else, actually reading a code that has a lot of if else is harder than reading a code that only and only has some ifs, sometimes we can not ignore using else then in that case yes we can use else.

#### Use constant for variables that is static

```ts
const SIZE = 30
```

#### Extract block of code that is doing same thing into a helper method or custom hook

Where ever you see a block of code that is doing a part of a process, we should extract it to a new helper method for two reason

first DRY

second that is much more important, make the code much more easy to read and understand. in this way we can think more to choose a better name for that helper method and we can make sure without having any kind of commenting in code others will understand what that helper method is doing by only reading its name.

Having maximum readablity equals to maximum bug-free, easy to maintain, easy to debug and easy to develop new features.
