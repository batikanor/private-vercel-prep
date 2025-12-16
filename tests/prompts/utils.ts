type FinishReason = "stop" | "length" | "content-filter" | "tool-calls";

type Usage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

type TextChunk =
  | { id: string; type: "text-start" }
  | { id: string; type: "text-delta"; delta: string }
  | { id: string; type: "text-end" };

type FinishChunk = {
  type: "finish";
  finishReason: FinishReason;
  usage: Usage;
};

export function getResponseChunksByPrompt(
  prompt: unknown,
  includeReasoning = false
): Array<TextChunk | FinishChunk> {
  const promptStr = JSON.stringify(prompt ?? "").toLowerCase();

  let text = "Hello, world!";
  if (promptStr.includes("weather")) {
    text = "The weather in San Francisco is sunny and 72°F.";
  }

  if (includeReasoning) {
    text = `Thinking...\n\n${text}`;
  }

  return [
    { id: "1", type: "text-start" },
    { id: "1", type: "text-delta", delta: text },
    { id: "1", type: "text-end" },
    {
      type: "finish",
      finishReason: "stop",
      usage: { inputTokens: 3, outputTokens: 10, totalTokens: 13 },
    },
  ];
}
