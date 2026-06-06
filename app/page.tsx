"use client";
import { useEffect, useState, useRef } from "react";
import { getPortfolio } from "@/lib/api";

const PROFILE_ID = process.env.NEXT_PUBLIC_PROFILE_ID!;

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function AnimSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const [open, setOpen] = useState(false);
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s` }}>
      <div onClick={() => setOpen(!open)} style={{ border: '1px solid', borderColor: open ? '#64ffda' : '#1e2a2a', borderRadius: '12px', padding: '28px', cursor: 'pointer', background: open ? 'rgba(100,255,218,0.03)' : 'rgba(255,255,255,0.02)', transition: 'all 0.3s ease', boxShadow: open ? '0 0 30px rgba(100,255,218,0.08)' : 'none' }}
        onMouseEnter={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = '#2a3f3f'; }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = '#1e2a2a'; }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#64ffda', letterSpacing: '0.1em' }}>0{index + 1}</span>
              {project.featured && <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '10px', color: '#64ffda', border: '1px solid #64ffda', padding: '1px 8px', borderRadius: '20px', opacity: 0.7 }}>FEATURED</span>}
            </div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '22px', color: '#e8e4d9', margin: '0 0 6px 0', fontWeight: 400 }}>{project.title}</h3>
            {project.tagline && <p style={{ fontFamily: "'Fira Code', monospace", fontSize: '12px', color: '#64ffda', margin: 0, opacity: 0.8 }}>{project.tagline}</p>}
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '16px' }}>
            {project.github_url && <a href={project.github_url} target="_blank" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#8892b0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.color = '#64ffda'} onMouseLeave={e => (e.target as HTMLElement).style.color = '#8892b0'}>github ↗</a>}
            {project.live_url && <a href={project.live_url} target="_blank" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#8892b0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.color = '#64ffda'} onMouseLeave={e => (e.target as HTMLElement).style.color = '#8892b0'}>live ↗</a>}
            <span style={{ color: '#64ffda', fontSize: '18px', transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
          </div>
        </div>

        {open && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #1e2a2a', paddingTop: '24px' }}>
            {project.problem && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontFamily: "'Fira Code', monospace", fontSize: '10px', color: '#64ffda', letterSpacing: '0.15em', marginBottom: '8px', opacity: 0.6 }}>THE PROBLEM</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#a8b2c1', lineHeight: 1.7, margin: 0 }}>{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontFamily: "'Fira Code', monospace", fontSize: '10px', color: '#64ffda', letterSpacing: '0.15em', marginBottom: '8px', opacity: 0.6 }}>THE SOLUTION</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#a8b2c1', lineHeight: 1.7, margin: 0 }}>{project.solution}</p>
              </div>
            )}
            {project.architecture && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontFamily: "'Fira Code', monospace", fontSize: '10px', color: '#64ffda', letterSpacing: '0.15em', marginBottom: '8px', opacity: 0.6 }}>ARCHITECTURE</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', color: '#a8b2c1', lineHeight: 1.7, margin: 0 }}>{project.architecture}</p>
              </div>
            )}
            {project.tech_stack?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {project.tech_stack.map((t: string) => (
                  <span key={t} style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#64ffda', background: 'rgba(100,255,218,0.08)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(100,255,218,0.15)' }}>{t}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPortfolio(PROFILE_ID)
      .then(d => { setData(d); setTimeout(() => setLoaded(true), 100); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Fira Code', monospace", color: '#64ffda', fontSize: '13px', letterSpacing: '0.1em' }}>
        <span style={{ animation: 'pulse 1.5s infinite' }}>initializing_</span>
      </div>
    </main>
  );

  if (error) return (
    <main style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: "'Fira Code', monospace", color: '#ff6b6b', fontSize: '13px' }}>error: {error}</p>
    </main>
  );

  const { profile, projects } = data;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fira+Code:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050505; }
        ::selection { background: rgba(100,255,218,0.2); color: #64ffda; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #1e2a2a; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes glow { 0%,100% { text-shadow: 0 0 20px rgba(100,255,218,0.3); } 50% { text-shadow: 0 0 40px rgba(100,255,218,0.6), 0 0 80px rgba(100,255,218,0.2); } }
        .nav-link { font-family: 'Fira Code', monospace; font-size: 12px; color: #8892b0; text-decoration: none; letter-spacing: 0.05em; transition: color 0.2s; }
        .nav-link:hover { color: #64ffda; }
        .hero-line { opacity: 0; animation: fadeUp 0.8s ease forwards; }
        .btn-primary { display:inline-flex; align-items:center; gap:8px; font-family:'Fira Code',monospace; font-size:13px; color:#64ffda; border:1px solid rgba(100,255,218,0.4); padding:12px 24px; border-radius:4px; text-decoration:none; transition:all 0.3s; background:rgba(100,255,218,0.03); }
        .btn-primary:hover { background:rgba(100,255,218,0.1); border-color:#64ffda; box-shadow:0 0 20px rgba(100,255,218,0.15); }
        .btn-secondary { display:inline-flex; align-items:center; gap:8px; font-family:'Fira Code',monospace; font-size:13px; color:#8892b0; border:1px solid #1e2a2a; padding:12px 24px; border-radius:4px; text-decoration:none; transition:all 0.3s; }
        .btn-secondary:hover { color:#e8e4d9; border-color:#2a3f3f; }
        .skill-tag { font-family:'Fira Code',monospace; font-size:12px; color:#8892b0; background:rgba(255,255,255,0.03); border:1px solid #1a1a1a; padding:6px 14px; border-radius:4px; transition:all 0.2s; cursor:default; }
        .skill-tag:hover { color:#64ffda; border-color:rgba(100,255,218,0.3); background:rgba(100,255,218,0.05); }
        .dot-grid { background-image: radial-gradient(circle, #1a2a2a 1px, transparent 1px); background-size: 40px 40px; }
      `}</style>

      <div style={{ background: '#050505', minHeight: '100vh', color: '#e8e4d9' }}>

        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #0d1a1a' }}>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '13px', color: '#64ffda', letterSpacing: '0.05em' }}>kethan.dev</span>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#projects" className="nav-link">projects</a>
            <a href="#skills" className="nav-link">skills</a>
            <a href="#contact" className="nav-link">contact</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="dot-grid" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 48px 80px', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          <div className="hero-line" style={{ animationDelay: '0.1s', marginBottom: '16px' }}>
            <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '13px', color: '#64ffda', letterSpacing: '0.15em' }}>{profile.role || 'AI Systems Engineer • Backend Developer'}</span>
          </div>
          <div className="hero-line" style={{ animationDelay: '0.25s', marginBottom: '24px' }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(52px, 8vw, 96px)', lineHeight: 1.0, fontWeight: 400, color: '#e8e4d9', letterSpacing: '-0.02em' }}>
              {profile.full_name}
              <span style={{ color: '#64ffda', animation: 'blink 1.2s infinite' }}>.</span>
            </h1>
          </div>
          <div className="hero-line" style={{ animationDelay: '0.4s', maxWidth: '560px', marginBottom: '32px' }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', color: '#8892b0', lineHeight: 1.7, fontWeight: 300 }}>{profile.tagline || profile.summary}</p>
          </div>
          {profile.open_to?.length > 0 && (
            <div className="hero-line" style={{ animationDelay: '0.5s', display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
              {profile.open_to.map((item: string) => (
                <span key={item} style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#64ffda', border: '1px solid rgba(100,255,218,0.25)', padding: '4px 12px', borderRadius: '20px', background: 'rgba(100,255,218,0.05)' }}>{item}</span>
              ))}
            </div>
          )}
          <div className="hero-line" style={{ animationDelay: '0.6s', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {profile.github_url && <a href={profile.github_url} target="_blank" className="btn-primary">github ↗</a>}
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" className="btn-secondary">linkedin ↗</a>}
          </div>
          <div style={{ position: 'absolute', bottom: '40px', left: '48px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, transparent, #64ffda)' }}></div>
            <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '10px', color: '#3a4a4a', letterSpacing: '0.1em', writingMode: 'vertical-rl' }}>scroll</span>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 48px' }}>
          <AnimSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#64ffda', opacity: 0.6 }}>02.</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '36px', color: '#e8e4d9', fontWeight: 400 }}>Projects</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #1e2a2a, transparent)', marginLeft: '8px' }}></div>
            </div>
          </AnimSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects?.map((p: any, i: number) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 48px' }}>
          <AnimSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#64ffda', opacity: 0.6 }}>03.</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '36px', color: '#e8e4d9', fontWeight: 400 }}>Skills</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #1e2a2a, transparent)', marginLeft: '8px' }}></div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {profile.skills?.map((s: string) => <span key={s} className="skill-tag">{s}</span>)}
            </div>
          </AnimSection>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 48px 120px' }}>
          <AnimSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
              <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#64ffda', opacity: 0.6 }}>04.</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '36px', color: '#e8e4d9', fontWeight: 400 }}>Contact</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #1e2a2a, transparent)', marginLeft: '8px' }}></div>
            </div>
            <div style={{ maxWidth: '480px' }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: '#8892b0', lineHeight: 1.7, marginBottom: '32px' }}>
                Open to AI/ML and Backend Engineering roles. Let&apos;s build something real.
              </p>
              <a href={`mailto:${profile.email}`} className="btn-primary" style={{ marginBottom: '16px', display: 'inline-flex' }}>{profile.email} ↗</a>
              {profile.location && <p style={{ fontFamily: "'Fira Code', monospace", fontSize: '12px', color: '#3a4a4a', marginTop: '16px' }}>{profile.location}</p>}
            </div>
          </AnimSection>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #0d1a1a', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#2a3a3a' }}>built with FastAPI + Next.js</span>
          <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '11px', color: '#2a3a3a' }}>© 2026 {profile.full_name}</span>
        </footer>
      </div>
    </>
  );
}
