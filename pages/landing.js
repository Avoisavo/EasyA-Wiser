import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { SmoothCursor } from '../components/ui/smooth-cursor';

export default function LandingPage() {
  const router = useRouter();
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <>
      <SmoothCursor />
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center cursor-none">
        {/* Dynamic Particles Background */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: ["#2563eb", "#60a5fa", "#38bdf8", "#0ea5e9"],
              },
              links: {
                color: "#2563eb",
                distance: 150,
                enable: true,
                opacity: 0.15,
                width: 1,
              },
              move: {
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
              glow: {
                enable: true,
                color: "#60a5fa",
                radius: 2,
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
        />

        {/* Futuristic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 opacity-95"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] bg-[size:18px_28px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 via-blue-300/20 to-blue-400/10 animate-gradient"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),rgba(255,255,255,0.9))]"></div>
        </div>

        {/* Content */}
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-8xl font-bold mb-6 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 blur-2xl opacity-40 animate-pulse"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 animate-gradient-x">
                Trade Me Baby
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Revolutionizing the future of finance with cutting-edge technology
            </p>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
              onClick={() => router.push('/nocard')}
            >
              Get Started
            </button>
          </motion.div>
        </div>

        <style jsx global>{`
          html,
          body,
          body *,
          * {
            cursor: none !important;
          }
          
          html {
            cursor: none !important;
          }
          
          body {
            cursor: none !important;
          }
          
          /* Ensure all interactive elements also have no cursor */
          button,
          a,
          input,
          textarea,
          select,
          [role="button"],
          [tabindex] {
            cursor: none !important;
          }
          
          /* Hide cursor on hover states too */
          *:hover {
            cursor: none !important;
          }
          
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes gradient-x {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient {
            animation: gradient 15s ease infinite;
            background-size: 200% 200%;
          }
          .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
            background-size: 200% 200%;
          }
        `}</style>
      </div>
    </>
  );
}
