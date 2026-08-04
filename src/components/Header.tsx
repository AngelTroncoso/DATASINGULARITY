import React, { useEffect, useState } from 'react';
import { Upload, Languages, Globe, User, LogOut, LogIn } from 'lucide-react';
import { EcosystemDomain } from '../types';
import { useLanguage, Language } from '../i18n';
import { auth, loginWithGoogle, logoutFirebase } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  activeDomain: EcosystemDomain;
  onSelectDomain: (domain: EcosystemDomain) => void;
  onOpenCustomModal: () => void;
  onSelectScenario: (scenarioPrompt: string) => void;
  assetsCount: number;
  averageEntropy: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeDomain,
  onSelectDomain,
  onOpenCustomModal,
  assetsCount,
  averageEntropy,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
  ];

  return (
    <header className="bg-[#0A0A0C] border-b border-white/10 text-slate-300 px-6 py-2.5 sticky top-0 z-40 flex items-center justify-between select-none">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Brand & Geometric Diamond Logo */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-sm rotate-45 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tighter text-white uppercase font-sans">
                {t.header.title}
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-sm">
                v4.0.2-OMEGA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              {t.header.subtitle}
            </p>
          </div>
        </div>

        {/* Domain Switcher, Stats & Language Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Geometric Domain Pills */}
          <div className="flex items-center bg-[#050506] p-1 rounded-sm border border-white/10 text-[11px] font-mono uppercase tracking-wider">
            <button
              onClick={() => onSelectDomain('finance')}
              className={`px-3 py-1 rounded-sm transition-all ${
                activeDomain === 'finance'
                  ? 'bg-blue-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.header.finance}
            </button>
            <button
              onClick={() => onSelectDomain('healthcare')}
              className={`px-3 py-1 rounded-sm transition-all ${
                activeDomain === 'healthcare'
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.header.healthcare}
            </button>
            <button
              onClick={() => onSelectDomain('saas')}
              className={`px-3 py-1 rounded-sm transition-all ${
                activeDomain === 'saas'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.header.saas}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 bg-[#050506] rounded-sm border border-white/10 text-[10px] font-mono tracking-widest uppercase">
            <div>
              <span className="text-slate-500">{t.header.assets}:</span>{' '}
              <span className="text-blue-400 font-bold">{assetsCount}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div>
              <span className="text-slate-500">{t.header.entropy}:</span>{' '}
              <span className={`font-bold ${averageEntropy > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {averageEntropy.toFixed(2)} bits
              </span>
            </div>
          </div>

          {/* Language Selector Button Group */}
          <div className="flex items-center bg-[#050506] p-1 rounded-sm border border-blue-500/30 text-[11px] font-mono tracking-wider">
            <div className="px-2 text-[10px] text-slate-500 uppercase flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
              <Globe className="w-3 h-3 text-blue-400" />
              <span className="hidden sm:inline">{t.header.language}:</span>
            </div>
            {languagesList.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded-sm transition-all flex items-center gap-1.5 font-bold uppercase text-[10px] ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={lang.label}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Import Button */}
          <button
            onClick={onOpenCustomModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-sm text-[11px] font-mono tracking-wider uppercase transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.header.import}</span>
          </button>

          {/* Firebase Authentication Button */}
          {user ? (
            <div className="flex items-center gap-2 bg-[#050506] p-1 border border-blue-500/30 rounded-sm text-[11px] font-mono">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span className="text-slate-200 text-[10px] hidden sm:inline max-w-[100px] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                onClick={logoutFirebase}
                className="p-1 hover:bg-rose-500/20 text-rose-400 rounded-sm transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-[11px] font-mono tracking-wider uppercase transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Firebase Login</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

