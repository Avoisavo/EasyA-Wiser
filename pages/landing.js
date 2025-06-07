import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { SmoothCursor } from '../components/ui/smooth-cursor';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function LandingPage() {
  const router = useRouter();
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <>
      <SmoothCursor />
      <div className={`relative min-h-screen overflow-hidden flex items-center justify-center cursor-none bg-black ${inter.className}`}>


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
                value: ["#fbbf24", "#f59e0b", "#d97706", "#92400e"],
              },
              links: {
                color: "#fbbf24",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
              },
              move: {
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: { min: 0.5, max: 2 },
                straight: false,
                direction: "none",
                attract: {
                  enable: true,
                  rotateX: 600,
                  rotateY: 1200
                }
              },
              number: {
                density: {
                  enable: true,
                  area: 1000,
                },
                value: 40,
              },
              opacity: {
                value: 0.2,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 2 },
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
        />

        {/* Geometric Pattern Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"
            animate={{ 
              background: [
                "linear-gradient(135deg, #000000 0%, #111827 50%, #000000 100%)",
                "linear-gradient(135deg, #111827 0%, #000000 50%, #111827 100%)",
                "linear-gradient(135deg, #000000 0%, #111827 50%, #000000 100%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute right-0 top-0 w-1/2 h-full opacity-20"
            animate={{ 
              x: [0, 20, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-l from-yellow-600/20 to-transparent"
              animate={{ 
                background: [
                  "linear-gradient(270deg, rgba(217, 119, 6, 0.2) 0%, transparent 100%)",
                  "linear-gradient(270deg, rgba(251, 191, 36, 0.3) 0%, transparent 100%)",
                  "linear-gradient(270deg, rgba(217, 119, 6, 0.2) 0%, transparent 100%)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 400 800"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <motion.circle 
                    cx="10" 
                    cy="10" 
                    r="1" 
                    fill="#fbbf24" 
                    animate={{ 
                      opacity: [0.3, 0.8, 0.3],
                      r: [1, 1.5, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </motion.svg>
          </motion.div>
          
          {/* Additional animated background elements */}
          <motion.div
            className="absolute left-0 top-1/4 w-1/3 h-1/2 opacity-10"
            animate={{ 
              rotate: [0, -360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-full h-full bg-gradient-radial from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
          </motion.div>
          
          <motion.div
            className="absolute right-1/4 bottom-1/4 w-1/4 h-1/4 opacity-10"
            animate={{ 
              rotate: [0, 360],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-full h-full bg-gradient-radial from-yellow-600/30 to-transparent rounded-full blur-2xl"></div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-sm text-yellow-400 mb-4 font-semibold tracking-wider font-inter">
                FOR BUSINESSES
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight font-inter">
                Take back{' '}
                <span className="text-yellow-400">control</span>{' '}
                of your{' '}
                <span className="text-yellow-400">capital</span>.
              </h1>
              
              <div className="text-gray-300 text-lg mb-4 font-inter font-normal">
                Secure your treasury and scale your business globally
              </div>
              <div className="text-gray-300 text-lg mb-8 font-inter font-normal">
                with a truly self-custodial account that only you control.
              </div>
              
              <div className="text-gray-400 mb-8 font-inter font-medium">
                You hold the keys. Always.
              </div>
              
              <motion.button
                className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20 font-inter tracking-wide"
                onClick={() => router.push('/nocard')}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 20px 50px rgba(251, 191, 36, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                JOIN NOW
              </motion.button>
            </motion.div>
          </div>

          {/* Mobile Phone Mockup */}
          <div className="hidden lg:block flex-1 flex justify-end pr-9">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="w-80 h-[600px] bg-gray-900 rounded-[40px] p-6 shadow-2xl border border-gray-700">
                <div className="w-full h-full bg-black rounded-[30px] p-4 overflow-hidden">
                  <div className="text-white text-center">
                    <motion.div 
                      className="text-sm text-gray-400 mb-4 font-inter font-medium"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Transfers - Send
                    </motion.div>
                    <motion.div 
                      className="text-2xl font-bold mb-6 font-inter"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      Recipient Country
                    </motion.div>
                    
                    {/* Country flags mockup */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { flag: "🇬🇧", color: "bg-red-500", delay: 0 },
                        { flag: "🇺🇸", color: "bg-blue-500", delay: 0.2 },
                        { flag: "🇪🇺", color: "bg-green-500", delay: 0.4 },
                        { flag: "🇯🇵", color: "bg-purple-500", delay: 0.6 },
                        { flag: "🇨🇳", color: "bg-yellow-500", delay: 0.8 },
                        { flag: "🇮🇳", color: "bg-pink-500", delay: 1.0 }
                      ].map((item, index) => (
                        <motion.div 
                          key={index}
                          className={`w-12 h-12 ${item.color} rounded-full mx-auto flex items-center justify-center text-white font-bold`}
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0, -5, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: item.delay
                          }}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                        >
                          {item.flag}
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div 
                      className="space-y-3 text-left"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="flex justify-between text-sm font-inter">
                        <span className="text-gray-400 font-medium">Method</span>
                        <span className="font-medium">Bank Transfer</span>
                      </div>
                      <div className="flex justify-between text-sm font-inter">
                        <span className="text-gray-400 font-medium">Rate</span>
                        <motion.span
                          className="font-semibold"
                          animate={{ color: ["#ffffff", "#fbbf24", "#ffffff"] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          1.2405 USD
                        </motion.span>
                      </div>
                      <div className="flex justify-between text-sm font-inter">
                        <span className="text-gray-400 font-medium">Amount</span>
                        <span className="font-semibold">$250.00</span>
                      </div>
                    </motion.div>
                    
                    <motion.button 
                      className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold mt-6 font-inter tracking-wide"
                      animate={{ 
                        backgroundColor: ["#fbbf24", "#f59e0b", "#fbbf24"],
                        scale: [1, 1.02, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Live
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <style jsx global>{`
          * {
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
          .animate-gradient {
            animation: gradient 15s ease infinite;
            background-size: 200% 200%;
          }
        `}</style>
      </div>
    </>
  );
}
