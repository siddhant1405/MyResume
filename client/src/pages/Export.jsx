import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GradientButton from "../components/GradientButton";
import Header from "../components/header";
import Footer from "../components/footer";
import ReviewScreen from "../components/ReviewScreen";

export default function ExportResumePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resume = location.state?.resume || null;
  const [isExporting, setIsExporting] = useState(false);
  const [exportingType, setExportingType] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleExport = async (type) => {
    if (!resume) {
      toast.error("No resume data found. Please go back and create a resume first.");
      return;
    }

    setIsExporting(true);
    setExportingType(type);

    try {
      // Step 1: Generate enhanced resume with AI
      toast.loading(`Processing your resume with AI...`, { id: 'processing' });
      
      const generateResponse = await fetch(`${API_BASE_URL}/api/resume/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: resume })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.message || 'Failed to generate resume');
      }

      const { data: enhancedResume } = await generateResponse.json();
      toast.success('Resume enhanced with AI!', { id: 'processing' });

      // Step 2: Handle different export types
      if (type === 'json') {
        // Handle JSON export on frontend
        const jsonBlob = new Blob([JSON.stringify(enhancedResume, null, 2)], {
          type: "application/json",
        });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement("a");
        jsonLink.href = jsonUrl;
        jsonLink.download = `${enhancedResume.personalInfo?.name || 'resume'}_enhanced.json`;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        URL.revokeObjectURL(jsonUrl);
        
        toast.success('JSON file downloaded successfully!');
        return;
      }

      // Step 3: Export PDF or DOCX through backend
      toast.loading(`Generating ${type.toUpperCase()} file...`, { id: 'exporting' });
      
      const exportResponse = await fetch(`${API_BASE_URL}/api/export/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resumeData: enhancedResume, 
          format: type 
        })
      });

      if (!exportResponse.ok) {
        const errorData = await exportResponse.json();
        throw new Error(errorData.message || `Failed to export ${type.toUpperCase()}`);
      }

      // Step 4: Handle file download
      const blob = await exportResponse.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = exportResponse.headers.get('Content-Disposition');
      let filename = `${enhancedResume.personalInfo?.name || 'resume'}_resume.${type}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${type.toUpperCase()} downloaded successfully!`, { id: 'exporting' });

    } catch (error) {
      console.error('Export failed:', error);
      toast.error(error.message || 'Export failed. Please try again.', { 
        id: exportingType === type ? 'processing' : 'exporting' 
      });
    } finally {
      setIsExporting(false);
      setExportingType("");
    }
  };

  const getButtonText = (type) => {
    if (isExporting && exportingType === type) {
      return `Exporting ${type.toUpperCase()}...`;
    }
    return `Export as ${type.toUpperCase()}`;
  };

  const isButtonDisabled = (type) => {
    return isExporting || !resume;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header>
        <GradientButton to="/" variant="outline">
          Home
        </GradientButton>
        <GradientButton to="/about" variant="outline">
          About Us
        </GradientButton>
      </Header>

      <main className="flex-grow max-w-5xl mx-auto text-center mt-8 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          Export Your <span className="text-green-500">Resume</span>
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Choose your preferred format to download your AI-enhanced resume.
        </p>

        {!resume && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-red-600">
              No resume data found. Please <button 
                onClick={() => navigate("/resume-form")} 
                className="text-red-700 underline font-medium"
              >
                create a resume
              </button> first.
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
          <GradientButton 
            onClick={() => handleExport("pdf")}
            disabled={isButtonDisabled("pdf")}
            className={`min-w-[140px] ${isExporting && exportingType === "pdf" ? "opacity-75" : ""}`}
          >
            {isExporting && exportingType === "pdf" && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {getButtonText("pdf")}
          </GradientButton>
          
          <GradientButton 
            onClick={() => handleExport("json")}
            disabled={isButtonDisabled("json")}
            className={`min-w-[140px] ${isExporting && exportingType === "json" ? "opacity-75" : ""}`}
          >
            {isExporting && exportingType === "json" && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {getButtonText("json")}
          </GradientButton>
          
          <GradientButton 
            onClick={() => handleExport("docx")}
            disabled={isButtonDisabled("docx")}
            className={`min-w-[140px] ${isExporting && exportingType === "docx" ? "opacity-75" : ""}`}
          >
            {isExporting && exportingType === "docx" && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {getButtonText("docx")}
          </GradientButton>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Final Preview
          </h3>
          <div className="border rounded-lg p-6 shadow-md bg-gray-50 max-w-3xl mx-auto">
            <div className="text-left w-full">
              {resume ? (
                <ReviewScreen formData={resume} />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No resume data found. Please create a resume first.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <GradientButton
              type="button"
              onClick={() => {
                if (resume) {
                  localStorage.setItem("savedResume", JSON.stringify(resume));
                }
                navigate("/resume-form");
              }}
              variant="outline"
              className="min-w-[12rem] px-6 py-2 text-white !bg-green-600 hover:!bg-green-500 shadow-lg"
              disabled={isExporting}
            >
              Edit This Resume
            </GradientButton>

            <GradientButton
              onClick={() => {
                localStorage.removeItem('resumeFormData'); 
                navigate("/resume-form");
              }}
              variant="outline"
              className="min-w-[12rem] px-6 py-2 text-white shadow-lg"
              disabled={isExporting}
            >
              Build Another Resume
            </GradientButton>
          </div>
        </div>

        {/* Processing Status */}
        {isExporting && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing your resume...
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
