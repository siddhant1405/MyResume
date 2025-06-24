const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    });
  }

  async enhanceResumeData(formData) {
    console.log('🚀 Starting resume enhancement with AI...');
    const prompt = this.createEnhancementPrompt(formData);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const enhancedData = this.extractAndParseJSON(text);
      return this.validateAndStructureData(enhancedData, formData);
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  createEnhancementPrompt(formData) {
    return `
You are a professional resume writer specializing in ATS optimization for computer science students. Convert the given resume data into an enhanced JSON format using the following memory context:

MEMORY CONTEXT:
1. API Integration: Experience with Exchange Rates API and Frankfurter for currency conversion and historical data
2. AI Integration: Used Google's Gemini API to enhance resume generation with AI
3. Version Control: Proficient with Git for version control and troubleshooting merge issues
4. Error Handling: Expertise in troubleshooting JavaScript errors in React apps, especially with module exports and audio libraries
5. Web Development: Focus on frontend UX and backend CRUD operations

CRITICAL REQUIREMENTS:
1. Each project and experience must have exactly 3-4 bullet points in "description" array
2. Bullet points must:
   - Start with ● (U+25CF) without any extra prefix or special characters
   - Avoid using %, •, *, or other unicode markers
   - Include quantifiable metrics and technologies
   - Reference memory context where applicable
3. Education format: Institution in bold, degree beside/below it

OUTPUT STRUCTURE:
{
  "personalInfo": {
    "name": "${formData.basics?.firstName || ''} ${formData.basics?.lastName || ''}",
    "email": "${formData.basics?.email || ''}",
    "phone": "${formData.basics?.phone || ''}",
    "links": {
      "github": "${formData.basics?.links?.github || ''}",
      "linkedin": "${formData.basics?.links?.linkedin || ''}",
      "portfolio": "${formData.basics?.links?.portfolio || ''}"
    }
  },
  "education": [
    {
      "institution": "Delhi Technological University (DTU)",
      "degree": "B.Tech in Software Engineering",
      "dates": "2022-2026",
      "details": "Relevant coursework: Data Structures, Algorithms"
    }
  ],
  "experience": [
    {
      "company": "Company name",
      "position": "Enhanced title",
      "dates": "Date range",
      "description": [
        "● Bullet with metrics and impact",
        "● Bullet with tech/tools"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": [
        "● Bullet with purpose",
        "● Bullet with technologies"
      ],
      "technologies": ["React", "MongoDB"],
      "link": "Project URL",
      "dates": "Project duration"
    }
  ],
  "skills": {
    "languages": ["JavaScript", "Python"],
    "frameworks": ["React", "Node.js"],
    "tools": ["Git", "Docker"],
    "databases": ["MongoDB", "PostgreSQL"],
    "apis": ["Exchange Rates API", "Frankfurter", "Gemini API"]
  }
}

INPUT:
${JSON.stringify(formData, null, 2)}
`;
  }

  extractAndParseJSON(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');

      let jsonStr = jsonMatch[0]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/[\u201C\u201D]/g, '"');

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('JSON parsing error:', error);
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

cleanBullets(descriptionArray) {
  if (!Array.isArray(descriptionArray)) return [];

  return descriptionArray.map(bullet => {
    return bullet
      .replace(/^%Ï\s*|^%\s*|^[-*•▪️●]?\s*/g, '● ') // added %Ï and ●
      .replace(/\uFE0F/g, '') // remove emoji variant selectors
      .replace(/\s+/g, ' ')   // normalize whitespace
      .trim();
  });
}


  generateFallbackBullets(type, item, originalDescription) {
    if (originalDescription && typeof originalDescription === 'string') {
      return originalDescription
        .split('.')
        .filter(s => s.trim())
        .slice(0, 4)
        .map(s => `● ${s.trim()}`);
    }

    if (type === 'project') {
      return [
        `● Developed ${item.name || 'application'} using React and Node.js`,
        `● Implemented RESTful APIs with 95% reliability`,
        `● Optimized performance reducing load time by 40%`,
        `● Deployed on cloud with CI/CD pipeline`
      ];
    }

    return [
      `● Contributed to ${item.company || 'projects'} using Git version control`,
      `● Troubleshot JavaScript errors improving app stability`,
      `● Implemented CRUD operations with 99% success rate`,
      `● Collaborated with cross-functional teams using Agile`
    ];
  }

  validateAndStructureData(enhancedData, originalData) {
    // Process experiences
    if (enhancedData.experience) {
      enhancedData.experience = enhancedData.experience.map((exp, index) => {
        if (!Array.isArray(exp.description) || exp.description.length < 3) {
          exp.description = this.generateFallbackBullets(
            'experience',
            exp,
            originalData.experience?.[index]?.description
          );
        }
        exp.description = this.cleanBullets(exp.description);
        return exp;
      });
    }

    // Process projects
    if (enhancedData.projects) {
      enhancedData.projects = enhancedData.projects.map((proj, index) => {
        if (!Array.isArray(proj.description) || proj.description.length < 3) {
          proj.description = this.generateFallbackBullets(
            'project',
            proj,
            originalData.projects?.[index]?.description
          );
        }
        proj.description = this.cleanBullets(proj.description);
        return proj;
      });
    }

    // Add API skills section
    if (!enhancedData.skills) enhancedData.skills = {};
    if (!enhancedData.skills.apis) {
      enhancedData.skills.apis = [
        "Exchange Rates API", 
        "Frankfurter", 
        "Gemini API"
      ];
    }

    return {
      personalInfo: enhancedData.personalInfo || {},
      education: enhancedData.education || [],
      experience: enhancedData.experience || [],
      projects: enhancedData.projects || [],
      skills: enhancedData.skills || {},
      customSections: originalData.customSections || [],
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '3.0',
        memoryContextUsed: true
      }
    };
  }
}

module.exports = new GeminiService();
