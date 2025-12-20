import { Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "./shared/Button";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    services: [] as string[],
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    services: "",
    message: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      services: "",
      message: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.services.length === 0) {
      newErrors.services = "Please select at least one service";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter a message";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Always validate - this will show errors if form is invalid
    if (validateForm()) {
      // In a real application, this would send the form data to a backend
      console.log("Form submitted:", formData);
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", email: "", services: [], message: "" });
      setErrors({ name: "", email: "", services: "", message: "" });
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Validate form and show errors for all invalid fields
    if (validateForm()) {
      // Form is valid, submit it
      submitForm();
    }
    // If invalid, validateForm() has already set the errors which will display
  };

  const submitForm = async () => {
    try {
      // Using Formspree to send email
      // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
      // Sign up at https://formspree.io/ and create a form to get your ID
      const response = await fetch('https://formspree.io/f/xjgbgbze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          services: formData.services.join(', '),
          message: formData.message,
          _replyto: formData.email, // This sets the reply-to address
          _subject: `New Contact Form Submission from ${formData.name}`,
        }),
      });

      if (response.ok) {
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: "", email: "", services: [], message: "" });
        setErrors({ name: "", email: "", services: "", message: "" });
      } else {
        alert("There was an error sending your message. Please try again or email us directly at info@lucesolutions.com");
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert("There was an error sending your message. Please try again or email us directly at info@lucesolutions.com");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleEmailBlur = () => {
    if (formData.email.trim() && !validateEmail(formData.email)) {
      setErrors({
        ...errors,
        email: "Please enter a valid email address",
      });
    }
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
    
    // Clear services error when user selects a checkbox
    if (errors.services) {
      setErrors({
        ...errors,
        services: "",
      });
    }
  };

  const serviceOptions = [
    "UX Design",
    "Visual Design",
    "Web Development",
    "Workflow Optimization Tools",
  ];

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      validateEmail(formData.email) &&
      formData.services.length > 0 &&
      formData.message.trim() !== ""
    );
  };

  return (
    <section id="contact" className="py-20 px-4 bg-muted/30 bg-[rgba(236,236,240,0.35)]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4">Let's Work Together</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Get in touch and let's discuss how we can help
            bring your vision to life.
          </p>
        </div>

        {/* Contact Information Row */}
        <div className="mb-12 bg-card p-8 rounded-xl border border-border">
          <h3 className="mb-6 text-center">Contact Information</h3>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-accent" size={20} />
              </div>
              <div>
                <a 
                  href="mailto:info@lucesolutions.com"
                  className="text-muted-foreground hover:text-accent transition-colors hover:underline"
                >
                  info@lucesolutions.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-accent" size={20} />
              </div>
              <div>
                <p className="text-muted-foreground">Ann Arbor, MI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h3 className="mb-6">Contact Form</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block mb-2">Service Interested In</label>
              <div className="space-y-1">
                {serviceOptions.map((service) => (
                  <div key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      id={service}
                      name="services"
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={() => handleCheckboxChange(service)}
                      className="mr-2 w-4 h-4 cursor-pointer"
                      style={{ accentColor: 'var(--accent-coral)' }}
                    />
                    <label htmlFor={service} className="font-normal">{service}</label>
                  </div>
                ))}
              </div>
              {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Tell us about your project..."
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={handleButtonClick}
              className={!isFormValid() ? "bg-gray-300 cursor-not-allowed text-gray-500 opacity-50" : ""}
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}