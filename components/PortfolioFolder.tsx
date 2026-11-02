"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { playClick, playHover } from "../lib/sfx";

type SectionId = "about" | "project" | "certification" | "contact";

type Section = {
  id: SectionId;
  label: string;
  // text/tab color used inside the pane content (role, issuer, labels)
  accent: string;
  // tab background shade
  wash: string;
  // tab label color — white only reads on the two darkest shades, so
  // the lighter tabs get a dark rose label instead (see globals.css)
  tabText: string;
};

const SECTIONS: Section[] = [
  {
    id: "about",
    label: "about",
    accent: "var(--accent-about)",
    wash: "var(--wash-about)",
    tabText: "var(--tab-text-about)",
  },
  {
    id: "project",
    label: "project",
    accent: "var(--accent-project)",
    wash: "var(--wash-project)",
    tabText: "var(--tab-text-project)",
  },
  {
    id: "certification",
    label: "certification",
    accent: "var(--accent-cert)",
    wash: "var(--wash-cert)",
    tabText: "var(--tab-text-cert)",
  },
  {
    id: "contact",
    label: "more",
    accent: "var(--accent-contact)",
    wash: "var(--wash-contact)",
    tabText: "var(--tab-text-contact)",
  },
];

const RESTING_COLOR = "var(--folder-resting)";

type ProjectType = "team" | "final" | "personal";

type Project = {
  name: string;
  role: string;
  type: ProjectType;
  image: string; 
  desc: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string; 
  figmaUrl?: string; 
};

const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  team: "Team Project",
  final: "Final Project",
  personal:"Personal Project"
};

const PROJECTS: Project[] = [
  {
    name: "Operational Report Analyzer",
    role: "Full Stack Developer",
    type: "personal",
    image: "/img/report.jpg",
    desc: "A simple AI-powered Web Application that transforms unstructured operational reports into structured insights using an Groq API.",
    tech: ["Next.js", "Tailwind CSS", "Groq API"],
    liveUrl: "https://ops-report-analyzer.vercel.app/",
    githubUrl: "https://github.com/Talia-Apr/report-analyzer.git",
  },
  {
    name: "Workshop Service Management",
    role: "Full Stack Developer",
    type: "final",
    image: "/img/bengkel.jpg",
    desc: "A web-based workshop management system for managing customers, vehicles, and service transactions. It features Ollama-powered Text-to-SQL, enabling owner to query database information using natural language and visualize the results through interactive charts.",
    tech: ["Next.js", "Tailwind CSS", "Ollama", "MySQL"],
    liveUrl: "https://bengkelnugrahajaya.vercel.app",
    githubUrl: "https://github.com/Talia-Apr/web-bengkel.git",
    figmaUrl: "https://www.figma.com/design/fUF4qqRt4rQsZbaWJeyUSW/Bengkel-Nugraha?node-id=1-6674&t=rg62OhAnejp9erjT-1"
  },
  {
    name: "Point of Sales (POS)",
    role: "Full Stack Developer",
    type: "team",
    image: "/img/pos.jpg",
    desc: "A web-based Point of Sales system for managing sales transactions, customer data, and business activities, featuring real-time interactive charts for monitoring sales performance.",
    tech: ["React.js", "Tailwind CSS", "Node.js", "MySQL"],
    githubUrl: "https://github.com/RismaParamesti/WEB-POS.git",
    figmaUrl: "https://www.figma.com/proto/FAT7JelIKLYQdwNbEjtb1j/UI-UX-POS_MAGANG?node-id=1336-10024&starting-point-node-id=1336%3A10024&t=E7CTc0EK3T54PU81-1"
  },
  {
    name: "Decision Making System",
    role: "Front End Developer",
    type: "team",
    image: "/img/wavercision.jpg",
    desc: "A web-based decision support system for selecting beach destinations across Java Island using AHP for criteria weighting and SAW for ranking destination alternatives based on user-defined criteria.",
    tech: ["HTML", "CSS", "Javascript", "Bootstrap"],
    githubUrl: "https://github.com/risdaah/spk-pantai.git"
  },
  {
    name: "Used Cooking Oil Collector",
    role: "Front End Developer",
    type: "team",
    image: "/img/sijelantah.jpg",
    desc: "A web-based platform that connects households with used cooking oil to collectors. Users can submit their used cooking oil for pickup and receive monetary compensation, making waste collection more convenient and sustainable.",
    tech: ["HTML", "CSS", "Javascript", "Bootstrap"],
    githubUrl: "https://github.com/Talia-Apr/SIJELANTAH.git",
    figmaUrl: "https://bit.ly/SIJELANTAH",
  },
  {
    name: "Puzzle Game",
    role: "Front End Developer",
    type: "team",
    image: "/img/funzle.jpg",
    desc: "An interactive web-based puzzle game featuring a space-themed environment, designed to provide an engaging and challenging gameplay experience.",
    tech: ["HTML", "CSS", "Javascript", "Bootstrap"],
    githubUrl: "https://github.com/Talia-Apr/FUNZLE.git",
    figmaUrl: "https://bit.ly/PROTO-FUNZLE",
  },
  {
    name: "Dashboard",
    role: "Full Stack Developer",
    type: "team",
    image: "/img/dwo.jpg",
    desc: "An interactive OLAP dashboard for analyzing AdventureWorks business data across multiple dimensions, including products, customers, regions, and time, using visualizations to identify sales trends and business insights.",
    tech: ["HTML", "CSS", "Javascript", "Bootstrap", "Apache Tomcat", "MySQL"],
    githubUrl: "https://github.com/risdaah/Dashboard-Adventureworks-PAR-B.git"
  },
  {
    name: "SIBOOK",
    role: "Full Stack Developer",
    type: "team",
    image: "/img/sibook.jpg",
    desc: "A desktop-based library management application for managing book collections, member data, and borrowing and return transactions to streamline library operations.",
    tech: ["VB .NET", "MySQL"],
    githubUrl: "https://github.com/Talia-Apr/SIBOOK.git"
  },
  {
    name: "Faculty Profile",
    role: "Front End Developer",
    type: "team",
    image: "/img/profilfakultas.jpg",
    desc: "A mobile application that provides accessible information about FISIP UPN Veteran Jawa Timur, including faculty profiles, academic information, and study programs.",
    tech: ["Flutter", "Dart"],
    githubUrl: "https://github.com/risdaah/UTS-PEMMOB-KEL-17.git"
  },
  {
    name: "KIDCARE",
    role: "Front End Developer",
    type: "team",
    image: "/img/kidcare.jpg",
    desc: "A mobile application that connects users with childcare providers, allowing them to find and book childcare services based on their preferred schedule and duration.",
    tech: ["Flutter", "Dart"],
    githubUrl: "https://github.com/Talia-Apr/kidcare.git",
    figmaUrl: "https://bit.ly/kidcare-design",
  },
  {
    name: "CAFENEA",
    role: "UI Design",
    type: "team",
    image: "/img/cafenea.jpg",
    desc: "A mobile UI/UX design for a cafe ordering application, featuring an intuitive menu interface and streamlined ordering flow for a convenient user experience.",
    tech: ["Figma", "Design System"],
    figmaUrl: "https://bit.ly/PROTO-CAFENEA",
  },
  {
    name: "APASI",
    role: "UI Design",
    type: "team",
    image: "/img/apasi.jpg",
    desc: "A mobile application for SMKN 2 Buduran Sidoarjo that enables students to purchase cooperative products and access services provided by students based on their study programs and skills.",
    tech: ["Figma", "Design System"],
    liveUrl: "https://bit.ly/APASI-APP",
    figmaUrl: "https://bit.ly/PROTO-APASI"
  },
  {
    name: "WedOne",
    role: "Full Stack Developer",
    type: "final",
    image: "/img/wedone.jpg",
    desc: "A mobile application for browsing and renting wedding dresses, allowing users to explore available dresses and make rental bookings conveniently.",
    tech: ["Android Studio", "MySQL", "Figma"],
    githubUrl: "https://bit.ly/PROTO-WEDONE",
    figmaUrl: "https://bit.ly/GIT-WEDONE",
  },
];

