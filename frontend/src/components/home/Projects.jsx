import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from '../common/ProjectModal';
import { fadeUp } from '../../motion/variants';

const projectsList = [
  {
    id: "prometheus",
    icon: "cpu",
    category: "Generative AI / Local Assistant",
    status: "Active",
    title: "Prometheus AI V2.0",
    subtitle: "Privacy-Focused Local AI Assistant",
    description: "A privacy-focused, local-first generative AI assistant using Llama 3.2 and Apple MLX with voice input support via Whisper.",
    tags: ["Llama 3.2", "Apple MLX", "Whisper", "FastAPI", "Python"],
    gradient: "from-amber-500/10 to-blue-500/10",
    liveUrl: "https://www.prometheuslikiths-ai.online/",
    sourceUrl: "https://github.com/LIKITH-3012-MAC/my_chatbot.git",
    details: [
      {
        heading: "Overview & Problem Addressed",
        text: "Cloud-hosted AI tools send user queries to external servers. Prometheus AI V2.0 runs quantized language models directly on Apple Silicon so prompts and audio transcripts stay local to the device."
      },
      {
        heading: "Key Functionality & Contribution",
        text: "Built the inference pipeline around Llama 3.2 and Apple MLX, integrated local speech-to-text transcription using Whisper, and exposed a local FastAPI backend for desktop interaction."
      }
    ],
    specs: [
      { label: "Category", value: "Local Generative AI" },
      { label: "Contribution", value: "LLM inference pipeline, voice input & FastAPI backend" },
      { label: "Status", value: "Active Development" }
    ]
  },
  {
    id: "resolvit",
    icon: "globe",
    category: "Civic Tech / AI Workflows",
    status: "Under Evaluation",
    title: "Resolvit-AI",
    subtitle: "Civic & NGO Issue Reporting Platform",
    description: "Civic issue reporting, tracking, and resolution workflow platform featuring AI-assisted category classification and map visualization.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Google Maps SDK", "AI Classification"],
    gradient: "from-blue-500/10 to-purple-500/10",
    liveUrl: "https://www.resolvit-ai.online",
    sourceUrl: "https://github.com/LIKITH-3012-MAC/SYNAPTIX_2026_404-FOUND_TEAM.git",
    details: [
      {
        heading: "Overview & Problem Addressed",
        text: "Citizens and civic groups often lack a structured channel to route local grievances to the appropriate department and verify progress over time."
      },
      {
        heading: "Key Functionality & Contribution",
        text: "Built reporting forms, PostgreSQL data models, FastAPI endpoints, location mapping, and an AI-assisted text classification step to help triage reports into agency queues. Developed with Team SΛKRΛ for Solution Challenge 2026."
      }
    ],
    specs: [
      { label: "Category", value: "Civic Issue Resolution" },
      { label: "Contribution", value: "Team Lead, FastAPI backend, database & AI triage logic" },
      { label: "Status", value: "Submitted · Under Evaluation" }
    ]
  },
  {
    id: "benchai",
    icon: "database",
    category: "EdTech / Offline RAG",
    status: "Prototype",
    title: "BenchAI",
    subtitle: "Offline Classroom Study Assistant",
    description: "Offline AI study assistant combining local language models (Ollama) with FAISS Retrieval-Augmented Generation for low-connectivity classrooms.",
    tags: ["Ollama", "LangChain", "RAG", "FAISS", "Python"],
    gradient: "from-rose-500/10 to-orange-500/10",
    details: [
      {
        heading: "Overview & Problem Addressed",
        text: "Students in classrooms with limited or unstable internet access cannot reliably use cloud study assistants. BenchAI enables curriculum Q&A over a local network."
      },
      {
        heading: "Key Functionality & Contribution",
        text: "Indexed study materials and PDF handouts with FAISS and LangChain, wired to locally served Ollama models so students can ask curriculum questions offline."
      }
    ],
    specs: [
      { label: "Category", value: "Offline EdTech / RAG" },
      { label: "Contribution", value: "RAG indexing pipeline & local LLM integration" },
      { label: "Status", value: "Working Prototype" }
    ]
  },
  {
    id: "pythongui",
    icon: "layout",
    category: "Desktop Utility / Python",
    status: "Completed",
    title: "Python GUI Utility",
    subtitle: "Desktop Batch Data Processor",
    description: "Desktop GUI application built with PyQt5/Tkinter and worker threading to automate repetitive file conversions and tabular data tasks.",
    tags: ["Python", "PyQt5", "Tkinter", "Pandas", "QThread"],
    gradient: "from-green-500/10 to-blue-500/10",
    details: [
      {
        heading: "Overview & Problem Addressed",
        text: "Running repetitive command-line scripts for file formatting and tabular cleanup is error-prone for everyday workflows. This utility wraps those tasks into a graphical interface."
      },
      {
        heading: "Key Functionality & Contribution",
        text: "Designed the PyQt5 interface, Pandas batch processing routines, and background QThread worker tasks so file operations run without freezing the application UI."
      }
    ],
    specs: [
      { label: "Category", value: "Desktop Automation" },
      { label: "Contribution", value: "GUI layout, Pandas batch logic & worker threads" },
      { label: "Status", value: "Completed" }
    ]
  },
  {
    id: "sakraevents",
    icon: "ticket",
    category: "Event Operations / Backend",
    status: "Active",
    title: "SAKRA VISION Event Hub",
    subtitle: "Event Registration & Verification Portal",
    description: "Event registration portal featuring UPI payment receipt review workflows, REST configuration APIs, automated confirmation emails, and MySQL persistence.",
    tags: ["Python", "FastAPI", "MySQL", "Resend API", "OCR Screening"],
    gradient: "from-indigo-500/10 to-pink-500/10",
    liveUrl: "https://forms-project-f3sb.vercel.app/"
  },
  {
    id: "aquasentinel",
    icon: "waves",
    category: "Environmental Concept / AI",
    status: "Concept / Prototype",
    title: "AquaSentinel AI",
    subtitle: "Marine Debris Monitoring Prototype",
    description: "Environmental monitoring prototype exploring satellite imagery datasets (NASA MODIS, Copernicus), interactive mapping, and a multilingual Groq-powered assistant.",
    tags: ["NASA MODIS", "Copernicus", "Groq API", "OpenStreetMap", "Python"],
    gradient: "from-cyan-500/10 to-teal-500/10",
    liveUrl: "https://aquq-sentinel-phsv.vercel.app/",
    details: [
      {
        heading: "Overview & Problem Addressed",
        text: "Explores how publicly available Earth-observation datasets and conversational assistants can help visualize regional marine debris indicators in a single map view."
      },
      {
        heading: "Key Functionality & Status",
        text: "Prototype combines OpenStreetMap views, sample MODIS/Copernicus ingestion concepts, and a Groq-backed multilingual Q&A assistant supporting English, Telugu, Tamil, and Hindi. Conceptual/prototype build."
      }
    ],
    specs: [
      { label: "Category", value: "Environmental Monitoring Concept" },
      { label: "Contribution", value: "Concept design, map UI & multilingual Groq copilot" },
      { label: "Status", value: "Prototype" }
    ]
  }
];

export const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);

  const handleOpenExplore = (project) => {
    setActiveProject(project);
  };

  const handleCloseExplore = () => {
    setActiveProject(null);
  };

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 text-left"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-amber-300 uppercase tracking-widest mb-4">
              Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
              Selected <span className="text-gradient-accent">Projects.</span>
            </h2>
            <p className="text-slate-300 text-lg font-light max-w-2xl">
              AI applications, backend platforms, and desktop software built around real workflows.
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsList.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              transition={{ delay: index * 100 }}
            >
              <ProjectCard 
                project={project} 
                onExplore={() => handleOpenExplore(project)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explore Dialog Modals */}
      <ProjectModal 
        isOpen={activeProject !== null} 
        onClose={handleCloseExplore} 
        project={activeProject}
      />
    </section>
  );
};

export default Projects;
