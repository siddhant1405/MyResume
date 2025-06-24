const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

const generatePDF = async (resumeData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header Section
      doc.fontSize(24).font('Helvetica-Bold')
         .text(resumeData.personalInfo?.name || 'Name', { align: 'center' });
      
      const contactInfo = [
        resumeData.personalInfo?.email,
        resumeData.personalInfo?.phone,
        resumeData.personalInfo?.links?.github,
        resumeData.personalInfo?.links?.linkedin
      ].filter(Boolean).join(' | ');
      
      doc.fontSize(10).font('Helvetica')
         .text(contactInfo, { align: 'center' });
      
      doc.moveDown(1.5);


      // Education
      if (resumeData.education?.length > 0) {
        addSection(doc, 'EDUCATION');
        resumeData.education.forEach(edu => {
          doc.fontSize(11).font('Helvetica-Bold')
             .text(`${edu.degree} | ${edu.institution}`, { continued: true });
          doc.font('Helvetica').text(` (${edu.dates})`, { align: 'right' });
          
          if (edu.details) {
            doc.fontSize(10).font('Helvetica').text(edu.details, { indent: 20 });
          }
          doc.moveDown(0.5);
        });
      }

      // Experience
      if (resumeData.experience?.length > 0) {
        addSection(doc, 'PROFESSIONAL EXPERIENCE');
        resumeData.experience.forEach(exp => {
          doc.fontSize(11).font('Helvetica-Bold')
             .text(`${exp.position} | ${exp.company}`, { continued: true });
          doc.font('Helvetica').text(` (${exp.dates})`, { align: 'right' });
          
          exp.achievements?.forEach(achievement => {
            doc.fontSize(10).font('Helvetica').text(`• ${achievement}`, { indent: 20 });
          });
          doc.moveDown(0.5);
        });
      }

      // Projects
      if (resumeData.projects?.length > 0) {
        addSection(doc, 'PROJECTS');
        resumeData.projects.forEach(project => {
          doc.fontSize(11).font('Helvetica-Bold').text(project.name);
          if (project.technologies?.length > 0) {
            doc.fontSize(9).font('Helvetica-Oblique')
               .text(`Technologies: ${project.technologies.join(', ')}`);
          }
          doc.fontSize(10).font('Helvetica').text(project.description, { indent: 20 });
          doc.moveDown(0.5);
        });
      }

      // Skills
      if (resumeData.skills) {
        addSection(doc, 'TECHNICAL SKILLS');
        Object.entries(resumeData.skills).forEach(([category, skills]) => {
          if (skills?.length > 0) {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            doc.fontSize(10).font('Helvetica-Bold')
               .text(`${categoryName}: `, { continued: true });
            doc.font('Helvetica').text(skills.join(', '));
          }
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const addSection = (doc, title) => {
  doc.fontSize(12).font('Helvetica-Bold').text(title);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
};

const generateDOCX = async (resumeData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.personalInfo?.name || 'Name',
              bold: true,
              size: 32,
            }),
          ],
          alignment: 'center',
        }),
        
        new Paragraph({
          children: [
            new TextRun({
              text: `${resumeData.personalInfo?.email || ''} | ${resumeData.personalInfo?.phone || ''}`,
              size: 20,
            }),
          ],
          alignment: 'center',
        }),

        // Summary
        ...(resumeData.summary ? [
          new Paragraph({ text: '' }), // Spacing
          new Paragraph({
            children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 24 })],
          }),
          new Paragraph({
            children: [new TextRun({ text: resumeData.summary, size: 20 })],
          }),
        ] : []),

        // Education
        ...(resumeData.education?.length > 0 ? [
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [new TextRun({ text: 'EDUCATION', bold: true, size: 24 })],
          }),
          ...resumeData.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.degree} | ${edu.institution} (${edu.dates})`,
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            ...(edu.details ? [new Paragraph({
              children: [new TextRun({ text: edu.details, size: 18 })],
            })] : []),
          ]),
        ] : []),

        // Experience
        ...(resumeData.experience?.length > 0 ? [
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: 24 })],
          }),
          ...resumeData.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.position} | ${exp.company} (${exp.dates})`,
                  bold: true,
                  size: 20,
                }),
              ],
            }),
            ...exp.achievements?.map(achievement => 
              new Paragraph({
                children: [new TextRun({ text: `• ${achievement}`, size: 18 })],
              })
            ) || [],
          ]),
        ] : []),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
};

module.exports = {
  generatePDF,
  generateDOCX
};
