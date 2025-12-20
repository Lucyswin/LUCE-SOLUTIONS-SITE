import { CheckCircle } from "lucide-react";
import aboutImage from "figma:asset/ff567f04c9e3060ea4028409ed347fb2d5bbda37.png";
import { ParticleNetwork } from "./ParticleNetwork";

const expertise = [
  "User-centered design approach",
  "Modern web technologies and frameworks",
  "Performance optimization and best practices",
  "Responsive and accessible solutions",
];

export function About() {
  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      {/* Particle Network Background */}
      <div className="absolute inset-0 -z-10">
        <ParticleNetwork opacity={0.2} />
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl mb-6">
              Expertise That Delivers Results
            </h2>
            <p className="text-muted-foreground mb-6">
              With a passion for creating exceptional digital experiences, we combine strategic
              thinking with technical expertise to help businesses achieve their goals.
            </p>
            <p className="text-muted-foreground mb-8">
              Whether you're launching a new product, refreshing your brand, or building a
              complex web application, we bring the skills and dedication needed to make your
              project succeed.
            </p>
            <ul className="space-y-4">
              {expertise.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/50">
              <img
                src={aboutImage}
                alt="Design and development"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}