// ---- Contact tab content ------------------------------------------------
const CONTACT_LINKS = [
  {
    label: "Email",
    value: "taliaaprianti46@gmail.com",
    href: "mailto:taliaaprianti46@gmail.com",
    icon: MailIcon,
  },
  {
    label: "GitHub",
    value: "github.com/Talia-Apr",
    href: "https://github.com/Talia-Apr",
    icon: GithubIconLarge,
  },
];

const CERTIFICATIONS = [
  {
    name: "Junior Web Programmer",
    year: "2025",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    image: "/doc/bnsp.jpg", 
  },
  {
    name: "Certification of Competency",
    year: "2022",
    issuer: "Asosiasi Pengusaha TIK Nasional (APTIKNAS)",
    image: "/doc/aptiknas.jpg",
  },
  {
    name: "Certification of Competency",
    year: "2021",
    issuer: "PT Awak Media (AMIGROUP)",
    image: "/doc/amigroup.jpg",
  },
];

// ---- About tab content ------------------
const PROFILE_PHOTO = "/img/talia.png"; 
const CV_URL = "/doc/cv_talia.pdf"; 

const EDUCATION = [
  {
    school: "UPN Veteran Jawa Timur",
    detail: "Bachelor's Degree in Information Systems",
    period: "Sep 2022 - Jun 2026",
    logo: "/logo/upn.png", 
  },
  {
    school: "SMKN 2 Buduran Sidoarjo",
    detail: "Software Engineering",
    period: "Jul 2019 - Jul 2022",
    logo: "/logo/smk.png",
  },
];

const INTERNSHIPS = [
  {
    company: "PT Otak Kanan",
    role: "Full Stack Developer Intern",
    period: "Sep 2024 - Dec 2024",
    logo: "/logo/ok.jpg",
    points: [
      "Developed responsive POS interfaces using React.js and Tailwind CSS, implementing frontend features and Node.js REST APIs integrated with a MySQL database.",
      "Integrated 4 core POS modules: Purchasing, Supplier, Customer, and User to support interconnected business workflows."
    ],
  },
];

const ORGANIZATIONS = [
  {
    name: "UKM Badminton UPNVJT",
    role: "Head of KOMINFO Departement",
    period: "Jul 2024 - May 2025",
    logo: "/logo/ukm.png",
    points: [
      "Led digital communication and social media strategies",
      "Directed content production aligned with organizational goals"
    ],
  },
];

const TECH_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Figma",
  "Git & GitHub",
];

const LANGUAGES = [
  { name: "Indonesian", level: "Native" },
  { name: "English", level: "Professional working proficiency" },
];

