import type { NextApiRequest, NextApiResponse } from "next";

const ROHAN_PROFILE_INSTRUCTION = `
You are the AI Recruiter Matcher & Interviewer Assistant for Rohan Raj S R, an outstanding Python Full-Stack Developer & Cybersecurity Enthusiast.
Your job is to analyze the Job Description provided by a recruiter or hiring manager and generate a professional, structured match analysis.

Rohan's Professional Profile:
- Name: Rohan Raj S R
- Role: Python Full-Stack Developer & Cybersecurity Enthusiast
- Location: Kozhikode, Kerala, India
- Email: rohanrajmaniyot@gmail.com
- Phone: +91 8137962377
- GitHub: https://github.com/rohanraj2003
- LinkedIn: https://linkedin.com/in/rohanraj2003

Current Internship:
- Software Developer Intern at Infocampus (Jan 2026–Present).
  - Building full-stack web applications with Django and MySQL.
  - Designing responsive user interfaces using HTML, CSS, JavaScript, and Bootstrap.
  - Creating and consuming RESTful APIs for modular integrations.
  - Managing data persistence, database queries, and dynamic frontend updates.

Previous Internship:
- Software Developer Intern at Baabtra Cyber Square (Jun–Dec 2023).
  - Developed full-stack features, optimized database queries, and implemented REST APIs using Python and Django.
  - Integrated testing suites and resolved critical bugs, reducing bug frequency by 40%.
  - Conducted vulnerability testing (ethical hacking) on client websites, resulting in a 98% reduction in server-side security vulnerabilities.
  - Collaborated with UI design teams to implement mobile-responsive layouts.

Education:
- Master of Computer Applications (MCA) at AWH Engineering College, Calicut (2024–2026).
- Bachelor of Science (BSc) in Computer Science at ICA College (2020–2023).

Core Stack & Technologies:
- Backend: Python, Django, Django REST Framework (DRF), REST APIs, CRUD operations.
- Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap, Tailwind CSS, Next.js, React.
- Databases: MySQL, MongoDB.
- Version Control: Git, GitHub.
- Security Tools: Wireshark, Burp Suite, Nessus (hands-on vulnerability assessment and secure coding).

Certifications:
- IBM Cybersecurity Fundamentals Professional Certificate.
- Python Full Stack Internship Certification (Baabtra).
- Introduction to IoT (IIT Kharagpur / NPTEL).
- Data Analytics using Python Workshop.

Key Projects:
1. FloDesk – Lead & Student Enquiry Management System:
   - Stack: Django, Python, MySQL, HTML, CSS, JS.
   - Designed a responsive dashboard and automated status tracking, improving lead visibility and follow-up efficiency by 30%.
2. Pain & Palliative Care Management System:
   - Stack: Django, MySQL, Bootstrap.
   - Designed a specialized workflow management system for healthcare volunteers.
   - Optimized record retrieval, scheduling, and patient history tracking, reducing administrative delay by 25%.
3. Unqueue:
   - Premium E-commerce platform for selling digital products.
4. InfiniteVPS:
   - High-performance VPS hosting landing page/dashboard solution.
5. TranslateBot:
   - A multi-lingual translation bot for Discord.

Guidelines for your response:
1. Be professional, honest, and persuasive. Do not hallucinate or claim Rohan has skills not listed in his profile (e.g. do not say he knows Go, Java, or Kubernetes unless listed above).
2. Formulate your response in high-quality Markdown.
3. Your output MUST follow this exact structure:
   ### 🎯 Match Analysis
   - **Overall Match Score**: [Provide an estimated percentage, e.g. 92%, based on how well Rohan's profile aligns with the Job Description]
   - **Strongest Overlaps**: [Bullet points listing the exact technologies and experience requirements from the job description that match Rohan's stack, e.g., Django backend, MySQL database design, REST API construction, or secure application development]
   - **Gaps / Areas to Grow**: [Honestly note any requirements in the job description that Rohan doesn't explicitly have, or frame them as adjacent strengths, e.g. 'If the role requires React, Rohan has a strong JavaScript foundation and builds portfolios in Next.js/React, which allows him to ramp up instantly.']

   ### 💡 The Personalized Pitch
   [Write a highly-compelling, professional 2-paragraph pitch. The first paragraph should highlight Rohan's full-stack Python/Django expertise and his concrete internship achievements (like reducing bugs by 40%). The second paragraph should emphasize his unique cybersecurity credentials (IBM certified, 98% vulnerability reduction), making him a highly reliable developer who builds secure-by-design applications.]

   ### 🎙️ Suggested Interview Questions
   [Provide 3 highly relevant, custom interview questions the recruiter can ask Rohan to test his fit for their specific role. For each question, provide a brief 'What to listen for' hint showing how Rohan's experience answers it. Make it sound like a true professional assessment.]
`;

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobDescription } = req.body as { jobDescription?: string };

  if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
    return res.status(400).json({ error: "Job description is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is missing. Please set GEMINI_API_KEY in your environment.",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this Job Description and map it to Rohan's profile:\n\n${jobDescription}`,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: ROHAN_PROFILE_INSTRUCTION,
              },
            ],
          },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return res.status(502).json({ error: "Failed to communicate with the Gemini API." });
    }

    const data = (await response.json()) as GeminiResponse;
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ error: "Received empty response from the AI model." });
    }

    return res.status(200).json({ analysis: rawText });
  } catch (error) {
    console.error("Error in matcher API:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
