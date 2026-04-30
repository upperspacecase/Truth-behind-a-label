"use client";

import Image from "next/image";
import { useState } from "react";

function FallbackMock() {
  return (
    <svg viewBox="0 0 600 480" className="h-full w-full" role="img" aria-label="Honest packet preview placeholder">
      <defs>
        <linearGradient id="rb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="20%" stopColor="#2563EB" />
          <stop offset="40%" stopColor="#10B981" />
          <stop offset="60%" stopColor="#FACC15" />
          <stop offset="80%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      <g>
        <rect x="40" y="60" width="220" height="360" rx="22" fill="#E63946" />
        <path d="M40 110 Q150 30 260 110 L260 170 Q150 100 40 170 Z" fill="url(#rb)" opacity="0.85" />
        <rect x="200" y="98" width="56" height="28" rx="14" fill="#fff" />
        <text x="228" y="118" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="14" fill="#0F0F0F">200 g</text>
        <text x="150" y="240" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="44" fill="#fff">Skittles</text>
        <text x="150" y="280" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="14" fill="#fff">Taste the rainbow</text>
      </g>

      <g transform="translate(290 220)">
        <circle r="22" fill="#fff" stroke="#E5E5E5" />
        <path d="M-8 0 L8 0 M3 -6 L9 0 L3 6" stroke="#0F0F0F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g>
        <rect x="340" y="60" width="220" height="360" rx="22" fill="#FFFFFF" stroke="#E5E5E5" />
        <text x="450" y="110" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="14" fill="#0F0F0F">THE TRUTH</text>
        <text x="450" y="128" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="11" fill="#0F0F0F">IF THIS PACKET</text>
        <text x="450" y="143" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="11" fill="#0F0F0F">HAD TO BE HONEST.</text>
        <line x1="370" y1="158" x2="530" y2="158" stroke="#0F0F0F" strokeWidth="1" />
        <text x="450" y="190" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="16" fill="#0F0F0F">FLAVORED</text>
        <text x="450" y="210" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="16" fill="#0F0F0F">SUGAR CANDIES</text>
        <rect x="370" y="226" width="160" height="38" rx="6" fill="#E8412B" />
        <text x="450" y="250" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="13" fill="#fff">ABOUT 75% SUGAR</text>
        <text x="450" y="276" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#0F0F0F">That&apos;s ~37.5g of sugar in this pack.</text>

        <g fontFamily="Inter, sans-serif" fontSize="11" fill="#0F0F0F">
          <circle cx="378" cy="298" r="8" fill="#0F0F0F" />
          <text x="394" y="302">Quick energy spike</text>
          <circle cx="378" cy="320" r="8" fill="#0F0F0F" />
          <text x="394" y="324">No real nutrition</text>
          <circle cx="378" cy="342" r="8" fill="#0F0F0F" />
          <text x="394" y="346">Easy to overeat</text>
        </g>

        <rect x="370" y="362" width="160" height="46" rx="6" fill="none" stroke="#0F0F0F" />
        <text x="450" y="380" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#0F0F0F">Fun to eat.</text>
        <text x="450" y="392" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#0F0F0F">Nothing to nourish.</text>
        <text x="450" y="404" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill="#0F0F0F">Enjoy occasionally.</text>
      </g>
    </svg>
  );
}

export function HeroIllustration() {
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative aspect-[5/4] w-full">
      {!errored ? (
        <Image
          src="/hero.png"
          alt="Skittles packet decoded into a plain-English honest packet"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain"
          onError={() => setErrored(true)}
        />
      ) : (
        <FallbackMock />
      )}
    </div>
  );
}
