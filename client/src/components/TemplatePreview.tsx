import { type ResumeContent } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Phone, Mail, MapPin } from "lucide-react";

interface TemplateProps {
  content: ResumeContent;
  accentColor?: string;
  className?: string;
}

// ==========================================
// TEMPLATE 1: MODERN SIDEBAR (Cream/Yellow Accent)
// Matches RapidApply Resume 1.jpg design exactly
// ==========================================
export function ModernTemplate({ content, accentColor = "#f4b400", className }: TemplateProps) {
  const { personalInfo, education, workExperience, skills } = content;
  const displaySkills = skills?.filter((s) => s.name && !s.name.toLowerCase().includes("certification")) || [];

  return (
    <div className={cn("resume-paper bg-white flex", className)}>
      {/* LEFT SIDEBAR - Cream Background */}
      <div className="w-[38%] p-8 pl-12 pr-6 flex flex-col space-y-8" style={{ backgroundColor: "#f5f1e8" }}>
        {/* Profile Photo */}
        <div className="flex justify-center mb-4">
          <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg">
            {personalInfo.profileImage ? (
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.fullName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-5xl font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {personalInfo.fullName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>

        {/* CONTACT Section */}
        <div>
          <h3 
            className="text-lg font-bold uppercase tracking-wider mb-4 pb-2"
            style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
          >
            CONTACT
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            {personalInfo.phone && (
              <div className="break-words">{personalInfo.phone}</div>
            )}
            {personalInfo.email && (
              <div className="break-words">{personalInfo.email}</div>
            )}
            {personalInfo.location && (
              <div className="break-words">{personalInfo.location}</div>
            )}
          </div>
        </div>

        {/* PROFESSIONAL PROFILE Section */}
        {personalInfo.summary && (
          <div>
            <h3 
              className="text-lg font-bold uppercase tracking-wider mb-4 pb-2"
              style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              PROFESSIONAL PROFILE
            </h3>
            <p className="text-sm leading-relaxed text-gray-700 text-justify">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* SKILLS Section */}
        {displaySkills.length > 0 && (
          <div>
            <h3 
              className="text-lg font-bold uppercase tracking-wider mb-4 pb-2"
              style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              SKILLS
            </h3>
            <ul className="text-sm space-y-2 text-gray-700">
              {displaySkills.map((skill, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-lg mr-2" style={{ color: accentColor }}>•</span>
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 pl-6 pr-12 py-8 pb-12 bg-white">
        {/* Header */}
        <div className="mb-8">
          {personalInfo.fullName ? (
            <h1 className="text-5xl font-bold text-gray-900 uppercase tracking-wide leading-tight">
              <span style={{ color: accentColor }}>
                {personalInfo.fullName.split(' ')[0]?.toUpperCase()}
              </span>
              <br />
              <span className="text-gray-900">
                {personalInfo.fullName.split(' ').slice(1).join(' ')?.toUpperCase()}
              </span>
            </h1>
          ) : (
            <h1 className="text-5xl font-bold text-gray-400 uppercase tracking-wide leading-tight">
              YOUR NAME
            </h1>
          )}
          {personalInfo.title ? (
            <h2 className="text-xl text-gray-700 font-normal mt-2">
              {personalInfo.title}
            </h2>
          ) : (
            <h2 className="text-xl text-gray-400 font-normal mt-2">
              Job Title
            </h2>
          )}
        </div>

        {/* EXPERIENCE Section */}
        {workExperience?.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-xl font-bold uppercase tracking-wider mb-6"
              style={{ color: accentColor }}
            >
              EXPERIENCE
            </h2>
            <div className="space-y-6">
              {workExperience.map((job) => {
                const bulletPoints = job.description?.split('\n').filter(line => line.trim()) || [];
                return (
                  <div key={job.id}>
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {job.company || 'Company Name'} - {job.position || 'Position'}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {job.startDate || 'Start Date'} - {job.endDate || 'Present'}
                      </p>
                    </div>
                    {bulletPoints.length > 0 && (
                      <ul className="space-y-2 text-gray-700">
                        {bulletPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-lg mr-3 mt-0" style={{ color: accentColor }}>•</span>
                            <span className="text-sm leading-relaxed">{point.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EDUCATION Section */}
        {education?.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-xl font-bold uppercase tracking-wider mb-6"
              style={{ color: accentColor }}
            >
              EDUCATION
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-lg font-bold text-gray-900">
                    {edu.degree || 'Degree'}
                  </h3>
                  <p className="text-base font-semibold text-gray-800">
                    {edu.school || 'School'} {edu.location && `- ${edu.location}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.startDate || 'Start'} - {edu.endDate || 'End'}
                  </p>
                  {edu.description && (
                    <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS Section */}
        {skills?.some(s => s.name?.toLowerCase().includes('certification')) && (
          <div>
            <h2 
              className="text-xl font-bold uppercase tracking-wider mb-6"
              style={{ color: accentColor }}
            >
              CERTIFICATIONS
            </h2>
            <ul className="space-y-2 text-gray-700">
              {skills
                .filter(s => s.name?.toLowerCase().includes('certification'))
                .map((cert, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lg mr-3 mt-0" style={{ color: accentColor }}>•</span>
                    <span className="text-sm">{cert.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// TEMPLATE 2: PROFESSIONAL MINIMAL (Muted Gold Accent)
// Matches Alex Johnson's Administrative Assistant resume
// ==========================================
export function MinimalTemplate({ content, accentColor = "#B1963B", className }: TemplateProps) {
  const { personalInfo, education, workExperience, skills } = content;
  const displaySkills = skills?.filter((s) => s.name && !s.name.toLowerCase().includes("certification")) || [];
  const secondaryAccent = "#2C3E50"; // Slate Blue for job titles and links
  const mainText = "#4A4A4A"; // Charcoal Grey for body text

  return (
    <div className={cn("resume-paper bg-white p-12", className)}>
      {/* HEADER SECTION */}
      <div className="mb-8">
        {/* Name */}
        {personalInfo.fullName ? (
          <h1 
            className="text-5xl font-bold uppercase tracking-wide mb-3"
            style={{ color: accentColor }}
          >
            {personalInfo.fullName.toUpperCase()}
          </h1>
        ) : (
          <h1 
            className="text-5xl font-bold uppercase tracking-wide mb-3 text-gray-400"
          >
            YOUR NAME
          </h1>
        )}
        
        {/* Title */}
        {personalInfo.title ? (
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: secondaryAccent }}
          >
            {personalInfo.title}
          </h2>
        ) : (
          <h2 
            className="text-2xl font-semibold mb-6 text-gray-400"
          >
            Job Title
          </h2>
        )}

        {/* Horizontal Line */}
        <div className="h-1 mb-6" style={{ backgroundColor: accentColor }}></div>

        {/* Contact Information - Horizontal Layout */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4" style={{ color: mainText }}>
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" style={{ color: secondaryAccent }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: secondaryAccent }} />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: secondaryAccent }} />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT SECTIONS */}
      <div className="space-y-8">
        {/* PROFESSIONAL SUMMARY Section */}
        {personalInfo.summary && (
          <div>
            <h2 
              className="text-xl font-bold uppercase tracking-wider mb-4 pb-2"
              style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <p className="leading-relaxed" style={{ color: mainText }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* PROFESSIONAL EXPERIENCE Section */}
        {workExperience?.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold uppercase tracking-wider mb-6 pb-2"
              style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-6">
              {workExperience.map((job) => {
                const bulletPoints = job.description?.split('\n').filter(line => line.trim()) || [];
                return (
                  <div key={job.id}>
                    <div className="mb-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 
                          className="text-lg font-bold"
                          style={{ color: secondaryAccent }}
                        >
                          {job.company || 'Company Name'}
                        </h3>
                        {job.location && (
                          <span className="text-sm" style={{ color: mainText }}>
                            {job.location}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-semibold" style={{ color: mainText }}>
                          {job.position || 'Position'}
                        </h4>
                        <span className="text-sm" style={{ color: mainText }}>
                          ({job.startDate || 'Start'} – {job.endDate || 'Present'})
                        </span>
                      </div>
                    </div>
                    {bulletPoints.length > 0 && (
                      <ul className="space-y-2">
                        {bulletPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-3 mt-1.5" style={{ color: accentColor }}>•</span>
                            <span className="text-sm leading-relaxed" style={{ color: mainText }}>
                              {point.trim()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EDUCATION Section */}
        {education?.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold uppercase tracking-wider mb-6 pb-2"
              style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              EDUCATION
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-lg font-bold" style={{ color: secondaryAccent }}>
                    {edu.degree || 'Degree'}
                  </h3>
                  <p className="text-base font-semibold" style={{ color: mainText }}>
                    {edu.school || 'School'}{edu.location && `, ${edu.location}`}
                  </p>
                  <p className="text-sm" style={{ color: mainText }}>
                    {edu.startDate || 'Start'} – {edu.endDate || 'End'}
                  </p>
                  {edu.description && (
                    <p className="text-sm mt-1" style={{ color: mainText }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS Section */}
        {displaySkills.length > 0 && (
          <div>
            <h2 
              className="text-xl font-bold uppercase tracking-wider mb-6 pb-2"
              style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}
            >
              SKILLS
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {displaySkills.map((skill, index) => (
                <div key={index} className="flex items-start">
                  <span className="mr-3" style={{ color: accentColor }}>•</span>
                  <span className="text-sm" style={{ color: mainText }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}