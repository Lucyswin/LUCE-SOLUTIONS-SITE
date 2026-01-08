/**
 * Scrolls smoothly to a section by its ID
 * If on a different page, navigates to home page first
 */
export function scrollToSection(sectionId: string): void {
  // Check if we're on the home page
  if (window.location.pathname === '/') {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
