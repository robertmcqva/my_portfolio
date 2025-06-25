import React, { useState, useEffect, useRef } from 'react';

// --- Foundational Styles & Fonts ---
const GlobalStyles = () => (
    <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
            :root {
                --c-background: #F9FAFB; /* Off-white for background */
                --c-surface: #FFFFFF;    /* White for cards and surfaces */
                --c-text-primary: #111827;  /* Near-black for main text */
                --c-text-secondary: #4B5563;/* Gray for secondary text */
                --c-border: #E5E7EB;      /* Light gray for borders */
                --c-accent: #0D9488;        /* Teal accent */
                --c-accent-light: #CCFBF1;  /* Light teal for backgrounds */
            }
            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--c-background);
                color: var(--c-text-primary);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            .glass-header {
                background-color: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
            }
            .section-padding {
                padding-top: 6rem;
                padding-bottom: 6rem;
            }
            @media (min-width: 1024px) {
                .section-padding {
                    padding-top: 8rem;
                    padding-bottom: 8rem;
                }
            }
            .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            
            /* Carousel Styles */
            .carousel-slide {
                transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
                position: absolute;
                inset: 0;
            }
            .carousel-slide.inactive {
                opacity: 0;
                transform: scale(0.95) translateY(10px);
                pointer-events: none;
            }
             .carousel-slide.active {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            .icon-gradient-bg {
                background: radial-gradient(circle, #f0fdfa, white);
            }
        `}</style>
    </>
);

// --- Global Constants ---
const developerName = "Robert McQva";

// --- Consistent Iconography (Lucide-inspired) ---
const LogoIcon = ({ className }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 26V6H15.5C18.5376 6 21 8.46243 21 11.5V11.5C21 14.5376 18.5376 17 15.5 17H11.5L16.5 26H8Z" fill="currentColor"/>
        <path d="M15 6L24 6L20 17L24 26H15L11.5 17L15 6Z" fill="currentColor" fillOpacity="0.7"/>
    </svg>
);
const GithubIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1 1.2-10.8 1-10.8 1-8.8 1-14.4-7.4-14.4-7.4 3.8-1 7.4 1.8 7.4 1.8-3.4-.6-6.1-4.9-6.1-4.9 1.4 2.3 4.9 4.3 6.1 4.3-1.4-1.8-1.4-4.2-1.4-4.2 3.8 4.9 9.3 6.1 9.3 6.1Z"/></svg>;
const ChevronLeftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRightIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const CompassIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const LayersIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const CodeIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const RocketIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.12-.67-.82-2.32-1.01-3.15-.06z"></path><path d="m12 15-3-3a9 9 0 0 1 3-7 9 9 0 0 1 7 3l-3 3"></path><path d="m9 9 3 3"></path><path d="m22 2-3 1 1 3-2 2 3 1 1 3 2-2 3-1 1-3-2-2Z"></path></svg>;

// --- Featured Work Carousel ---
const CarouselCard = ({ project }) => {
    const getLayoutClasses = () => {
        switch (project.type) {
            case 'web':
            case '3d':
                return { preview: 'lg:col-span-4', description: 'lg:col-span-1' };
            case 'mobile':
                return { preview: 'lg:col-span-2', description: 'lg:col-span-3' };
            default:
                return { preview: 'lg:col-span-3', description: 'lg:col-span-2' };
        }
    };
    const layout = getLayoutClasses();
    
    const renderContent = () => {
        if (project.type === '3d') {
            return <iframe title={project.title} frameBorder="0" allowFullScreen mozallowfullscreen="true" webkitallowfullscreen="true" src={project.embedUrl} className="w-full h-full"></iframe>;
        }
        if (project.type === 'mobile') {
             return (
                 <div className="w-full h-full bg-slate-900 p-4 sm:p-6 flex items-center justify-center">
                     <iframe className="w-full h-full rounded-lg border border-slate-700" src={project.embedUrl} title={project.title}></iframe>
                </div>
             );
        }
        if (project.type === 'web') {
            return (
                <div className="w-full h-full bg-slate-800 p-4">
                     <iframe className="w-full h-full rounded-lg" src={project.embedUrl} title={project.title}></iframe>
                </div>
            );
        }
        return (
            <div className="w-full h-full flex flex-col p-8 bg-slate-800">
                <div className="flex-grow space-y-4 overflow-hidden">
                     <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">A</span>
                        <div className="p-3 rounded-lg bg-slate-600 text-white">What is diversification?</div>
                    </div>
                     <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">RM</span>
                        <div className="p-3 rounded-lg bg-teal-600 text-white">Think of it like a dinner party - invite guests from different backgrounds so if one is boring, the others keep it lively.</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
            <div className={`bg-slate-100 border-r border-slate-200 ${layout.preview}`}>{renderContent()}</div>
            <div className={`bg-white p-8 lg:p-12 flex flex-col justify-center ${layout.description}`}>
                <div>
                    <p className="font-semibold text-teal-600">{project.category}</p>
                    <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{project.title}</h3>
                    <p className="mt-4 text-slate-600">{project.description}</p>
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <h4 className="font-semibold text-slate-800">Key Technologies</h4>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {project.techStack.map(tech => (
                                <span key={tech} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{tech}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeaturedWork = () => {
    const projects = [
        { type: 'web', category: "Web Application Showcase", title: "Live Web App", description: "A production-ready, fully responsive web application built with a modern stack, focusing on clean UI and seamless user experience.", embedUrl: "https://7n86c61l8bljunbuuyi9.share.dreamflow.app", techStack: ['React', 'Next.js', 'Vercel'] },
        { type: '3d', category: "3D Asset & Game Development", title: "Game-Ready Vehicle", description: "A high-fidelity 3D model integrated into a real-time game engine, featuring custom physics and interactive components.", embedUrl: "https://sketchfab.com/models/1b63ea01e6f443cdad5fec3d366d8cf1/embed?autostart=1&ui_theme=dark&transparent=1&ui_controls=0&ui_infos=0", techStack: ['Unity', 'C#', 'Blender'] },
        { type: 'mobile', category: "Cross-Platform Mobile App", title: "MVP Showcase", description: "A functional Minimum Viable Product built with Flutter to validate a mobile app concept on both iOS and Android from a single codebase.", embedUrl: "https://es1anjvcwkmz0nuetf8y.share.dreamflow.app", techStack: ['Flutter', 'Dart', 'Firebase'] },
        { type: 'ai', category: "Custom AI Integration", title: "Specialized Financial Agent", description: "A bespoke AI agent providing expert-level conversation, powered by Google's Gemini API and a custom-engineered persona.", techStack: ['React', 'Gemini API', 'Node.js'] },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => setCurrentIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1));
    const handleNext = () => setCurrentIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1));

    return (
        <section id="work" className="section-padding bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                     <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">The Work</h2>
                     <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A curated selection of projects, each demonstrating a unique technical challenge and solution.</p>
                </div>

                <div className="relative h-[75vh] max-h-[720px] w-full">
                    {projects.map((project, index) => (
                        <div key={index} className={`carousel-slide ${index === currentIndex ? 'active' : 'inactive'}`}>
                           <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                              <CarouselCard project={project} />
                           </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button onClick={handlePrev} className="bg-white hover:bg-slate-100 rounded-full p-3 shadow-md border border-slate-200 transition-colors" aria-label="Previous featured project"><ChevronLeftIcon className="w-6 h-6 text-slate-700" /></button>
                     <button onClick={handleNext} className="bg-white hover:bg-slate-100 rounded-full p-3 shadow-md border border-slate-200 transition-colors" aria-label="Next featured project"><ChevronRightIcon className="w-6 h-6 text-slate-700" /></button>
                </div>
            </div>
        </section>
    );
};

// --- My Process Section ---
const MyProcess = () => {
    const processSteps = [
        { icon: CompassIcon, title: "Discover", description: "I start by deeply understanding the core problem, user needs, and business goals to ensure the project is set up for success from day one." },
        { icon: LayersIcon, title: "Design", description: "Next, I architect a robust solution, planning everything from the user interface and experience to the underlying system and data architecture." },
        { icon: CodeIcon, title: "Develop", description: "With a solid plan, I build, test, and iterate on the product, writing clean, efficient, and scalable code while ensuring quality at every stage." },
        { icon: RocketIcon, title: "Deploy", description: "I ensure a seamless launch by managing deployment pipelines, monitoring performance, and gathering feedback for future iterations." }
    ];

    return (
        <section id="process" className="section-padding bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                     <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">My Process</h2>
                     <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A disciplined approach to building successful digital products.</p>
                </div>
                <div className="relative">
                    <div className="grid md:grid-cols-4 gap-12 text-center">
                        {processSteps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center z-10">
                               <div className="w-16 h-16 icon-gradient-bg rounded-2xl shadow-md flex items-center justify-center border border-slate-200 mb-6">
                                   <step.icon className="w-8 h-8 text-teal-600" />
                               </div>
                                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                                <p className="mt-2 text-slate-600 max-w-xs">{step.description}</p>
                            </div>
                        ))}
                    </div>
                     <div className="absolute top-8 left-0 w-full h-px bg-slate-200 hidden md:block" aria-hidden="true">
                        <svg width="100%" height="100%" className="overflow-visible">
                            <line x1="12.5%" y1="0" x2="87.5%" y2="0" strokeWidth="2" stroke="var(--c-border)" strokeDasharray="8 8" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Core Technologies Section ---
const CoreTechnologies = () => {
    const techCategories = {
        "Languages": ["C#", "Python", "JavaScript", "TypeScript", "SQL"],
        ".NET Ecosystem": ["ASP.NET Core", "Entity Framework Core", ".NET 8", "Blazor", "MAUI"],
        "AI & Data Science": ["PyTorch", "TensorFlow", "Scikit-learn", "LangChain", "Hugging Face", "Pandas"],
        "Cloud & DevOps": ["Azure (App Service, Functions)", "AWS (EC2, S3, Lambda)", "Docker", "Kubernetes", "Azure DevOps"],
        "Frontend": ["React", "Next.js", "HTML5 & CSS3", "Tailwind CSS"],
        "Databases": ["SQL Server", "PostgreSQL", "MongoDB", "Redis", "Pinecone (Vector DB)"],
    };

    return (
        <section id="tech" className="section-padding bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                     <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Core Technologies</h2>
                     <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">The primary tools and technologies I use to build, train, and deploy modern applications.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(techCategories).map(([category, skills]) => (
                        <div key={category} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {skills.map(skill => (
                                    <li key={skill} className="text-slate-600 flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 bg-teal-500 rounded-full"></span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// --- Testimonials Section ---
const Testimonials = () => {
    return (
        <section className="section-padding bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                    Trusted by Colleagues
                </h2>
                <div className="mt-10">
                    <blockquote className="text-2xl lg:text-3xl font-medium text-slate-800 leading-snug">
                       “Robert is a rare talent. His ability to bridge complex technical challenges with a deep understanding of user experience is unmatched. He’s not just an engineer; he’s a true product visionary.”
                    </blockquote>
                    <footer className="mt-6">
                        <p className="font-semibold text-slate-900">Jane Doe</p>
                        <p className="text-slate-600">Former Manager, Tech Solutions Inc.</p>
                    </footer>
                </div>
            </div>
        </section>
    )
}

// --- Additional Projects Carousel ---
const AdditionalProjectCard = ({ project }) => (
    <div className="flex-shrink-0 w-full sm:w-[45%] lg:w-1/3 snap-start p-3">
        <div className="bg-white h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden hover:-translate-y-1">
            <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => e.target.src='https://placehold.co/400x300/e2e8f0/4B5563?text=Image'}/>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                <p className="text-slate-600 text-sm mt-1 mb-4 flex-grow">{project.subtitle}</p>
                 <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
                    {project.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">{tech}</span>
                    ))}
                 </div>
            </div>
             <a href="#" className="absolute inset-0" aria-label={`View case study for ${project.title}`}></a>
        </div>
    </div>
);

const AdditionalProjects = () => {
    const projects = [
        { id: 1, category: 'Machine Learning', title: 'AI E-commerce Platform', subtitle: 'Personalized shopping experiences using collaborative filtering.', imageUrl: 'https://placehold.co/400x300/14B8A6/FFFFFF?text=Project+A', techStack: ['React', 'Node.js', 'Python', 'TensorFlow']},
        { id: 2, category: 'Data Visualization', title: 'Real-time Data Dashboard', subtitle: 'Visualizing live-streaming financial data with D3.js.', imageUrl: 'https://placehold.co/400x300/3B82F6/FFFFFF?text=Project+B', techStack: ['React', 'D3.js', 'WebSocket', 'Node.js']},
        { id: 3, category: 'Web Application', title: 'Project Management Tool', subtitle: 'A real-time, collaborative Kanban board application.', imageUrl: 'https://placehold.co/400x300/8B5CF6/FFFFFF?text=Project+C', techStack: ['React', 'Firebase', 'Tailwind CSS'] },
        { id: 4, category: 'Mobile App', title: 'Cross-Platform Fitness Tracker', subtitle: 'Track workouts and progress with a unified mobile experience.', imageUrl: 'https://placehold.co/400x300/F59E0B/FFFFFF?text=Project+D', techStack: ['Flutter', 'Dart', 'Firebase'] },
    ];
    return (
        <section className="section-padding">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-8">More To Explore</h2>
                 <div className="flex overflow-x-auto pb-4 -mx-4 px-1 no-scrollbar snap-x snap-mandatory">
                     {projects.map(p => <AdditionalProjectCard key={p.id} project={p} />)}
                 </div>
            </div>
        </section>
    );
};

// --- About Me Section ---
const AboutMe = () => {
  return (
    <section id="about" className="section-padding bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
            <div className="w-48 h-48 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-slate-100">
                <LogoIcon className="h-24 w-24 text-slate-900" />
            </div>
        </div>
        <div className="md:col-span-2">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                Driven by a passion for solving complex problems.
            </h2>
            <p className="mt-6 text-lg text-slate-600">
                As a senior software engineer, I thrive on architecting and building robust, scalable applications that bridge the gap between user needs and business goals. My expertise spans the full stack, with a deep interest in leveraging AI and modern frameworks to create impactful, intuitive digital products.
            </p>
        </div>
      </div>
    </section>
  )
};

// --- Contact Section ---
const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [formStatus, setFormStatus] = useState({ submitted: false, message: '' });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setFormStatus({ submitted: true, message: "Thank you for your message! I'll be in touch soon." });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus({ submitted: false, message: '' }), 5000);
    };

    return (
        <section id="contact" className="section-padding">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Let's build something together.</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Have a project in mind or just want to connect? I'd love to hear from you.</p>

                <div className="mt-12">
                    {formStatus.submitted ? (
                        <div className="bg-teal-100 border-l-4 border-teal-500 text-teal-800 p-4 text-left rounded-md" role="alert">
                            <p className="font-bold">Success!</p>
                            <p>{formStatus.message}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                            <div>
                                <label htmlFor="name" className="sr-only">Full Name</label>
                                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email Address</label>
                                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"/>
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea name="message" id="message" rows="4" required value={formData.message} onChange={handleChange} placeholder="Your message..." className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"></textarea>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="text-lg font-bold bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors transform hover:scale-105">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- Footer ---
const Footer = () => {
    const socialLinks = [ { name: 'GitHub', icon: GithubIcon, url: '#' }, { name: 'LinkedIn', icon: LinkedinIcon, url: '#' }, { name: 'Twitter', icon: TwitterIcon, url: '#' }, ];
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} {developerName}. All Rights Reserved.</p>
                     <div className="flex items-center gap-6">
                         {socialLinks.map(link => (
                             <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors" aria-label={link.name}>
                                 <link.icon className="w-5 h-5" />
                             </a>
                         ))}
                     </div>
                </div>
            </div>
        </footer>
    );
};


// --- Main App Component ---
export default function App() {
    return (
        <>
            <GlobalStyles />
            <header className="fixed top-0 left-0 right-0 z-50 glass-header">
                 <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                     <a href="#" aria-label="Home">
                        <LogoIcon className="h-8 w-auto text-slate-900" />
                    </a>
                    <div className="flex items-center gap-8">
                         <a href="#work" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">The Work</a>
                         <a href="#process" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Process</a>
                         <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">About</a>
                         <a href="#contact" className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">Contact</a>
                    </div>
                </nav>
            </header>

            <main>
                <section className="section-padding relative flex items-center justify-center min-h-[70vh]">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="w-96 h-96 bg-teal-200 rounded-full absolute -top-20 -left-20 filter blur-3xl"></div>
                        <div className="w-80 h-80 bg-purple-200 rounded-full absolute -bottom-20 -right-20 filter blur-3xl"></div>
                    </div>
                     <div className="relative z-10 text-center">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Engineering <br />Digital Experiences
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A showcase of full-stack development, AI integration, and user-centric design.
                        </p>
                    </div>
                </section>
                
                <FeaturedWork />
                <MyProcess />
                <AboutMe />
                <Testimonials />
                <CoreTechnologies />
                <AdditionalProjects />
                <Contact />
            </main>

            <Footer />
        </>
    );
}
