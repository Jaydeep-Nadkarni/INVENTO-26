/**
 * LCP (Largest Contentful Paint) Optimization
 * Ensures hero image is loaded with highest priority
 */

export const optimizeLCPImage = (imageUrl, isMobile = false) => {
  if (typeof document === 'undefined') return;

  // Create high-priority image element for LCP optimization
  const img = new Image();
  
  // Set fetchpriority attribute (high priority)
  img.fetchPriority = 'high';
  
  // Preload the image
  img.src = imageUrl;
  
  // Add loading="eager" to prevent lazy loading
  img.loading = 'eager';
  
  // Mark as important for browser
  img.dataset.lcp = 'true';
  
  return img;
};

/**
 * Report Web Vitals to console
 * Helps monitor LCP, FID, CLS
 */
export const reportWebVitals = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Report LCP
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const lastEntry = list.getEntries()[list.getEntries().length - 1];
        console.log(`📊 LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.debug('LCP observer not available');
    }
  }

  // Report FCP
  const fcpEntries = performance.getEntriesByName('first-contentful-paint');
  if (fcpEntries.length > 0) {
    console.log(`📊 FCP: ${fcpEntries[0].startTime}ms`);
  }

  // Report CLS
  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log(`📊 CLS: ${clsValue.toFixed(3)}`);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.debug('CLS observer not available');
    }
  }
};

/**
 * Priority-load background image
 */
export const preloadBackgroundImage = (imageUrl) => {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = imageUrl;
  link.fetchPriority = 'high';
  document.head.appendChild(link);
};

export default {
  optimizeLCPImage,
  reportWebVitals,
  preloadBackgroundImage
};
