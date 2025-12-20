import { ParticleNetwork } from "./ParticleNetwork";
import { Button } from "./shared/Button";
import { scrollToSection } from "../../utils/navigation";
import microsoftLogo from "figma:asset/70806f53f23156ecee082393b11521af300fb6bd.png";
import metaLogo from "figma:asset/b01e5bfed3137d5863a79b66480f51f67f13728d.png";
import hereLogo from "figma:asset/b55cb9ce4c3ef270adb08358e2f429938b3c08e4.png";
import retroStudiosLogo from "figma:asset/b19d10ce85e2f1fd58c0d272b1564787439b94bd.png";
import scopelyLogo from "figma:asset/a315eca7695397976618184e74ee8d7097f6861b.png";
import xboxLogo from "figma:asset/d7e61bfbeab7e966ac5d961430261d11a43e4b6b.png";
import armyWestPointLogo from "figma:asset/aa71507becb3ca0d26639647f1d05be38b7c7bfa.png";
import groundspeedLogo from "figma:asset/8ce2682dc458104cde508597edb2ee28bc99ea7f.png";

const logos = [
  { name: "Microsoft", src: microsoftLogo },
  { name: "Meta", src: metaLogo },
  { name: "HERE Technologies", src: hereLogo },
  { name: "Scopely", src: scopelyLogo },
  { name: "Retro Studios", src: retroStudiosLogo },
  { name: "Xbox", src: xboxLogo },
  { name: "Army West Point Esports", src: armyWestPointLogo },
  { name: "Groundspeed", src: groundspeedLogo },
];

export function Hero() {
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center px-4 pt-24 pb-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <ParticleNetwork className="w-full h-full object-cover scale-150" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
      </div>

      <div className="container mx-auto text-center max-w-4xl flex-1 flex items-center">
        <div className="space-y-6 w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl">
            Transform Your Vision Into Reality
          </h1>
          <p className="text-lg md:text-xl text-[rgb(0,0,0)] max-w-2xl mx-auto">
            Expert consulting in UX Design, Visual Design, Web Development, and Optimization Tools.
            Creating exceptional digital experiences that drive results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={() => scrollToSection("contact")}>
              Start Your Project
            </Button>
            <Button variant="secondary" onClick={() => scrollToSection("services")}>
              View Services
            </Button>
          </div>
        </div>
      </div>

      {/* Logo Carousel */}
      <div className="w-full pb-4 pt-2">
        <div className="overflow-hidden">
          <div className="relative">
            <div className="inline-flex carousel-scroll will-change-transform">
              {logos.concat(logos).map((logo, index) => (
                <div key={`logo-${index}`} className="flex-shrink-0 mx-12">
                  <div className="w-48 h-24 flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-[rgba(113,113,130,0.29)] mt-4">
          Our team members have worked with these companies
        </p>
      </div>
    </section>
  );
}
