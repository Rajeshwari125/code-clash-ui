import React from 'react';

interface CodeClashHeroProps {
    subtitle?: string;
    showSubtitle?: boolean;
    className?: string;
}

export default function CodeClashHero({
    subtitle = "Ultimate Coding Competition",
    showSubtitle = false,
    className = ""
}: CodeClashHeroProps) {
    return (
        <div className={`code-clash-hero ${className}`}>
            <div className="hero-content">
                <h1 className="code-clash-title">
                    CODE CLASH
                </h1>
                {showSubtitle && (
                    <p className="hero-subtitle">{subtitle}</p>
                )}
            </div>

            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');

        .code-clash-hero {
          position: relative;
          width: 100%;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: 
            radial-gradient(ellipse at center, 
              rgba(255, 242, 166, 0.3) 0%, 
              rgba(242, 148, 22, 0.1) 40%, 
              transparent 70%
            ),
            radial-gradient(circle at center,
              #FFDA6B 0%,
              #F29416 25%,
              #CA6A06 60%,
              #8F4508 100%
            );
          overflow: hidden;
        }

        /* Animated texture overlay */
        .code-clash-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            repeating-radial-gradient(
              circle at 30% 30%,
              transparent 0,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 3px
            ),
            radial-gradient(
              circle at center,
              transparent 0%,
              rgba(0, 0, 0, 0.2) 100%
            );
          animation: textureRotate 120s linear infinite;
          pointer-events: none;
        }

        /* Sunburst rays */
        .code-clash-hero::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150%;
          height: 150%;
          transform: translate(-50%, -50%);
          background: 
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              rgba(255, 242, 166, 0.1) 0deg,
              transparent 2deg,
              transparent 4deg,
              rgba(255, 242, 166, 0.15) 5deg,
              transparent 6deg
            );
          animation: rayRotate 60s linear infinite;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2rem;
        }

        .code-clash-title {
          font-family: 'Bangers', 'Anton', 'Impact', cursive;
          font-size: clamp(3rem, 15vw, 10rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: center;
          margin: 0;
          padding: 0;
          line-height: 0.9;
          
          /* Golden gradient fill */
          background: linear-gradient(
            to bottom,
            #FFF2A6 0%,
            #FFE77A 25%,
            #F2C94C 60%,
            #E0A82E 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          
          /* Multiple text shadows for depth */
          filter: drop-shadow(0 0 20px rgba(255, 242, 166, 0.5));
          
          /* Text stroke */
          -webkit-text-stroke: 4px #3D2817;
          paint-order: stroke fill;
          
          /* 3D depth effect with multiple shadows */
          text-shadow:
            3px 3px 0 #3D2817,
            6px 6px 0 #2A1810,
            9px 9px 0 #1A0F08,
            12px 12px 20px rgba(0, 0, 0, 0.7),
            0 0 30px rgba(242, 148, 22, 0.5),
            0 0 60px rgba(242, 148, 22, 0.3);
          
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
          user-select: none;
        }

        .code-clash-title:hover {
          transform: scale(1.02) translateY(-2px);
          filter: 
            drop-shadow(0 0 30px rgba(255, 242, 166, 0.8))
            drop-shadow(0 0 60px rgba(242, 148, 22, 0.6));
          text-shadow:
            4px 4px 0 #3D2817,
            8px 8px 0 #2A1810,
            12px 12px 0 #1A0F08,
            16px 16px 30px rgba(0, 0, 0, 0.8),
            0 0 40px rgba(242, 148, 22, 0.7),
            0 0 80px rgba(242, 148, 22, 0.5);
        }

        .hero-subtitle {
          font-family: 'Inter', 'Arial', sans-serif;
          font-size: clamp(1rem, 3vw, 1.5rem);
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FFF2A6;
          margin-top: 1.5rem;
          text-shadow:
            2px 2px 0 #3D2817,
            4px 4px 10px rgba(0, 0, 0, 0.7);
          -webkit-text-stroke: 1px #3D2817;
        }

        @keyframes textureRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes rayRotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .code-clash-hero {
            min-height: 300px;
          }

          .code-clash-title {
            -webkit-text-stroke: 3px #3D2817;
            text-shadow:
              2px 2px 0 #3D2817,
              4px 4px 0 #2A1810,
              6px 6px 0 #1A0F08,
              8px 8px 15px rgba(0, 0, 0, 0.7),
              0 0 20px rgba(242, 148, 22, 0.4);
          }
        }

        @media (max-width: 480px) {
          .code-clash-hero {
            min-height: 250px;
          }

          .code-clash-title {
            -webkit-text-stroke: 2px #3D2817;
            letter-spacing: 0.05em;
          }
        }

        /* High resolution displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .code-clash-title {
            -webkit-text-stroke: 5px #3D2817;
          }
        }
      `}</style>
        </div>
    );
}
