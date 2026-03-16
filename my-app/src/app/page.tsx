"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";
import { NavbarDemo } from "@/components/ui/navbar-demo";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { motion } from "motion/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <NavbarDemo />

        {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 pb-20 sm:p-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Introduction */}
          <motion.div 
            className="space-y-6 font-body"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-heading font-black mb-8 tracking-tight">
              <TypingAnimation words={["Hey, I'm Chris!"]} />
            </h1>
            
            <motion.div 
              className="space-y-4 text-gray-300 text-base leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p>I&apos;m based in <span className="underline">Toronto</span> and <span className="underline">Waterloo</span>.</p>
              <p>I came to Waterloo to study <span className="underline">CS</span> in 2023 and have been here ever since.</p>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">What am I doing currently...</h2>
              
              <div className="space-y-3 text-gray-300">
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">studying <span className="font-semibold text-white">Computer Science</span> at <span className="inline-flex items-center gap-1.5 underline">
                    <Image 
                      src="https://storage-prtl-co.imgix.net/endor/organisations/14118/logos/1703088516_studyportals-logo.png" 
                      alt="Wilfrid Laurier University" 
                      width={16} 
                      height={16} 
                      className="inline-block"
                    />
                    Wilfrid Laurier University
                  </span> (grad: Dec. 2026, GPA: 3.85)</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">working with <span className="underline font-semibold"><a href="https://x.com/mayankja1n">Mayank</a></span> (<span className="inline-flex items-baseline gap-1.5">
                    <Image 
                      src="/Hecaton Logo.svg" 
                      alt="Hecaton" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    Hecaton
                  </span>) to ship digital products for startups (<span className="inline-flex items-baseline gap-1.5 underline font-semibold">
                    <Image 
                      src="/1bitcoincaLogosmall-1024x247.webp" 
                      alt="1Bitcoin.ca" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    <a href="https://1bitcoin.ca/">1Bitcoin.ca</a>
                  </span>, <span className="inline-flex items-baseline gap-1.5 underline font-semibold">
                    <Image 
                      src="/fleetcraft logo.png" 
                      alt="Fleetcraft" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    <a href="https://www.fleetcraft.com/">Fleetcraft</a>
                  </span>, <span className="underline font-semibold"><a href="https://realestateaigents.ca/">reAIgents</a></span>)</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">working on <span className="inline-flex items-baseline gap-1.5 font-semibold text-white underline">
                    <Image 
                      src="/MT logo.jpeg" 
                      alt="MentorTrader" 
                      width={16} 
                      height={16} 
                      className="inline-block align-text-bottom"
                    />
                    <a href="https://www.mentor-trader.com/">MentorTrader</a>
                  </span> as a solo founder</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">playing <span className="font-semibold text-white">high-stakes poker</span> to clear out my mind ♠️</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">I ...</h2>
              
              <div className="space-y-3 text-gray-300">
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">
                    will be working as a SWE intern at{" "}
                    <span className="inline-flex items-center gap-1.5 underline font-semibold text-white">
                      <a href="https://www.manulife.ca/">Manulife</a>
                    </span>
                    {' this summer.(May to Sep. 2026)'}
                  </p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">was working as a <span className="font-semibold text-white">SWE intern</span> at <span className="inline-flex items-center gap-1.5 underline font-semibold text-white">
                    <Image 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTaqx9Nk6GoCK9IISw9asCEs2YC8MitdLjAg&s" 
                      alt="Bolttech" 
                      width={16} 
                      height={16} 
                      className="inline-block"
                    />
                    <a href="https://bolttech.io/">
                    Bolttech
                    </a>
                  </span>. Generated $15000+ in annual savings by re-architecting legacy automation into a serverless AWS ETL
                  pipeline (Lambda/Step Functions) scaling to process 1M+ daily inventory records.</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1">was working as a <span className="font-semibold text-white">SWE intern</span> at <span className="inline-flex items-center gap-1.5 underline font-semibold text-white">
                    <Image 
                      src="https://media.licdn.com/dms/image/v2/C560BAQE7J1kH3K6Axg/company-logo_200_200/company-logo_200_200/0/1663666337869/sensoft_technologies_logo?e=2147483647&v=beta&t=MHNWv81ezIhKijgNalYp3yrMd-_Rv_fBno1FCqg0_04" 
                      alt="Sensoft Technologies" 
                      width={16} 
                      height={16} 
                      className="inline-block"
                    />
                    <a href="https://sensoft.tech/">
                    Sensoft Technologies
                    </a>
                  </span>, building a monitoring system for <span className="font-semibold text-white">50+ IoT sensors</span> across multiple sites</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">On nights and weekends...</h2>
              
              <div className="space-y-3 text-gray-300">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-gray-500 flex-shrink-0">›</span>
                    <div className="flex-1">
                      <p>am working on <span className="inline-flex items-baseline gap-1.5 font-semibold text-white">
                        <Image 
                          src="/MT logo.jpeg" 
                          alt="MentorTrader" 
                          width={16} 
                          height={16} 
                          className="inline-block align-text-bottom"
                        />
                        <a href="https://www.mentor-trader.com/">MentorTrader</a>
                      </span> -- a marketplace platform for <span className="font-semibold text-white">retail traders</span> to find <span className="font-semibold text-white">credible verified mentors</span></p>
                              
                      <div className="mt-4 ml-4"> 
                        <h3 className="text-base font-heading font-semibold text-white mb-3">my progress so far..</h3>
                        <div className="space-y-2 text-gray-300">
                          <div className="flex items-baseline gap-3">
                            <span className="text-gray-500 flex-shrink-0">›</span>
                            <p className="flex-1">created an <span className="font-semibold text-white">MVP</span> (<span className="underline font-semibold"><a href="https://www.mentor-trader.com/">mentor-trader.com</a></span>)</p>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-gray-500 flex-shrink-0">›</span>
                            <p className="flex-1">onboarded <span className="font-semibold text-white">120+ verified traders</span> from <span className="font-semibold text-white">X</span></p>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-gray-500 flex-shrink-0">›</span>
                            <p className="flex-1">partnering with fintech companies like <span className="inline-flex items-baseline gap-1.5 underline font-semibold text-white">
                              <Image 
                                src="/kinfo.png" 
                                alt="Kinfo" 
                                width={16} 
                                height={16} 
                                className="inline-block align-text-bottom"
                              />
                              <a href="https://kinfo.com/">Kinfo</a>
                            </span> and <span className="inline-flex items-baseline gap-1.5 underline font-semibold text-white">
                              <Image 
                                src="/Darwinex.png" 
                                alt="Darwinex" 
                                width={16} 
                                height={16} 
                                className="inline-block align-text-bottom"
                              />
                              <a href="https://www.darwinexzero.com/">Darwinex</a>
                            </span></p>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-gray-500 flex-shrink-0">›</span>
                            <p className="flex-1">interviewed with <span className="underline font-semibold"><a href="https://www.youtube.com/@tommyanytime">Tommy Anytime</a></span>, a YouTuber known for exposing fake trading gurus</p>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <span className="text-gray-500 flex-shrink-0">›</span>
                            <p className="flex-1">collected feedback from <span className="font-semibold text-white">100+ traders</span> on <span className="font-semibold text-white">X</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <h2 className="text-xl font-heading font-bold text-white text-left">A few projects that I&apos;ve worked on...</h2>
              
              <div className="space-y-3 text-gray-300">
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.7, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1"><span className="underline font-semibold"><a href="https://www.blockmark.ca/">Blockmark</a></span> - Permanently record and verify messages and files on the Bitcoin blockchain. </p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1"><span className="underline font-semibold"><a href="https://www.fleetcraft.com/">Fleetcraft</a></span> – AI built for aircraft maintenance.</p>
                </motion.div>
                <motion.div 
                  className="flex items-baseline gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.9, duration: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-gray-500 flex-shrink-0">›</span>
                  <p className="flex-1"><span className="underline font-semibold"><a href="https://realestateaigents.ca/">reAIgents</a></span> – Make Better Real Estate Decisions (Ontario).</p>
                </motion.div>
              </div>
            </motion.div>

   
          </motion.div>

          {/* Right Side - Chat Interface */}
          <motion.div 
            className="lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ChatInterface />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="mt-20 text-center text-sm text-gray-500 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <p>© Please reach out to me on X, I love yapping with anyone about anything.</p>
      </motion.footer>
    </div>
  );
}
