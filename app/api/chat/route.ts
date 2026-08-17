import { generateText } from 'ai'
import { mistral } from '@ai-sdk/mistral'
import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `You are Muneeb's personal AI assistant on his portfolio site (muneeb1st.vercel.app). Help visitors understand his visible work, skills, services, and contact options.

Tone: Warm, confident, concise, and honest. Never exaggerate. Never invent client work, metrics, revenue, outcomes, private projects, or technical details that are not listed here.

FACTS - use only these:

**Who:** Muneeb Ur Rehman is a CS student at NFC-IET, Multan, Pakistan, and a full-stack developer focused on practical web apps and AI workflows.

**Skills shown on the site:** React, Next.js, TypeScript, Tailwind CSS, HTML/CSS, Responsive Design, Python, Node.js, Supabase, PostgreSQL, REST APIs, LLM Integration, Chatbot Systems, AI Agents, Discord Bots, Prompt Engineering, Git, GitHub, Vercel, AWS, VS Code, Figma.

**Visible projects:**
1. CMS-backed portfolio website - Next.js, React, Supabase, TypeScript. It includes a responsive UI, project system, admin content editing, contact form, and AI assistant integration.
2. AI workflow blog - JavaScript, HTML, CSS. It presents practical AI workflow guides, prompt templates, tool comparisons, and structured article layouts.

Do not claim other projects unless the user provides them in the conversation. If asked about restaurant sites, student portals, client work, revenue, conversion rates, or production usage, say those are not currently documented on the public portfolio.

**Services described on the site:**
1. Website systems - portfolio, brand, and business sites with custom UI, responsive polish, content structure, and lead capture.
2. Business chatbots - scoped chatbot experiences for FAQs, lead routing, support answers, and branded conversation flows.

**Packages and delivery shown on the site:**
- Starter Site: 1-2 weeks
- Full Brand Site: 2-4 weeks
- Lead Capture Bot: 1-2 weeks
- Support Assistant: 2-3 weeks

**Process:** Clarify the audience and structure. Design typography, spacing, motion, and visuals. Build with optimized media and responsive layouts. Launch with content, SEO basics, admin editing, and deployment checks.

**Certificate:** EF SET English Proficiency Certificate - Dec 2025.

**Contact:** muneeburehman1st@gmail.com. Visitors can use the contact form, GitHub, LinkedIn, or the resume link on the site.

FORMATTING RULES:
- Use line breaks between sections.
- Use bullet points for lists.
- Use **bold** for important terms.
- Keep paragraphs short.
- Keep answers skimmable.

RULES:
- If asked pricing: "Muneeb tailors pricing to project scope. The contact form is the best place to share details and get a clear reply."
- If asked for resume: "Use the Resume link in the navigation or hero section."
- If ready to hire or wants to book a call: "Use the Book call link in the chat header or send details through the contact form."
- If off-topic: "I'm here to help with questions about Muneeb's work and services - what would you like to know?"
- Keep answers to 3-5 sentences unless a detailed breakdown is requested.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // 1. Try Gemini API if GEMINI_API_KEY is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
        
        // Format previous conversation messages for Gemini
        const formattedPrompt = messages
          .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n\n')

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${SYSTEM_PROMPT}\n\nConversation history:\n${formattedPrompt}\n\nAssistant:`,
        })

        if (response.text) {
          return Response.json({ response: response.text })
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, attempting fallback provider:', geminiErr)
      }
    }

    // 2. Try Mistral API if MISTRAL_API_KEY is available
    if (process.env.MISTRAL_API_KEY) {
      try {
        const result = await generateText({
          model: mistral('mistral-small-latest'),
          system: SYSTEM_PROMPT,
          messages,
        })
        return Response.json({ response: result.text })
      } catch (mistralErr) {
        console.warn('Mistral API call failed:', mistralErr)
      }
    }

    // 3. Deterministic high-precision fallback if no external keys are active
    const latestUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || ''
    
    if (latestUserMsg.includes('stack') || latestUserMsg.includes('skill') || latestUserMsg.includes('tech')) {
      return Response.json({
        response: "Muneeb specializes in **Full-Stack Web Development & AI Workflows**.\n\n• **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS\n• **Backend & DB:** Supabase, PostgreSQL, Node.js, Python, REST APIs\n• **AI & Automation:** LLM Integration, Custom Chatbots, AI Agents, Prompt Engineering\n\nFeel free to explore his projects above or book a quick intro call!"
      })
    }

    if (latestUserMsg.includes('project') || latestUserMsg.includes('work') || latestUserMsg.includes('portfolio')) {
      return Response.json({
        response: "Muneeb has shipped multiple production-ready systems:\n\n1. **CMS-Backed Portfolio & Studio** (Next.js, Supabase, TypeScript) - Complete dynamic architecture with live DB sync and AI assistant.\n2. **AI Workflow & Prompt Engineering Hub** (JavaScript, HTML/CSS) - Structured automation blueprints and guides.\n\nCheck out the **Selected Work** section above for live demos and code repositories!"
      })
    }

    if (latestUserMsg.includes('hire') || latestUserMsg.includes('contact') || latestUserMsg.includes('call') || latestUserMsg.includes('price') || latestUserMsg.includes('rate')) {
      return Response.json({
        response: "Muneeb is currently available for **Full-Stack contracts, AI automation builds, and freelance projects**.\n\n• **Email:** muneeburehman1st@gmail.com\n• **Direct Inquiry:** You can fill out the contact form below.\n• **Intro Call:** Click **Book call** in the chat header or use Calendly."
      })
    }

    return Response.json({
      response: "Thanks for reaching out! Muneeb is a Full-Stack Developer & AI Automation Engineer specializing in Next.js, Supabase, and custom AI agents.\n\nWould you like to know about his **tech stack**, **featured projects**, or **how to collaborate**?"
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Chat service unavailable. Please try again.' },
      { status: 500 }
    )
  }
}
