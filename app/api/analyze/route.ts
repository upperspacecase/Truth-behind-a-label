import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 120;

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

const SYSTEM = `You are "truth label" — a calm, dry, plain-English food packaging decoder.
You are NOT a moralist or diet coach. You name persuasion tricks the way a media critic would.
Tone: dry, observant, a little wry. Never preachy. Never use the words "junk", "evil", "toxic", "guilty pleasure".
Never lecture. Be specific.

You will be given a product photo. Reply with JSON only that follows the provided schema.

Guidance for fields:
- whatThePacketSays: the literal slogan or front-of-pack claim, in quotes. If unreadable, infer the dominant message.
- whatItMeans: a one-line plain-English translation. No moralizing.
- marketingMove: name the persuasion trick in 4-8 words (e.g. "Turns sugar into play", "Borrows the language of fitness").
- truthLabel: a short three-line honest stamp. Punchy. No diet talk.
- honestHeadline: 2-3 words ALL CAPS describing what it actually is (e.g. "FLAVORED SUGAR CANDIES", "SUGARY CEREAL").
- honestSubhead: a short factual stat for the red badge (e.g. "ABOUT 75% SUGAR"). Must be specific to the product. If unknown, use a defensible estimate and prefix with "ABOUT" or "ROUGHLY".
- honestStatDetail: a one-line elaboration of the stat (e.g. "That's ~37.5g of sugar in this pack.").
- bullets: exactly three short factual phrases (2-4 words each) describing what eating it actually does, e.g. ["Quick energy spike", "No real nutrition", "Easy to overeat"]. Stay neutral.
- footerLine: a 3-line honest tagline as a single string with newline separators, e.g. "Fun to eat.\\nNothing to nourish.\\nEnjoy occasionally."
- imagePrompt: a single paragraph describing a clean, photorealistic image of an "honest" version of THIS product's packaging. Match the original packet shape (pouch, box, can, bottle, bag) and proportions. The packet should be plain matte white with crisp black sans-serif typography. Top of pack: small caps "THE TRUTH / IF THIS PACKET / HAD TO BE HONEST." with a thin divider. Below: the honestHeadline in big bold black sans-serif. Below that: a red rectangle badge with white text containing honestSubhead, with honestStatDetail in small text under it. Below that: three small black icons next to the three bullets. Bottom: a thin black-bordered rectangle containing footerLine on three lines. Studio white background, soft shadow under the packet. Do NOT include the original brand name, mascots, or rainbow. No people. No extra text beyond what is specified.`;

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    productName: { type: "string" },
    category: { type: "string" },
    whatThePacketSays: { type: "string" },
    whatItMeans: { type: "string" },
    marketingMove: { type: "string" },
    truthLabel: { type: "string" },
    honestHeadline: { type: "string" },
    honestSubhead: { type: "string" },
    honestStat: { type: "string" },
    honestStatDetail: { type: "string" },
    bullets: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
    },
    footerLine: { type: "string" },
    imagePrompt: { type: "string" },
  },
  required: [
    "productName",
    "category",
    "whatThePacketSays",
    "whatItMeans",
    "marketingMove",
    "truthLabel",
    "honestHeadline",
    "honestSubhead",
    "honestStat",
    "honestStatDetail",
    "bullets",
    "footerLine",
    "imagePrompt",
  ],
} as const;

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

export async function POST(req: NextRequest) {
  try {
    const { imageDataUrl } = (await req.json()) as { imageDataUrl?: string };
    if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Missing or invalid image." }, { status: 400 });
    }

    const client = getClient();

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.4,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "truth_label_analysis",
          schema: ANALYSIS_SCHEMA,
          strict: true,
        },
      },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Decode this product packaging. Return JSON matching the schema.",
            },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    let analysis: Analysis;
    try {
      analysis = JSON.parse(raw) as Analysis;
    } catch {
      return NextResponse.json(
        { error: "Could not parse model output." },
        { status: 502 },
      );
    }

    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt: analysis.imagePrompt,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    });

    const b64 = image.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: "No image returned." }, { status: 502 });
    }

    return NextResponse.json({
      analysis,
      honestImage: `data:image/png;base64,${b64}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
