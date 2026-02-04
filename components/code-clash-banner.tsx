import React from 'react';

interface CodeClashBannerProps {
    subtitle?: string;
    showSubtitle?: boolean;
    fullHeight?: boolean;
    className?: string;
}

export default function CodeClashBanner({
    subtitle = "Ultimate Coding Competition",
    showSubtitle = false,
    fullHeight = false,
    className = ""
}: CodeClashBannerProps) {
    return (
        <>
            <div className={`relative w-full ${fullHeight ? 'min-h-screen' : 'min-h-[400px]'} flex items-center justify-center overflow-hidden bg-gradient-radial from-[#FFDA6B] via-[#F29416] via-[#CA6A06] to-[#8F4508] ${className}`}>
                {/* Animated texture overlay */}
                <div className="absolute inset-0 opacity-30 mix-blend-multiply animate-texture-spin" style={{
                    backgroundImage: `
            repeating-radial-gradient(
              circle at 30% 30%,
              transparent 0,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 3px
            )
          `
                }} />

                {/* Sunburst rays */}
                <div className="absolute inset-0 animate-ray-rotate" style={{
                    background: `repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(255, 242, 166, 0.15) 0deg,
            transparent 2deg,
            transparent 4deg,
            rgba(255, 242, 166, 0.2) 5deg,
            transparent 6deg
          )`
                }} />

                {/* Center glow */}
                <div className="absolute inset-0 bg-gradient-radial from-[rgba(255,242,166,0.4)] via-[rgba(242,148,22,0.15)] to-transparent" />

                {/* Content */}
                <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
                    <h1 className="code-clash-comic-title">
                        CODE CLASH
                    </h1>
                    {showSubtitle && (
                        <p className="mt-6 text-xl sm:text-2xl lg:text-3xl font-bold tracking-[0.15em] uppercase text-[#FFF2A6] comic-subtitle">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Anton&display=swap');

        .code-clash-comic-title {
          font-family: 'Bangers', 'Anton', 'Impact', cursive;
          font-size: clamp(3rem, 15vw, 12rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          line-height: 0.85;
          text-align: center;
          margin: 0;
          padding: 0;
          
          /* Golden gradient */
          background: linear-gradient(
            180deg,
            #FFF2A6 0%,
            #FFE77A 20%,
            #F2C94C 55%,
            #E0A82E 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          
          /* Dark brown stroke */
          -webkit-text-stroke: 4px #3D2817;
          paint-order: stroke fill;
          
          /* Multiple layered shadows for 3D depth */
          filter: drop-shadow(0 0 25px rgba(255, 242, 166, 0.6));
          text-shadow:
            3px 3px 0 #3D2817,
            6px 6px 0 #2A1810,
            9px 9px 0 #1A0F08,
            12px 12px 0 #0D0805,
            15px 15px 25px rgba(0, 0, 0, 0.8),
            0 0 40px rgba(242, 148, 22, 0.6),
            0 0 80px rgba(202, 106, 6, 0.4);
          
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: default;
          user-select: none;
          transform-origin: center;
        }

        .code-clash-comic-title:hover {
          transform: scale(1.02) translateY(-4px) rotate(-0.5deg);
          filter: 
            drop-shadow(0 0 35px rgba(255, 242, 166, 0.9))
            drop-shadow(0 0 70px rgba(242, 148, 22, 0.7))
            drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5));
          text-shadow:
            4px 4px 0 #3D2817,
            8px 8px 0 #2A1810,
            12px 12px 0 #1A0F08,
            16px 16px 0 #0D0805,
            20px 20px 35px rgba(0, 0, 0, 0.9),
            0 0 50px rgba(242, 148, 22, 0.8),
            0 0 100px rgba(202, 106, 6, 0.6);
        }

        .comic-subtitle {
          text-shadow:
            2px 2px 0 #3D2817,
            4px 4px 0 #2A1810,
            6px 6px 15px rgba(0, 0, 0, 0.8);
          -webkit-text-stroke: 1.5px #3D2817;
          paint-order: stroke fill;
          filter: drop-shadow(0 0 20px rgba(255, 242, 166, 0.4));
        }

        @keyframes texture-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ray-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-texture-spin {
          animation: texture-spin 120s linear infinite;
        }

        .animate-ray-rotate {
          animation: ray-rotate 60s linear infinite;
        }

        /* Tablet adjustments */
        @media (max-width: 1024px) {
          .code-clash-comic-title {
            -webkit-text-stroke: 3px #3D2817;
            text-shadow:
              2px 2px 0 #3D2817,
              4px 4px 0 #2A1810,
              6px 6px 0 #1A0F08,
              8px 8px 0 #0D0805,
              10px 10px 18px rgba(0, 0, 0, 0.7),
              0 0 30px rgba(242, 148, 22, 0.5);
          }
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
          .code-clash-comic-title {
            -webkit-text-stroke: 2.5px #3D2817;
            letter-spacing: 0.06em;
            text-shadow:
              2px 2px 0 #3D2817,
              4px 4px 0 #2A1810,
              6px 6px 0 #1A0F08,
              8px 8px 12px rgba(0, 0, 0, 0.6),
              0 0 25px rgba(242, 148, 22, 0.4);
          }
        }

        /* Retina displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .code-clash-comic-title {
            -webkit-text-stroke: 5px #3D2817;
          }
        }
      `}</style>
        </>
    );
}
