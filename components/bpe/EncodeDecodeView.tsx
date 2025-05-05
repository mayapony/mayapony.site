// components/EncodeDecodeView.tsx
"use client";

import { useState } from "react";

const byteToToken = (text: string): number[] => {
  return Array.from(new TextEncoder().encode(text));
};

const decodeTokens = (
  tokens: number[],
  vocab: Map<number, Uint8Array>
): string => {
  const bytes: number[] = [];
  for (const token of tokens) {
    const chunk = vocab.get(token);
    if (chunk) bytes.push(...chunk);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
};

const applyBPE = (
  initial: number[],
  merges: Map<string, number>
): {
  steps: { tokens: number[]; merge?: [number, number]; newId?: number }[];
} => {
  const steps = [{ tokens: initial.slice() }];
  let current = initial.slice();

  while (true) {
    const pairFreq = new Map<string, number>();
    for (let i = 0; i < current.length - 1; i++) {
      const key = `${current[i]}_${current[i + 1]}`;
      if (merges.has(key)) {
        pairFreq.set(key, (pairFreq.get(key) || 0) + 1);
      }
    }
    if (pairFreq.size === 0) break;

    const [pairKey] = [...pairFreq.entries()].sort((a, b) => b[1] - a[1])[0];
    const [a, b] = pairKey.split("_").map(Number);
    const newId = merges.get(pairKey)!;

    const merged: number[] = [];
    let i = 0;
    while (i < current.length) {
      if (i < current.length - 1 && current[i] === a && current[i + 1] === b) {
        merged.push(newId);
        i += 2;
      } else {
        merged.push(current[i]);
        i++;
      }
    }
    current = merged;
    steps.push({ tokens: current.slice(), merge: [a, b], newId });
  }

  return { steps };
};

export default function EncodeDecodeView({
  merges,
}: {
  merges: Map<string, number>;
}) {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<
    { tokens: number[]; merge?: [number, number]; newId?: number }[]
  >([]);
  const [vocab, setVocab] = useState<Map<number, Uint8Array>>(new Map());
  const [decoded, setDecoded] = useState("");

  const buildVocab = (merges: Map<string, number>) => {
    const vocab = new Map<number, Uint8Array>();
    for (let i = 0; i < 256; i++) {
      vocab.set(i, new Uint8Array([i]));
    }
    for (const [key, id] of merges.entries()) {
      const [a, b] = key.split("_").map(Number);
      const bytes = new Uint8Array([
        ...(vocab.get(a) || []),
        ...(vocab.get(b) || []),
      ]);
      vocab.set(id, bytes);
    }
    return vocab;
  };

  const handleRun = () => {
    const inputIds = [...byteToToken(input), 256];
    const vocabMap = buildVocab(merges);
    const result = applyBPE(inputIds, merges);
    const decodedText = decodeTokens(result.steps.at(-1)!.tokens, vocabMap);
    setSteps(result.steps);
    setVocab(vocabMap);
    setDecoded(decodedText);
  };

  const renderToken = (id: number, index: number) => {
    const bytes = vocab.get(id);
    const text = bytes ? new TextDecoder().decode(bytes) : "?";
    return (
      <span
        key={index}
        className="rounded border bg-gray-50 px-2 py-0.5 text-xs"
        title={`Token ID: ${id}\nBytes: [${bytes?.join(
          ", "
        )}]\nText: '${text}'`}
      >
        {id}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">编码解码</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="请输入要编码的文本"
        className="w-full rounded border p-2"
        rows={3}
      />

      <button
        onClick={handleRun}
        className="rounded bg-green-600 px-4 py-1 text-white hover:bg-green-700"
      >
        开始编码
      </button>

      {steps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">编码过程：</h3>
          {steps.map((step, i) => (
            <div key={i} className="text-sm">
              <div className="mb-1 font-medium">
                Step {i}{" "}
                {step.merge
                  ? `: 合并 (${step.merge[0]}, ${step.merge[1]}) → ${step.newId}`
                  : "(初始字节序列)"}
              </div>
              <div className="flex flex-wrap gap-1">
                {step.tokens.map((t, idx) => renderToken(t, idx))}
              </div>
            </div>
          ))}
        </div>
      )}

      {decoded && (
        <div className="mt-4 text-sm">
          <strong>解码为原文：</strong> {decoded}
        </div>
      )}
    </div>
  );
}
