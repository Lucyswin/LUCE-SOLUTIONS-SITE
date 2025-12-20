import PixelRegularCode from "../../imports/PixelRegularCode";
import PixelRegularThemes from "../../imports/PixelRegularThemes";
import PixelRegularPencilRuler from "../../imports/PixelRegularPencilRuler";
import PixelRegularTrending from "../../imports/PixelRegularTrending";
import { Button } from "./shared/Button";
import { scrollToSection } from "../../utils/navigation";

interface Service {
  customIcon: React.ComponentType;
  title: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    customIcon: PixelRegularPencilRuler,
    title: "UX Design",
    description:
      "Designing intuitive and engaging web experiences. We focus on user-centered design principles to create interfaces that are both beautiful and functional.",
    features: ["Responsive Design", "User Research", "Prototyping", "Interaction Design"],
  },
  {
    customIcon: PixelRegularThemes,
    title: "Visual Design",
    description:
      "Crafting stunning visual identities that capture your brand essence. From logos to complete brand systems, we create designs that resonate with your audience.",
    features: ["PDPs & Social Media Assets", "Brand and Campaign Design", "Scalable Visual Systems", "Graphics & Illustrations"],
  },
  {
    customIcon: PixelRegularCode,
    title: "Development",
    description:
      "Building robust, scalable web applications with modern technologies. Clean code, best practices, and attention to detail in every project.",
    features: ["HTML, CSS, React", "Front-End Development", "API Integration", "Performance Optimization"],
  },
  {
    customIcon: PixelRegularTrending,
    title: "Workflow Optimization Tools",
    description:
      "Creating custom tools and applications that streamline your business processes. Automate repetitive tasks and boost productivity with tailored solutions.",
    features: ["Custom Automation", "Process Optimization", "Internal Tools", "Workflow Integration"],
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.customIcon;

  const handleClick = () => {
    scrollToSection("contact");
  };

  return (
    <div className="service-card" onClick={handleClick}>
      <div className="icon-container">
        <div className="pixel-icon">
          <Icon />
        </div>
      </div>
      <h3 className="mb-4 text-center text-xl">{service.title}</h3>
      <p className="text-muted-foreground mb-6">{service.description}</p>
      <ul className="space-y-2 mb-6 flex-grow">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-1">•</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        variant="tertiary"
        fullWidth
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        Learn More
      </Button>
    </div>
  );
}

function getGridClass(count: number): string {
  // If count % 3 === 1 (like 4, 7, 10), use 2 columns to avoid a single orphan
  if (count % 3 === 1) {
    return "grid md:grid-cols-2 gap-8";
  }
  // Otherwise use 3 columns (works well for 5, 6, 8, 9, etc.)
  return "grid md:grid-cols-2 lg:grid-cols-3 gap-8";
}

export function Services() {
  return (
    <section id="services" className="py-20 px-4 bg-muted/30 bg-[rgba(236,236,240,0.46)]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-4">Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our work spans AI/ML powered platforms, e-commerce, advertising systems, 
            and the complex workflows behind them. 
            No matter the industry, our focus is turning complexity
            into solutions that are intentional, efficient, and built to scale.
          </p>
        </div>

        <div className={getGridClass(services.length)}>
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}