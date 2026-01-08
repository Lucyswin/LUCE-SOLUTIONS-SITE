/**
 * Scrolls smoothly to a section by its ID
 * If on a different page, navigates to home page first
 */
export function scrollToSection(sectionId: string): void {
  // Check if we're on the home page
  if (window.location.pathname === '/') {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset for fixed header (banner + nav = ~140px, add extra 20px padding)
      const offset = 160;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  } else {
    // Navigate to home page with hash
    window.location.href = `/#${sectionId}`;
  }
}

/**
 * Scrolls smoothly to the top of the page
 * If on a different page, navigates to home page
 */
export function scrollToTop(): void {
  if (window.location.pathname === '/') {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // Navigate to home page
    window.location.href = '/';
  }
}
