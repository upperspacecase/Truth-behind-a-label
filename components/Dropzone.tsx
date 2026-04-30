"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const FEATURES = [
  "Health claims",
  "Hidden tradeoffs",
  "Sugar, salt & additives",
  "Emotional tricks",
  "What the label leaves out",
];

const MAX_BYTES = 12 * 1024 * 1024;

function CheckIcon() {
  return (
    <span className="check-dot">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

function UploadIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-ink/70">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M12 16V8" />
      <path d="m8 11 4-3 4 3" />
    </svg>
  );
}

export function Dropzone({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image (JPG, PNG, or WebP).");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("Image is too large. Max 12 MB.");
        return;
      }
      try {
        setBusy(true);
        const dataUrl = await fileToDataUrl(file);
        sessionStorage.setItem("truthlabel:source", dataUrl);
        sessionStorage.removeItem("truthlabel:result");
        router.push("/result");
      } catch (e) {
        setError("Could not read the file. Try another image.");
        setBusy(false);
      }
    },
    [router],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div id="upload" className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`group cursor-pointer rounded-2xl border-2 border-dashed bg-cream2/60 px-6 transition ${
          dragOver ? "border-ink/60 bg-cream2" : "border-ink/15 hover:border-ink/30"
        } ${variant === "compact" ? "py-6" : "py-12"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
        <div
          className={`flex flex-col items-center gap-4 ${
            variant === "compact" ? "md:flex-row md:items-center md:justify-center md:gap-6" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <UploadIcon />
            <div>
              <div className="text-lg font-bold">Drop a product photo here</div>
              <div className="text-sm text-ink/60">
                We&rsquo;ll analyze the packaging and reveal the truth.
              </div>
            </div>
          </div>
          <div className={`mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 ${variant === "compact" ? "md:mt-0" : ""}`}>
            {FEATURES.map((f) => (
              <span key={f} className="inline-flex items-center gap-2 text-sm text-ink/70">
                <CheckIcon />
                {f}
              </span>
            ))}
          </div>
        </div>

        {variant === "full" && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="btn-primary disabled:opacity-60"
            >
              {busy ? "Loading…" : "Reveal the real label"}
            </button>
            <div className="text-xs text-ink/50">
              No moral lecture. No diet culture. Just the difference between what it sells and what it is.
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-3 text-sm text-truthred">{error}</div>}
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
