import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "react-feather";
import toast from "react-hot-toast";
import GradientButton from "../components/GradientButton";
import SectionEditor from "../components/SectionEditor";
import Header from "../components/header";
import Footer from "../components/footer";
import ReviewScreen from "../components/ReviewScreen";

const sectionConfig = {
  education: {
    label: "Education",
    defaultItem: { institution: "", degree: "", dates: "", description: "" },
  },
  experience: {
    label: "Experience",
    defaultItem: { company: "", role: "", dates: "", description: "" },
  },
  projects: {
    label: "Projects",
    defaultItem: { name: "", link: "", description: "", dates: "" },
  },
  skills: {
    label: "Technical Skills",
    defaultItem: { skillname: "", description: "" },
  },
};

export default function ResumeFormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [enabledSections, setEnabledSections] = useState(() => {
    const saved = localStorage.getItem("enabledSections");
    return saved ? JSON.parse(saved) : Object.keys(sectionConfig);
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("resumeFormData");
    return saved
      ? JSON.parse(saved)
      : {
          basics: { firstName: "", lastName: "", email: "", phone: "", links: {} },
          education: [sectionConfig.education.defaultItem],
          experience: [sectionConfig.experience.defaultItem],
          projects: [sectionConfig.projects.defaultItem],
          skills: [sectionConfig.skills.defaultItem],
          customSections: [],
        };
  });

  useEffect(() => {
    localStorage.setItem("resumeFormData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("enabledSections", JSON.stringify(enabledSections));
  }, [enabledSections]);

  const navigate = useNavigate();

  const steps = [
    "Basic Info",
    ...enabledSections.map((section) => sectionConfig[section].label),
    "Custom Sections",
    "Review",
  ];

  const handleSectionToggle = (section, enable) => {
    const newSections = enable
      ? [...enabledSections, section]
      : enabledSections.filter((s) => s !== section);
    setEnabledSections(newSections);
    if (!enable) setFormData((prev) => ({ ...prev, [section]: [] }));
    toast.success(`${sectionConfig[section].label} section ${enable ? "enabled" : "removed"}`);
  };

  const handleSectionUpdate = (section, items) => {
    setFormData((prev) => ({ ...prev, [section]: items }));
    if (items.length > 0 && !enabledSections.includes(section)) {
      handleSectionToggle(section, true);
    }
  };

  const handleBasicInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      basics: { ...prev.basics, [field]: value },
    }));
  };

  const handleLinkChange = (platform, url) => {
    setFormData((prev) => ({
      ...prev,
      basics: {
        ...prev.basics,
        links: { ...prev.basics.links, [platform]: url },
      },
    }));
  };

  const addCustomSection = () => {
    setFormData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, { title: "New Section", items: [""] }],
    }));
    toast.success("Custom section added");
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      const { firstName, email, phone } = formData.basics;
      if (!firstName.trim() || !email.trim() || !phone.trim()) {
        toast.error("Name, Email and Phone are required fields.");
        return;
      }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["firstName", "lastName", "email", "phone"].map((field) => {
                const isRequired = true;
                return (
                  <div key={field} className="flex flex-col">
                    <label className="mb-1 font-medium text-left">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                      {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      value={formData.basics[field]}
                      onChange={(e) => handleBasicInfoChange(field, e.target.value)}
                      placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                      className="p-3 border rounded-md"
                      required={isRequired}
                    />
                  </div>
                );
              })}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Links (optional)</h3>
              {["github", "linkedin", "portfolio"].map((platform) => (
                <input
                  key={platform}
                  type="url"
                  value={formData.basics.links[platform] || ""}
                  onChange={(e) => handleLinkChange(platform, e.target.value)}
                  placeholder={`${platform} URL`}
                  className="p-3 border rounded-md w-full"
                />
              ))}
            </div>
          </div>
        );

      case steps.length - 2:
        return (
          <div className="space-y-6">
            {formData.customSections.map((section, index) => (
              <SectionEditor
                key={`custom-${index}`}
                title={section.title || ""}
                items={section.items || [""]}
                onTitleChange={(newTitle) => {
                  const newSections = [...formData.customSections];
                  newSections[index] = { ...newSections[index], title: newTitle };
                  setFormData((prev) => ({ ...prev, customSections: newSections }));
                }}
                onChange={(items) => {
                  const newSections = [...formData.customSections];
                  newSections[index].items = items;
                  setFormData((prev) => ({ ...prev, customSections: newSections }));
                }}
                onDelete={() => {
                  const newSections = formData.customSections.filter((_, i) => i !== index);
                  setFormData((prev) => ({ ...prev, customSections: newSections }));
                  toast.success("Custom section removed");
                }}
                defaultItem=""
              />
            ))}
            <GradientButton type="button" onClick={addCustomSection} variant="outline">
              + Add Custom Section
            </GradientButton>
          </div>
        );

      case steps.length - 1:
        return <ReviewScreen formData={formData} />;

      default:
        const sectionKey = enabledSections[currentStep - 1];
        const config = sectionConfig[sectionKey];
        return (
          <SectionEditor
            title={config.label}
            items={formData[sectionKey]}
            defaultItem={config.defaultItem}
            onChange={(items) => handleSectionUpdate(sectionKey, items)}
            onDelete={() => {
              if (window.confirm(`Remove ${config.label} section?`)) {
                handleSectionToggle(sectionKey, false);
                handlePrevStep();
              }
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header>
        <GradientButton to="/" variant="outline">
          Home
        </GradientButton>
        <GradientButton to="/about" variant="outline">
          About Us
        </GradientButton>
        <GradientButton
          type="button"
          onClick={() => {
            localStorage.removeItem("resumeFormData");
            localStorage.removeItem("enabledSections");
            toast.success("Form data cleared");
            setTimeout(() => window.location.reload(), 500);
          }}
          variant="outline"
        >
          Clear Data
        </GradientButton>
      </Header>

      <div className="max-w-5xl mx-auto text-center mt-5">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          Build Your <span className="text-green-500">Resume</span>
        </h2>
      </div>

      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className={`flex items-center ${index !== steps.length - 1 ? "flex-1" : ""}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              {index !== steps.length - 1 && (
                <div className={`flex-1 h-1 ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8">{steps[currentStep]}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}
          <div className="flex justify-between mt-12">
            <GradientButton
              type="button"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              variant={currentStep === 0 ? "disabled" : "outline"}
              className="w-36 flex items-center justify-center gap-2"
            >
              <ChevronLeft size={22} />
              Previous
            </GradientButton>

            {currentStep < steps.length - 1 ? (
              <GradientButton
                type="button"
                onClick={handleNextStep}
                className="w-36 flex items-center justify-center gap-2"
              >
                <span>Next</span>
                <ChevronRight size={22} />
              </GradientButton>
            ) : (
              <GradientButton
                type="button"
                onClick={() => {
                  navigate("/export", { state: { resume: formData } });
                  toast.success("resume ready to export...");
                }}
                className="w-44 flex items-center justify-center gap-2"
              >
                Generate Resume
              </GradientButton>
            )}
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}