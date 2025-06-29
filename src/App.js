import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

// --- Firebase Configuration ---
// IMPORTANT: Replace this with your own Firebase project configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};


// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Authentication Context ---
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = { currentUser, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


// --- Foundational Styles & Fonts ---
const GlobalStyles = () => (
    <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
            :root {
                --c-background: #f8fafc;
                --c-surface: #FFFFFF;
                --c-text-primary: #1e293b;
                --c-text-secondary: #64748b;
                --c-border: #e2e8f0;
                --c-accent: #334155;
                --c-accent-light: #f1f5f9;
            }
            body { font-family: 'Inter', sans-serif; background-color: var(--c-background); color: var(--c-text-primary); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; scroll-behavior: smooth; }
            .glass-header { background-color: rgba(248, 250, 252, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--c-border); }
            .section-padding { padding-top: 4rem; padding-bottom: 4rem; }
            @media (min-width: 1024px) { .section-padding { padding-top: 6rem; padding-bottom: 6rem; } } /* Adjusted desktop padding */
            .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            
            .carousel-slide {
              grid-column: 1 / -1;
              grid-row: 1 / -1;
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.5s ease-in-out, visibility 0s 0.5s;
            }
            .carousel-slide.active {
              opacity: 1;
              visibility: visible;
              transition-delay: 0s;
            }

            .modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; transition: opacity 0.3s ease-in-out; pointer-events: none; padding: 1rem;}
            .modal-overlay.visible { opacity: 1; pointer-events: auto; }
            .modal-content { background: white; border-radius: 1rem; padding: 1.5rem; width: 100%; transform: scale(0.95); transition: transform 0.3s ease-in-out; max-height: 90vh; overflow-y: auto;}
            @media (min-width: 640px) { .modal-content { padding: 2rem; } }
            .modal-overlay.visible .modal-content { transform: scale(1); }
            
            .framework-item {
                opacity: 0;
                transform: translateY(50px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }

            .framework-item.is-visible {
                opacity: 1;
                transform: translateY(0);
            }

            .framework-card {
                background-color: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid #ffffff;
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
            }

            @media (min-width: 768px) {
                .framework-card:hover {
                    transform: translateY(-10px) scale(1.03);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
                }
            }
            
            .timeline-dot {
                background-color: var(--c-surface);
                border: 2px solid var(--c-border);
                color: var(--c-text-secondary);
                font-weight: 600;
                transition: all 0.5s ease;
                transform: scale(1);
            }
            .framework-item.is-visible .timeline-dot {
                background-color: var(--c-accent);
                border-color: var(--c-accent);
                color: white;
                transform: scale(1.1);
                box-shadow: 0 0 0 6px rgba(51, 65, 85, 0.1);
            }
             .icon-container {
                background: radial-gradient(circle, #ffffff 60%, #f1f5f9 100%);
                box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.02), 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
            }

            /* --- STREAMING CAROUSEL STYLES (COVERFLOW) --- */
            .coverflow-container {
                overflow: hidden;
            }
            .coverflow-track {
                display: flex;
                align-items: center;
                transition: transform 0.6s cubic-bezier(0.5, 0, 0.5, 1);
            }
            .coverflow-item {
                flex: 0 0 90%;
                min-width: 0;
                position: relative;
                transition: transform 0.6s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.6s ease;
                opacity: 0.4;
                transform: scale(0.85);
            }
            @media (min-width: 768px) {
                .coverflow-item {
                    flex: 0 0 75%;
                }
            }
            .coverflow-item.active {
                opacity: 1;
                transform: scale(1);
            }
            .coverflow-item.active .coverflow-content {
                opacity: 1;
            }
            .coverflow-content {
                position: absolute;
                bottom: 1.5rem;
                left: 1.5rem;
                right: 1.5rem;
                color: white;
                opacity: 0;
                transition: opacity 0.6s ease;
                pointer-events: none;
            }

            /* --- MOBILE-SPECIFIC OVERRIDES --- */
            @media (max-width: 767px) {
                .featured-work-grid {
                    display: flex;
                    flex-direction: column;
                }
                .framework-timeline::before {
                   content: none;
                }
                .framework-step {
                    flex-direction: column !important;
                    align-items: stretch !important;
                    margin-bottom: 2rem;
                }
                 .framework-step > div {
                    width: 100% !important;
                }
                .timeline-dot-container {
                    display: none;
                }
            }
        `}</style>
    </>
);

// --- Global Constants & Icons ---
const developerName = "Robert McQva";
const LogoIcon = ({ className }) => (<svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 26V6H15.5C18.5376 6 21 8.46243 21 11.5V11.5C21 14.5376 18.5376 17 15.5 17H11.5L16.5 26H8Z" fill="currentColor"/><path d="M15 6L24 6L20 17L24 26H15L11.5 17L15 6Z" fill="currentColor" fillOpacity="0.7"/></svg>);
const GithubIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1 1.2-10.8 1-10.8 1-8.8 1-14.4-7.4-14.4-7.4 3.8-1 7.4 1.8 7.4 1.8-3.4-.6-6.1-4.9-6.1-4.9 1.4 2.3 4.9 4.3 6.1 4.3-1.4-1.8-1.4-4.2-1.4-4.2 3.8 4.9 9.3 6.1 9.3 6.1Z"/></svg>;
const ChevronLeftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRightIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const ChevronUpIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"></polyline></svg>;
const CompassIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const LayersIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const CodeIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const CloudUploadIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="22"></line></svg>;
const SyncIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M16 4v4h4"/></svg>;
const XIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const DownloadIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const LogOutIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const MenuIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;


// --- Auth & About Modals ---
const AuthModal = ({ isOpen, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLoginView) await signInWithEmailAndPassword(auth, email, password);
            else await createUserWithEmailAndPassword(auth, email, password);
            onClose();
        } catch (err) { setError(err.message); }
    };
    
    const handleGoogleSignIn = async () => {
        setError('');
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            onClose();
        } catch(err) { setError(err.message); }
    }

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}>
            <div className="modal-content max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{isLoginView ? 'Sign In' : 'Create Account'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><XIcon className="w-6 h-6 text-slate-500"/></button>
                </div>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleAuthAction} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"/>
                    <button type="submit" className="w-full text-lg font-bold bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors">{isLoginView ? 'Sign In' : 'Sign Up'}</button>
                </form>
                <div className="flex items-center my-4"><hr className="flex-grow border-slate-200"/><span className="px-2 text-slate-500 text-sm">OR</span><hr className="flex-grow border-slate-200"/></div>
                <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.012 36.49 44 31.134 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    Sign in with Google
                </button>
                <p className="text-center text-sm text-slate-600 mt-6">{isLoginView ? "Don't have an account?" : 'Already have an account?'}<button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-slate-600 hover:underline ml-1">{isLoginView ? 'Sign Up' : 'Sign In'}</button></p>
            </div>
        </div>
    );
};

const AboutModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}>
            <div className="modal-content max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end mb-2">
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100" aria-label="Close about modal"><XIcon className="w-6 h-6 text-slate-500"/></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
                    <div className="md:col-span-1 flex justify-center">
                        <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-slate-100">
                            <LogoIcon className="h-20 w-20 md:h-24 md:w-24 text-slate-900" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                            Driven by a passion for solving complex problems.
                        </h2>
                        <p className="mt-6 text-base md:text-lg text-slate-600">
                            As a senior software engineer, I thrive on architecting and building robust, scalable applications that bridge the gap between user needs and business goals. My expertise spans the full stack, with a deep interest in leveraging AI and modern frameworks to create impactful, intuitive digital products.
                        </p>
                        <div className="mt-8">
                            <a 
                                href="/Robert_McQva_Resume.pdf" 
                                download 
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base md:text-lg transition-colors ${currentUser ? 'bg-slate-900 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                                onClick={(e) => !currentUser && e.preventDefault()}
                                title={!currentUser ? "Sign in to download" : "Download Resume"}
                            >
                                <DownloadIcon className="w-6 h-6" />
                                Download Resume
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InsightModal = ({ insight, onClose }) => {
    if (!insight) return null;

    return (
        <div className={`modal-overlay visible`} onClick={onClose}>
            <div className="modal-content max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="font-semibold text-slate-600">{insight.category}</p>
                        <h2 className="text-2xl md:text-3xl font-bold mt-1">{insight.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 -mt-2 -mr-2 flex-shrink-0"><XIcon className="w-6 h-6 text-slate-500"/></button>
                </div>
                <div className="prose prose-slate lg:prose-lg max-w-none text-slate-700 leading-relaxed">
                   {insight.content}
                </div>
            </div>
        </div>
    );
}

// --- Featured Work Carousel ---
const CarouselCard = ({ project }) => {
    const renderContent = () => {
        const commonIframeClasses = "w-full h-full bg-white";
        
        if (project.display === 'tablet') {
            const tabletContainerClasses = "relative w-full h-full flex justify-center overflow-hidden";
            return (
                <div className={`${tabletContainerClasses} bg-slate-100 p-0 md:p-4 lg:p-8`}>
                    <div className="md:hidden w-full h-full">
                         <iframe src={project.embedUrl} title={project.title} className={commonIframeClasses}></iframe>
                    </div>
                    <div className="hidden md:block my-auto relative mx-auto border-gray-800 bg-gray-800 border-[16px] rounded-[2.5rem] w-full max-w-[800px] aspect-[4/3] shadow-xl">
                        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                            <iframe src={project.embedUrl} title={project.title} className={commonIframeClasses} scrolling="no"></iframe>
                        </div>
                    </div>
                </div>
            );
        }

        const baseContainerClasses = "relative w-full h-full flex items-center justify-center overflow-hidden";
        if (project.type === 'mobile') {
             return (
                 <div className={`${baseContainerClasses} bg-slate-100 p-4 md:p-8`}>
                     <div className="hidden md:block">
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                               <iframe src={project.embedUrl} title={project.title} className={commonIframeClasses}></iframe>
                            </div>
                        </div>
                    </div>
                    {/* Mobile: simple iframe takes full width */}
                     <div className="md:hidden w-full aspect-[9/16] rounded-2xl overflow-hidden border-8 border-slate-800 shadow-xl">
                         <iframe src={project.embedUrl} title={project.title} className={commonIframeClasses}></iframe>
                     </div>
                 </div>
             );
        }

        // Default for 'web' and '3d'
        return (
            <div className={`${baseContainerClasses} bg-slate-900`}>
                 <iframe 
                    title={project.title} 
                    frameBorder="0" 
                    allowFullScreen 
                    mozallowfullscreen="true" 
                    webkitallowfullscreen="true" 
                    src={project.embedUrl} 
                    className={commonIframeClasses}
                 ></iframe>
            </div>
        );
    };

    const descriptionPanel = (
         <div className="bg-white p-6 md:p-8 flex flex-col justify-between h-full">
            <div>
                <p className="font-semibold text-slate-600">{project.category}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">{project.title}</h3>
                <p className="mt-4 text-slate-600">{project.description}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-800">Key Technologies</h4>
                <div className="flex flex-wrap gap-2 mt-3">
                    {project.techStack.map(tech => (
                        <span key={tech} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{tech}</span>
                    ))}
                </div>
            </div>
        </div>
    );
    
    const isThinLayout = project.layout === 'thin';

    // Desktop classes
    const desktopContentClasses = isThinLayout ? 'md:col-span-9 lg:col-span-10' : 'md:col-span-7';
    const desktopDescriptionClasses = isThinLayout ? 'md:col-span-3 lg:col-span-2' : 'md:col-span-5';

    return (
        <div className="flex flex-col md:grid md:grid-cols-12 h-full featured-work-grid">
            <div className={`aspect-video md:aspect-auto ${desktopContentClasses}`}>
                {renderContent()}
            </div>
            <div className={`flex flex-col ${desktopDescriptionClasses}`}>
                {descriptionPanel}
            </div>
        </div>
    );
};


const FeaturedWork = () => {
    const projects = [
        { 
            type: 'web', 
            category: "FinTech Dashboard", 
            title: "Zenith Analytics", 
            description: "A comprehensive and interactive dashboard for visualizing key financial metrics, recent transactions, and investment performance.", 
            embedUrl: "https://zenith-sand.vercel.app/", 
            techStack: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
            layout: 'thin'
        },
        { 
            type: 'web', 
            category: "UI/UX & Web Development", 
            title: "Aura Creative Agency", 
            description: "A visually-driven, animated website for a modern creative agency, focusing on fluid user experience and brand storytelling.", 
            embedUrl: "https://aura-three-opal.vercel.app/", 
            techStack: ['React', 'Next.js', 'GSAP', 'Tailwind'],
            layout: 'thin'
        },
        { 
            type: 'mobile', 
            display: 'tablet',
            category: "Interactive Tablet Kiosk", 
            title: "Real Estate Showcase", 
            description: "An interactive kiosk application for showcasing property listings, designed for use on tablet devices in real estate offices or at open houses.", 
            embedUrl: "https://es1anjvcwkmz0nuetf8y.share.dreamflow.app/", 
            techStack: ['Flutter', 'Dart', 'Firebase'] 
        },
        { 
            type: '3d', 
            category: "3D Asset & Game Development", 
            title: "Game-Ready Vehicle", 
            description: "A high-fidelity 3D model integrated into a real-time game engine, featuring custom physics and interactive components.", 
            embedUrl: "https://sketchfab.com/models/1b63ea01e6f443cdad5fec3d366d8cf1/embed?autostart=1&ui_theme=dark&transparent=1&ui_controls=0&ui_infos=0", 
            techStack: ['Unity', 'C#', 'Blender'],
            layout: 'thin' 
        },
        { type: 'web', category: "Web Application Showcase", title: "Live Web App", description: "A production-ready, fully responsive web application built with a modern stack, focusing on clean UI and seamless user experience.", embedUrl: "https://7n86c61l8bljunbuuyi9.share.dreamflow.app", techStack: ['React', 'Next.js', 'Vercel'] },

    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => setCurrentIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1));
    const handleNext = () => setCurrentIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1));

    return (
        <section id="work" className="section-padding bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">The Work</h2>
                     <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">A curated selection of projects, each demonstrating a unique technical challenge and solution.</p>
                </div>

                <div className="grid min-h-0 md:min-h-[660px]">
                    {projects.map((project, index) => (
                        <div 
                            key={project.title} 
                            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                        >
                           <div className="rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full">
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


// --- The Framework Section ---
const FrameworkStep = ({ step, index }) => {
    const itemRef = useRef(null);

    useEffect(() => {
        const currentRef = itemRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (observer && currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const isEven = index % 2 === 0;
    // Mobile first: always column. Desktop: row/row-reverse
    return (
        <div ref={itemRef} className={`framework-item framework-step group relative flex items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 ${isEven ? '' : 'md:flex-row-reverse md:space-x-reverse'}`}>
             <div className="w-full md:w-[calc(50%-2.5rem)]">
                 <div className="relative p-6 md:p-8 rounded-2xl framework-card shadow-lg">
                    <div className="relative z-10">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center icon-container mb-6">
                            <step.icon className="w-7 h-7 md:w-8 md:h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{step.title}</h3>
                        <p className="mt-3 text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                </div>
            </div>
            <div className="timeline-dot-container hidden md:flex w-20 h-full absolute top-0 left-1/2 -translate-x-1/2 items-center justify-center">
                 <div className="timeline-dot w-10 h-10 rounded-full flex items-center justify-center text-sm">
                   0{index+1}
                </div>
            </div>
        </div>
    );
};

const TheFramework = () => {
    const processSteps = [
        { icon: CompassIcon, title: "Discover", description: "I start by deeply understanding the core problem, user needs, and business goals to ensure the project is set up for success from day one." },
        { icon: LayersIcon, title: "Design", description: "Next, I architect a robust solution, planning everything from the user interface and experience to the underlying system and data architecture." },
        { icon: CodeIcon, title: "Develop", description: "With a solid plan, I build, test, and iterate on the product, writing clean, efficient, and scalable code while ensuring quality at every stage." },
        { icon: CloudUploadIcon, title: "Deploy", description: "I ensure a seamless launch by managing deployment pipelines, monitoring performance, and gathering feedback for future iterations." },
        { icon: SyncIcon, title: "Evolve", description: "The launch is just the beginning. I monitor performance, gather user feedback, and use data-driven insights to inform the next cycle of improvements and features." }
    ];

    return (
        <section id="framework" className="section-padding bg-slate-50 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">The Framework</h2>
                     <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">A disciplined, end-to-end approach to building successful digital products.</p>
                </div>

                <div className="relative framework-timeline">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-slate-200 hidden md:block" aria-hidden="true"></div>
                    <div className="space-y-12 md:space-y-24">
                        {processSteps.map((step, index) => (
                            <FrameworkStep key={index} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Streaming Carousel (Coverflow Effect) ---
const StreamingCarousel = ({ onReadInsight }) => {
    const articles = [
        { 
            id: 1, 
            category: "Artificial Intelligence", 
            title: "The Future of Generative AI", 
            imageUrl: "https://placehold.co/1960x1102/1e293b/94a3b8?text=AI",
            url: "#",
            logo: {src: "https://placehold.co/120x50/ffffff/1e293b?text=Insights", alt: "Insights"},
            content: (
                <>
                    <p className="mb-4">
                        Generative AI has moved from a niche concept to a dominant force reshaping our digital world. Unlike traditional AI that analyzes existing data, generative models create entirely new, original content—from text and images to complex code and scientific models. This isn't just an incremental improvement; it's a paradigm shift in human-computer collaboration that is unlocking unprecedented opportunities.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">Key Trends for 2025 and Beyond</h3>
                    <p className="mb-4">
                        The evolution of Generative AI is accelerating. As we look ahead, several key trends are defining its trajectory:
                    </p>
                    <ul className="list-disc list-inside space-y-3 mb-4 pl-2">
                        <li>
                            <strong>Multimodality as the Standard:</strong> Early models specialized in one domain (e.g., text or images). The future is multimodal systems like Google's Gemini, which can seamlessly understand, process, and generate content across text, images, audio, and video. This allows for far more sophisticated applications, such as generating a video with a complete script and soundtrack from a single prompt.
                        </li>
                        <li>
                            <strong>The Rise of AI Agents:</strong> We are moving from single-purpose models to coordinated, multi-agent systems. Think of a team of specialized AIs working together: one for research, one for writing, one for fact-checking, and another for translating. This collaborative approach enhances accuracy, scalability, and efficiency, enabling the automation of complex, multi-step workflows.
                        </li>
                        <li>
                            <strong>Human-AI Co-Creation:</strong> The narrative is shifting from AI as a tool to AI as a creative partner. In fields like software development, engineering, and design, AI is augmenting human expertise—not replacing it. Developers use AI to write boilerplate code and debug, while artists use it to generate novel concepts, allowing professionals to focus on higher-level strategy and innovation.
                        </li>
                    </ul>
                    <h3 className="text-xl font-bold mt-6 mb-3">Ethical Frontiers and Responsibility</h3>
                    <p className="mb-4">
                        With great power comes great responsibility. As generative models become more integrated into society, addressing the ethical implications is paramount. Key considerations include:
                    </p>
                    <ul className="list-disc list-inside space-y-3 pl-2">
                        <li>
                            <strong>Transparency and Regulation:</strong> As regulators catch up, we will see stricter rules for disclosing AI-generated content, auditing models for bias, and ensuring data privacy. Building trust through transparency is no longer optional.
                        </li>
                        <li>
                            <strong>Bias and Misinformation:</strong> Models trained on vast internet datasets can inherit and amplify human biases. The industry must continue to develop techniques to mitigate these biases and combat the potential for generating persuasive but false information at scale.
                        </li>
                         <li>
                            <strong>Environmental Impact:</strong> Training large-scale models is computationally intensive and has a significant energy footprint. A growing focus on "Green AI" involves developing more efficient algorithms and hardware to ensure the future of AI is sustainable.
                        </li>
                    </ul>
                     <p className="mt-6">
                        The generative AI landscape is dynamic and full of opportunity. For engineers and creators, the key is not just to adopt these tools, but to understand the underlying principles, anticipate future trends, and build ethically. The future we're building is one where AI augments human potential, driving progress in ways we are only beginning to imagine.
                    </p>
                </>
            )
        },
        { 
            id: 2, 
            category: "Software Development", 
            title: "Mastering React Hooks", 
            imageUrl: "https://placehold.co/1960x1102/4f46e5/a5b4fc?text=React",
            url: "#",
            logo: {src: "https://placehold.co/120x50/ffffff/1e293b?text=Code", alt: "Code"},
            content: (
                <>
                    <p className="mb-4">
                        React Hooks revolutionized how we build components, allowing us to use state and other React features in functional components. This shift from class-based components has led to cleaner, more composable, and easier-to-understand code. Mastering Hooks is essential for any modern React developer.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">The Core Hooks: `useState` and `useEffect`</h3>
                    <p className="mb-4">
                        These are the foundational Hooks you'll use in almost every component:
                    </p>
                    <ul className="list-disc list-inside space-y-3 mb-4 pl-2">
                        <li>
                            <strong>`useState`:</strong> The most basic Hook, it allows you to add state to functional components. It returns a stateful value and a function to update it. Remember, updates are asynchronous and batched for performance.
                        </li>
                        <li>
                            <strong>`useEffect`:</strong> This Hook lets you perform side effects in your components, such as data fetching, subscriptions, or manually changing the DOM. Think of it as a combination of `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. The key is mastering its dependency array to control when the effect re-runs.
                        </li>
                    </ul>
                    <h3 className="text-xl font-bold mt-6 mb-3">Advanced Hooks for Optimization and State Management</h3>
                     <p className="mb-4">
                        As applications grow, managing performance and complex state becomes crucial.
                    </p>
                    <ul className="list-disc list-inside space-y-3 mb-4 pl-2">
                        <li>
                            <strong>`useContext`:</strong> Solves the "prop drilling" problem by allowing you to share state across the entire component tree without passing props down manually.
                        </li>
                        <li>
                             <strong>`useReducer`:</strong> An alternative to `useState` for managing complex state logic. It's often preferred when you have multiple sub-values or when the next state depends on the previous one.
                        </li>
                        <li>
                            <strong>`useCallback` and `useMemo`:</strong> These are performance optimization Hooks. `useCallback` memoizes functions, preventing unnecessary re-renders of child components, while `useMemo` memoizes values, avoiding expensive recalculations on every render.
                        </li>
                    </ul>
                    <h3 className="text-xl font-bold mt-6 mb-3">The Power of Custom Hooks</h3>
                    <p className="mb-4">
                        Perhaps the most powerful feature of Hooks is the ability to create your own. By extracting component logic into reusable functions (e.g., `useFetch`, `useLocalStorage`, `useEventListener`), you can share logic across components, keep your code DRY (Don't Repeat Yourself), and build a powerful library of personal utilities.
                    </p>
                     <p className="mt-6">
                        Hooks are more than just an API; they represent a fundamental shift in thinking about React development. By embracing a functional and composable approach, you can build applications that are not only more powerful but also significantly easier to maintain and scale.
                    </p>
                </>
            )
        },
        { 
            id: 3, 
            category: "Product Design", 
            title: "Principles of User-Centric Design", 
            imageUrl: "https://placehold.co/1960x1102/059669/a7f3d0?text=Design",
            url: "#",
            logo: {src: "https://placehold.co/120x50/ffffff/1e293b?text=Design", alt: "Design"},
            content: (
                <>
                    <p className="mb-4">
                        In today's competitive digital landscape, a great product is no longer defined just by its features, but by its experience. User-Centric Design (UCD) is an iterative design philosophy that places the user, their needs, and their limitations at the forefront of every stage of the design and development process. It's about building products *for* people, not just for the sake of technology.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">The Core Pillars of UCD</h3>
                    <p className="mb-4">
                        User-Centric Design is guided by a few fundamental principles:
                    </p>
                    <ul className="list-disc list-inside space-y-3 mb-4 pl-2">
                        <li>
                            <strong>Empathy is Everything:</strong> You cannot design effectively for users you don't understand. The process begins with deep empathy—understanding their context, motivations, pain points, and goals through research methods like user interviews, surveys, and creating user personas.
                        </li>
                        <li>
                            <strong>Iterate, Iterate, Iterate:</strong> The first idea is rarely the best one. UCD embraces a cycle of prototyping, user testing, and refining. Low-fidelity wireframes and interactive prototypes allow for quick feedback and learning before a single line of code is written, saving time and resources.
                        </li>
                        <li>
                            <strong>Clarity and Simplicity Trump All:</strong> A successful design is one that feels intuitive. It guides the user effortlessly toward their goal without unnecessary complexity. This means clear navigation, readable typography, and a consistent visual language that doesn't make the user think.
                        </li>
                    </ul>
                    <h3 className="text-xl font-bold mt-6 mb-3">From Philosophy to Process</h3>
                    <p className="mb-4">
                        UCD isn't just an abstract idea; it's a practical process. A typical workflow involves understanding the context of use, specifying user requirements, producing design solutions, and evaluating the design against those requirements. This cycle repeats as the product evolves, ensuring it continuously meets user needs.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">The Business Case for User-Centricity</h3>
                     <p className="mb-4">
                        Ultimately, designing for the user is designing for the business. A product that is easy and enjoyable to use leads to higher user satisfaction, increased engagement, better retention rates, and stronger brand loyalty. By solving real problems for real people, you create lasting value for both the user and the business.
                    </p>
                </>
            )
        },
        { 
            id: 4, 
            category: "Cloud Computing", 
            title: "Scaling Applications with Kubernetes", 
            imageUrl: "https://placehold.co/1960x1102/0891b2/67e8f9?text=Cloud",
            url: "#",
            logo: {src: "https://placehold.co/120x50/ffffff/1e293b?text=Infra", alt: "Infra"},
            content: (
                 <>
                    <p className="mb-4">
                       As applications have shifted from monoliths to distributed microservices, the complexity of managing them has exploded. Kubernetes (K8s) has emerged as the de facto operating system for the cloud, providing a robust framework for deploying, scaling, and managing containerized applications. Understanding its core principles is crucial for building modern, resilient systems.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">Why Kubernetes? The Problem of Scale</h3>
                    <p className="mb-4">
                        In a microservices architecture, you're no longer managing a single application but dozens or even hundreds of independent services. This introduces challenges in deployment, networking, load balancing, and health monitoring. Kubernetes solves these problems by providing a unified, declarative API to manage the entire application lifecycle.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">Core Concepts Demystified</h3>
                    <p className="mb-4">
                       Kubernetes has a steep learning curve, but its power lies in a few core concepts:
                    </p>
                    <ul className="list-disc list-inside space-y-3 mb-4 pl-2">
                        <li>
                            <strong>Containers:</strong> The lightweight, portable units that package an application and its dependencies. Kubernetes is a container orchestrator.
                        </li>
                        <li>
                            <strong>Pods:</strong> The smallest deployable unit in Kubernetes. A Pod is a wrapper around one or more containers, sharing storage and network resources.
                        </li>
                         <li>
                            <strong>Deployments:</strong> You describe a desired state in a Deployment (e.g., "I want three replicas of my web server running"), and Kubernetes works to maintain that state, automatically handling updates and rollbacks.
                        </li>
                        <li>
                            <strong>Services:</strong> Pods are ephemeral and can be replaced at any time. A Service provides a stable IP address and DNS name for a set of Pods, enabling reliable communication between microservices.
                        </li>
                    </ul>
                    <h3 className="text-xl font-bold mt-6 mb-3">The Key Benefits for Engineering Teams</h3>
                    <ul className="list-disc list-inside space-y-3 mt-4 pl-2">
                         <li>
                            <strong>Automated Scaling and Self-Healing:</strong> Kubernetes can automatically scale your application based on CPU usage or other metrics and will automatically restart or replace containers that fail.
                        </li>
                        <li>
                            <strong>Infrastructure Abstraction:</strong> Developers can focus on their applications without worrying about the underlying machines. Kubernetes abstracts away the hardware, whether it's on-premises or in any public cloud.
                        </li>
                         <li>
                            <strong>Portability and No Vendor Lock-in:</strong> Because Kubernetes is open-source and runs everywhere, it provides the ultimate freedom to move workloads between different environments without significant re-architecture.
                        </li>
                    </ul>
                     <p className="mt-6">
                        While Kubernetes itself is complex, its adoption has been simplified by managed offerings from cloud providers (like GKE, EKS, and AKS). By leveraging its power, engineering teams can build highly available, scalable, and resilient systems that are fit for the demands of the modern cloud-native era.
                    </p>
                </>
            )
        },
        { 
            id: 5, 
            category: "Cybersecurity", 
            title: "The Zero Trust Security Model", 
            imageUrl: "https://placehold.co/1960x1102/be123c/fecdd3?text=Security",
            url: "#",
            logo: {src: "https://placehold.co/120x50/ffffff/1e293b?text=Security", alt: "Security"},
            content: (
                <>
                    <p className="mb-4">
                        The traditional "castle-and-moat" approach to security, which trusts anyone and anything inside the network perimeter, is fundamentally broken. In a world of remote work, cloud services, and sophisticated cyber threats, the perimeter is gone. Zero Trust is the modern security paradigm designed for this reality, built on a simple but powerful principle: **never trust, always verify.**
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">The Philosophical Shift: From Trust to Verification</h3>
                    <p className="mb-4">
                       Zero Trust assumes that the network is always hostile. It eliminates the concept of a trusted internal network and an untrusted external one. Instead, every access request—regardless of where it originates—must be treated as a potential threat. Trust is not granted based on location; it must be explicitly and continuously earned.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3">The Three Pillars of Zero Trust</h3>
                    <p className="mb-4">
                       Implementing Zero Trust architecture revolves around three core pillars:
                    </p>
                    <ul className="list-disc list-inside space-y-3 mb-4 pl-2">
                        <li>
                            <strong>Verify Explicitly:</strong> Always authenticate and authorize based on all available data points. This includes user identity (often with multi-factor authentication), device health, location, and the service being requested.
                        </li>
                        <li>
                            <strong>Use Least Privilege Access:</strong> Grant users and devices only the bare minimum permissions required to perform their specific task. This limits the potential damage if an account or device is compromised, a practice known as "just-in-time" and "just-enough-access."
                        </li>
                         <li>
                            <strong>Assume Breach:</strong> Don't wait for an attack to happen; operate as if one has already occurred. This mindset drives critical security practices like micro-segmentation (to prevent lateral movement), end-to-end encryption, and continuous monitoring to detect and respond to threats quickly.
                        </li>
                    </ul>
                    <h3 className="text-xl font-bold mt-6 mb-3">Why It Matters for Modern Development</h3>
                    <p className="mb-4">
                        For engineers and developers, Zero Trust isn't just an IT policy; it's a development principle. It means building security into applications from the ground up, implementing strong authentication for APIs, and ensuring services have the minimum necessary permissions to function.
                    </p>
                     <p className="mt-6">
                        Adopting Zero Trust is a journey, not a destination. It requires a strategic, phased approach to replace implicit trust with explicit, policy-based verification. In an era where data breaches are inevitable, it is the most effective strategy for minimizing risk and building a resilient, secure digital infrastructure.
                    </p>
                </>
            )
        },
    ];
    
    const [activeIndex, setActiveIndex] = useState(0);
    const autoplayRef = useRef(null);

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % articles.length);
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayRef.current = setInterval(handleNext, 5000);
    };

    const stopAutoplay = () => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
        }
    };

    useEffect(() => {
        startAutoplay();
        return stopAutoplay;
    }, []);

    const itemWidthPercentage = 90; 
    const mdItemWidthPercentage = 75;
    const trackOffset = (100 - itemWidthPercentage) / 2;
    const mdTrackOffset = (100 - mdItemWidthPercentage) / 2;

    const [trackTranslateX, setTrackTranslateX] = useState(-activeIndex * itemWidthPercentage + trackOffset);

    useEffect(() => {
        const updateTrackPosition = () => {
            const isMobile = window.innerWidth < 768;
            const width = isMobile ? itemWidthPercentage : mdItemWidthPercentage;
            const offset = isMobile ? trackOffset : mdTrackOffset;
            setTrackTranslateX(-activeIndex * width + offset);
        };
        updateTrackPosition();
        window.addEventListener('resize', updateTrackPosition);
        return () => window.removeEventListener('resize', updateTrackPosition);
    }, [activeIndex]);


    return (
        <section id="insights" className="bg-white py-16 sm:py-24" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16 px-4">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Insights</h2>
                     <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Thoughts on technology, design, and development.</p>
                </div>
                <div className="coverflow-container h-[55vh] md:h-[60vh]">
                    <div 
                        className="coverflow-track h-full"
                        style={{ transform: `translateX(${trackTranslateX}%)` }}
                    >
                        {articles.map((item, index) => {
                             const isActive = index === activeIndex;
                            return (
                                <div key={item.id} className={`coverflow-item ${isActive ? 'active' : ''}`}>
                                    <div className="relative w-full h-full rounded-none md:rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent pointer-events-none"></div>
                                        <div className="coverflow-content">
                                            <h3 className="text-base md:text-xl font-semibold">{item.category}</h3>
                                            <p className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mt-1">{item.title}</p>
                                            <button onClick={() => onReadInsight(item)} className="mt-4 md:mt-6 inline-block bg-white text-black font-semibold px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base hover:bg-slate-200 transition-colors" style={{pointerEvents: 'auto'}}>
                                                Read Insight
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                 <div className="flex justify-center items-center gap-4 mt-8">
                    <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><ChevronLeftIcon className="w-6 h-6"/></button>
                     {articles.map((_, index) => (
                         <button key={index} onClick={() => setActiveIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-slate-800 w-6' : 'bg-slate-300'}`}></button>
                     ))}
                    <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><ChevronRightIcon className="w-6 h-6"/></button>
                 </div>
            </div>
        </section>
    );
};


// --- Testimonials Section ---
const Testimonials = () => {
    return (
        <section className="section-padding bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                    Trusted by Colleagues
                </h2>
                <div className="mt-10">
                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-800 leading-snug">
                       “Robert is a rare talent. His ability to bridge complex technical challenges with a deep understanding of user experience is unmatched. He’s not just an engineer; he’s a true product visionary.”
                    </blockquote>
                    <footer className="mt-6">
                        <p className="font-semibold text-slate-900">Raymel Rodriguez</p>
                        <p className="text-slate-600">CEO of MCC Design Solutions</p>
                    </footer>
                </div>
            </div>
        </section>
    )
}

// --- Contact Section ---
const Contact = () => {
    const [state, setState] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        setState({ submitting: true });

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                setState({ succeeded: true });
                form.reset();
            } else {
                response.json().then(data => {
                     if (Object.hasOwn(data, 'errors')) {
                        setState({ errors: data["errors"].map((error) => error["message"]).join(", ") })
                    } else {
                        setState({ errors: "Something went wrong!" })
                    }
                })
            }
        }).catch(error => {
             setState({ errors: "Something wrong!" })
        });
    };
    
    if (state?.succeeded) {
        return (
            <section id="contact" className="section-padding">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Thank You!</h2>
                     <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Your message has been sent. I'll be in touch with you shortly.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="section-padding">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">Let's build something together.</h2>
                <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Have a project in mind or just want to connect? I'd love to hear from you.</p>

                <div className="mt-12">
                    <form onSubmit={handleSubmit} action="https://formspree.io/f/xnnvobbj" method="POST" className="space-y-6 text-left">
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input id="name" type="text" name="name" required placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email Address</label>
                            <input id="email" type="email" name="email" required placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">Message</label>
                            <textarea id="message" name="message" rows="4" required placeholder="Your message..." className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"></textarea>
                        </div>
                        <div className="text-center">
                            <button type="submit" disabled={state?.submitting} className="text-lg font-bold bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed">
                                {state?.submitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                         {state?.errors && <p className="text-red-600 text-sm mt-2 text-center">{state.errors}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

// --- Scroll To Top Button ---
const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) setIsVisible(true);
        else setIsVisible(false);
    };
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-700 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            aria-label="Scroll to top"
        ><ChevronUpIcon className="w-6 h-6" /></button>
    );
};


// --- Footer ---
const Footer = () => {
    const socialLinks = [ { name: 'GitHub', icon: GithubIcon, url: '#' }, { name: 'LinkedIn', icon: LinkedinIcon, url: '#' }, { name: 'Twitter', icon: TwitterIcon, url: '#' }, ];
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-slate-500 text-center sm:text-left">&copy; {new Date().getFullYear()} {developerName}. All Rights Reserved.</p>
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
function AppContent() {
    const { currentUser } = useAuth();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [selectedInsight, setSelectedInsight] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setIsMenuOpen(false); // Close menu on sign out
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setIsMenuOpen(false); // Close mobile menu on link click
        const element = document.getElementById(targetId);
        // Add a small offset to account for the fixed header
        const headerOffset = 80;
        const elementPosition = element?.getBoundingClientRect().top ?? 0;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    };

    const NavLinks = ({ isMobile = false }) => {
        const commonClass = "text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors";
        const mobileClass = "block text-lg py-3";
        return (
            <>
                <a href="#work" onClick={(e) => handleNavClick(e, 'work')} className={isMobile ? mobileClass : commonClass}>The Work</a>
                <a href="#framework" onClick={(e) => handleNavClick(e, 'framework')} className={isMobile ? mobileClass : commonClass}>Framework</a>
                <a href="#insights" onClick={(e) => handleNavClick(e, 'insights')} className={isMobile ? mobileClass : commonClass}>Insights</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setAboutModalOpen(true); }} className={isMobile ? mobileClass : commonClass}>About</a>
            </>
        )
    }

    return (
        <>
            <GlobalStyles />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
            <InsightModal insight={selectedInsight} onClose={() => setSelectedInsight(null)} />

            <header className="fixed top-0 left-0 right-0 z-50 glass-header">
                 <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                     <a href="#" onClick={(e) => {e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'})}} aria-label="Home">
                        <LogoIcon className="h-8 w-auto text-slate-900" />
                    </a>
                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                         <NavLinks />
                         {currentUser ? (
                             <div className="relative group">
                                <button className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                                    {currentUser.email?.charAt(0).toUpperCase() || 'A'}
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block">
                                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                                        <LogOutIcon className="w-4 h-4"/> Sign Out
                                    </button>
                                </div>
                             </div>
                         ) : (
                             <button onClick={() => setAuthModalOpen(true)} className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">Sign In</button>
                         )}
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Toggle menu">
                            {isMenuOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
                        </button>
                    </div>
                </nav>
                 {/* Mobile Menu Panel */}
                 <div className={`absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="px-8 py-6">
                        <nav className="flex flex-col items-center space-y-4">
                            <NavLinks isMobile={true}/>
                             <div className="pt-6 w-full border-t border-slate-200 text-center">
                                {currentUser ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <p className="text-slate-600">{currentUser.email}</p>
                                        <button onClick={handleSignOut} className="w-full text-lg font-bold bg-slate-100 text-slate-800 px-8 py-3 rounded-lg flex items-center justify-center gap-2">
                                            <LogOutIcon className="w-5 h-5"/> Sign Out
                                        </button>
                                    </div>
                                ) : (
                                     <button onClick={() => { setIsMenuOpen(false); setAuthModalOpen(true); }} className="w-full text-lg font-bold bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors">Sign In</button>
                                )}
                            </div>
                        </nav>
                    </div>
                 </div>
            </header>

            <main>
                <section className="section-padding relative flex items-center justify-center min-h-[60vh] md:min-h-[70vh] pt-20">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="w-72 h-72 md:w-96 md:h-96 bg-slate-200 rounded-full absolute -top-20 -left-20 filter blur-3xl"></div>
                        <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-200 rounded-full absolute -bottom-20 -right-20 filter blur-3xl"></div>
                    </div>
                     <div className="relative z-10 text-center px-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Engineering <br />Digital Experiences
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A showcase of full-stack development, AI integration, and user-centric design.
                        </p>
                    </div>
                </section>
                
                <FeaturedWork />
                <TheFramework />
                <StreamingCarousel onReadInsight={setSelectedInsight} />
                <Testimonials />
                <Contact />
            </main>

            <Footer />
            <ScrollToTopButton />
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
