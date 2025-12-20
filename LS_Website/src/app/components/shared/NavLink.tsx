import { scrollToSection } from "../../../utils/navigation";

interface NavLinkProps {
  sectionId: string;
  children: React.ReactNode;
  variant?: "desktop" | "mobile";
  onClick?: () => void;
}

export function NavLink({ sectionId, children, variant = "desktop", onClick }: NavLinkProps) {
  const handleClick = () => {
    scrollToSection(sectionId);
    onClick?.();
  };

  const linkClass = variant === "desktop" ? "nav-link-desktop" : "nav-link-mobile";

  return (
    <button onClick={handleClick} className={`nav-link ${linkClass}`}>
      {variant === "mobile" ? (
        <span className="nav-link-mobile">
          {children}
          <span className="nav-link-underline"></span>
        </span>
      ) : (
        <>
          {children}
          <span className="nav-link-underline"></span>
        </>
      )}
    </button>
  );
}
