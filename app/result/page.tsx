"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";

type Analysis = {
  productName: string;
  category: string;
  whatThePacketSays: string;
  whatItMeans: string;
  marketingMove: string;
  truthLabel: string;
  honestHeadline: string;
  honestSubhead: string;
  honestStat: string;
  honestStatDetail: string;
  bullets: [string, string, string];
  footerLine: string;
  imagePrompt: string;
};

type Result = {
  analysis: Analysis;
  honestImage: string;
};

const STAGES = [
  "Reading the packet…",
  "Spotting the persuasion tricks…",
  "Decoding the costume…",
  "Rewriting the front label…",
  "Generating the honest packet…",
];

function ArrowRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function Block({ label, value, italic = false }: { label: string; value: string; italic?: boolean }) {
  return (
    <div>
      <div className="text-sm font-semibold uppercase tracking-wide text-ink/50">{label}</div>
      <div className={`mt-2 text-xl leading-snug ${italic ? "italic" : ""}`}>{value}</div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [source, setSource] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const src = sessionStorage.getItem("truthlabel:source");
    if (!src) {
      router.replace("/");
      return;
    }
    setSource(src);

    const cached = sessionStorage.getItem("truthlabel:result");
    if (cached) {
      try {
        setResult(JSON.parse(cached) as Result);
        return;
      } catch {
        sessionStorage.removeItem("truthlabel:result");
      }
    }

    if (startedRef.current) return;
    startedRef.current = true;

    const stageInterval = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 2200);

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageDataUrl: src }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error ?? "Something went wrong.");
        return data as Result;
      })
      .then((data) => {
        sessionStorage.setItem("truthlabel:result", JSON.stringify(data));
        setResult(data);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => clearInterval(stageInterval));

    return () => clearInterval(stageInterval);
  }, [router]);

  return (
    <main className="min-h-screen">
      <Header />

      <section className="mx-auto max-w-page px-6 pt-10 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm text-ink/60 hover:text-ink">
            ← Decode another packet
          </Link>
          {result && (
            <div className="text-sm text-ink/50">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                Decoded
              </span>
            </div>
          )}
        </div>

        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink/40">
              The packet
            </div>
            <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl bg-cream2/40">
              {source && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={source} alt="Original product" className="h-full w-full object-contain" />
              )}
            </div>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-white text-ink ring-1 ring-black/10 md:flex">
            <ArrowRight />
          </div>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink/40">
              The honest version
            </div>
            <div className="relative mt-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-cream2/40">
              {result ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.honestImage}
                  alt="Honest packet"
                  className="h-full w-full object-contain"
                />
              ) : error ? (
                <div className="px-6 text-center text-sm text-truthred">{error}</div>
              ) : (
                <LoadingState stage={stage} />
              )}
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Block
              label="What the packet says"
              value={`“${result.analysis.whatThePacketSays.replace(/^"|"$/g, "")}”`}
              italic
            />
            <Block label="What it means" value={result.analysis.whatItMeans} />
            <Block label="Marketing move" value={result.analysis.marketingMove} />
            <div className="rounded-2xl bg-ink p-6 text-white md:row-span-1">
              <div className="text-sm font-semibold uppercase tracking-wide text-white/60">
                Truth label
              </div>
              <div className="mt-2 text-xl leading-snug">
                {result.analysis.truthLabel}
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-14 flex flex-col items-start gap-3">
            <Link href="/" className="btn-primary">
              Decode another packet
              <ArrowRight />
            </Link>
            <div className="text-xs text-ink/50">
              Each decode runs a fresh image generation. Roughly $0.10 per packet.
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function LoadingState({ stage }: { stage: number }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-ping rounded-full bg-ink/10" />
        <div className="absolute inset-2 rounded-full bg-ink" />
      </div>
      <div className="text-sm text-ink/70">{STAGES[stage]}</div>
      <div className="text-xs text-ink/40">This usually takes 20–40 seconds.</div>
    </div>
  );
}
