import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signInAnonymously,
    signInWithCustomToken
} from 'firebase/auth';

// --- Firebase Configuration ---
// This will be populated by the environment variable in production.
const firebaseConfig = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config)
    : {
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                setLoading(false);
            } else {
                 // Handle initial sign-in if no user is found
                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Initial sign-in failed:", error);
                    setLoading(false); // Ensure loading completes even on error
                }
            }
        });
        return unsubscribe;
    }, []);

    const value = { currentUser, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


// --- Foundational Styles & Fonts (Apple Design-Inspired) ---
const GlobalStyles = () => (
    <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
            :root {
                --c-background: #f9f9f9;
                --c-surface: #FFFFFF;
                --c-text-primary: #1d1d1f;
                --c-text-secondary: #6e6e73;
                --c-border: #d2d2d7;
                --c-accent: #007aff;
                --c-accent-light: #f5f5f7;
            }

            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
                color: var(--c-text-primary); 
                -webkit-font-smoothing: antialiased; 
                -moz-osx-font-smoothing: grayscale; 
                scroll-behavior: smooth;
                background-color: var(--c-background);
                overflow-x: hidden;
            }

            .background-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                overflow: hidden;
            }

            .light-orb {
                position: absolute;
                border-radius: 50%;
                filter: blur(150px);
                opacity: 0.08;
                will-change: transform;
            }

            @keyframes move-orb-1 {
                0% { transform: translate(10vw, -20vh) scale(1); }
                50% { transform: translate(70vw, 50vh) scale(1.3); }
                100% { transform: translate(10vw, -20vh) scale(1); }
            }
            @keyframes move-orb-2 {
                0% { transform: translate(80vw, 30vh) scale(1.2); }
                50% { transform: translate(20vw, 80vh) scale(0.9); }
                100% { transform: translate(80vw, 30vh) scale(1.2); }
            }
            @keyframes move-orb-3 {
                0% { transform: translate(40vw, 100vh) scale(1.1); }
                50% { transform: translate(90vw, 10vh) scale(1.2); }
                100% { transform: translate(40vw, 100vh) scale(1.1); }
            }

            .light-orb-1 { width: 700px; height: 700px; background-color: #647eff; animation: move-orb-1 70s linear infinite; }
            .light-orb-2 { width: 800px; height: 800px; background-color: #ff7f50; animation: move-orb-2 80s linear infinite; }
            .light-orb-3 { width: 650px; height: 650px; background-color: #50c878; animation: move-orb-3 75s linear infinite; }

            .glass-header { 
                background-color: rgba(251, 251, 251, 0.8); 
                backdrop-filter: saturate(180%) blur(20px);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                border-bottom: 1px solid rgba(0, 0, 0, 0.07);
            }
            .section-padding { padding-top: 7rem; padding-bottom: 7rem; }
            @media (min-width: 1024px) { .section-padding { padding-top: 9rem; padding-bottom: 9rem; } }
            
            .modal-overlay { 
                position: fixed; inset: 0; 
                background-color: rgba(0,0,0,0.4); 
                display: flex; align-items: center; justify-content: center; 
                z-index: 1000; opacity: 0; 
                transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                pointer-events: none; padding: 1rem;
            }
            .modal-overlay.visible { opacity: 1; pointer-events: auto; }
            .modal-content { 
                background: var(--c-surface); 
                border-radius: 1.25rem; 
                padding: 1.5rem; width: 100%; 
                transform: translateY(20px) scale(0.98); 
                transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); 
                max-height: 90vh; overflow-y: auto;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            }
            @media (min-width: 640px) { .modal-content { padding: 2rem; } }
            .modal-overlay.visible .modal-content { transform: translateY(0) scale(1); }
            
            #page-wrapper { transition: filter 0.4s ease, transform 0.4s ease; }
            body.modal-open #page-wrapper { filter: blur(8px); transform: scale(0.99); }
            
            .framework-item {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
            }
            .framework-item.is-visible {
                opacity: 1;
                transform: translateY(0);
            }
            .framework-card {
                background-color: var(--c-surface);
                border: 1px solid var(--c-border);
                transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1);
                border-radius: 1.5rem;
                box-shadow: 0 10px 30px -15px rgba(0,0,0,0.1);
            }
            .framework-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
            }
            .timeline-dot {
                background-color: var(--c-surface);
                border: 2px solid var(--c-border);
                color: var(--c-text-secondary);
                font-weight: 600;
                transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
                transform: scale(1);
            }
            .framework-item.is-visible .timeline-dot {
                background-color: var(--c-text-primary);
                border-color: var(--c-text-primary);
                color: white;
                transform: scale(1.1);
                box-shadow: 0 0 0 6px rgba(29, 29, 31, 0.1);
            }
            .icon-container {
                background: linear-gradient(145deg, #ffffff, #e6e6e6);
                box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.03);
            }
            
            /* --- Loading Spinner --- */
            .loading-overlay {
                position: fixed;
                inset: 0;
                background-color: var(--c-background);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            .spinner {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: 6px solid var(--c-border);
                border-top-color: var(--c-text-primary);
                animation: spin 0.8s linear infinite;
            }
        `}</style>
    </>
);

// --- Global Components ---
const LoadingSpinner = () => (
    <div className="loading-overlay">
        <div className="spinner" aria-label="Loading content"></div>
    </div>
);

const BackgroundEffects = () => (
    <div className="background-container">
        <div className="light-orb light-orb-1"></div>
        <div className="light-orb light-orb-2"></div>
        <div className="light-orb light-orb-3"></div>
    </div>
);

const developerName = "Robert McQva";
const LogoIcon = ({ className }) => (<svg className={className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 26V6H15.5C18.5376 6 21 8.46243 21 11.5V11.5C21 14.5376 18.5376 17 15.5 17H11.5L16.5 26H8Z" fill="currentColor"/><path d="M15 6L24 6L20 17L24 26H15L11.5 17L15 6Z" fill="currentColor" fillOpacity="0.7"/></svg>);
const GithubIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1 1.2-10.8 1-10.8 1-8.8 1-14.4-7.4-14.4-7.4 3.8-1 7.4 1.8 7.4 1.8-3.4-.6-6.1-4.9-6.1-4.9 1.4 2.3 4.9 4.3 6.1 4.3-1.4-1.8-1.4-4.2-1.4-4.2 3.8 4.9 9.3 6.1 9.3 6.1Z"/></svg>;
const ChevronLeftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRightIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const ChevronUpIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"></polyline></svg>;
const XIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const DownloadIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const LogOutIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const MenuIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const InfoIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;

// --- Icons for Framework Section ---
const CompassIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const FrameworkLayersIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const FrameworkCodeIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const FrameworkCloudUploadIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="22"></line></svg>;
const FrameworkSyncIcon = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M16 4v4h4"/></svg>;


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
    };

    const handleAppleSignIn = async () => {
        setError('');
        try {
            const provider = new OAuthProvider('apple.com');
            await signInWithPopup(auth, provider);
            onClose();
        } catch(err) { setError(err.message); }
    }

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}>
            <div className="modal-content max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold tracking-tighter">{isLoginView ? 'Sign In' : 'Create Account'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100" aria-label="Close modal"><XIcon className="w-6 h-6 text-slate-500"/></button>
                </div>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleAuthAction} className="space-y-4">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"/>
                    <button type="submit" className="w-full text-lg font-bold bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors">{isLoginView ? 'Sign In' : 'Sign Up'}</button>
                </form>
                <div className="flex items-center my-4"><hr className="flex-grow border-slate-200"/><span className="px-2 text-slate-500 text-sm">OR</span><hr className="flex-grow border-slate-200"/></div>
                <div className="space-y-3">
                    <button onClick={handleAppleSignIn} aria-label="Sign in with Apple" className="w-full flex items-center justify-center gap-2 py-3 border bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M8.28,1.5c-0.68,0-1.4,0.42-1.85,1.11c-0.49,0.75-1.2,2.06-0.68,3.25c0.63,1.44,1.88,1.91,2.53,1.91c0.64,0,1.33-0.43,1.85-1.12c0.54-0.75,0.83-1.94,0.29-3.13C10.05,1.93,9.03,1.5,8.28,1.5z M9.73,10.33c-0.23,0.67-0.6,1.25-1.07,1.72c-0.53,0.54-1.05,1.13-1.81,1.13c-0.75,0-1.22-0.54-1.85-0.54c-0.64,0-1.25,0.53-1.87,0.53c-0.7,0-1.32-0.52-1.74-1.2c-0.84-1.38-0.6-3.88,0.89-5.32c0.6-0.56,1.29-0.9,2.09-0.9c0.72,0,1.27,0.48,1.81,0.48c0.53,0,1.21-0.51,1.95-0.51c0.81,0,1.38,0.4,1.81,0.85c-1.17,0.71-1.84,2.05-1.41,3.48V10.33z"></path></svg>
                        Sign in with Apple
                    </button>
                     <button onClick={handleGoogleSignIn} aria-label="Sign in with Google" className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.012 36.49 44 31.134 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                        Sign in with Google
                    </button>
                </div>
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
                        <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tighter text-slate-900">
                            Driven by a passion for solving complex problems.
                        </h2>
                        <p className="mt-6 text-base md:text-lg text-slate-600">
                            As a senior software engineer, I thrive on architecting and building robust, scalable applications that bridge the gap between user needs and business goals. My expertise spans the full stack, with a deep interest in leveraging AI and modern frameworks to create impactful, intuitive digital products.
                        </p>
                        <div className="mt-8">
                            <a 
                                href="/Robert_McQva_Resume.pdf" 
                                download 
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base md:text-lg transition-colors ${currentUser && !currentUser.isAnonymous ? 'bg-slate-900 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                                onClick={(e) => (!currentUser || currentUser.isAnonymous) && e.preventDefault()}
                                title={(!currentUser || currentUser.isAnonymous) ? "Sign in to download" : "Download Resume"}
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

const ProjectDetailModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className={`modal-overlay visible`} onClick={onClose}>
            <div className="modal-content max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end -mt-2 -mr-2">
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100" aria-label="Close project details"><XIcon className="w-6 h-6 text-slate-500"/></button>
                </div>
                <p className="font-semibold text-slate-600">{project.category}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tighter text-slate-900">{project.title}</h3>
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
    );
};

// --- Featured Work Section ---

const MobileCarouselCard = ({ project, onViewDetails }) => (
    <div className="bg-slate-100/80 backdrop-blur-sm">
        <div className="p-4">
            <div className={`relative w-full ${(project.type === 'mobile' || project.mobileDisplay === 'mobile') ? 'aspect-[9/16]' : 'aspect-video'} rounded-2xl overflow-hidden border-4 border-slate-200 shadow-lg mx-auto bg-slate-800`}>
                <iframe src={project.embedUrl} title={project.title} className="w-[calc(100%+17px)] h-full bg-white" frameBorder="0" allowFullScreen></iframe>
                <div className="absolute bottom-4 right-4 z-20">
                    <button 
                        onClick={() => onViewDetails(project)}
                        className="bg-white/80 backdrop-blur-sm text-slate-800 rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                        aria-label="View project details"
                    >
                        <InfoIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
        <div className="p-4 pt-3 text-center">
            <p className="font-semibold text-slate-600 text-sm">{project.category}</p>
            <h3 className="mt-1 text-lg font-extrabold text-slate-900 tracking-tighter">{project.title}</h3>
        </div>
    </div>
);

const DesktopContent = ({ project }) => {
    if (project.display === 'tablet') {
        return (
            <div className="relative w-full bg-slate-100 h-full">
                <div className="absolute inset-0 p-4 lg:p-8 flex justify-center items-center">
                    <div className="my-auto relative mx-auto border-gray-800 bg-gray-800 border-[16px] rounded-[2.5rem] w-full max-w-[800px] aspect-[4/3] shadow-xl">
                        <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                            <iframe src={project.embedUrl} title={project.title} className="w-[calc(100%+17px)] h-full" frameBorder="0"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (project.type === 'mobile') {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-100 p-4 md:p-8">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                        <iframe src={project.embedUrl} title={project.title} className="w-[calc(100%+17px)] h-full" frameBorder="0"></iframe>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="relative w-full bg-slate-900 h-full overflow-hidden">
            <iframe 
                title={project.title} 
                frameBorder="0" 
                allowFullScreen 
                src={project.embedUrl} 
                className="absolute top-0 left-0 w-[calc(100%+17px)] h-full bg-white"
            ></iframe>
        </div>
    );
};

const DesktopCarouselCard = ({ project, isPanelCollapsed }) => (
    <div className={`flex h-full transition-transform duration-500 ease-in-out w-full md:w-[calc(100%+350px)] ${isPanelCollapsed ? 'md:-translate-x-[350px]' : 'md:translate-x-0'}`}>
        <div className="flex-shrink-0 bg-white/30 backdrop-blur-lg w-[350px]">
            <div className="p-6 md:p-8 flex flex-col justify-between h-full w-full">
                <div>
                    <p className="font-semibold text-slate-600">{project.category}</p>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tighter text-slate-900">{project.title}</h3>
                    <p className="mt-4 text-slate-600">{project.description}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200/50">
                    <h4 className="font-semibold text-slate-800">Key Technologies</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {project.techStack.map(tech => (
                            <span key={tech} className="bg-slate-100/80 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{tech}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="relative h-full w-full">
            <DesktopContent project={project} />
        </div>
    </div>
);

const FeaturedWork = ({ onProjectSelect }) => {
    const projects = [
        { 
            type: 'mobile', 
            category: "Mental Health MVP", 
            title: "Aura Mood Tracker", 
            description: "For Aura, I was tasked with bringing a client's concept for a mental health and mood-tracking app to life. As the sole developer, I rapidly prototyped and built a functional MVP, focusing on an intuitive and calming user interface. This project showcases my ability to translate a client's vision into a tangible product, delivering a polished proof-of-concept from the ground up.", 
            embedUrl: "https://aura-three-opal.vercel.app/", 
            techStack: ['React', 'Next.js', 'GSAP', 'Tailwind'],
        },
        { 
            type: 'web', 
            mobileDisplay: 'mobile',
            category: "AI SaaS Platform", 
            title: "Artemix", 
            description: "As the sole creator of Artemix, I transformed a complex engineering challenge into a scalable, enterprise-ready SaaS application. I orchestrated every phase of the project, from initial concept and branding to the complete business and marketing strategy. My work involved architecting the full-stack application and engineering the core AI, which extracts and understands highly complex data from civil engineering drawings. The result is a robust automation tool, built on a custom data and training pipeline, that dramatically accelerates the engineering workflow.",
            embedUrl: "https://artemix.vercel.app/", 
            techStack: ['React', 'Next.js', 'FastAPI', 'Vertex AI', 'Docker', 'Vercel'],
        },
        { 
            type: 'web', 
            mobileDisplay: 'mobile',
            category: "FinTech MVP", 
            title: "Zenith Analytics", 
            description: "Zenith Analytics began with a broad client request for a 'next-gen fintech application.' Taking this high-level concept, I independently designed and developed a comprehensive MVP. The result is a clean, data-rich dashboard that provides clear financial insights, demonstrating my ability to define product features, architect a user-friendly interface, and deliver a complete solution based on a visionary idea.", 
            embedUrl: "https://zenith-sand.vercel.app/", 
            techStack: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
        },
        { 
            type: 'mobile', 
            display: 'tablet',
            category: "Cross-Platform Real Estate App", 
            title: "Real Estate Showcase", 
            description: "As the sole developer, I created this interactive real estate showcase as a comprehensive MVP. Built entirely with Flutter, the application runs seamlessly on web, Android, and iOS from a single codebase. This project highlights my expertise in cross-platform development, delivering a consistent and polished user experience designed to engage potential buyers on any device.", 
            embedUrl: "https://es1anjvcwkmz0nuetf8y.share.dreamflow.app/", 
            techStack: ['Flutter', 'Dart', 'Firebase'] 
        },
        { 
            type: '3d',
            mobileDisplay: 'mobile',
            category: "Game Asset Integration", 
            title: "Game-Ready Vehicle", 
            description: "This project was a creative partnership where my role was to bring a high-fidelity 3D model to life. While my partner focused on the asset creation in Blender, I handled all programming and animation within the Unity engine. This involved implementing realistic vehicle physics with C#, creating interactive components, and ensuring the asset was fully optimized and game-ready.", 
            embedUrl: "https://sketchfab.com/models/1b63ea01e6f443cdad5fec3d366d8cf1/embed?autostart=1&ui_theme=dark&transparent=1&ui_controls=0&ui_infos=0", 
            techStack: ['Unity', 'C#', 'Blender'],
        },
        { 
            type: 'web', 
            mobileDisplay: 'mobile',
            category: "Cross-Platform Web App", 
            title: "Live Web App", 
            description: "This project serves as a comprehensive demonstration of a modern, production-ready application. Built as a versatile MVP, it is fully responsive for the web while also running natively on iOS and Android. As the sole developer, I engineered this app to showcase a clean, seamless user experience and a robust, cross-platform architecture using a modern tech stack.", 
            embedUrl: "https://7n86c61l8bljunbuuyi9.share.dreamflow.app", 
            techStack: ['React', 'Next.js', 'Vercel'] 
        },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

    const handlePrev = () => setCurrentIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1));
    const handleNext = () => setCurrentIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1));

    const activeProject = projects[currentIndex];

    return (
        <section id="work" className="section-padding bg-transparent">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900">The Work</h2>
                     <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Curated projects showcasing unique solutions.</p>
                </div>

                <div className="grid md:min-h-[660px] relative group">
                    <button
                        onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden md:block bg-slate-900/80 backdrop-blur-sm text-white rounded-full p-2 shadow-lg hover:bg-slate-700 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        aria-label="Toggle details panel"
                    >
                        {isPanelCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
                    </button>
                    
                    <div key={currentIndex} className="carousel-item-wrapper">
                        <div className="rounded-2xl shadow-xl overflow-hidden border border-slate-200/50 h-full">
                            <div className="md:hidden">
                                <MobileCarouselCard project={activeProject} onViewDetails={onProjectSelect} />
                            </div>
                            <div className="hidden md:block h-full">
                                <DesktopCarouselCard project={activeProject} isPanelCollapsed={isPanelCollapsed} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-2 z-20">
                        <button onClick={handlePrev} className="bg-white/60 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-colors" aria-label="Previous project">
                            <ChevronLeftIcon className="w-6 h-6 text-slate-800" />
                        </button>
                        <button onClick={handleNext} className="bg-white/60 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-colors" aria-label="Next project">
                            <ChevronRightIcon className="w-6 h-6 text-slate-800" />
                        </button>
                    </div>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex justify-center items-center gap-4 mt-8">
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
            { threshold: 0.3 }
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

    return (
        <div ref={itemRef} className={`framework-item group relative flex items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
             <div className={`md:w-[calc(50%-2.5rem)] ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                 <div className="relative p-8 rounded-2xl framework-card shadow-lg">
                     <div className="relative z-10">
                         <div className="w-16 h-16 rounded-full flex items-center justify-center icon-container mb-6">
                             <step.icon className="w-8 h-8 text-slate-500" />
                         </div>
                         <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                         <p className="mt-3 text-slate-600 leading-relaxed">{step.description}</p>
                     </div>
                 </div>
             </div>
             <div className="hidden md:block w-20 h-full absolute top-0 left-1/2 -translate-x-1/2">
                 <div className="w-full h-full flex items-center justify-center">
                     <div className="timeline-dot w-10 h-10 rounded-full flex items-center justify-center text-sm">
                        0{index+1}
                     </div>
                 </div>
             </div>
        </div>
    );
};

const TheFramework = () => {
    const processSteps = [
        { 
            icon: CompassIcon, 
            title: "Discover", 
            description: "I start by deeply understanding the core problem, user needs, and business goals to ensure the project is set up for success from day one." 
        },
        { 
            icon: FrameworkLayersIcon, 
            title: "Design", 
            description: "Next, I architect a robust solution, planning everything from the user interface and experience to the underlying system and data architecture." 
        },
        { 
            icon: FrameworkCodeIcon, 
            title: "Develop", 
            description: "With a solid plan, I build, test, and iterate on the product, writing clean, efficient, and scalable code while ensuring quality at every stage." 
        },
        { 
            icon: FrameworkCloudUploadIcon, 
            title: "Deploy", 
            description: "I ensure a seamless launch by managing deployment pipelines, monitoring performance, and gathering feedback for future iterations." 
        },
        { 
            icon: FrameworkSyncIcon, 
            title: "Evolve", 
            description: "The launch is just the beginning. I monitor performance, gather user feedback, and use data-driven insights to inform the next cycle of improvements and features." 
        }
    ];

    return (
        <section id="framework" className="section-padding bg-slate-50 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                     <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">The Framework</h2>
                     <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A disciplined, end-to-end approach to building successful digital products.</p>
                </div>

                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-slate-200 hidden md:block" aria-hidden="true"></div>
                    <div className="space-y-16 md:space-y-24">
                        {processSteps.map((step, index) => (
                            <FrameworkStep key={index} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


// --- Testimonials Section ---
const Testimonials = () => {
    return (
        <section className="section-padding bg-transparent">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter text-slate-900">
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
            <section id="contact" className="section-padding bg-transparent">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                     <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900">Thank You!</h2>
                     <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Your message has been sent. I'll be in touch with you shortly.</p>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="section-padding bg-transparent">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-slate-900">Let's build something together.</h2>
                <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Have a project in mind? Let's connect.</p>

                <div className="mt-12">
                    <form onSubmit={handleSubmit} action="https://formspree.io/f/xnnvobbj" method="POST" className="space-y-6 text-left">
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input id="name" type="text" name="name" required placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-white/80 border border-slate-300/70 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email Address</label>
                            <input id="email" type="email" name="email" required placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-white/80 border border-slate-300/70 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">Message</label>
                            <textarea id="message" name="message" rows="4" required placeholder="Your message..." className="w-full px-4 py-3 rounded-lg bg-white/80 border border-slate-300/70 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition shadow-sm"></textarea>
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
        <footer className="bg-transparent">
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
    const { currentUser, loading } = useAuth();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [detailProject, setDetailProject] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            if (isMenuOpen) {
                setIsHeaderVisible(true);
                return;
            }
            if (window.scrollY > lastScrollY && window.scrollY > 80) { // Scrolling down
                setIsHeaderVisible(false);
            } else { // Scrolling up
                setIsHeaderVisible(true);
            }
            setLastScrollY(window.scrollY);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY, isMenuOpen]);


    const anyModalOpen = isAuthModalOpen || isAboutModalOpen || !!detailProject;

    useEffect(() => {
        if (anyModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [anyModalOpen]);


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    
    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setIsMenuOpen(false);
        const element = document.getElementById(targetId);
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
                <a href="#" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setAboutModalOpen(true); }} className={isMobile ? mobileClass : commonClass}>About</a>
            </>
        )
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div id="page-wrapper" className="relative z-10">
                <header className={`fixed top-0 left-0 right-0 z-50 glass-header transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                        <a href="#" onClick={(e) => {e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'})}} aria-label="Home">
                            <LogoIcon className="h-8 w-auto text-slate-900" />
                        </a>
                        <div className="hidden md:flex items-center gap-8">
                            <NavLinks />
                            {currentUser && !currentUser.isAnonymous ? (
                                <div className="relative group">
                                    <button className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center" aria-label="User menu">
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
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Toggle menu">
                                {isMenuOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
                            </button>
                        </div>
                    </nav>
                    <div className={`absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="px-8 py-6">
                            <nav className="flex flex-col items-center space-y-4">
                                <NavLinks isMobile={true}/>
                                <div className="pt-6 w-full border-t border-slate-200 text-center">
                                    {currentUser && !currentUser.isAnonymous ? (
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
                        <div className="relative z-10 text-center px-4">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-slate-900 mb-4">
                                Engineering <br />Digital Experiences
                            </h1>
                            <p className="text-xl md:text-2xl font-medium text-slate-600 tracking-wide">
                                Beyond the hype.
                            </p>
                        </div>
                    </section>
                    
                    <FeaturedWork onProjectSelect={setDetailProject} />
                    <TheFramework />
                    <Testimonials />
                    <Contact />
                </main>

                <Footer />
                <ScrollToTopButton />
            </div>

            {/* Modals are outside the page-wrapper to avoid being blurred */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setAboutModalOpen(false)} />
            <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <GlobalStyles />
            <BackgroundEffects />
            <AppContent />
        </AuthProvider>
    );
}
