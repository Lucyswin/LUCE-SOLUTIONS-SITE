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
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Route to intake page
  if (currentPath === "/website-launch-intake") {
    return <WebsiteLaunchIntake />;
  }

  // Default route - main site
  return (
    <>
        <div className="fixed top-0 left-0 right-0 z-50">
        <PromoBanner />
        <Header />
      </div>
      <main>
        <Hero />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
