import { mount, flushPromises } from '@vue/test-utils';
import OfferCard from '@/components/OfferCard.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { nextTick } from 'vue';

// Mock Firebase auth with a function to control auth state
let mockAuthState = { currentUser: { uid: 'testUserId' } };
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuthState),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(mockAuthState.currentUser);
    return vi.fn();
  }),
}));

// Mock Firestore with configurable query results
const existingChatDoc = { id: 'existingChatId' };
const newChatDoc = { id: 'newChatId' };
let mockQueryEmpty = true;

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(() => 'chatsCollection'),
  query: vi.fn(() => 'query'),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({
    empty: mockQueryEmpty,
    docs: mockQueryEmpty ? [] : [{ id: existingChatDoc.id }]
  })),
  addDoc: vi.fn(() => Promise.resolve(newChatDoc)),
  serverTimestamp: vi.fn(() => ({})),
}));

// Mock the firebase.js module
vi.mock('@/firebase', () => ({
  db: {},
  firebaseApp: {}
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/chat/:chatId', name: 'Chat', component: { template: '<div>Chat</div>' } }
  ],
});

describe('OfferCard.vue', () => {
  beforeEach(async () => {
    mockAuthState = { currentUser: { uid: 'testUserId' } };
    mockQueryEmpty = true;
    router.push('/');
    await router.isReady();
    await flushPromises();
  });

  it('renders correctly with given props', () => {
    const wrapper = mount(OfferCard, {
      global: {
        plugins: [router],
      },
      props: {
        id: '1',
        title: 'Test Offer',
        description: 'This is a test offer description.',
        price: 100,
        image: 'test-image.jpg',
        sellerId: 'seller123',
      },
    });

    expect(wrapper.find('h1').text()).toBe('Test Offer');
    expect(wrapper.find('p').text()).toBe('This is a test offer description.');
    expect(wrapper.find('.text-lg').text()).toBe('100');
    expect(wrapper.find('img').attributes('src')).toBe('test-image.jpg');
  });

  it('shows alert when user is not logged in', async () => {
    mockAuthState = { currentUser: null };
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const wrapper = mount(OfferCard, {
      global: { plugins: [router] },
      props: {
        id: '1',
        title: 'Test Offer',
        description: 'Test description',
        price: 100,
        image: 'test.jpg',
        sellerId: 'seller123',
      },
    });

    const messageButton = wrapper.findAll('button').find(btn => btn.text() === 'Message Seller');
    await messageButton.trigger('click');

    expect(alertMock).toHaveBeenCalledWith('You must be logged in to message the seller.');
    alertMock.mockRestore();
  });

  it('navigates to existing chat when one exists', async () => {
    mockQueryEmpty = false;

    const wrapper = mount(OfferCard, {
      global: { plugins: [router] },
      props: {
        id: '1',
        title: 'Test Offer',
        description: 'Test description',
        price: 100,
        image: 'test.jpg',
        sellerId: 'seller123',
      },
    });

    const messageButton = wrapper.findAll('button').find(btn => btn.text() === 'Message Seller');
    await messageButton.trigger('click');
    await flushPromises(); // Wait for Firestore operation
    await router.isReady(); // Wait for router
    await nextTick(); // Wait for Vue updates

    expect(router.currentRoute.value.path).toBe(`/chat/${existingChatDoc.id}`);
  });

  it('creates new chat when none exists', async () => {
    mockQueryEmpty = true;

    const wrapper = mount(OfferCard, {
      global: { plugins: [router] },
      props: {
        id: '1',
        title: 'Test Offer',
        description: 'Test description',
        price: 100,
        image: 'test.jpg',
        sellerId: 'seller123',
      },
    });

    const messageButton = wrapper.findAll('button').find(btn => btn.text() === 'Message Seller');
    await messageButton.trigger('click');
    await flushPromises(); // Wait for Firestore operation
    await router.isReady(); // Wait for router
    await nextTick(); // Wait for Vue updates

    expect(router.currentRoute.value.path).toBe(`/chat/${newChatDoc.id}`);
  });
});