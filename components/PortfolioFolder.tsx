
"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";

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
    label: "contact",
    accent: "var(--accent-contact)",
    wash: "var(--wash-contact)",
    tabText: "var(--tab-text-contact)",
  },
];

const RESTING_COLOR = "var(--folder-resting)";

type ProjectType = "team" | "final";

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
};

const PROJECTS: Project[] = [
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
    desc: "A desktop-based library management application for managing **book collections, member data, and borrowing and return transactions** to streamline library operations.",
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
    value: "talia.aprianti@email.com",
    href: "mailto:talia.aprianti@email.com",
  },
  {
    label: "GitHub",
    value: "github.com/username",
    href: "https://github.com/username",
  },
];

// Guestbook: messages are posted to and read from an API route backed
// by real storage, so they persist after the site is closed and are
// visible to every visitor, not just the person who wrote them. See
// app/api/messages/route.ts.
const MESSAGES_API_URL = "/api/messages";
const MAX_MESSAGE_LENGTH = 500;
const MAX_NAME_LENGTH = 40;

type GuestMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString();
}


const CERTIFICATIONS = [
  {
    name: "Intro to Software Engineering",
    year: "2026",
    issuer: "RevoU",
    image: "/doc/revou.jpg",
  },
  {
    name: "Junior Web Programmer",
    year: "2025",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    image: "/doc/bnsp.jpg", 
  },
  {
    name: "Work In Tech Indonesia",
    year: "2023",
    issuer: "Aguna Course",
    image: "/doc/wit.jpg",
  },
  {
    name: "IT Support Google",
    year: "2023",
    issuer: "Google / Coursera",
    image: "/doc/it.jpg",
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
const CV_URL = "/doc/cv.pdf"; 

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
      "Developed responsive Point of Sales (POS) web interfaces using React.js, Tailwind CSS and Node.js",
      "Integrated 4 core POS modules — Purchasing, Supplier, Customer, and User"
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
    <div className="w-full max-w-4xl select-none">
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
                className="relative -mb-px flex-shrink-0 h-9 sm:h-12 md:h-16 px-2.5 sm:px-4 md:px-6 rounded-t-lg sm:rounded-t-xl font-display font-bold text-[11px] sm:text-sm md:text-lg whitespace-nowrap transition-all duration-300 hover:scale-105"
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
        <div className="folder-scroll h-[60vh] sm:h-[65vh] overflow-y-auto px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12">
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
        I'm a Software Developer
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
          <div className="rounded-[20px] border-4 border-[var(--frame-border)] bg-[var(--card-bg)] shadow-[0_10px_24px_-8px_var(--frame-shadow)] overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_30px_-8px_var(--frame-shadow)]">
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
            Software Developer · UI/UX Enthusiast
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
            className="inline-flex items-center gap-2 rounded-full bg-[var(--btn-bg)] px-5 py-2.5 font-display font-bold text-sm sm:text-base text-[var(--btn-text)] shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:bg-[var(--btn-bg-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--btn-bg)]"
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
      <div className="grid gap-6 md:grid-cols-3">
        <section>
          <AboutSectionTitle>Education</AboutSectionTitle>
          <ol className="space-y-3">
            {EDUCATION.map((e) => (
              <li
                key={e.school}
                className="flex items-start gap-3 rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
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
                className="flex items-start gap-3 rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
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
                className="flex items-start gap-3 rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
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
              className="rounded-xl bg-[var(--card-bg)] px-3 py-2 font-body font-semibold text-sm text-[var(--intro-title)] shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md cursor-default"
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
              className="rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
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
      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--link-btn-bg)] px-3 py-1.5 font-body text-xs sm:text-sm font-semibold text-[var(--link-btn-text)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:bg-[var(--link-btn-bg-hover)]"
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
            className="rounded-2xl bg-[var(--card-bg)] overflow-hidden shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md flex flex-col"
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
                        : "var(--badge-final-bg)",
                    color:
                      p.type === "team"
                        ? "var(--badge-team-text)"
                        : "var(--badge-final-text)",
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
            className="rounded-2xl bg-[var(--card-bg)] overflow-hidden shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md flex flex-col"
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

function ContactPane() {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(MESSAGES_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load messages.");
        return res.json();
      })
      .then((data: { messages?: GuestMessage[] }) => {
        if (!cancelled) setMessages(data.messages ?? []);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Couldn't load messages right now.");
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(MESSAGES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to send message.");
      }
      setMessages((prev) => [data.message as GuestMessage, ...prev]);
      setMessage("");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to send message."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 text-[var(--ink-contact)]">
      <h2 className="font-display font-bold text-2xl sm:text-3xl">Contact</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: how to reach me */}
        <div className="space-y-3">
          <p className="font-body leading-relaxed">
            Got a project or collaboration in mind? Feel free to reach out, or
            just leave a message on the right.
          </p>
          {CONTACT_LINKS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm flex items-center justify-between gap-3 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
            >
              <span className="font-body font-semibold text-sm text-[var(--accent-contact)]">
                {c.label}
              </span>
              <span className="font-body text-sm truncate">{c.value}</span>
            </a>
          ))}
        </div>

        {/* Right: guestbook — send + read messages, stored server-side */}
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              maxLength={MAX_NAME_LENGTH}
              className="w-full rounded-xl bg-[var(--card-bg)] px-3 py-2 font-body text-sm text-[var(--ink-contact)] placeholder:opacity-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-contact)]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message..."
              maxLength={MAX_MESSAGE_LENGTH}
              rows={3}
              required
              className="w-full rounded-xl bg-[var(--card-bg)] px-3 py-2 font-body text-sm text-[var(--ink-contact)] placeholder:opacity-60 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-contact)]"
            />
            <div className="flex items-center justify-between gap-3">
              {submitError ? (
                <p className="font-body text-xs text-red-500">{submitError}</p>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="rounded-full bg-[var(--btn-bg)] px-5 py-2 font-display font-bold text-sm text-[var(--btn-text)] shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md hover:bg-[var(--btn-bg-hover)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:cursor-not-allowed"
              >
                {submitting ? "Sending…" : "Send"}
              </button>
            </div>
          </form>

          <div className="folder-scroll space-y-2 max-h-64 overflow-y-auto pr-1">
            {loadingMessages && (
              <p className="font-body text-sm opacity-70">Loading messages…</p>
            )}
            {!loadingMessages && loadError && (
              <p className="font-body text-sm text-red-500">{loadError}</p>
            )}
            {!loadingMessages && !loadError && messages.length === 0 && (
              <p className="font-body text-sm opacity-70">
                No messages yet — be the first to say hi!
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-[var(--card-bg)] px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-bold text-sm">{m.name}</p>
                  <span className="font-body text-[11px] opacity-60 whitespace-nowrap">
                    {formatRelativeTime(m.createdAt)}
                  </span>
                </div>
                <p className="font-body text-sm mt-1 leading-relaxed whitespace-pre-wrap break-words">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}