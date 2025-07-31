"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggle = () => setIsVisible(window.scrollY > 200);
        window.addEventListener('scroll', toggle);
        toggle();
        return () => window.removeEventListener('scroll', toggle);
    }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button id="ToTop" class="z-50 hidden cursor-pointer hover:scale-115 fixed bottom-5 right-5 bg-[#EAEAEA] rounded-full p-2 shadow-lg">
            <ArrowUp class="!hover:scale-100" width="25" height="25"/>
        </button>
    )
}