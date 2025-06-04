import React from "react";

export default function ReviewScreen({ formData }) {
  const { basics, education, experience, projects, skills, customSections } = formData;

  return (
    <div className="bg-white max-w-3xl mx-auto p-10 text-[15px] text-black font-sans shadow border border-gray-200">
      {/* Name and Contact */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold tracking-wide">{basics.firstName} {basics.lastName}</h1>
        <div className="text-[13px] text-gray-700 mt-1">
          {basics.phone && <span>{basics.phone} | </span>}
          {basics.email && <span>{basics.email} | </span>}
          {basics.links?.linkedin && <span>{basics.links.linkedin} | </span>}
          {basics.links?.github && <span>{basics.links.github}</span>}
        </div>
      </div>

      {/* Education */}
      {education?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold uppercase text-[13px] tracking-widest border-b border-gray-300 pb-1 mb-2">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between font-semibold">
                  <span>{edu.institution}</span>
                  <span className="text-[13px]">{edu.dates}</span>
                </div>
                <div className="flex justify-between italic text-[13px]">
                  <span>{edu.degree}</span>
                  <span>{edu.location}</span>
                </div>
                {edu.description && (
                  <div className="text-[13px] mt-1">{edu.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold uppercase text-[13px] tracking-widest border-b border-gray-300 pb-1 mb-2">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-semibold">
                  <span>{exp.role}</span>
                  <span className="text-[13px]">{exp.dates}</span>
                </div>
                <div className="flex justify-between italic text-[13px]">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                {/* Bullets for experience details */}
                {Array.isArray(exp.bullets) && exp.bullets.length > 0 ? (
                  <ul className="list-disc pl-6 mt-1 text-[13px] space-y-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  exp.description && <div className="text-[13px] mt-1">{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold uppercase text-[13px] tracking-widest border-b border-gray-300 pb-1 mb-2">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between font-semibold">
                  <span>{proj.name}{proj.technologies && <span className="text-[13px] font-normal italic"> | {proj.technologies}</span>}</span>
                  <span className="text-[13px]">{proj.dates}</span>
                </div>
                {proj.link && (
                  <div className="text-[13px] text-blue-700 underline">
                    <a href={proj.link} target="_blank" rel="noreferrer">{proj.link}</a>
                  </div>
                )}
                {/* Bullets for project details */}
                {Array.isArray(proj.bullets) && proj.bullets.length > 0 ? (
                  <ul className="list-disc pl-6 mt-1 text-[13px] space-y-1">
                    {proj.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  proj.description && <div className="text-[13px] mt-1">{proj.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {skills?.length > 0 && (
        <section className="mt-6">
          <h2 className="font-bold uppercase text-[13px] tracking-widest border-b border-gray-300 pb-1 mb-2">Technical Skills</h2>
          <div className="text-[13px]">
            <ul className="list-none pl-0">
              {skills.map((skill, i) => (
                <li key={i}><span className="font-semibold">{skill.skillname}</span>: {skill.description}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections?.length > 0 && (
        <section className="mt-6">
          {customSections.map((section, i) => (
            <div key={i} className="mb-4">
              <h2 className="font-bold uppercase text-[13px] tracking-widest border-b border-gray-300 pb-1 mb-2">{section.title}</h2>
              <ul className="list-disc pl-6 text-[13px] space-y-1">
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
