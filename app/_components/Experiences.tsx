"use client"

import SectionTitle from "@/components/SectionTitle"
import { MY_EXPERIENCE } from "@/lib/data"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const ExperiencesTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Animate timeline line
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      })

      tl.fromTo(".timeline-line", { height: "0%" }, { height: "100%", ease: "none" })
    },
    { scope: containerRef },
  )

  useGSAP(
    () => {
      // Animate experience items
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 60%",
          end: "bottom 50%",
          toggleActions: "restart none none reverse",
        },
      })

      tl.from(".timeline-item", {
        x: (index) => (index % 2 === 0 ? -100 : 100),
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      })

      tl.from(
        ".timeline-dot",
        {
          scale: 0,
          opacity: 0,
          stagger: 0.2,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.6",
      )
    },
    { scope: containerRef },
  )

  useGSAP(
    () => {
      // Exit animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 50%",
          end: "bottom 20%",
          scrub: 1,
        },
      })

      tl.to(containerRef.current, {
        y: -150,
        opacity: 0,
      })
    },
    { scope: containerRef },
  )

  return (
    <section className="py-section" id="my-experience">
      <div className="container" ref={containerRef}>
        <SectionTitle title="My Experience" />

        <div className="relative mt-16" ref={timelineRef}>
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-border transform -translate-x-1/2 hidden md:block">
            <div className="timeline-line w-full bg-[#5EABD6] origin-top"></div>
          </div>

          {/* Mobile Timeline Line */}
          <div className="absolute left-8 top-0 w-0.5 h-full bg-border md:hidden">
            <div className="timeline-line w-full bg-[#5EABD6] origin-top"></div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {MY_EXPERIENCE.map((item, index) => (
              <div
                key={item.title}
                className={`timeline-item relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Desktop Layout */}
                <div className="hidden md:block md:w-1/2">
                  <div className={`p-6 bg-[#1B3C53] rounded-lg shadow-sm ${index % 2 === 0 ? "mr-8" : "ml-8"}`}>
                    <p className="text-lg text-muted-foreground mb-2">{item.company}</p>
                    <h3 className="text-2xl md:text-3xl font-anton leading-tight mb-2">{item.title}</h3>
                    <p className="text-base text-muted-foreground">{item.duration}</p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="timeline-dot absolute left-1/2 w-4 h-4 bg-[#5EABD6] rounded-full border-4 border-background transform -translate-x-1/2 z-10 hidden md:block"></div>

                {/* Mobile Timeline Dot */}
                <div className="timeline-dot absolute left-8 w-4 h-4 bg-[#5EABD6] rounded-full border-4 border-background transform -translate-x-1/2 z-10 md:hidden"></div>

                {/* Mobile Layout */}
                <div className="md:hidden pl-16 w-full">
                  <div className="p-6 bg-card border rounded-lg shadow-sm">
                    <p className="text-lg text-muted-foreground mb-2">{item.company}</p>
                    <h3 className="text-2xl font-anton leading-tight mb-2">{item.title}</h3>
                    <p className="text-base text-muted-foreground">{item.duration}</p>
                  </div>
                </div>

                {/* Desktop Spacer */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExperiencesTimeline
