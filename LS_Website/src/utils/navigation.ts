/**
 * Scrolls smoothly to a section by its ID
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Scrolls smoothly to the top of the page
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
