"use client";

import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export const ExperienceHero = ({ 
  kicker = "Model-Based Systems Engineering, Re-invented",
  title = "Systems Engineering\nfor Innovators.",
  description = "Production-ready SysML v2 Language Server, completely free for individuals. Everything you need to build the future, faster.",
  ctaText = "Get Early Access",
  ctaLink = "/contact",
  stats = [
    { id: "001", title: "AVAILABILITY", val: "Open", type: "progress" },
    { id: "002", title: "STUDIO STATS", val: "20+ Wins", type: "data" },
    { id: "003", title: "EXPERTISE", val: "Creative Dev", type: "text" }
  ]
}) => {
  const containerRef = useRef(null);
  const revealRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(revealRef.current, 
        { filter: "blur(30px)", opacity: 0, scale: 1.02 },
        { filter: "blur(0px)", opacity: 1, scale: 1, duration: 2.2, ease: "expo.out", clearProps: "filter,scale" }
      );
      
      gsap.from(".command-cell", {
        x: 60, opacity: 0, stagger: 0.1, duration: 1.5, ease: "power4.out", delay: 1, clearProps: "all"
      });

      const handleMouseMove = (e) => {
        if (!ctaRef.current) return;
        const rect = ctaRef.current.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
        if (dist < 150) {
          gsap.to(ctaRef.current, { x: (e.clientX - (rect.left + rect.width/2)) * 0.4, y: (e.clientY - (rect.top + rect.height/2)) * 0.4, duration: 0.6 });
        } else {
          gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full bg-[#020202] flex flex-col selection:bg-white selection:text-black" style={{ fontFamily: "'Lexend Exa', system-ui, -apple-system, 'Segoe UI', 'Roboto', sans-serif", overflowX: 'hidden' }}>
      {/* Laptop background image - only visible within hero section */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/laptop.webp')" }}
      />

      <div ref={revealRef} className="relative z-[10] w-full flex flex-col md:flex-row p-8 md:p-14 lg:p-20 min-h-screen items-center md:items-stretch gap-8 md:gap-12" style={{ willChange: 'auto' }}>
        <div className="flex-1 min-w-0 flex flex-col justify-between pb-12 md:pb-8 w-full">
          <div className="flex items-center gap-3">
             <div className="relative w-2.5 h-2.5 bg-white rounded-full">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
             </div>
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif", color: '#00B4D8' }}>SYSNEX.TECHNOLOGIES</span>
          </div>

          <div className="max-w-3xl lg:-translate-y-8 pr-8" style={{ position: 'relative', zIndex: 11 }}>
            <h1 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[1.2] tracking-tighter uppercase italic-none whitespace-pre-line" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif", position: 'relative', zIndex: 12, color: '#00B4D8' }}>
              {title.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] max-w-sm leading-relaxed" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif", position: 'relative', zIndex: 12, color: 'rgba(255, 255, 255, 0.8)' }}>
              {description}
            </p>
          </div>
          
          <div ref={ctaRef} className="w-fit lg:-translate-y-20">
            <Link to={ctaLink} className="flex items-center gap-6 group">
               <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white transition-all duration-500 overflow-hidden">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:stroke-black stroke-white transition-colors duration-500">
                    <path d="M7 17L17 7M17 7H8M17 7V16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif", color: '#00B4D8' }}>{ctaText}</span>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col gap-4 justify-center" style={{ position: 'relative', zIndex: 11 }}>
          {stats.map((item) => (
            <div key={item.id} className="command-cell glass-panel p-6 sm:p-7 block opacity-100">
              <span className="text-[10px] uppercase tracking-widest block mb-3 font-semibold" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif", color: '#00B4D8' }}>{item.id} // {item.title}</span>
              {item.type === "progress" ? (
                <div className="flex justify-between items-end mt-2">
                  <h4 className="text-lg sm:text-xl font-bold tracking-tighter" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif", color: '#FBBF24' }}>{item.val}</h4>
                  <div className="h-[2px] w-20 bg-white/20 rounded-full overflow-hidden">
                     <div className="h-full w-[60%] animate-loading" style={{ backgroundColor: '#00B4D8' }} />
                  </div>
                </div>
              ) : item.type === "data" ? (
                <div className="mt-4 flex flex-col gap-3">
                  {item.data ? (
                    item.data.map((dataItem, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex justify-between text-[11px] font-medium" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif" }}>
                          <span style={{ color: '#FBBF24' }}>{dataItem.label}</span>
                          <span className="font-semibold" style={{ color: '#FBBF24' }}>{dataItem.value}</span>
                        </div>
                        {idx < item.data.length - 1 && (
                          <div className="h-[1px] w-full bg-white/30" />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <div className="flex justify-between text-[11px] font-medium" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif" }}>
                        <span style={{ color: '#FBBF24' }}>VS Code Extension</span>
                        <span className="font-semibold" style={{ color: '#FBBF24' }}>Available</span>
                      </div>
                      <div className="h-[1px] w-full bg-white/30" />
                      <div className="flex justify-between text-[11px] font-medium" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif" }}>
                        <span style={{ color: '#FBBF24' }}>NexSuite by SysNex</span>
                        <span className="font-semibold" style={{ color: '#FBBF24' }}>Coming Soon</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <h3 className="text-xs font-medium mt-3 leading-snug" style={{ fontFamily: "'Lexend Exa', system-ui, sans-serif", color: '#FBBF24' }}>
                  {item.val}
                </h3>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
