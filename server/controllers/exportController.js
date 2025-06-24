const { generatePDF, generateDOCX } = require('../utils/exportUtils');

const exportResume = async (req, res) => {
  try {
    const { resumeData, format } = req.body;
    
    if (!resumeData || !format) {
      return res.status(400).json({
        success: false,
        message: 'Resume data and format are required'
      });
    }

    let fileBuffer;
    let fileName;
    let mimeType;

    switch (format.toLowerCase()) {
      case 'pdf':
        fileBuffer = await generatePDF(resumeData);
        fileName = `${resumeData.personalInfo?.name || 'resume'}_resume.pdf`;
        mimeType = 'application/pdf';
        break;
      
      case 'docx':
        fileBuffer = await generateDOCX(resumeData);
        fileName = `${resumeData.personalInfo?.name || 'resume'}_resume.docx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      
      case 'json':
        fileBuffer = Buffer.from(JSON.stringify(resumeData, null, 2));
        fileName = `${resumeData.personalInfo?.name || 'resume'}_resume.json`;
        mimeType = 'application/json';
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported format. Use pdf, docx, or json'
        });
    }

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': fileBuffer.length
    });

    console.log(`Exporting ${format.toUpperCase()} for: ${resumeData.personalInfo?.name}`);
    res.send(fileBuffer);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export resume'
    });
  }
};

module.exports = {
  exportResume
};
