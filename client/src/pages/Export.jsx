import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GradientButton from "../components/GradientButton";
import Header from "../components/header";
import Footer from "../components/footer";
import ReviewScreen from "../components/ReviewScreen";

export default function ExportResumePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resume = location.state?.resume || null;

  const handleExport = (type) => {
    switch (type) {
      case "pdf":
        console.log("Export as PDF", resume);
        break;
      case "json":
        const jsonBlob = new Blob([JSON.stringify(resume, null, 2)], {
          type: "application/json",
        });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement("a");
        jsonLink.href = jsonUrl;
        jsonLink.download = "resume.json";
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        break;
      case "latex":
        console.log("Export as LaTeX", resume);
        break;
      default:
        break;
    }
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
          Choose your preferred format to download or reuse your resume.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
          <GradientButton onClick={() => handleExport("pdf")}>
            Export as PDF
          </GradientButton>
          <GradientButton onClick={() => handleExport("json")}>
            Export as JSON
          </GradientButton>
          <GradientButton onClick={() => handleExport("latex")}>
            Export as LaTeX
          </GradientButton>
        </div>

        <div className="text-center ">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Final Preview
          </h3>
          <div className="border rounded-lg p-6 shadow-md bg-gray-50 max-w-3xl mx-auto">
            <div className="text-left w-full">
            {resume ? (
              <ReviewScreen formData={resume} />
            ) : (
              <p>No resume data found.</p>
            )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <GradientButton
              type="button"
              onClick={() => {
                localStorage.setItem("savedResume", JSON.stringify(resume));
                navigate("/resume-form");
              }}
              variant="outline"
              className="min-w-[12rem] px-6 py-2 text-white !bg-green-600 hover:!bg-green-500 shadow-lg"
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
            >
              Build Another Resume
            </GradientButton>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
