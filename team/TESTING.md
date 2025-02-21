# Testing Documentation

## Testing Library

We used **Vitest** as the testing framework for our project. Vitest is a fast and lightweight testing library that is compatible with Vite, making it an excellent choice for Vue.js projects.

## Testing Approach

Our approach to testing involves writing unit tests for individual components to ensure they behave as expected. We use the `@vue/test-utils` library to mount components and interact with them in a test environment.

## Running Tests

To run the tests, follow these steps:

1. Ensure you have all dependencies installed by running:
   ```bash
   npm install
   ```

2. Run the tests using the following command:
   ```bash
   npm run test
   ```

This will execute all the test files in the project and display the results in the terminal.

## Unit Test Example

Below is an example of a unit test for the `BrowseOffers.vue` component. This test verifies that the component correctly filters offers based on a search term, minimum price, and maximum price.

```javascript
import { mount } from '@vue/test-utils';
import BrowseOffers from '@/views/BrowseOffers.vue';

describe('BrowseOffers.vue', () => {
  it('filters offers based on search term, min price, and max price', async () => {
    const wrapper = mount(BrowseOffers, {
      data() {
        return {
          offers: [
            { id: 1, title: 'Offer 1', price: 100, active: true },
            { id: 2, title: 'Offer 2', price: 200, active: true },
            { id: 3, title: 'Special Offer', price: 300, active: true },
          ],
          searchTerm: 'Special',
          minPrice: 150,
          maxPrice: 350,
        };
      },
    });

    expect(wrapper.vm.filteredOffers).toEqual([
      { id: 3, title: 'Special Offer', price: 300, active: true },
    ]);
  });
});
```

## Component Test Example

Below is an example of a component test for the `OfferCard.vue` component. This test suite demonstrates:
- Component rendering
- Firebase authentication mocking
- Firestore operations mocking
- Chat functionality testing
- Async operation handling

```javascript
import { mount, flushPromises } from '@vue/test-utils';
import OfferCard from '@/components/OfferCard.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock Firebase auth state
let mockAuthState = { currentUser: { uid: 'testUserId' } };
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuthState),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(mockAuthState.currentUser);
    return vi.fn();
  }),
}));

// Mock Firestore operations
const existingChatDoc = { id: 'existingChatId' };
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({
    empty: true,
    docs: []
  })),
  addDoc: vi.fn(() => Promise.resolve({ id: 'newChatId' })),
  serverTimestamp: vi.fn(),
}));

describe('OfferCard.vue', () => {
  it('renders correctly with given props', () => {
    const wrapper = mount(OfferCard, {
      props: {
        id: '1',
        title: 'Test Offer',
        description: 'Test description',
        price: 100,
        image: 'test.jpg',
        sellerId: 'seller123'
      }
    });
    expect(wrapper.find('h1').text()).toBe('Test Offer');
  });

  it('shows alert when user is not logged in', async () => {
    mockAuthState.currentUser = null;
    // Test unauthorized access scenario
  });

  it('navigates to existing chat', async () => {
    // Test existing chat navigation
  });

  it('creates new chat when none exists', async () => {
    // Test new chat creation
  });
});
```

### Key Testing Concepts Demonstrated

1. **Mock Management**
   - Firebase authentication state
   - Firestore operations
   - Browser APIs (alert)

2. **Async Testing**
   - Using `flushPromises` for async operations
   - Waiting for router navigation
   - Vue component updates with `nextTick`

3. **Component Interaction**
   - Button click handling
   - Navigation validation
   - Props validation

## Future Testing Plans

### Unit Tests

We may to continue writing unit tests for critical components and functions in our project, but seeing that our project is rapidly changing and our time availability for development is limited, we will most likely not.

### Component/Integration/End-to-End Tests

We have integrated component testing using `@vue/test-utils` and `Vitest` to ensure that our components render correctly and interact with each other as expected. Going forward, we will most likely not be writing more component tests due to the fact that our project is rapidly changing, and tests have a high chance of losing their relevancy; however we do intend on manually testing our components. We may explore end-to-end testing frameworks like Cypress to test user flows and interactions in a real browser environment.