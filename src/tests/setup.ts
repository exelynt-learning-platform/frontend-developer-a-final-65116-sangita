import '@testing-library/jest-dom/vitest';

// Ant Design needs these in jsdom
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!window.ResizeObserver) {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error - test-only polyfill
  window.ResizeObserver = MockResizeObserver;
}

// jsdom does not support pseudo-elements; Ant Design Table/Form rely on getComputedStyle
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = (element, pseudoElement) => {
  if (pseudoElement) {
    return { getPropertyValue: () => '' } as CSSStyleDeclaration;
  }
  return originalGetComputedStyle(element);
};
