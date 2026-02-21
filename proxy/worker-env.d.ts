declare module "*.md" {
  const content: string;
  export default content;
}

/** Cloudflare Workers AI binding. */
interface Ai {
  run(
    model: string,
    input: {
      messages: { role: string; content: string }[];
      max_tokens?: number;
    },
  ): Promise<{ response?: string }>;
}
