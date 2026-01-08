import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { PromoBanner } from "./components/PromoBanner";
import { WebsiteLaunchIntake } from "./pages/WebsiteLaunchIntake";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

 // Handle hash navigation on page load (for links from other pages)
 useEffect(() => {
    if (currentPath === '/' && window.location.hash) {
      const sectionId = window.location.hash.substring(1); // Remove the '#'
      setTimeout(() => {
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
      }, 100); // Small delay to ensure page is rendered
    }
  }, [currentPath]);
  
  if (currentPath === "/website-launch-intake") return <WebsiteLaunchIntake />;

  return (
    <>
      {/* Promo banner fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <PromoBanner />
      </div>

      {/* Header fixed below banner */}
      <div className="fixed top-[42px] sm:top-[46px] left-0 right-0 z-40">
        <Header />
      </div>

      {/* Push page content down so it’s not hidden behind fixed elements */}
      <main className="pt-[42px] sm:pt-[46px]">
        {/* Add header height too. Example assumes header is ~72px desktop, adjust to yours */}
        <div className="pt-[72px]">
          <Hero />
          <Services />
          <About />
          <Contact />
        </div>
      </main>

      <Footer />
    </>
  );
}
