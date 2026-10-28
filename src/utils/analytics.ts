/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    adsbygoogle?: any[];
  }
}

export const GA_TRACKING_ID = 'G-ZSN0SP08KZ';
export const ADSENSE_CLIENT_ID = 'ca-pub-2644536267352236';

/**
 * Tracks custom event to Google Analytics (GA4)
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams: Record<string, any> = {}
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...additionalParams,
      });
    } catch (e) {
      // Ignore analytics dispatch errors quietly
    }
  }
}

/**
 * Tracks virtual page view for SPA navigation
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    } catch (e) {
      // Ignore
    }
  }
}
