
"use client";

import { useEffect, useState, useRef } from "react";
import { getPortfolio } from "@/lib/api";

const PROFILE_ID = process.env.NEXT_PUBLIC_PROFILE_ID!;

function useScramble(text: string, active: boolean) {
  const [display, setDisplay] = useState('');
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  useEffect(() => {
    if (!active || !text) return;
    let iter = 0;
    const id = setInterval(() => {
      setDisplay(text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < Math.floor(iter)) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(''));
      iter += 0.5;
      if (iter > text.length + 2) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [active, text]);
  return display || text;
}

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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      {children}
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)', transition: `opacity 0.7s ease ${index * 0.08}s, transform 0.7s ease ${index * 0.08}s` }}>
      <div onClick={() => setOpen(!open)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ borderRadius: '16px', padding: '28px 32px', cursor: 'pointer', background: open || hovered ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)', border: '1px solid', borderColor: open ? 'rgba(245,158,11,0.5)' : hovered ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', boxShadow: open ? '0 0 40px rgba(245,158,11,0.08), inset 0 0 40px rgba(245,158,11,0.02)' : hovered ? '0 0 20px rgba(245,158,11,0.05)' : 'none', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: hovered || open ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)' : 'transparent', transition: 'all 0.4s ease' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#f59e0b', opacity: 0.5, letterSpacing: '0.1em' }}>{String(index + 1).padStart(2, '0')}</span>
              {project.featured && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.12em', background: 'rgba(245,158,11,0.06)' }}>FEATURED</span>}
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', color: hovered || open ? '#faf6ee' : '#d4cfc7', margin: '0 0 8px 0', fontWeight: 700, transition: 'color 0.3s ease', letterSpacing: '-0.01em' }}>{project.title}</h3>
            {project.tagline && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: hovered || open ? 'rgba(245,158,11,0.8)' : 'rgba(245,158,11,0.5)', margin: 0, lineHeight: 1.5, transition: 'color 0.3s ease' }}>{project.tagline}</p>}
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexShrink: 0 }}>
            {project.github_url && <a href={project.github_url} target="_blank" onClick={e => e.stopPropagation()} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.05em' }} onMouseEnter={e => (e.target as HTMLElement).style.color = '#f59e0b'} onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748b'}>github ↗</a>}
            {project.live_url && <a href={project.live_url} target="_blank" onClick={e => e.stopPropagation()} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.color = '#f59e0b'} onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748b'}>live ↗</a>}
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid', borderColor: open ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: open ? '#f59e0b' : '#64748b', fontSize: '16px', fontWeight: 300, transition: 'all 0.3s ease', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>+</div>
          </div>
        </div>
        <div style={{ maxHeight: open ? '600px' : '0', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
          <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
            {project.problem && <div style={{ marginBottom: '20px' }}><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#f59e0b', letterSpacing: '0.2em', marginBottom: '10px', opacity: 0.6 }}>THE PROBLEM</p><p style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', color: '#94a3b8', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>{project.problem}</p></div>}
            {project.solution && <div style={{ marginBottom: '20px' }}><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#f59e0b', letterSpacing: '0.2em', marginBottom: '10px', opacity: 0.6 }}>THE SOLUTION</p><p style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', color: '#94a3b8', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>{project.solution}</p></div>}
            {project.architecture && <div style={{ marginBottom: '20px' }}><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#f59e0b', letterSpacing: '0.2em', marginBottom: '10px', opacity: 0.6 }}>ARCHITECTURE</p><p style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', color: '#94a3b8', lineHeight: 1.75, margin: 0, fontWeight: 400 }}>{project.architecture}</p></div>}
            {project.tech_stack?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>{project.tech_stack.map((t: string) => <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#f59e0b', background: 'rgba(245,158,11,0.08)', padding: '4px 12px', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.18)' }}>{t}</span>)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    if (!data) return;
    const els = document.querySelectorAll('a, button, [data-hover]');
    const on = () => setCursorHover(true);
    const off = () => setCursorHover(false);
    els.forEach(el => { el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off); });
    return () => els.forEach(el => { el.removeEventListener('mouseenter', on); el.removeEventListener('mouseleave', off); });
  }, [data]);

  useEffect(() => {
    document.title = 'kethan.dev';
    getPortfolio(PROFILE_ID)
      .then(d => { setData(d); setTimeout(() => setReady(true), 200); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const nameScramble = useScramble(data?.profile?.full_name || '', ready);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060608', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#f59e0b', fontSize: '13px', letterSpacing: '0.15em', opacity: 0.6 }}>initializing<span style={{ animation: 'blink 0.8s infinite' }}>_</span></span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#060608', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", color: '#ef4444', fontSize: '13px' }}>error: {error}</p>
    </div>
  );

  const { profile, projects } = data;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #060608; cursor: none; }
        * { cursor: none !important; }
        ::selection { background: rgba(245,158,11,0.25); color: #f59e0b; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #060608; }
        ::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.2); border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes auroraPulse { 0%,100%{opacity:0.4;transform:scale(1) translate(0,0)} 33%{opacity:0.6;transform:scale(1.1) translate(2%,1%)} 66%{opacity:0.3;transform:scale(0.95) translate(-1%,2%)} }
        .hero-word { opacity:0; animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
        .nav-link { font-family:'JetBrains Mono',monospace; font-size:12px; color:#52525b; text-decoration:none; letter-spacing:0.06em; transition:color 0.25s; position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:#f59e0b; transition:width 0.3s ease; }
        .nav-link:hover { color:#f59e0b; }
        .nav-link:hover::after { width:100%; }
        .btn-amber { display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#f59e0b; border:1px solid rgba(245,158,11,0.35); padding:12px 24px; border-radius:8px; text-decoration:none; transition:all 0.35s cubic-bezier(0.16,1,0.3,1); background:rgba(245,158,11,0.04); letter-spacing:0.04em; position:relative; overflow:hidden; }
        .btn-amber::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(245,158,11,0.1),transparent); transition:left 0.5s ease; }
        .btn-amber:hover { background:rgba(245,158,11,0.1); border-color:rgba(245,158,11,0.7); box-shadow:0 0 24px rgba(245,158,11,0.15); transform:translateY(-2px); }
        .btn-amber:hover::before { left:100%; }
        .btn-ghost { display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#52525b; border:1px solid rgba(255,255,255,0.08); padding:12px 24px; border-radius:8px; text-decoration:none; transition:all 0.3s ease; background:transparent; letter-spacing:0.04em; }
        .btn-ghost:hover { color:#faf6ee; border-color:rgba(255,255,255,0.2); transform:translateY(-2px); }
        .skill-tag { font-family:'JetBrains Mono',monospace; font-size:12px; color:#52525b; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); padding:8px 16px; border-radius:8px; transition:all 0.3s ease; cursor:default; letter-spacing:0.03em; display:inline-block; }
        .skill-tag:hover { color:#f59e0b; background:rgba(245,158,11,0.06); border-color:rgba(245,158,11,0.25); transform:translateY(-2px); box-shadow:0 4px 16px rgba(245,158,11,0.08); }
      `}</style>

      {/* Custom cursor */}
      <div style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', left: cursor.x, top: cursor.y, transform: 'translate(-50%,-50%)' }}>
        <div style={{ width: cursorHover ? '40px' : '28px', height: cursorHover ? '40px' : '28px', border: `1px solid rgba(245,158,11,${cursorHover ? 0.6 : 0.35})`, borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: cursorHover ? '0 0 16px rgba(245,158,11,0.3)' : 'none' }} />
        <div style={{ width: '4px', height: '4px', background: '#f59e0b', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', boxShadow: '0 0 8px rgba(245,158,11,0.8)' }} />
      </div>

      <div style={{ background: '#060608', minHeight: '100vh', color: '#faf6ee', position: 'relative', overflow: 'hidden' }}>

        {/* Aurora blobs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: '600px', height: '600px', top: '-100px', right: '-100px', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', animation: 'auroraPulse 8s ease-in-out infinite', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', width: '400px', height: '400px', bottom: '20%', left: '-100px', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)', animation: 'auroraPulse 12s ease-in-out infinite 4s', borderRadius: '50%' }} />
        </div>

        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(6,6,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', color: '#faf6ee', fontWeight: 700, letterSpacing: '-0.01em' }}>kethan<span style={{ color: '#f59e0b' }}>.dev</span></span>
          <div style={{ display: 'flex', gap: '36px' }}>
            <a href="#projects" className="nav-link">projects</a>
            <a href="#skills" className="nav-link">skills</a>
            <a href="#contact" className="nav-link">contact</a>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 48px 80px', maxWidth: '1120px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="hero-word" style={{ animationDelay: '0.1s', marginBottom: '18px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#f59e0b', letterSpacing: '0.2em', opacity: 0.7 }}>AI Engineer · ML Platform · Systems</span>
          </div>
          <div className="hero-word" style={{ animationDelay: '0.25s', marginBottom: '28px' }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(56px,9vw,104px)', lineHeight: 0.95, fontWeight: 800, color: '#faf6ee', letterSpacing: '-0.03em' }}>
              {nameScramble}<span style={{ color: '#f59e0b', animation: 'blink 1.2s infinite', fontWeight: 300 }}>_</span>
            </h1>
          </div>
          <div className="hero-word" style={{ animationDelay: '0.4s', maxWidth: '520px', marginBottom: '36px' }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '17px', color: '#64748b', lineHeight: 1.75, fontWeight: 400 }}>{profile.tagline || profile.summary}</p>
          </div>
          {profile.open_to?.length > 0 && (
            <div className="hero-word" style={{ animationDelay: '0.5s', display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '44px' }}>
              {profile.open_to.map((item: string) => (
                <span key={item} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', padding: '5px 14px', borderRadius: '20px', background: 'rgba(245,158,11,0.05)', letterSpacing: '0.04em' }}>{item}</span>
              ))}
            </div>
          )}
          <div className="hero-word" style={{ animationDelay: '0.62s', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {profile.github_url && <a href={profile.github_url} target="_blank" className="btn-amber">github ↗</a>}
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" className="btn-ghost">linkedin ↗</a>}
          </div>
          <div style={{ position: 'absolute', bottom: '40px', left: '48px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.35 }}>
            <div style={{ width: '1px', height: '52px', background: 'linear-gradient(to bottom, transparent, #f59e0b)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#f59e0b', letterSpacing: '0.2em', writingMode: 'vertical-rl', textTransform: 'uppercase' }}>scroll</span>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ maxWidth: '1120px', margin: '0 auto', padding: '80px 48px', position: 'relative', zIndex: 1 }}>
          <AnimSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(245,158,11,0.4)', letterSpacing: '0.1em' }}>01.</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,40px)', color: '#faf6ee', fontWeight: 700, letterSpacing: '-0.02em' }}>Projects</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(245,158,11,0.15), transparent)', marginLeft: '8px' }} />
            </div>
          </AnimSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {projects?.map((p: any, i: number) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ maxWidth: '1120px', margin: '0 auto', padding: '80px 48px', position: 'relative', zIndex: 1 }}>
          <AnimSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(245,158,11,0.4)', letterSpacing: '0.1em' }}>02.</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,40px)', color: '#faf6ee', fontWeight: 700, letterSpacing: '-0.02em' }}>Skills</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(245,158,11,0.15), transparent)', marginLeft: '8px' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {profile.skills?.map((s: string) => <span key={s} className="skill-tag">{s}</span>)}
            </div>
          </AnimSection>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ maxWidth: '1120px', margin: '0 auto', padding: '80px 48px 140px', position: 'relative', zIndex: 1 }}>
          <AnimSection>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(245,158,11,0.4)', letterSpacing: '0.1em' }}>03.</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px,4vw,40px)', color: '#faf6ee', fontWeight: 700, letterSpacing: '-0.02em' }}>Contact</h2>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(245,158,11,0.15), transparent)', marginLeft: '8px' }} />
            </div>
            <div style={{ maxWidth: '520px' }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', color: '#64748b', lineHeight: 1.8, marginBottom: '40px', fontWeight: 400 }}>
                Open to AI Engineering and ML Platform roles. I build systems that ship, scale, and stay observable.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'flex-start' }}>
                <a href={`mailto:${profile.email}`} className="btn-amber">{profile.email} ↗</a>
                {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" className="btn-ghost">LinkedIn ↗</a>}
                {profile.github_url && <a href={profile.github_url} target="_blank" className="btn-ghost">GitHub ↗</a>}
              </div>
              {profile.location && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#2a2a2e', marginTop: '28px', letterSpacing: '0.08em' }}>{profile.location}</p>}
            </div>
          </AnimSection>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#1e1e24', letterSpacing: '0.05em' }}>fastapi · next.js · supabase</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#1e1e24', letterSpacing: '0.05em' }}>© 2026 kethan.dev</span>
        </footer>
      </div>
    </>
  );
}
