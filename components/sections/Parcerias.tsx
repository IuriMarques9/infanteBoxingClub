'use client';
import Image from "next/image";
import { PlaceHolderImages } from "../../lib/placeholder-images";
import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const partnerImages = PlaceHolderImages.filter(img => img.id.startsWith('partner-'));

const extendedPartnerImages = [...partnerImages, ...partnerImages];

export default function Partnerships() {
	const movingContainer = useRef<HTMLDivElement>(null);
	const timeline = useRef<GSAPTimeline>();

	useGSAP(
		() => {
		// Translate the container half of its width to the left (the width of list)
		// Then set it back to the start, and repeat infinitely.
		const setupInfiniteMarqueeTimeline = () => {
			gsap.set(movingContainer.current, {
			xPercent: 0,
			});
			timeline.current = gsap
			.timeline({
				defaults: { ease: "none", repeat: -1 },
			})
			.to(movingContainer.current, {
				xPercent: -50,
				duration: 20,
			})
			.set(movingContainer.current, { xPercent: 0 });
		};

		setupInfiniteMarqueeTimeline();
		},
	);

  const timelineTimeScaleTween = useRef<GSAPTween>();

  const onPointerEnter = () => {
    if (!timeline.current) return;
    timelineTimeScaleTween.current?.kill();
    timelineTimeScaleTween.current = gsap.to(timeline.current, {
      timeScale: 0.25,
      duration: 0.4,
    });
  };

  const onPointerLeave = () => {
    if (!timeline.current) return;
    timelineTimeScaleTween.current?.kill();
    timelineTimeScaleTween.current = gsap.to(timeline.current, {
      timeScale: 1,
      duration: 0.2,
    });
  };

  const list = useMemo(
    () => (
      <div className="flex w-fit items-center gap-24">
        {extendedPartnerImages.map((image, index) => {
          const isLast = index === extendedPartnerImages.length - 1;
          return (
            <div
              key={index}
              className={`relative flex shrink-0 items-center justify-center w-[200px] h-[100px] ${isLast && "mr-24"}`}
            >
              <Link className="transition-all duration-300 hover:brightness-50" href={image.link || '/'}>
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  height={300}
                  width={300}
                  className=" w-full object-contain"
                />
              </Link>
            </div>
          );
        })}
      </div>
    ),
    []
  );
    return (
    <div 
      className="max-w-7xl mx-auto select-none overflow-hidden bg-secondary my-16" 
      style={{maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)'}}
      onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
    >
		<div ref={movingContainer} className="flex w-fit">
			{list}
			{list}
		</div>
	</div>
  );
}