import { useState, useEffect } from "react";
import { Check, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/shared/Button";
import fullyManagedImage from "../../assets/FullyManagedTier2.png";
import buildOnlyImage from "../../assets/BasicTier.png";

// PayPal SDK type declaration
declare global {
  interface Window {
    paypal?: any;
  }
}

type Plan = "fully-managed" | "build-only" | null;
type ContactMethod = "email" | "instagram" | "";
type DomainOwnership = "yes" | "no" | "";
type Registrar = "godaddy" | "namecheap" | "google" | "squarespace" | "other" | "not-sure" | "";
type LogoOption = "upload" | "text" | "";
type SocialLinks = "yes" | "no" | "";

interface FormData {
  // Plan
  plan: Plan;
  
  // Contact
  fullName: string;
  email: string;
  businessName: string;
  contactMethod: ContactMethod;
  instagramHandle: string;
  
  // Business
  businessDescription: string;
  
  // Domain
  ownsDomain: DomainOwnership;
  domainName: string;
  registrar: Registrar;
  
  // Website content
  heroHeadline: string;
  heroSubtext: string;
  servicesContent: string;
  aboutContent: string;
  contactContent: string;
  
  // Branding
  logoOption: LogoOption;
  brandColors: string;
  
  // Images
  logoFile: File | null;
  heroImage: File | null;
  aboutImage: File | null;
  
  // Contact info
  displayEmail: string;
  includeSocialLinks: SocialLinks;
  socialLinks: string;
  
  // Confirmation
  confirmation: boolean;
  planDisclaimer: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const STEPS = [
  { id: 1, label: "Plan", shortLabel: "Plan" },
  { id: 2, label: "Information", shortLabel: "Info" },
  { id: 3, label: "Domain", shortLabel: "Domain" },
  { id: 4, label: "Content", shortLabel: "Content" },
  { id: 5, label: "Images", shortLabel: "Images" },
  { id: 6, label: "Review", shortLabel: "Review" },
  { id: 7, label: "Payment", shortLabel: "Payment" },
];

export function WebsiteLaunchIntake() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    plan: null,
    fullName: "",
    email: "",
    businessName: "",
    contactMethod: "",
    instagramHandle: "",
    businessDescription: "",
    ownsDomain: "",
    domainName: "",
    registrar: "",
    heroHeadline: "",
    heroSubtext: "",
    servicesContent: "",
    aboutContent: "",
    contactContent: "",
    logoOption: "",
    brandColors: "",
    logoFile: null,
    heroImage: null,
    aboutImage: null,
    displayEmail: "",
    includeSocialLinks: "",
    socialLinks: "",
    confirmation: false,
    planDisclaimer: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [setupPaymentCompleted, setSetupPaymentCompleted] = useState(false);
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState<string | null>(null);
  const [formspreeSubmitted, setFormspreeSubmitted] = useState(false);
  const [formspreeError, setFormspreeError] = useState(false);
  const [isSubmittingToFormspree, setIsSubmittingToFormspree] = useState(false);

  // Formspree endpoint
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvpgedw";

  // Check for PayPal return (for Build Only hosted button)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status') || urlParams.get('st');
    
    // If payment completed, mark it and navigate to step 7
    if (paymentStatus === 'Completed' || paymentStatus === 'completed') {
      setSetupPaymentCompleted(true);
      setCurrentStep(7);
      
      // Submit intake form to Formspree for Build Only plan
      submitToFormspree();
      
      // Clean up URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Format and submit intake form to Formspree after successful payment
  const submitToFormspree = async () => {
    if (isSubmittingToFormspree || formspreeSubmitted) return;

    setIsSubmittingToFormspree(true);
    setFormspreeError(false);

    try {
      const submissionId = `intake-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();

      // Format file information
      const getFileInfo = (file: File | null, fieldName: string) => {
        if (!file) return `${fieldName}: Not uploaded`;
        const url = file ? URL.createObjectURL(file) : null;
        return `${fieldName}: ${file.name}${url ? ` (temporary browser URL: ${url})` : ' (File uploaded in browser, no URL available)'}`;
      };

      // Build structured email body
      const emailBody = `
NEW WEBSITE LAUNCH INTAKE FORM SUBMISSION
Submission ID: ${submissionId}
Timestamp: ${new Date(timestamp).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Plan Selected: ${formData.plan === 'fully-managed' ? 'Fully Managed ($20/month + setup)' : 'Build Only ($349 one-time)'}
Business Name: ${formData.businessName}
Primary Contact: ${formData.contactMethod === 'email' ? formData.email : `Instagram @${formData.instagramHandle}`}
Domain Status: ${formData.ownsDomain === 'yes' ? `Has domain: ${formData.domainName}` : 'No domain yet'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A) PLAN DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Selected Plan: ${formData.plan === 'fully-managed' ? 'Fully Managed' : 'Build Only'}
${formData.plan === 'fully-managed' 
  ? '• Includes: Website build + hosting + maintenance + support\n• Monthly subscription: $20/month\n• One-time setup fee included' 
  : '• Includes: Website build only\n• One-time payment: $349\n• Client responsible for hosting and maintenance'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
B) BASIC INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Name: ${formData.fullName}
Email: ${formData.email}
Business Name: ${formData.businessName}
Preferred Contact Method: ${formData.contactMethod}
${formData.contactMethod === 'instagram' ? `Instagram Handle: @${formData.instagramHandle}` : ''}

Business Description:
${formData.businessDescription}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
C) DOMAIN & HOSTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Owns Domain: ${formData.ownsDomain === 'yes' ? 'Yes' : 'No'}
${formData.ownsDomain === 'yes' ? `
Domain Name: ${formData.domainName}
Registrar: ${formData.registrar === 'godaddy' ? 'GoDaddy' : 
             formData.registrar === 'namecheap' ? 'Namecheap' :
             formData.registrar === 'google' ? 'Google Domains' :
             formData.registrar === 'squarespace' ? 'Squarespace' :
             formData.registrar === 'other' ? 'Other' :
             formData.registrar === 'not-sure' ? 'Not Sure' : formData.registrar}
` : 'Domain will need to be purchased'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
D) WEBSITE CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HERO SECTION
─────────────
Headline: ${formData.heroHeadline || '(Not provided)'}

Subtext: ${formData.heroSubtext || '(Not provided)'}

SERVICES SECTION
─────────────────
${formData.servicesContent || '(Not provided)'}

ABOUT SECTION
──────────────
${formData.aboutContent || '(Not provided)'}

CONTACT SECTION
────────────────
${formData.contactContent || '(Not provided)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
E) BRANDING & DESIGN PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Logo Option: ${formData.logoOption === 'upload' ? 'Upload Logo File' : formData.logoOption === 'text' ? 'Text-Based Logo' : '(Not specified)'}

Brand Colors:
${formData.brandColors || '(Not provided)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
F) IMAGES / FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getFileInfo(formData.logoFile, 'Logo File')}
${getFileInfo(formData.heroImage, 'Hero Image')}
${getFileInfo(formData.aboutImage, 'About Image')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
G) CONTACT & SOCIAL LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Display Email on Website: ${formData.displayEmail || '(Not provided)'}
Include Social Links: ${formData.includeSocialLinks === 'yes' ? 'Yes' : 'No'}

${formData.includeSocialLinks === 'yes' ? `Social Media Links:\n${formData.socialLinks || '(Not provided)'}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
H) CONFIRMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Accuracy Confirmation: ${formData.confirmation ? 'Confirmed' : 'Not confirmed'}
Plan Disclaimer: ${formData.planDisclaimer ? 'Acknowledged' : 'Not acknowledged'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      // Prepare payload for Formspree
      const payload = {
        _subject: `New Website Launch Intake: ${formData.businessName} (${formData.plan === 'fully-managed' ? 'Fully Managed' : 'Build Only'})`,
        submissionId,
        timestamp,
        message: emailBody,
        // Include structured data as well
        plan: formData.plan,
        businessName: formData.businessName,
        fullName: formData.fullName,
        email: formData.email,
        contactMethod: formData.contactMethod,
        instagramHandle: formData.instagramHandle,
      };

      // Submit to Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Formspree submission failed: ${response.status}`);
      }

      setFormspreeSubmitted(true);
      console.log('✅ Intake form successfully submitted to Formspree', { submissionId });

    } catch (error) {
      console.error('❌ Error submitting to Formspree:', error);
      setFormspreeError(true);
    } finally {
      setIsSubmittingToFormspree(false);
    }
  };

  // Load PayPal SDK when payment step is reached
  useEffect(() => {
    if (currentStep === 7 && !setupPaymentCompleted && formData.plan && paypalSdkLoaded !== formData.plan) {
      // Remove any existing PayPal script first
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Clear the paypal object
      if (window.paypal) {
        delete window.paypal;
      }

      // Load the appropriate SDK based on the plan
      const script = document.createElement('script');
      
      if (formData.plan === "fully-managed") {
        // Fully Managed: subscription
        script.src = 'https://www.paypal.com/sdk/js?client-id=AbQuLT_AccJMdHn2C9iz02-pMIrxwfL6wIUz_sucbZsHoUhVzbXhOROehvv9S-emVc4KlBspNxJqtnEb&vault=true&intent=subscription';
        script.setAttribute('data-sdk-integration-source', 'button-factory');
      } else if (formData.plan === "build-only") {
        // Build Only: hosted button
        script.src = 'https://www.paypal.com/sdk/js?client-id=BAATRiYE82NIqFuoFLdKHHi34wAXaNLGr7FzE2Mw5vqLWlaqINm1QCv4p7o-JeGV04zjJ1JQmJ8-T2fPz8&components=hosted-buttons&enable-funding=venmo&currency=USD';
      }
      
      script.async = true;
      script.onload = () => {
        setPaypalSdkLoaded(formData.plan);
      };
      document.head.appendChild(script);
    }
  }, [currentStep, setupPaymentCompleted, formData.plan, paypalSdkLoaded]);

  // Render PayPal Fully Managed subscription button
  useEffect(() => {
    if (currentStep === 7 && !setupPaymentCompleted && formData.plan === "fully-managed" && paypalSdkLoaded === "fully-managed") {
      const renderButton = () => {
        if (window.paypal && window.paypal.Buttons && document.getElementById('paypal-button-container-P-33631873E0915932XNFOVGMY')) {
          // Clear any existing button first
          const container = document.getElementById('paypal-button-container-P-33631873E0915932XNFOVGMY');
          if (container) {
            container.innerHTML = '';
            window.paypal.Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'paypal'
              },
              createSubscription: function(data: any, actions: any) {
                return actions.subscription.create({
                  plan_id: 'P-33631873E0915932XNFOVGMY'
                });
              },
              onApprove: async function(data: any, actions: any) {
                // Payment successful - mark as completed
                setSetupPaymentCompleted(true);
                console.log('✅ PayPal subscription created! ID: ' + data.subscriptionID);
                
                // Submit intake form to Formspree
                await submitToFormspree();
              }
            }).render('#paypal-button-container-P-33631873E0915932XNFOVGMY');
          }
        }
      };

      // If PayPal SDK is already loaded, render immediately
      if (window.paypal && window.paypal.Buttons) {
        renderButton();
      } else {
        // Otherwise, wait for it to load
        const checkPayPal = setInterval(() => {
          if (window.paypal && window.paypal.Buttons) {
            renderButton();
            clearInterval(checkPayPal);
          }
        }, 100);

        return () => clearInterval(checkPayPal);
      }
    }
  }, [currentStep, setupPaymentCompleted, formData.plan, paypalSdkLoaded]);

  // Render PayPal Build Only hosted button
  useEffect(() => {
    if (currentStep === 7 && !setupPaymentCompleted && formData.plan === "build-only" && paypalSdkLoaded === "build-only") {
      // Listen for messages from PayPal
      const handleMessage = (event: MessageEvent) => {
        if (event.origin === "https://www.paypal.com") {
          try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            if (data.action === 'checkout' && data.result === 'success') {
              // Payment completed successfully
              setSetupPaymentCompleted(true);
              
              // Submit intake form to Formspree
              submitToFormspree();
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      };

      window.addEventListener('message', handleMessage);

      const renderButton = () => {
        if (window.paypal && window.paypal.HostedButtons && document.getElementById('paypal-container-XY8K2RBF8KV6A')) {
          // Clear any existing button first
          const container = document.getElementById('paypal-container-XY8K2RBF8KV6A');
          if (container) {
            container.innerHTML = '';
            window.paypal.HostedButtons({
              hostedButtonId: "XY8K2RBF8KV6A"
            }).render("#paypal-container-XY8K2RBF8KV6A");
          }
        }
      };

      // If PayPal SDK is already loaded, render immediately
      if (window.paypal && window.paypal.HostedButtons) {
        renderButton();
      } else {
        // Otherwise, wait for it to load
        const checkPayPal = setInterval(() => {
          if (window.paypal && window.paypal.HostedButtons) {
            renderButton();
            clearInterval(checkPayPal);
          }
        }, 100);

        return () => {
          clearInterval(checkPayPal);
          window.removeEventListener('message', handleMessage);
        };
      }

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [currentStep, setupPaymentCompleted, formData.plan, paypalSdkLoaded]);

  // Helper function to check if a step is complete based on the selected plan
  const isStepComplete = (stepId: number, data: FormData): boolean => {
    // First, check if this step's own requirements are met
    let stepRequirementsMet = false;
    
    switch (stepId) {
      case 1: // Plan
        stepRequirementsMet = !!data.plan;
        break;

      case 2: // Basic Information
        stepRequirementsMet = !!(
          data.fullName.trim() &&
          data.email.trim() &&
          validateEmail(data.email) &&
          data.businessName.trim() &&
          data.contactMethod &&
          data.businessDescription.trim()
        );
        break;

      case 3: // Domain
        if (!data.ownsDomain) {
          stepRequirementsMet = false;
        } else if (data.ownsDomain === "yes") {
          stepRequirementsMet = !!(data.domainName.trim() && data.registrar);
        } else {
          stepRequirementsMet = true;
        }
        break;

      case 4: // Content
        if (data.plan === "build-only") {
          stepRequirementsMet = !!(
            data.heroHeadline.trim() &&
            data.heroSubtext.trim() &&
            data.servicesContent.trim() &&
            data.aboutContent.trim() &&
            data.contactContent.trim()
          );
        } else {
          stepRequirementsMet = true; // Optional for fully-managed
        }
        break;

      case 5: // Branding & Images
        if (!data.logoOption) {
          stepRequirementsMet = false;
        } else if (data.logoOption === "upload" && !data.logoFile) {
          stepRequirementsMet = false;
        } else if (data.plan === "build-only" && !data.heroImage) {
          stepRequirementsMet = false;
        } else if (data.plan === "build-only" && !data.aboutImage) {
          stepRequirementsMet = false;
        } else if (!data.includeSocialLinks) {
          stepRequirementsMet = false;
        } else if (data.includeSocialLinks === "yes" && !data.socialLinks.trim()) {
          stepRequirementsMet = false;
        } else {
          stepRequirementsMet = true;
        }
        break;

      case 6: // Review
        stepRequirementsMet = !!(data.confirmation && data.planDisclaimer);
        break;

      default:
        stepRequirementsMet = false;
    }
    
    // If this step's requirements aren't met, it's incomplete
    if (!stepRequirementsMet) {
      return false;
    }
    
    // Step 1 has no dependencies, so if requirements are met, it's complete
    if (stepId === 1) {
      return true;
    }
    
    // For steps 2+, check that ALL previous steps are complete
    for (let i = 1; i < stepId; i++) {
      if (!isStepComplete(i, data)) {
        return false;
      }
    }
    
    return true;
  };

  const handlePlanSelect = (plan: Plan) => {
    const updatedFormData = { ...formData, plan };
    setFormData(updatedFormData);
    
    if (errors.plan) {
      setErrors({ ...errors, plan: "" });
    }

    // Re-evaluate all completed steps with the new plan
    const stillCompletedSteps: number[] = [];
    let firstIncompleteStep: number | null = null;

    for (let i = 1; i <= 6; i++) {
      if (isStepComplete(i, updatedFormData)) {
        stillCompletedSteps.push(i);
      } else if (firstIncompleteStep === null && i > 1) {
        // Track the first incomplete step after step 1 (plan selection)
        firstIncompleteStep = i;
      }
    }

    setCompletedSteps(stillCompletedSteps);

    // If switching to Build Only and there are incomplete required steps
    if (plan === "build-only" && firstIncompleteStep !== null) {
      // If current step is beyond the first incomplete step, navigate back
      if (currentStep > firstIncompleteStep) {
        setCurrentStep(firstIncompleteStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      [fieldName]: file,
    });

    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 1: // Plan
        if (!formData.plan) {
          newErrors.plan = "Please select a plan";
        }
        break;

      case 2: // Basic Information
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required";
        }
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
        if (!formData.businessName.trim()) {
          newErrors.businessName = "Business name is required";
        }
        if (!formData.contactMethod) {
          newErrors.contactMethod = "Please select a contact method";
        }
        if (!formData.businessDescription.trim()) {
          newErrors.businessDescription = "Business description is required";
        }
        break;

      case 3: // Domain
        if (!formData.ownsDomain) {
          newErrors.ownsDomain = "Please indicate if you own a domain";
        }
        if (formData.ownsDomain === "yes" && !formData.domainName.trim()) {
          newErrors.domainName = "Domain name is required";
        }
        if (formData.ownsDomain === "yes" && !formData.registrar) {
          newErrors.registrar = "Please select your registrar";
        }
        break;

      case 4: // Content
        if (formData.plan === "build-only") {
          if (!formData.heroHeadline.trim()) {
            newErrors.heroHeadline = "Hero headline is required for Build Only plan";
          }
          if (!formData.heroSubtext.trim()) {
            newErrors.heroSubtext = "Hero subtext is required for Build Only plan";
          }
          if (!formData.servicesContent.trim()) {
            newErrors.servicesContent = "Services content is required for Build Only plan";
          }
          if (!formData.aboutContent.trim()) {
            newErrors.aboutContent = "About content is required for Build Only plan";
          }
          if (!formData.contactContent.trim()) {
            newErrors.contactContent = "Contact content is required for Build Only plan";
          }
        }
        break;

      case 5: // Branding & Images
        if (!formData.logoOption) {
          newErrors.logoOption = "Please select a logo option";
        }
        if (formData.logoOption === "upload" && !formData.logoFile) {
          newErrors.logoFile = "Please upload your logo";
        }
        if (formData.plan === "build-only" && !formData.heroImage) {
          newErrors.heroImage = "Hero image is required for Build Only plan";
        }
        if (formData.plan === "build-only" && !formData.aboutImage) {
          newErrors.aboutImage = "Please upload an about image";
        }
        if (!formData.includeSocialLinks) {
          newErrors.includeSocialLinks = "Please indicate if you want social links";
        }
        if (formData.includeSocialLinks === "yes" && !formData.socialLinks.trim()) {
          newErrors.socialLinks = "Please provide your social links";
        }
        break;

      case 6: // Review
        if (!formData.confirmation) {
          newErrors.confirmation = "You must agree to the terms to continue";
        }
        if (!formData.planDisclaimer) {
          newErrors.planDisclaimer = "You must acknowledge the plan terms to continue";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector(".text-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (stepId: number) => {
    // Only allow navigation to steps that are:
    // 1. The current step
    // 2. Previously completed steps that are still complete with the current plan
    // 3. Step 1 (plan selection) is always accessible
    if (stepId === currentStep || stepId === 1 || (completedSteps.includes(stepId) && isStepComplete(stepId, formData))) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // If clicking on a future step or an incomplete step, do nothing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateCurrentStep()) {
      // Log form data (replace with actual API call later)
      console.log("Form submitted:", formData);
      // Move to payment step instead of showing submitted screen
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector(".text-red-500");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl mb-4">Launch Your Website</h1>
          <p className="text-muted-foreground text-lg">
            Get a clean, one page site built fast.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          {/* Step counter */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>

          {/* Progress bar */}
          <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto px-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative" style={{ flex: 1 }}>
                {/* Connector line - positioned before circle except for first step */}
                {index > 0 && (
                  <div
                    className="absolute top-5 right-1/2 h-[2px] transition-all"
                    style={{
                      width: '100%',
                      backgroundColor: completedSteps.includes(STEPS[index - 1].id)
                        ? '#e45792'
                        : 'var(--border)',
                    }}
                  />
                )}

                {/* Step circle */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    onClick={() => handleStepClick(step.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      completedSteps.includes(step.id)
                        ? 'border-[#e45792]'
                        : currentStep === step.id
                        ? 'border-[#e45792]'
                        : 'bg-background border-border'
                    } ${
                      step.id === currentStep || completedSteps.includes(step.id)
                        ? 'cursor-pointer'
                        : 'cursor-default'
                    }`}
                    style={{
                      backgroundColor: completedSteps.includes(step.id) || currentStep === step.id
                        ? '#e45792'
                        : undefined
                    }}
                  >
                    {completedSteps.includes(step.id) ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          currentStep === step.id ? 'text-white' : 'text-muted-foreground'
                        }`}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    onClick={() => handleStepClick(step.id)}
                    className={`text-xs mt-2 text-center whitespace-nowrap hidden md:block ${
                      currentStep === step.id ? 'font-medium' : 'text-muted-foreground'
                    } ${
                      step.id === currentStep || completedSteps.includes(step.id)
                        ? 'cursor-pointer'
                        : 'cursor-default'
                    }`}
                    style={{
                      color: currentStep === step.id ? '#e45792' : undefined
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    onClick={() => handleStepClick(step.id)}
                    className={`text-xs mt-2 text-center md:hidden ${
                      currentStep === step.id ? 'font-medium' : 'text-muted-foreground'
                    } ${
                      step.id === currentStep || completedSteps.includes(step.id)
                        ? 'cursor-pointer'
                        : 'cursor-default'
                    }`}
                    style={{
                      color: currentStep === step.id ? '#e45792' : undefined
                    }}
                  >
                    {step.shortLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {/* Step 1: Plan */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="bg-card p-6 md:p-8 lg:p-10 rounded-xl border border-border">
                <h2 className="text-2xl mb-6">Select Your Plan</h2>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
                  {/* Fully Managed Plan */}
                  <div
                    onClick={() => handlePlanSelect("fully-managed")}
                    className={`relative bg-card p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.plan === "fully-managed"
                        ? "border-primary shadow-lg"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[rgb(255,210,48)] text-[rgb(0,0,0)] px-4 py-1 rounded-full text-sm font-medium font-bold text-[15px]">
                      Most Popular
                    </div>
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          formData.plan === "fully-managed"
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {formData.plan === "fully-managed" && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2">Fully Managed</h3>
                        <p className="text-muted-foreground text-sm">
                          We'll handle the website text and images. You just answer questions and provide feedback.
                        </p>
                      </div>
                    </div>
                    {/* Plan image */}
                    <img 
                      src={fullyManagedImage} 
                      alt="Fully Managed Website Launch Plan"
                      className="rounded-lg"
                      style={{ display: 'block', width: '100%', height: 'auto' }}
                    />
                  </div>

                  {/* Build Only Plan */}
                  <div
                    onClick={() => handlePlanSelect("build-only")}
                    className={`bg-card p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.plan === "build-only"
                        ? "border-primary shadow-lg"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          formData.plan === "build-only"
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {formData.plan === "build-only" && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2">Build Only</h3>
                        <p className="text-muted-foreground text-sm">
                          You provide all content and images. We'll build your site to your specifications.
                        </p>
                      </div>
                    </div>
                    {/* Plan image */}
                    <img 
                      src={buildOnlyImage} 
                      alt="Build Only Website Launch Plan"
                      className="rounded-lg"
                      style={{ display: 'block', width: '100%', height: 'auto' }}
                    />
                  </div>
                </div>
                {errors.plan && <p className="text-red-500 text-sm mt-4 text-center">{errors.plan}</p>}
              </div>

              {/* Reassurance Notes */}
              {formData.plan === "fully-managed" && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>Good news:</strong> No need to upload images or provide copy unless you'd like to! We'll write the copy and source images based on your answers.
                  </p>
                </div>
              )}
              {formData.plan === "build-only" && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <strong>Important:</strong> You must provide the website text and a high quality hero image to begin.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Basic Information */}
          {currentStep === 2 && (
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="businessName" className="block mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>

                <div>
                  <label className="block mb-2">
                    Preferred Contact Method <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="contact-email"
                        name="contactMethod"
                        value="email"
                        checked={formData.contactMethod === "email"}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4 cursor-pointer"
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <label htmlFor="contact-email" className="font-normal cursor-pointer">
                        Email
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="contact-instagram"
                        name="contactMethod"
                        value="instagram"
                        checked={formData.contactMethod === "instagram"}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4 cursor-pointer"
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <label htmlFor="contact-instagram" className="font-normal cursor-pointer">
                        Instagram DM
                      </label>
                    </div>
                  </div>
                  {errors.contactMethod && <p className="text-red-500 text-sm mt-1">{errors.contactMethod}</p>}
                </div>

                <div>
                  <label htmlFor="instagramHandle" className="block mb-2">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    id="instagramHandle"
                    name="instagramHandle"
                    value={formData.instagramHandle}
                    onChange={handleInputChange}
                    placeholder="@yourhandle"
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label htmlFor="businessDescription" className="block mb-2">
                    Business Description <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-muted-foreground mb-2">2 to 4 sentences is perfect.</p>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.businessDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Domain */}
          {currentStep === 3 && (
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl mb-6">Domain</h2>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2">
                    Do you already own a domain? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="domain-yes"
                        name="ownsDomain"
                        value="yes"
                        checked={formData.ownsDomain === "yes"}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4 cursor-pointer"
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <label htmlFor="domain-yes" className="font-normal cursor-pointer">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="domain-no"
                        name="ownsDomain"
                        value="no"
                        checked={formData.ownsDomain === "no"}
                        onChange={handleInputChange}
                        className="mr-2 w-4 h-4 cursor-pointer"
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <label htmlFor="domain-no" className="font-normal cursor-pointer">
                        No
                      </label>
                    </div>
                  </div>
                  {errors.ownsDomain && <p className="text-red-500 text-sm mt-1">{errors.ownsDomain}</p>}
                  
                  {formData.ownsDomain === "no" && formData.plan === "build-only" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-700">
                        We recommend upgrading to the <b>Fully Managed Plan</b> so that we can handle domain setup for you. If you choose not to set one up now, your website will use an address like yourbusiness.pages.dev.{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStep(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
                        >
                          Change plans
                        </button>
                      </p>
                    </div>
                  )}
                  
                  {formData.ownsDomain === "no" && formData.plan === "fully-managed" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-700">
                        If you don't have a domain yet, your website will temporarily use an address like yourbusiness.pages.dev. <br></br><br></br>This won't stop you from continuing. If you'd like help setting up a custom domain later, we can assist at a discounted rate and will reach out after launch.
                      </p>
                    </div>
                  )}
                </div>

                {formData.ownsDomain === "yes" && (
                  <>
                    <div>
                      <label htmlFor="domainName" className="block mb-2">
                        If so, what is your domain? <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="domainName"
                        name="domainName"
                        value={formData.domainName}
                        onChange={handleInputChange}
                        placeholder="example.com"
                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {errors.domainName && <p className="text-red-500 text-sm mt-1">{errors.domainName}</p>}
                    </div>

                    <div>
                      <label htmlFor="registrar" className="block mb-2">
                        Registrar <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="registrar"
                        name="registrar"
                        value={formData.registrar}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select registrar</option>
                        <option value="godaddy">GoDaddy</option>
                        <option value="namecheap">Namecheap</option>
                        <option value="google">Google Domains</option>
                        <option value="squarespace">Squarespace</option>
                        <option value="other">Other</option>
                        <option value="not-sure">Not sure</option>
                      </select>
                      {errors.registrar && <p className="text-red-500 text-sm mt-1">{errors.registrar}</p>}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <b>Note:</b> You'll need to provide temporary access to your domain so I can connect it to your website. I'll reach out with simple step by step instructions and help you through the process.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Content */}
          {currentStep === 4 && (
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl mb-2">Website Content</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {formData.plan === "build-only" ? "Required for Build Only plan" : "Optional for Fully Managed plan"}
              </p>
              <div className="space-y-6">
                <div>
                  <label htmlFor="heroHeadline" className="block mb-2">
                    Hero Headline {formData.plan === "build-only" && <span className="text-red-500">*</span>}
                  </label>
                  <p className="text-sm text-gray-500 mb-2">This is the large headline at the top of your website</p>
                  <input
                    type="text"
                    id="heroHeadline"
                    name="heroHeadline"
                    value={formData.heroHeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.heroHeadline && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.heroHeadline}.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-blue-600 underline hover:text-blue-800 text-sm font-normal cursor-pointer"
                      >
                        Upgrade to Fully Managed
                      </button>{" "}
                      and we'll handle it for you.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="heroSubtext" className="block mb-2">
                    Hero Subtext {formData.plan === "build-only" && <span className="text-red-500">*</span>}
                  </label>
                  <p className="text-sm text-gray-500 mb-2">This is the smaller text that appears below the main headline</p>
                  <textarea
                    id="heroSubtext"
                    name="heroSubtext"
                    value={formData.heroSubtext}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.heroSubtext && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.heroSubtext}.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-blue-600 underline hover:text-blue-800 text-sm font-normal cursor-pointer"
                      >
                        Upgrade to Fully Managed
                      </button>{" "}
                      and we'll handle it for you.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="servicesContent" className="block mb-2">
                    Services Section Text {formData.plan === "build-only" && <span className="text-red-500">*</span>}
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Describe your services or what you do at your company</p>
                  <textarea
                    id="servicesContent"
                    name="servicesContent"
                    value={formData.servicesContent}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.servicesContent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.servicesContent}.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-blue-600 underline hover:text-blue-800 text-sm font-normal cursor-pointer"
                      >
                        Upgrade to Fully Managed
                      </button>{" "}
                      and we'll handle it for you.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="aboutContent" className="block mb-2">
                    About Section Text {formData.plan === "build-only" && <span className="text-red-500">*</span>}
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Describe your business. This could be about your company mission, about you, or your company values.</p>
                  <textarea
                    id="aboutContent"
                    name="aboutContent"
                    value={formData.aboutContent}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.aboutContent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.aboutContent}.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-blue-600 underline hover:text-blue-800 text-sm font-normal cursor-pointer"
                      >
                        Upgrade to Fully Managed
                      </button>{" "}
                      and we'll handle it for you.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contactContent" className="block mb-2">
                    Contact Section Text {formData.plan === "build-only" && <span className="text-red-500">*</span>}
                  </label>
                  <p className="text-sm text-gray-500 mb-2">This can be as simple as a short sentence inviting visitors to reach out</p>
                  <textarea
                    id="contactContent"
                    name="contactContent"
                    value={formData.contactContent}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.contactContent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactContent}.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-blue-600 underline hover:text-blue-800 text-sm font-normal cursor-pointer"
                      >
                        Upgrade to Fully Managed
                      </button>{" "}
                      and we'll handle it for you.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Branding & Images */}
          {currentStep === 5 && (
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl mb-6">Branding & Images</h2>
              <div className="space-y-8">
                {/* Branding */}
                <div className="space-y-6">
                  <h3 className="font-medium">Branding</h3>
                  <div>
                    <label className="block mb-2">
                      Do you have a logo? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="logo-upload"
                          name="logoOption"
                          value="upload"
                          checked={formData.logoOption === "upload"}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 cursor-pointer"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <label htmlFor="logo-upload" className="font-normal cursor-pointer">
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="logo-text"
                          name="logoOption"
                          value="text"
                          checked={formData.logoOption === "text"}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 cursor-pointer"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <label htmlFor="logo-text" className="font-normal cursor-pointer">
                          No
                        </label>
                      </div>
                    </div>
                    {errors.logoOption && <p className="text-red-500 text-sm mt-1">{errors.logoOption}</p>}
                  </div>

                  <div>
                    <label htmlFor="brandColors" className="block mb-2">
                      Brand Colors
                    </label>
                    <input
                      type="text"
                      id="brandColors"
                      name="brandColors"
                      value={formData.brandColors}
                      onChange={handleInputChange}
                      placeholder="#4e5ba6, #E45792"
                      className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Enter hex codes separated by commas</p>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-6">
                  <h3 className="font-medium">Images</h3>
                  <div>
                    <label className="block mb-2">
                      Logo Upload {formData.logoOption === "upload" && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-sm text-muted-foreground mb-2">PNG, SVG, or JPG</p>
                    <label
                      htmlFor="logoFile"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        formData.logoFile
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-input-background hover:bg-input-background"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        {formData.logoFile ? (
                          <p className="text-sm text-foreground font-medium">{formData.logoFile.name}</p>
                        ) : (
                          <>
                            <p className="mb-1 text-sm text-muted-foreground">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, SVG or JPG</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        id="logoFile"
                        name="logoFile"
                        accept=".png,.svg,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, "logoFile")}
                        className="hidden"
                      />
                    </label>
                    {errors.logoFile && (
                      <p className="text-red-500 text-sm mt-1">
                        Please upload your logo.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2">
                      Hero Image {formData.plan === "build-only" && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Minimum recommended size 1920 × 1080. Horizontal images work best. No screenshots or images with text.
                    </p>
                    <label
                      htmlFor="heroImage"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        formData.heroImage
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-input-background hover:bg-input-background"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        {formData.heroImage ? (
                          <p className="text-sm text-foreground font-medium">{formData.heroImage.name}</p>
                        ) : (
                          <>
                            <p className="mb-1 text-sm text-muted-foreground">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG or JPG (1920 × 1080 or larger)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        id="heroImage"
                        name="heroImage"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, "heroImage")}
                        className="hidden"
                      />
                    </label>
                    {errors.heroImage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.heroImage}.{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStep(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-blue-600 underline hover:text-blue-800 text-sm font-normal cursor-pointer"
                        >
                          Upgrade to Fully Managed
                        </button>{" "}
                        and we'll handle it for you.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2">
                      About Image {formData.plan === "build-only" && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Photo of you, your team, your workspace, or something that represents your brand.
                    </p>
                    <label
                      htmlFor="aboutImage"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        formData.aboutImage
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-input-background hover:bg-input-background"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        {formData.aboutImage ? (
                          <p className="text-sm text-foreground font-medium">{formData.aboutImage.name}</p>
                        ) : (
                          <>
                            <p className="mb-1 text-sm text-muted-foreground">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG or JPG</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        id="aboutImage"
                        name="aboutImage"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => handleFileChange(e, "aboutImage")}
                        className="hidden"
                      />
                    </label>
                    {errors.aboutImage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.aboutImage}.{" "}
                        {formData.plan === "build-only" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentStep(1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-blue-600 underline hover:text-blue-800 text-sm font-normal cursor-pointer"
                            >
                              Upgrade to Fully Managed
                            </button>{" "}
                            and we'll handle it for you.
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  <h3 className="font-medium">Contact Section Information</h3>
                  <div>
                    <label htmlFor="displayEmail" className="block mb-2">
                      An email that you would like to display in the contact section of your site
                    </label>
                    <input
                      type="email"
                      id="displayEmail"
                      name="displayEmail"
                      value={formData.displayEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">
                      Would you like to include social media links/icons in the contact section of your site? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="social-yes"
                          name="includeSocialLinks"
                          value="yes"
                          checked={formData.includeSocialLinks === "yes"}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 cursor-pointer"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <label htmlFor="social-yes" className="font-normal cursor-pointer">
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="social-no"
                          name="includeSocialLinks"
                          value="no"
                          checked={formData.includeSocialLinks === "no"}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 cursor-pointer"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <label htmlFor="social-no" className="font-normal cursor-pointer">
                          No
                        </label>
                      </div>
                    </div>
                    {errors.includeSocialLinks && (
                      <p className="text-red-500 text-sm mt-1">{errors.includeSocialLinks}</p>
                    )}
                  </div>

                  {formData.includeSocialLinks === "yes" && (
                    <div>
                      <label htmlFor="socialLinks" className="block mb-2">
                        Social Links <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-muted-foreground mb-2">
                        If adding social media, please enter your social media and handles/links
                      </p>
                      <textarea
                        id="socialLinks"
                        name="socialLinks"
                        value={formData.socialLinks}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Instagram: https://instagram.com/yourhandle&#10;LinkedIn: https://linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                      {errors.socialLinks && <p className="text-red-500 text-sm mt-1">{errors.socialLinks}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="bg-card p-8 rounded-xl border border-border">
              <h2 className="text-2xl mb-6">Review & Confirm</h2>
              
              {/* Summary */}
              <div className="space-y-6 mb-8">
                <div className="pb-4 border-b border-border">
                  <h3 className="font-medium mb-2">Selected Plan</h3>
                  <p className="text-muted-foreground capitalize">{formData.plan?.replace("-", " ")}</p>
                </div>

                <div className="pb-4 border-b border-border">
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <p className="text-muted-foreground">{formData.fullName}</p>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <p className="text-muted-foreground">{formData.businessName}</p>
                </div>

                <div className="pb-4 border-b border-border">
                  <h3 className="font-medium mb-2">Domain</h3>
                  <p className="text-muted-foreground">
                    {formData.ownsDomain === "yes" ? `Yes - ${formData.domainName}` : "No"}
                  </p>
                </div>

                <div className="pb-4 border-b border-border">
                  <h3 className="font-medium mb-2">Branding</h3>
                  <p className="text-muted-foreground">
                    Logo: {formData.logoOption === "upload" ? "Custom upload" : "No logo"}
                  </p>
                  {formData.logoFile && (
                    <p className="text-muted-foreground text-sm mt-1">File: {formData.logoFile.name}</p>
                  )}
                </div>

                <div className="pb-4 border-b border-border">
                  <h3 className="font-medium mb-2">Images</h3>
                  <p className="text-muted-foreground">
                    Hero Image: {formData.heroImage ? formData.heroImage.name : "Not uploaded"}
                  </p>
                  <p className="text-muted-foreground">
                    About Image: {formData.aboutImage ? formData.aboutImage.name : "Not uploaded"}
                  </p>
                </div>
              </div>

              {/* Confirmation */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="confirmation"
                      name="confirmation"
                      checked={formData.confirmation}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 cursor-pointer"
                      style={{ accentColor: "var(--primary)" }}
                    />
                    <label htmlFor="confirmation" className="font-normal cursor-pointer flex-1">
                      I understand this is a one page website with one layout and one revision round. Feedback must be
                      provided within 48 hours. Typical delivery is about 7 business days after payment and required
                      content is received. <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {errors.confirmation && <p className="text-red-500 text-sm mt-1">{errors.confirmation}</p>}
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="planDisclaimer"
                      name="planDisclaimer"
                      checked={formData.planDisclaimer}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 cursor-pointer"
                      style={{ accentColor: "var(--primary)" }}
                    />
                    <label htmlFor="planDisclaimer" className="font-normal cursor-pointer flex-1">
                      {formData.plan === "fully-managed" ? (
                        <>
                          By selecting the Fully Managed plan, I understand this includes a one-time website setup fee and an ongoing monthly subscription for hosting, maintenance, and support. The subscription must remain active to keep the website live and managed. Canceling the subscription will result in hosting and ongoing management being discontinued.
                        </>
                      ) : (
                        <>
                          By selecting the Build Only plan, I understand this service includes a one-time website build only. Hosting, ongoing management, updates, and support are not included. I am responsible for providing all required content and assets needed to complete the website.
                        </>
                      )} <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {errors.planDisclaimer && <p className="text-red-500 text-sm mt-1">{errors.planDisclaimer}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Payment - Build Only */}
          {currentStep === 7 && !setupPaymentCompleted && formData.plan === "build-only" && (
            <div className="bg-card p-8 rounded-xl border border-border text-center">
              <h2 className="text-2xl md:text-3xl mb-4">You're almost there</h2>
              <p className="text-muted-foreground text-lg mb-6">
                To get started, complete your one-time website setup payment.
              </p>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <p className="text-3xl font-semibold mb-2">$349 one-time</p>
                <p className="text-sm text-muted-foreground">Website setup and build</p>
              </div>

              <div className="max-w-md mx-auto">
                <div id="paypal-container-XY8K2RBF8KV6A"></div>
              </div>
            </div>
          )}

          {/* Step 7: Payment - Fully Managed (Combined Setup + Subscription) */}
          {currentStep === 7 && !setupPaymentCompleted && formData.plan === "fully-managed" && (
            <div className="bg-card p-8 rounded-xl border border-border text-center">
              <h2 className="text-2xl md:text-3xl mb-4">Complete Your Purchase</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Your Fully Managed plan includes both a one-time setup fee and ongoing monthly hosting.
              </p>
              
              {/* One-time Setup Fee */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-4 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-2">One-time setup fee</p>
                <p className="text-3xl font-semibold mb-2">$349</p>
                <p className="text-sm text-muted-foreground">Website setup and build</p>
              </div>

              {/* Monthly Subscription */}
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-2">Ongoing monthly subscription</p>
                <p className="text-3xl font-semibold mb-4">$20/month</p>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Required to keep your website live and managed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Includes hosting, maintenance, and ongoing support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>

              <div id="paypal-button-container-P-33631873E0915932XNFOVGMY" className="max-w-md mx-auto mb-6"></div>

              <p className="text-sm text-muted-foreground">
                Secure payment and subscription managed by PayPal
              </p>
            </div>
          )}

          {/* Payment Complete - Success State */}
          {currentStep === 7 && setupPaymentCompleted && !formspreeError && (
            <div className="bg-card p-12 rounded-xl border border-border text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-accent" size={32} />
              </div>
              {isSubmittingToFormspree ? (
                <>
                  <h2 className="text-3xl md:text-4xl mb-4">Submitting your intake...</h2>
                  <p className="text-muted-foreground text-lg">
                    Please wait while we process your information.
                  </p>
                </>
              ) : formspreeSubmitted ? (
                <>
                  <h2 className="text-3xl md:text-4xl mb-4">Payment received and intake submitted!</h2>
                  <p className="text-muted-foreground text-lg mb-2">
                    Thank you! I will follow up within 1 business day.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    You can safely close this page.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl mb-4">Payment received!</h2>
                  <p className="text-muted-foreground text-lg">
                    Processing your intake form...
                  </p>
                </>
              )}
            </div>
          )}

          {/* Payment Complete - Error State */}
          {currentStep === 7 && setupPaymentCompleted && formspreeError && (
            <div className="bg-card p-12 rounded-xl border border-red-500/20 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl mb-4 text-red-500">Payment received, but submission failed</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Your payment was successful, but we couldn't submit your intake form automatically.
              </p>
              <p className="text-foreground mb-2">
                Please email me at: <a href="mailto:info@lucesolutions.com" className="text-primary hover:underline font-medium">info@lucesolutions.com</a>
              </p>
              <p className="text-sm text-muted-foreground">
                I will fix this ASAP and get started on your website.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 7 && (
            <div className="flex justify-between items-center mt-8">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft size={20} />
                    Back
                  </Button>
                )}
              </div>

              <div>
                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={20} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-12"
                  >
                    Submit Intake
                  </Button>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
