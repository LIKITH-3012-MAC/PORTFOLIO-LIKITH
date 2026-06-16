import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectModal from '../common/ProjectModal';
import { fadeUp } from '../../motion/variants';

const projectsList = [
  {
    id: "prometheus",
    icon: "cpu",
    badge: "Flagship",
    title: "Prometheus AI V2.0",
    subtitle: "Local-First Gen-AI System",
    description: "A local-first, privacy-centric Gen-AI system utilizing Llama 3.2 and Apple MLX for secure, voice-enabled intelligence.",
    tags: ["Llama 3.2", "Apple MLX", "Local AI", "Whisper API", "FastAPI"],
    gradient: "from-amber-500/10 to-blue-500/10",
    liveUrl: "https://www.prometheuslikiths-ai.online/",
    sourceUrl: "https://github.com/LIKITH-3012-MAC/my_chatbot.git",
    details: [
      {
        heading: "Project Overview",
        text: "Prometheus AI V2.0 is an advanced, privacy-first localized AI desktop environment designed to execute high-performance LLM capabilities directly on edge devices. By prioritizing local compute, the platform ensures total user privacy and offline operability."
      },
      {
        heading: "Architecture & Pipeline",
        text: "The core engine leverages Apple MLX and Llama 3.2, utilizing unified memory architecture to optimize throughput on Apple Silicon. Audio inputs are processed locally using Whisper-based neural nets, feeding prompts directly to the LLM core."
      }
    ],
    specs: [
      { label: "Status", value: "Production-Grade / Flagship" },
      { label: "Performance", value: "Sub-100ms Inference Latency" }
    ]
  },
  {
    id: "resolvit",
    icon: "globe",
    title: "Resolvit-AI",
    subtitle: "Civic & NGO Operations Platform",
    description: "AI-powered civic issue resolution platform with real-time tracking, authority workflows, and modern government-grade UI.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Google Maps SDK", "AI Classifier"],
    gradient: "from-blue-500/10 to-purple-500/10",
    liveUrl: "https://www.resolvit-ai.online",
    sourceUrl: "https://github.com/LIKITH-3012-MAC/SYNAPTIX_2026_404-FOUND_TEAM.git",
    details: [
      {
        heading: "Project Overview",
        text: "Resolvit-AI is a comprehensive, production-grade civic intelligence platform designed to connect citizens directly with public authorities and municipal agencies. The platform empowers users to report local issues and track real-time resolution pipelines."
      },
      {
        heading: "Intelligence & Routing",
        text: "Features a specialized classification pipeline that parses natural language reports and routes them automatically to the correct agency department. Built-in interactive map layers and dynamic authority dashboards provide full accountability at every stage."
      }
    ],
    specs: [
      { label: "Architecture", value: "FastAPI Middleware & Next.js" },
      { label: "Database", value: "PostgreSQL Cloud Backend" }
    ]
  },
  {
    id: "benchai",
    icon: "database",
    title: "BenchAI",
    subtitle: "Smart Classroom System",
    description: "Offline LLM + RAG-powered smart classroom infrastructure providing multilingual AI learning support without internet dependency.",
    tags: ["Ollama", "LangChain", "RAG", "FAISS Vector DB", "Local WebSockets"],
    gradient: "from-rose-500/10 to-orange-500/10",
    details: [
      {
        heading: "Project Overview",
        text: "BenchAI is a localized offline learning solution built for environments lacking stable internet. It bridges the digital divide by running optimized LLMs and RAG systems on localized local area networks (LANs)."
      },
      {
        heading: "Local RAG Architecture",
        text: "A local server indexes educational curricula and PDF textbooks using FAISS and LangChain. Students connect via a local WiFi access point and query the system. Deployed Ollama engines handle secure local token generation with high speed and zero cloud data costs."
      }
    ],
    specs: [
      { label: "Ecosystem", value: "Offline Hub-and-Spoke" },
      { label: "Latency", value: "Zero Internet Lag (LAN-Speed)" }
    ]
  },
  {
    id: "pythongui",
    icon: "layout",
    title: "Python GUI Utility",
    subtitle: "Desktop Data Processing System",
    description: "Desktop application using Tkinter/PyQt with robust backend processing, reducing processing latency by 12% vs CLI tools.",
    tags: ["Python", "PyQt5", "Tkinter", "Pandas Engine", "Multi-threading"],
    gradient: "from-green-500/10 to-blue-500/10",
    details: [
      {
        heading: "Project Overview",
        text: "A high-performance desktop processing tool built to automate complex data tasks. It addresses bottleneck issues commonly found in CLI scripts and web applications by executing processing pipelines locally."
      },
      {
        heading: "Thread Management & Latency",
        text: "Features a responsive PyQt5 layout. The backend employs QThreads to split intensive IO operations and file conversions off the main event loop, preventing system lockups and reducing processing latency by 12% compared to standard CLI approaches."
      }
    ],
    specs: [
      { label: "Architecture", value: "PyQt5 Concurrent Engine" },
      { label: "Optimization", value: "Pandas Batch Ingestion" }
    ]
  },
  {
    id: "sakraevents",
    icon: "ticket",
    title: "SAKRA VISION Event Hub",
    subtitle: "AI-Powered Event Operations Platform",
    description: "A premium, dynamic event registration portal featuring automated UPI QR verification and live configuration APIs.",
    tags: ["FastAPI", "Render API", "UPI Integration", "Aiven Cloud MySQL", "Resend Domain Email"],
    gradient: "from-indigo-500/10 to-pink-500/10",
    liveUrl: "https://forms-project-f3sb.vercel.app/"
  },
  {
    id: "aquasentinel",
    icon: "waves",
    title: "AquaSentinel AI",
    subtitle: "Ocean Intelligence Operating System",
    description: "A specialized marine intelligence operating system tracking debris via satellite telemetry and supporting teams with multilingual AI copilots.",
    tags: ["Satellite Fusion", "Groq AI", "Marine AI", "NASA MODIS Ingest", "OpenStreetMap API"],
    gradient: "from-cyan-500/10 to-teal-500/10",
    liveUrl: "https://aquq-sentinel-phsv.vercel.app/",
    details: [
      {
        heading: "Project Overview",
        text: "AquaSentinel AI is a specialized ocean protection operating system designed to ingest, process, and map telemetry regarding global marine health and plastic debris layouts."
      },
      {
        heading: "Satellite Data & AI Integration",
        text: "The core engine consumes spatial imagery from NASA MODIS, Copernicus, and OpenWeather APIs to model debris density indices and calculate real-time regional threat alerts. The platform features a customized Groq-based RAG copilot offering tactical guidelines in multiple languages (Telugu, Tamil, Hindi, and English)."
      }
    ],
    specs: [
      { label: "RAG Assistant", value: "Groq Engine / Multilingual" },
      { label: "Ingestion Pipeline", value: "NASA MODIS & Copernicus API" }
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
          className="flex flex-col md:flex-row justify-between items-end mb-16 text-left"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Featured <span className="text-gradient-accent">Systems.</span>
            </h2>
            <p className="text-slate-400 text-lg">Architecting intelligent infrastructure.</p>
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
