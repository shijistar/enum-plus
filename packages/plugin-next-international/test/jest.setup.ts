/*
 * This file is used to set up the testing environment for Jest.
 * It runs before EACH TEST FILE in the suite.
 */
import { initClientInstance } from './data/initClientInstance';
import { initServerInstance } from './data/initServerInstance';

beforeAll(() => {
  initClientInstance();
  initServerInstance();
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // Mock console.warn to suppress warnings during tests
  });
});

afterAll(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    // next-international 通常会读 params 里的 locale（或 segmentName）
    useParams: () => ({ locale: 'en' }),
  }));
});

// afterEach(() => {
//   vi.clearAllMocks()
// })