export default function PortfolioFolder() {
  const [active, setActive] = useState<SectionId | null>(null);
 
  const current = SECTIONS.find((s) => s.id === active) ?? null;
  // The folder body always shows the same pink gradient — which tab is
  // open is shown by the tab itself (raised + a stronger shadow), not
  // by recoloring the whole folder.
  const folderGradient = current
    ? "var(--tab-active-bg)"
    : "linear-gradient(180deg, var(--folder-grad-top), var(--folder-grad-bottom))";
 
  return (
    <div
      className="w-full max-w-4xl select-none"
      onPointerOver={(e) => {
        // Hover sound: only for a real mouse, and only when the pointer
        // ENTERS a card/pill (not when moving between its children).
        if (e.pointerType !== "mouse") return;
        const el = (e.target as HTMLElement).closest('[data-sfx="hover"]');
        if (!el) return;
        const from = e.relatedTarget as Node | null;
        if (from && el.contains(from)) return;
        playHover();
      }}
      onClick={(e) => {
        // Click sound for any button or link inside the folder (nav tabs,
        // back-to-intro tab, CV / project / contact links).
        if ((e.target as HTMLElement).closest("button, a")) playClick();
      }}
    >
      {/* Tab row: name tab (decorative) + nav tabs. Stays in one row at
          every width — tabs shrink first, and if they still don't fit,
          the nav strip scrolls sideways instead of wrapping under. */}
      <div className="flex items-end">
        {/* Front name tab — click to return to the intro view */}
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-label="Kembali ke beranda — Portofolio Talia Aprianti"
          className="relative -mb-px flex-shrink-0 h-11 sm:h-16 md:h-20 pl-1.5 pr-4 sm:pl-3 sm:pr-9 md:pl-4 md:pr-11 flex items-center rounded-t-xl sm:rounded-t-3xl cursor-pointer"
          style={{
            backgroundColor: RESTING_COLOR,
            boxShadow: "var(--tab-shadow-active)",
            clipPath:
              "polygon(0 0, 84% 0, 85.86% 0.94%, 87.45% 3.75%, 88.76% 8.44%, 89.8% 15%, 98.2% 85%, 98.8% 91.56%, 98.8% 96.25%, 98.2% 99.06%, 97% 100%, 0 100%)",
            transition: "background-color 0.5s ease",
          }}
        >
          <span
            aria-hidden="true"
            className="invisible font-display font-bold text-[var(--ink-strong)] text-[10px] sm:text-base md:text-lg whitespace-nowrap"
          >
            <span className="sm:hidden">Talia Aprianti</span>
            <span className="hidden sm:inline">Portofolio Talia Aprianti</span>
          </span>
        </button>
 
        {/* Nav tabs */}
        <nav className="no-scrollbar flex items-end flex-nowrap overflow-x-auto min-w-0">
          {SECTIONS.map((section) => {
            const isActive = active === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActive(isActive ? null : section.id)}
                aria-pressed={isActive}
                className="relative -mb-px flex-shrink-0 h-9 sm:h-12 md:h-16 px-2.5 sm:px-4 md:px-6 rounded-t-lg sm:rounded-t-xl font-display font-bold text-[11px] sm:text-sm md:text-lg whitespace-nowrap transition-all duration-300 hover:scale-105" data-sfx="hover"
                style={{
                  backgroundColor: isActive ? "var(--tab-active-bg)" : section.wash,
                  color: isActive ? "var(--ink-strong)" : section.tabText,
                  boxShadow: isActive
                    ? "var(--tab-shadow-active)"
                    : "var(--tab-shadow-inactive)",
                }}
              >
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>
 
      {/* Folder body */}
      <div
        className="relative rounded-b-3xl rounded-tr-3xl shadow-folder overflow-hidden"
        style={{ background: folderGradient }}
      >
        <div className="folder-scroll h-[60vh] sm:h-[65vh] supports-[height:100dvh]:h-[60dvh] supports-[height:100dvh]:sm:h-[65dvh] overflow-y-auto px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12">
          {!current && <IntroPane />}
          {current?.id === "about" && <AboutPane />}
          {current?.id === "project" && <ProjectPane />}
          {current?.id === "certification" && <CertificationPane />}
          {current?.id === "contact" && <ContactPane />}
        </div>
      </div>
    </div>
  );
}

function IntroPane() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-3 sm:gap-4">
      <h1 className="font-display font-bold text-3xl sm:text-5xl text-[var(--intro-title)]">
        Hi, I'm <span className="text-[var(--accent-contact)]">Talia!</span>
      </h1>
      <h2 className="font-display font-bold text-xl sm:text-3xl text-[var(--intro-subtitle)]">
        I'm a Developer
      </h2>
      <p className="font-body text-sm sm:text-xl leading-relaxed text-[var(--intro-body)] max-w-[34rem] pt-1 sm:pt-2">
        I transform complex ideas into clean, scalable web &amp; mobile solutions
        combining intuitive UI/UX design with robust architectures using{" "}
        <span className="font-semibold" style={{ color: "var(--accent-project)" }}>
          React
        </span>
        ,{" "}
        <span className="font-semibold" style={{ color: "var(--accent-cert)" }}>
          Next.js
        </span>
        ,{" "}
        <span className="font-semibold" style={{ color: "var(--accent-contact)" }}>
          TypeScript
        </span>
        , and modern backend tech.
      </p>
    </div>
  );
}

function AboutSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display font-bold text-lg sm:text-xl mb-3 text-[var(--intro-title)]">
      {children}
    </h3>
  );
}

// Small square logo chip. The background stays plain white on purpose —
// most institution/company logos are designed for a light background,
// so this keeps every logo legible in both light and dark mode instead
// of fading into a translucent dark card.
function LogoBadge({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
      <Image src={src} alt={alt} fill sizes="48px" className="object-contain p-1.5" />
    </div>
  );
}

