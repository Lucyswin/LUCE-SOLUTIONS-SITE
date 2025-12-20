import { LucideIcon } from "lucide-react";

interface SocialLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    <a
      href="https://www.instagram.com/lucesolutions?igsh=MWlwMGVza2Vjb3d3ZQ%3D%3D&utm_source=qr"
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
      aria-label={label}
    >
      <Icon size={20} />
    </a>
  );
}