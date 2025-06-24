const geminiService = require('../services/geminiService');

const generateResume = async (req, res) => {
  try {
    const { formData } = req.body;
    
    // Validate input
    if (!formData) {
      return res.status(400).json({
        success: false,
        message: 'Form data is required'
      });
    }

    // Basic validation for required fields
    if (!formData.basics?.firstName || !formData.basics?.email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    console.log('Processing resume for:', formData.basics.firstName);
    
    // Process with Gemini
    const enhancedResume = await geminiService.enhanceResumeData(formData);
    
    res.json({
      success: true,
      data: enhancedResume,
      message: 'Resume generated successfully'
    });

  } catch (error) {
    console.error('Generate resume error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate resume'
    });
  }
};

module.exports = {
  generateResume
};