function AboutPane() {
  return (
    <div className="space-y-8 text-[var(--ink-about)]">
      {/* Photo + intro */}
      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:gap-8 items-center">
        {/* Photo frame */}
        <div className="mx-auto w-44 sm:w-52 md:w-full">
          <div className="rounded-[20px] border-4 border-[var(--frame-border)] bg-[var(--card-bg)] shadow-[0_10px_24px_-8px_var(--frame-shadow)] overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_30px_-8px_var(--frame-shadow)]" data-sfx="hover">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={PROFILE_PHOTO}
                alt="Portrait of Talia Aprianti"
                fill
                sizes="(min-width: 768px) 220px, 208px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
 
        {/* Name, description, CV button */}
        <div className="text-center md:text-left space-y-3">
          <p className="font-body text-sm sm:text-base font-semibold text-[var(--intro-subtitle)]">
            Hello, I'm
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--intro-title)]">
            Talia Aprianti
          </h2>
          <p className="font-body font-semibold text-[var(--intro-subtitle)]">
            Web Developer · UI/UX Enthusiast
          </p>
          <p className="font-body leading-relaxed text-[var(--intro-body)]">
            I build clean, friendly, and easy-to-use digital products. I enjoy
            moving from small research and wireframe sketches to polished
            interfaces in Figma, then turning them into real code with React,
            Next.js, and Tailwind CSS.
          </p>
          <a
            href={CV_URL}
            download
            className="inline-flex items-center gap-2 rounded-full bg-[var(--btn-bg)] px-5 py-2.5 font-display font-bold text-sm sm:text-base text-[var(--btn-text)] shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:bg-[var(--btn-bg-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--btn-bg)]" data-sfx="hover"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Download CV
          </a>
        </div>
      </div>
 
      {/* Education + Internship + Organization */}
      <div className="grid gap-6 sm:grid-cols-3">
        <section>
          <AboutSectionTitle>Education</AboutSectionTitle>
          <ol className="space-y-3">
            {EDUCATION.map((e) => (
              <li
                key={e.school}
                className="flex items-start gap-3 rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md" data-sfx="hover"
              >
                <LogoBadge src={e.logo} alt={`${e.school} logo`} />
                <div>
                  <p className="font-display font-bold text-sm sm:text-base">
                    {e.school}
                  </p>
                  <p className="font-body text-sm text-[var(--intro-body)]">
                    {e.detail}
                  </p>
                  <p className="font-body text-xs sm:text-sm font-semibold text-[var(--accent-about)] mt-1">
                    {e.period}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
 
        <section>
          <AboutSectionTitle>Internship Experience</AboutSectionTitle>
          <ol className="space-y-3">
            {INTERNSHIPS.map((i) => (
              <li
                key={i.company}
                className="flex items-start gap-3 rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md" data-sfx="hover"
              >
                <LogoBadge src={i.logo} alt={`${i.company} logo`} />
                <div>
                  <p className="font-display font-bold text-sm sm:text-base">
                    {i.company}
                  </p>
                  <p className="font-body text-sm text-[var(--intro-body)]">
                    {i.role}
                  </p>
                  <p className="font-body text-xs sm:text-sm font-semibold text-[var(--accent-about)] mt-1">
                    {i.period}
                  </p>
                  {i.points && i.points.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {i.points.map((point) => (
                        <li
                          key={point}
                          className="font-body text-xs sm:text-sm text-[var(--intro-body)] leading-relaxed pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--accent-about)]"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
 
        <section>
          <AboutSectionTitle>Organization Experience</AboutSectionTitle>
          <ol className="space-y-3">
            {ORGANIZATIONS.map((o) => (
              <li
                key={o.name}
                className="flex items-start gap-3 rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md" data-sfx="hover"
              >
                <LogoBadge src={o.logo} alt={`${o.name} logo`} />
                <div>
                  <p className="font-display font-bold text-sm sm:text-base">
                    {o.name}
                  </p>
                  <p className="font-body text-sm text-[var(--intro-body)]">
                    {o.role}
                  </p>
                  <p className="font-body text-xs sm:text-sm font-semibold text-[var(--accent-about)] mt-1">
                    {o.period}
                  </p>
                  {o.points && o.points.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {o.points.map((point) => (
                        <li
                          key={point}
                          className="font-body text-xs sm:text-sm text-[var(--intro-body)] leading-relaxed pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--accent-about)]"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
 
      {/* Tech stack */}
      <section>
        <AboutSectionTitle>Tech Stack</AboutSectionTitle>
        <ul className="flex flex-wrap gap-2">
          {TECH_STACK.map((t) => (
            <li
              key={t}
              className="rounded-xl bg-[var(--card-bg)] px-3 py-2 font-body font-semibold text-sm text-[var(--intro-title)] shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md cursor-default" data-sfx="hover"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>
 
      {/* Languages */}
      <section>
        <AboutSectionTitle>Languages</AboutSectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2">
          {LANGUAGES.map((l) => (
            <li
              key={l.name}
              className="rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md" data-sfx="hover"
            >
              <p className="font-display font-bold text-sm sm:text-base">
                {l.name}
              </p>
              <p className="font-body text-xs sm:text-sm font-semibold text-[var(--accent-about)]">
                {l.level}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 7 8.4 6.3a1 1 0 0 0 1.2 0L21 7" />
    </svg>
  );
}

function GithubIconLarge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.53-.29-5.2-1.27-5.2-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17.91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.68 5.34-5.22 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.03 11.03 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5C6.24 5 1.5 9.5 0.5 12c1 2.5 5.74 7 11.5 7s10.5-4.5 11.5-7c-1-2.5-5.74-7-11.5-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
      />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
 

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.53-.29-5.2-1.27-5.2-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17.91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.68 5.34-5.22 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A11.03 11.03 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function FigmaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 24a4 4 0 0 1 0-8h4v4a4 4 0 0 1-4 4Z" />
      <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" />
      <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" />
      <path d="M12 0h4a4 4 0 0 1 0 8h-4V0Z" />
      <path d="M20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
  );
}

function ProjectLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--link-btn-bg)] px-3 py-1.5 font-body text-xs sm:text-sm font-semibold text-[var(--link-btn-text)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:bg-[var(--link-btn-bg-hover)]" data-sfx="hover"
    >
      {icon}
      {label}
    </a>
  );
}

function ProjectPane() {
  return (
    <div className="space-y-4 text-[var(--ink-project)]">
      <h2 className="font-display font-bold text-2xl sm:text-3xl">Project</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl bg-[var(--card-bg)] overflow-hidden shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md flex flex-col" data-sfx="hover"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-[16/10] bg-[var(--chip-bg)]">
              <Image
                src={p.image}
                alt={`${p.name} preview`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              {/* Fade overlay: same color as the card body, 100% opacity
                  where it meets the text below, fading to fully
                  transparent toward the top of the photo — so the image
                  blends into the card instead of ending with a hard edge. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, var(--project-fade) 0%, transparent 60%)",
                }}
              />
            </div>
 
            <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
              {/* Type badge + role */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="rounded-full px-2.5 py-1 font-body text-[10px] sm:text-xs font-bold uppercase tracking-wide"
                  style={{
                    backgroundColor:
                      p.type === "team"
                        ? "var(--badge-team-bg)"
                        : p.type === "final"
                          ? "var(--badge-final-bg)"
                          : "var(--badge-personal-bg)",
                    color:
                      p.type === "team"
                        ? "var(--badge-team-text)"
                        : p.type === "final"
                          ? "var(--badge-final-text)"
                          : "var(--badge-personal-text)",
                  }}
                >
                  {PROJECT_TYPE_LABEL[p.type]}
                </span>
                <span className="font-body text-xs sm:text-sm uppercase tracking-wide text-[var(--accent-project)] font-semibold">
                  {p.role}
                </span>
              </div>
 
              {/* Title + description */}
              <div>
                <p className="font-display font-bold text-base sm:text-lg">
                  {p.name}
                </p>
                <p className="font-body text-sm mt-1.5 leading-relaxed">
                  {p.desc}
                </p>
              </div>
 
              {/* Tech chips */}
              <ul className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-[var(--chip-bg)] px-2.5 py-1 font-body text-[11px] sm:text-xs font-semibold text-[var(--chip-text)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
 
              {/* Links */}
              {(p.liveUrl || p.githubUrl || p.figmaUrl) && (
                <div className="flex flex-wrap gap-2 mt-auto pt-1">
                  {p.liveUrl && (
                    <ProjectLink
                      href={p.liveUrl}
                      icon={<EyeIcon />}
                      label="View"
                    />
                  )}
                  {p.githubUrl && (
                    <ProjectLink
                      href={p.githubUrl}
                      icon={<GithubIcon />}
                      label="GitHub"
                    />
                  )}
                  {p.figmaUrl && (
                    <ProjectLink
                      href={p.figmaUrl}
                      icon={<FigmaIcon />}
                      label="Figma"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationPane() {
  return (
    <div className="space-y-4 text-[var(--ink-cert)]">
      <h2 className="font-display font-bold text-2xl sm:text-3xl">Certification</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {CERTIFICATIONS.map((c) => (
          <div
            key={c.name}
            className="rounded-2xl bg-[var(--card-bg)] overflow-hidden shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md flex flex-col" data-sfx="hover"
          >
            {/* Certificate image */}
            <div className="relative w-full aspect-[16/10] bg-[var(--chip-bg)]">
              <Image
                src={c.image}
                alt={`${c.name} certificate`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              {/* Same fade-into-card treatment as the project thumbnails */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, var(--project-fade) 0%, transparent 60%)",
                }}
              />
            </div>
 
            <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold text-sm sm:text-base">
                  {c.name}
                </p>
                <p className="font-body text-xs sm:text-sm text-[var(--accent-cert)] font-semibold mt-1">
                  {c.issuer}
                </p>
              </div>
              <span className="font-body text-xs sm:text-sm font-semibold text-[var(--ink-cert)] whitespace-nowrap">
                {c.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Contact tab: email / GitHub on the left, "ask about Talia" bot on the right
function ContactPane() {
  return (
    // h-full = exactly the folder's inner height, so nothing needs scrolling.
    // Phone: links in a compact row, chat takes whatever height is left.
    // Desktop: two columns, both as tall as the folder.
    <div className="grid h-full min-h-[21rem] grid-rows-[auto_minmax(0,1fr)] gap-3 text-[var(--ink-contact)] md:min-h-[17rem] md:grid-cols-2 md:grid-rows-[minmax(0,1fr)] md:gap-6">
      {/* Left: heading + email / GitHub */}
      <div className="flex min-h-0 flex-col gap-2 md:gap-4">
        <div className="text-center md:text-left">
          {/* hidden on very short phone screens: the tab already says "contact" */}
          <h2 className="font-display font-bold text-xl sm:text-3xl [@media(max-height:660px)]:max-md:hidden">
            Contact
          </h2>
          <p className="mt-2 hidden font-body leading-relaxed md:block">
            Got a project or collaboration in mind? Feel free to reach out.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:min-h-0 md:flex-1 md:flex-col md:gap-3">
          {CONTACT_LINKS.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex min-w-0 items-center gap-2 rounded-2xl bg-[var(--card-bg)] px-3 py-2.5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md md:flex-1 md:gap-3 md:px-5 md:py-4" data-sfx="hover"
              >
                <span className="flex-shrink-0 text-[var(--accent-contact)]">
                  <Icon />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block font-body text-xs font-semibold text-[var(--accent-contact)] md:text-sm">
                    {c.label}
                  </span>
                  <span className="block break-all font-body text-xs text-[var(--ink-contact)] md:break-words md:text-sm">
                    {c.value}
                  </span>
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Right: chatbot */}
      <ChatPanel />
    </div>
  );
}

function GhostIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 100 118" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M50 4C27 4 10 22 10 46v50c0 4 4.5 6 7.5 3.2l7-6.5 7 6.5c2 1.9 5 1.9 7 0l7-6.5 7 6.5c2 1.9 5 1.9 7 0l7-6.5 7 6.5c3 2.8 7.5.8 7.5-3.2V46C90 22 73 4 50 4ZM33 46a5 7 0 1 0 10 0 5 7 0 1 0-10 0ZM57 52a5 7 0 1 0 10 0 5 7 0 1 0-10 0Z"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

type ChatMessage = { id: number; from: "bot" | "user" } & BotReply;

// Quick questions shown as chips under the conversation.
const SUGGESTIONS = [
  { label: "Tech stack", question: "What's her tech stack?" },
  { label: "Projects", question: "What projects has she built?" },
  { label: "Certifications", question: "What certifications does she have?" },
  { label: "Education", question: "Where did she study?" },
  { label: "Experience", question: "What's her work experience?" },
  { label: "Contact", question: "How can I contact her?" },
];

function ChatLink({ link }: { link: BotLink }) {
  const external = link.href.startsWith("http");
  return (
    <a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={link.download ? true : undefined}
      className="inline-flex items-center rounded-full bg-[var(--link-btn-bg)] px-3 py-1.5 font-body text-xs font-semibold text-[var(--link-btn-text)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--link-btn-bg-hover)]" data-sfx="hover"
    >
      {link.label}
    </a>
  );
}

function ChatPanel() {
  const nextId = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, from: "bot", text: BOT_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Keep the newest message in view (scrolls the chat box only, not the page).
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (typeof el.scrollTo === "function") {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  function ask(question: string) {
    const q = question.trim();
    if (!q || typing) return;

    setMessages((m) => [...m, { id: nextId.current++, from: "user", text: q }]);
    setInput("");
    setTyping(true);

    const reply = getBotReply(q);
    // A short "typing…" pause so it feels like a conversation; a bit
    // longer for longer answers, never more than about a second.
    const delay = 450 + Math.min(reply.text.length, 400) * 1.2;
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, from: "bot", ...reply }]);
      setTyping(false);
    }, delay);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(input);
  }

  return (
    <section
      aria-label="Chat with Talia's assistant"
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-[var(--card-bg)] shadow-sm text-left"
    >
      {/* Header — says clearly it's an automatic bot, not a live chat */}
      <div className="flex items-center gap-3 border-b border-[var(--chip-bg)] px-4 py-2.5">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[var(--accent-contact)]">
          <GhostIcon />
        </span>
        <div className="min-w-0">
          <p className="font-display font-bold text-sm sm:text-base leading-tight">
            Ask about Talia
          </p>
          <p className="font-body text-xs leading-tight text-[var(--intro-body)]">
            Auto-replies based on this site
          </p>
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        className="folder-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[88%]">
              <p
                className={`select-text whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 font-body text-sm leading-relaxed ${
                  m.from === "user"
                    ? "rounded-br-md bg-[var(--btn-bg)] text-[var(--btn-text)]"
                    : "rounded-bl-md bg-[var(--chip-bg)] text-[var(--intro-body)]"
                }`}
              >
                {m.text}
              </p>
              {m.links && m.links.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.links.map((l) => (
                    <ChatLink key={l.label} link={l} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start" aria-hidden="true">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[var(--chip-bg)] px-3.5 py-3.5">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--accent-contact)] motion-reduce:animate-none"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick questions */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            disabled={typing}
            onClick={() => ask(s.question)}
            className="flex-shrink-0 rounded-full bg-[var(--link-btn-bg)] px-3 py-1.5 font-body text-xs font-semibold text-[var(--link-btn-text)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--link-btn-bg-hover)] disabled:cursor-not-allowed disabled:opacity-60" data-sfx="hover"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-[var(--chip-bg)] px-3 py-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={200}
          autoComplete="off"
          aria-label="Type your question about Talia"
          placeholder="Ask me anything about Talia…"
          className="min-w-0 flex-1 select-text rounded-full bg-[var(--chip-bg)] px-4 py-2.5 font-body text-base text-[var(--intro-title)] outline-none placeholder:text-[var(--accent-about)] focus-visible:ring-2 focus-visible:ring-[var(--btn-bg)]"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          aria-label="Send question"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--btn-bg)] text-[var(--btn-text)] transition-all duration-200 ease-out hover:bg-[var(--btn-bg-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon />
        </button>
      </form>
    </section>
  );
}

// ---- The bot's brain ------------------------------------------------------
// A small rule-based bot: no API key, no server, no cost. It looks for
// keywords in the question (English + Indonesian) and answers from the
// SAME data the tabs render (PROJECTS, CERTIFICATIONS, EDUCATION, …), so
// when you edit that data both the tab and the bot update together.
// It never invents anything — if it can't match a question it says so
// and points to email instead.

type BotLink = { label: string; href: string; download?: boolean };
type BotReply = { text: string; links?: BotLink[] };

const BOT_GREETING =
  "Hi there! 👋 I'm Talia's little assistant bot. Ask me about her skills, projects, certifications, education, or experience — or tap a suggestion below.";

// lowercase, letters/digits only, single spaces ("Next.js" -> "next js")
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// whole-word (or whole-phrase) match, tolerating a plural "s"
function mentions(text: string, phrase: string): boolean {
  return new RegExp(`(^| )${phrase}s?( |$)`).test(text);
}

function listNames(names: string[], max = 6): string {
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} and ${names.length - max} more`;
}

function bullets(lines: string[]): string {
  return lines.map((l) => `• ${l}`).join("\n");
}

// -- technologies --

// "Next.js" / "nextjs" / "next js" all become "next"; "js" -> "javascript"
function canonTech(raw: string): string {
  return normalize(raw)
    .replace(/\breact native\b/g, " ") // a different technology — don't read it as "react"
    .replace(/\b(next|react|node)\s?js\b/g, "$1")
    .replace(/\btailwindcss\b/g, "tailwind css")
    .replace(/\btailwind\b(?! css)/g, "tailwind css")
    .replace(/\bjs\b/g, "javascript")
    .replace(/\bts\b/g, "typescript")
    .replace(/\s+/g, " ")
    .trim();
}

type TechEntry = { key: string; label: string; inStack: boolean; projects: string[] };

// "github" is left out on purpose: asking about GitHub means "where is
// her GitHub?" (contact), not "does she know GitHub?".
const NON_TECH_KEYS = new Set(["git", "github"]);

function buildTechIndex(): TechEntry[] {
  const map = new Map<string, TechEntry>();
  const add = (label: string, project?: string, fromStack = false) => {
    label.split("&").forEach((part) => {
      const name = part.trim();
      const key = canonTech(name);
      if (!key || NON_TECH_KEYS.has(key)) return;
      let entry = map.get(key);
      if (!entry) {
        entry = { key, label: name, inStack: false, projects: [] };
        map.set(key, entry);
      }
      if (fromStack) {
        entry.inStack = true;
        entry.label = name; // prefer the spelling used in the tech stack
      }
      if (project && entry.projects.indexOf(project) === -1) entry.projects.push(project);
    });
  };
  TECH_STACK.forEach((t) => add(t, undefined, true));
  PROJECTS.forEach((p) => p.tech.forEach((t) => add(t, p.name)));
  return Array.from(map.values());
}

const TECH_INDEX = buildTechIndex();

// -- projects --

const GENERIC_WORDS = new Set(["service", "management", "system", "making", "profile"]);

// Names a visitor might use for a project: its title, the image file name
// ("bengkel", "sijelantah"…), a word in parentheses ("POS"), and any single
// word that is unique to that project.
function projectAliases(p: Project): string[] {
  const aliases = new Set<string>();
  aliases.add(normalize(p.name));
  aliases.add(normalize(p.name.replace(/\(.*?\)/g, "")));
  const inParens = p.name.match(/\(([^)]+)\)/);
  if (inParens) aliases.add(normalize(inParens[1]));
  const slug = (p.image.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");
  if (slug) aliases.add(normalize(slug));
  normalize(p.name)
    .split(" ")
    .forEach((w) => {
      if (w.length < 6 || GENERIC_WORDS.has(w)) return;
      const owners = PROJECTS.filter((o) => normalize(o.name).split(" ").indexOf(w) !== -1);
      if (owners.length === 1) aliases.add(w);
    });
  return Array.from(aliases).filter(Boolean);
}

const PROJECT_MATCHERS = PROJECTS.map((p) => ({ project: p, aliases: projectAliases(p) }));

function replyProject(p: Project): BotReply {
  const links: BotLink[] = [];
  if (p.liveUrl) links.push({ label: "View", href: p.liveUrl });
  if (p.githubUrl) links.push({ label: "GitHub", href: p.githubUrl });
  if (p.figmaUrl) links.push({ label: "Figma", href: p.figmaUrl });
  return {
    text: `${p.name} (${PROJECT_TYPE_LABEL[p.type]}) — Talia's role: ${p.role}.\n\n${p.desc}\n\nTech: ${p.tech.join(", ")}.`,
    links,
  };
}

function replyProjectList(list: Project[]): BotReply {
  return {
    text: `Here are those projects:\n${bullets(
      list.map((p) => `${p.name} — ${p.role} (${p.tech.join(", ")})`)
    )}\n\nAsk about one of them by name for the full details and links.`,
  };
}

function replyTech(text: string): BotReply | null {
  const q = ` ${canonTech(text)} `;
  const found = TECH_INDEX.filter((t) => q.indexOf(` ${t.key} `) !== -1);
  // "css" is also inside "tailwind css" — keep only the longest match
  const hits = found.filter((t) => !found.some((u) => u !== t && u.key.indexOf(t.key) !== -1));
  if (hits.length === 0) return null;

  const lines = hits.slice(0, 3).map((t) => {
    const intro = t.inStack
      ? `Yes! ${t.label} is part of Talia's main tech stack.`
      : `Yes — Talia has worked with ${t.label}.`;
    if (t.projects.length === 0) return intro;
    const count = t.projects.length === 1 ? "1 project" : `${t.projects.length} projects`;
    return `${intro} She has used it in ${count}: ${listNames(t.projects)}.`;
  });
  return { text: lines.join("\n\n") };
}

// -- topic replies --

function replySkills(): BotReply {
  const extras = TECH_INDEX.filter((t) => !t.inStack).map((t) => t.label);
  const example = extras.find((l) => /flutter/i.test(l)) ?? extras[0] ?? TECH_STACK[0];
  const parts = [`Talia's main tech stack: ${TECH_STACK.join(", ")}.`];
  if (extras.length > 0) {
    parts.push(`Across her projects she has also worked with: ${extras.join(", ")}.`);
  }
  parts.push(`Ask about any of them (try "${example}") and I'll tell you where she used it.`);
  return { text: parts.join("\n\n") };
}

function replyProjects(): BotReply {
  const finals = PROJECTS.filter((p) => p.type === "final").length;
  const teams = PROJECTS.length - finals;
  const highlights = PROJECTS.slice(0, 4).map((p) => p.name).join(", ");
  return {
    text: `Talia has worked on ${PROJECTS.length} projects (${finals} final projects and ${teams} team projects) across web, mobile and UI design. Some of them: ${highlights}.\n\nAsk me about any project by name, or open the Project tab to see them all.`,
  };
}

function replyCertifications(): BotReply {
  return {
    text: `Talia holds ${CERTIFICATIONS.length} certifications:\n${bullets(
      CERTIFICATIONS.map((c) => `${c.name} — ${c.issuer} (${c.year})`)
    )}\n\nThe Certification tab shows the certificates themselves.`,
  };
}

function replyEducation(): BotReply {
  return {
    text: `Education:\n${bullets(
      EDUCATION.map((e) => `${e.school} — ${e.detail} (${e.period})`)
    )}`,
  };
}

function replyExperience(): BotReply {
  const intern = INTERNSHIPS.map(
    (i) => `${i.company} — ${i.role} (${i.period})\n${bullets(i.points ?? [])}`
  ).join("\n\n");
  const orgs = ORGANIZATIONS.map((o) => `${o.name} (${o.role})`).join(", ");
  return {
    text: `Internship experience:\n${intern}\n\nBesides that, she's been active in ${orgs}. Ask me about organizations for the details.`,
  };
}

function replyOrganizations(): BotReply {
  return {
    text: `Organization experience:\n${ORGANIZATIONS.map(
      (o) => `${o.name} — ${o.role} (${o.period})\n${bullets(o.points ?? [])}`
    ).join("\n\n")}`,
  };
}

function replyLanguages(): BotReply {
  return {
    text: `Talia speaks ${LANGUAGES.map((l) => `${l.name} (${l.level})`).join(" and ")}.\n\nLooking for programming languages? Ask me about her tech stack.`,
  };
}

function replyContact(q: string): BotReply {
  const other = /(linkedin|instagram|whatsapp|telegram|twitter|facebook|tiktok)/.test(q);
  return {
    text: `${other ? "I don't have that one listed, but you" : "You"} can reach Talia here:\n${bullets(
      CONTACT_LINKS.map((c) => `${c.label}: ${c.value}`)
    )}\n\nGot a project or collaboration in mind? Email is the fastest way.`,
    links: CONTACT_LINKS.map((c) => ({ label: c.label, href: c.href })),
  };
}

function replyCv(): BotReply {
  return {
    text: "You can download Talia's CV right here:",
    links: [{ label: "Download CV", href: CV_URL, download: true }],
  };
}

function replyDesign(): BotReply {
  const ui = PROJECTS.filter((p) => /ui|design/i.test(p.role)).map((p) => p.name);
  const withFigma = PROJECTS.filter((p) => p.figmaUrl).length;
  const parts = [
    "Design is a big part of how Talia works: she moves from research and wireframe sketches to polished interfaces in Figma, then builds them in code.",
  ];
  if (ui.length > 0) parts.push(`UI design projects: ${listNames(ui)}.`);
  parts.push(
    `${withFigma} of her ${PROJECTS.length} projects have a Figma design linked — ask me about a project to get the link.`
  );
  return { text: parts.join("\n\n") };
}

function replyAbout(): BotReply {
  const edu = EDUCATION[0];
  return {
    text: `Talia Aprianti is a Web Developer and UI/UX enthusiast who builds clean, friendly, and easy-to-use digital products — from small research and wireframe sketches to polished interfaces in Figma, then real code with React, Next.js, and Tailwind CSS.${
      edu ? `\n\nShe studied ${edu.detail} at ${edu.school}.` : ""
    }\n\nAsk me about her skills, projects, certifications, education or experience.`,
  };
}

function replyHelp(): BotReply {
  return {
    text: "I can answer questions about Talia:\n• her tech stack and skills\n• her projects (try a project name!)\n• certifications and education\n• internship and organization experience\n• how to contact her or get her CV\n\nI understand English and Indonesian.",
  };
}

const FALLBACK: BotReply = {
  text: "Hmm, I don't know that one yet 🙈 I can tell you about Talia's skills, projects, certifications, education or experience. For anything else, the best way is to email her:",
  links: CONTACT_LINKS.filter((c) => c.href.startsWith("mailto:")).map((c) => ({
    label: c.label,
    href: c.href,
  })),
};

// -- keyword routing --

type Intent = { keywords: string[]; reply: (q: string) => BotReply };

// Keywords are word beginnings ("certif" matches certificate / certification),
// except very short ones ("cv", "ui") which must match a whole word. When a
// question matches several topics, the one with the most keyword hits wins;
// on a tie the topic listed first wins — so greeting/about stay at the end.
const INTENTS: Intent[] = [
  { keywords: ["cv", "resume", "curriculum", "download", "unduh"], reply: replyCv },
  {
    keywords: [
      "contact", "kontak", "email", "mail", "github", "reach", "hire", "hubungi", "hubung",
      "collab", "kolaborasi", "message", "pesan", "dm", "whatsapp", "linkedin", "instagram",
      "social", "sosmed", "available", "freelance", "open to", "hiring", "recruit", "rekrut",
    ],
    reply: replyContact,
  },
  {
    keywords: ["ui", "ux", "design", "desain", "wireframe", "prototype", "prototipe", "interface"],
    reply: replyDesign,
  },
  {
    keywords: [
      "skill", "git", "tech stack", "technolog", "teknolog", "tools", "stack", "programming",
      "pemrograman", "coding", "coder", "kemampuan", "keahlian", "kuasai", "framework",
      "expert", "good at", "what can she", "strength", "frontend", "front end", "backend",
      "back end", "database", "fullstack", "full stack",
    ],
    reply: replySkills,
  },
  {
    keywords: [
      "project", "proyek", "projek", "portfolio", "portofolio", "karya", "built", "build",
      "made", "create", "aplikasi", "app", "apps", "website", "web app", "hasil",
    ],
    reply: replyProjects,
  },
  {
    keywords: [
      "certif", "sertif", "course", "kursus", "bnsp", "revou", "google", "coursera",
      "license", "lisensi", "credential", "kompetensi",
    ],
    reply: replyCertifications,
  },
  {
    keywords: [
      "educat", "pendidikan", "universit", "univ", "kampus", "campus", "college", "kuliah",
      "school", "sekolah", "smk", "upn", "degree", "gelar", "sarjana", "major", "jurusan",
      "study", "studi", "graduat", "lulus", "bachelor", "skripsi",
    ],
    reply: replyEducation,
  },
  {
    keywords: [
      "experience", "pengalaman", "intern", "magang", "career", "karir", "karier", "worked",
      "working", "kerja", "bekerja", "pekerjaan", "company", "perusahaan", "otak kanan",
      "employment", "job",
    ],
    reply: replyExperience,
  },
  {
    keywords: [
      "organi", "ukm", "badminton", "kominfo", "volunteer", "komunitas", "community",
      "leadership", "himpunan", "extracurricular",
    ],
    reply: replyOrganizations,
  },
  {
    keywords: ["language", "bahasa", "speak", "english", "inggris", "indonesian", "indonesia", "fluent", "bilingual"],
    reply: replyLanguages,
  },
  { keywords: ["help", "bantu", "what can you", "can you", "menu", "options"], reply: replyHelp },
  {
    keywords: ["thank", "thanks", "makasih", "terima kasih", "thx", "tengkyu", "trims"],
    reply: () => ({ text: "You're welcome! 😊 Anything else you'd like to know about Talia?" }),
  },
  {
    keywords: ["bye", "goodbye", "see you", "sampai jumpa", "dadah"],
    reply: () => ({ text: "Bye for now! 👋 Thanks for stopping by Talia's portfolio." }),
  },
  {
    keywords: ["who", "siapa", "about", "tentang", "introduce", "perkenal", "yourself", "name", "nama", "what does she do", "occupation"],
    reply: replyAbout,
  },
  {
    keywords: ["hi", "hello", "hey", "hai", "halo", "hallo", "pagi", "siang", "sore", "malam", "selamat", "assalam"],
    reply: () => ({ text: BOT_GREETING }),
  },
];

function hasKeyword(words: string[], text: string, kw: string): boolean {
  if (kw.indexOf(" ") !== -1) return text.indexOf(kw) !== -1;
  if (kw.length <= 3) return words.indexOf(kw) !== -1;
  return words.some((w) => w.indexOf(kw) === 0);
}

function pickIntent(text: string): Intent | null {
  const words = text.split(" ");
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = intent.keywords.filter((kw) => hasKeyword(words, text, kw)).length;
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best;
}

function getBotReply(question: string): BotReply {
  const text = normalize(question);
  if (!text) return FALLBACK;

  // React Native isn't something she lists — be honest about it
  if (/\breact native\b/.test(text)) {
    return {
      text: "I don't see React Native on Talia's list. For mobile apps she has used Flutter and Android Studio — ask me about them!",
    };
  }

  // 1) a specific project, by name
  const projects = PROJECT_MATCHERS.filter((m) =>
    m.aliases.some((a) => mentions(text, a))
  ).map((m) => m.project);
  if (projects.length === 1) return replyProject(projects[0]);
  if (projects.length > 1) return replyProjectList(projects);

  // 2) a specific technology
  const tech = replyTech(text);
  if (tech) return tech;

  // 3) a general topic
  const intent = pickIntent(text);
  if (intent) return intent.reply(text);

  return FALLBACK;
}