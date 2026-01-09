/**
 * Performance Optimization Utilities
 * Handles mobile detection, animation control, and lazy loading
 */

// Mobile device detection
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
};

// Detect if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Skip animations on mobile or when reduced motion is preferred
export const shouldSkipAnimations = () => {
  return isMobileDevice() || prefersReducedMotion();
};

// Lazy load animation library only on desktop
export const lazyLoadFramerMotion = () => {
  if (isMobileDevice()) {
    // Return dummy motion object on mobile
    return {
      motion: { div: 'div', span: 'span', button: 'button' },
      AnimatePresence: ({ children }) => children
    };
  }
  // Load real Framer Motion on desktop
  return import('framer-motion');
};

// Defer non-critical operations
export const deferToIdleCallback = (callback) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(callback, 1000);
  }
};

// Defer to animation frame
export const deferToAnimationFrame = (callback) => {
  if (typeof window !== 'undefined') {
    window.requestAnimationFrame(callback);
  }
};

// Prefetch resources for better performance
export const prefetchResource = (url, type = 'script') => {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  if (type === 'style') link.as = 'style';
  if (type === 'script') link.as = 'script';
  document.head.appendChild(link);
};

// Measure performance metrics
export const measurePerformance = (label) => {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const startMark = `${label}-start`;
  const endMark = `${label}-end`;
  const measureName = `${label}-measure`;
  
  if (!performance.getEntriesByName(startMark).length) {
    performance.mark(startMark);
  } else {
    performance.mark(endMark);
    try {
      performance.measure(measureName, startMark, endMark);
      const measure = performance.getEntriesByName(measureName)[0];
      console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
    } catch (e) {
      console.error('Performance measurement failed:', e);
    }
  }
};

// Monitor long tasks
export const monitorLongTasks = () => {
  if (typeof PerformanceObserver === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // PerformanceObserver might not support longtask
    console.debug('Long task monitoring not available');
  }
};

// Batch DOM updates to prevent layout thrashing
export const batchDOMUpdates = (updates) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

export default {
  isMobileDevice,
  prefersReducedMotion,
  shouldSkipAnimations,
  lazyLoadFramerMotion,
  deferToIdleCallback,
  deferToAnimationFrame,
  prefetchResource,
  measurePerformance,
  monitorLongTasks,
  batchDOMUpdates
};
