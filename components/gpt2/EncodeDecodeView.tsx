// components/EncodeDecodeView.tsx
"use client";

import { TokenViewer } from "@/components/gpt2/TokenViewer";
import {
  bytesToUnicode,
  decodeBpeTokenString,
  tokenizeWithGpt2Pattern,
} from "@/utils/bpe";
import { useState } from "react";

const COLORS = [
  "bg-ctp-rosewater",
  "bg-ctp-flamingo",
  "bg-ctp-pink",
  "bg-ctp-mauve",
  "bg-ctp-red",
  "bg-ctp-maroon",
  "bg-ctp-peach",
  "bg-ctp-yellow",
  "bg-ctp-green",
  "bg-ctp-teal",
  "bg-ctp-sky",
  "bg-ctp-sapphire",
  "bg-ctp-blue",
  "bg-ctp-lavender",
];

interface EncodeDecodeViewProps {
  vocab: Array<[string, string]>; // 按照顺序的 vocab 合并对
  encoder: Map<string, number>; // token 字符串 -> id
}

interface Step {
  step: number;
  segment: string;
  tokens: number[];
  pairStats: Array<{
    pair: [number, number];
    freq: number;
    key: string;
    mergedStr: string;
    canMerge: boolean;
    vocabIndex: number;
  }>;
  merged?: string;
  newTokenId?: number;
  reason?: string;
  nextHint?: string;
}

export default function EncodeDecodeView({
  vocab,
  encoder,
}: EncodeDecodeViewProps) {
  const [inputText, setInputText] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [decodedText, setDecodedText] = useState("");
  const [segmentsPreview, setSegmentsPreview] = useState<string[]>([]);

  const byteEncoder = bytesToUnicode();
  const unicodeToByte = new Map<string, number>();
  for (const [byte, char] of byteEncoder.entries()) {
    unicodeToByte.set(char, byte);
  }

  const tokenIdToString = new Map<number, string>();
  for (const [str, id] of encoder.entries()) {
    tokenIdToString.set(id, str);
  }

  const vocabIndex = new Map<string, number>();
  vocab.forEach(([a, b], i) => {
    vocabIndex.set(`${a}_${b}`, i);
  });

  const getPairStats = (tokens: number[]): Step["pairStats"] => {
    const stats = new Map<string, { pair: [number, number]; freq: number }>();
    for (let i = 0; i < tokens.length - 1; i++) {
      const pair: [number, number] = [tokens[i], tokens[i + 1]];
      const key = `${pair[0]}_${pair[1]}`;
      stats.set(key, {
        pair,
        freq: (stats.get(key)?.freq || 0) + 1,
      });
    }
    return Array.from(stats.values())
      .map(({ pair, freq }) => {
        const left = tokenIdToString.get(pair[0]) ?? "";
        const right = tokenIdToString.get(pair[1]) ?? "";
        const mergedStr = left + right;
        const mergeKey = `${left}_${right}`;
        const canMerge = vocabIndex.has(mergeKey);
        const vocabRank = vocabIndex.get(mergeKey);
        return {
          pair,
          freq,
          key: `${pair[0]}_${pair[1]}`,
          mergedStr,
          canMerge,
          vocabIndex: vocabRank ?? Infinity,
        };
      })
      .sort((a, b) => {
        if (a.canMerge && b.canMerge) {
          return a.vocabIndex - b.vocabIndex;
        } else if (a.canMerge) {
          return -1;
        } else if (b.canMerge) {
          return 1;
        } else {
          return b.freq - a.freq;
        }
      });
  };

  const handleEncode = (input: string) => {
    const segments = tokenizeWithGpt2Pattern(input);
    setSegmentsPreview(segments);
    const allSteps: Step[] = [];
    const finalTokens: number[] = [];
    const decodedBytes: number[] = [];
    let globalStep = 0;

    for (const segment of segments) {
      const textBytes = Array.from(new TextEncoder().encode(segment));
      const initTokens = textBytes.map(
        (b) => encoder.get(byteEncoder.get(b)!) ?? b
      );

      let tokens = [...initTokens];
      let step = 0;

      while (true) {
        const pairStats = getPairStats(tokens);
        const validStats = pairStats.filter(({ canMerge }) => canMerge);

        const stepData: Step = {
          step: globalStep++,
          segment,
          tokens: [...finalTokens, ...tokens],
          pairStats,
        };

        if (step === 0) {
          stepData.reason = `初始化 '${segment}'，从字节映射 token。`;
        }

        if (validStats.length === 0) {
          stepData.nextHint = `无合并项，结束段 '${segment}'。`;
          allSteps.push(stepData);
          break;
        }

        const best = validStats[0];
        const newId = encoder.get(best.mergedStr)!;

        stepData.merged = `${best.mergedStr}`;
        stepData.newTokenId = newId;
        stepData.reason = `合并 ${best.mergedStr}，优先级（index）=${best.vocabIndex}`;
        stepData.nextHint = `下一步继续查找优先级最小的合并对。`;

        allSteps.push(stepData);

        const newTokens: number[] = [];
        let i = 0;
        while (i < tokens.length) {
          if (
            i < tokens.length - 1 &&
            tokens[i] === best.pair[0] &&
            tokens[i + 1] === best.pair[1]
          ) {
            newTokens.push(newId);
            i += 2;
          } else {
            newTokens.push(tokens[i]);
            i++;
          }
        }

        tokens = newTokens;
        step++;
      }

      finalTokens.push(...tokens);
      for (const id of tokens) {
        const chars = tokenIdToString.get(id) ?? "";
        for (const c of chars) {
          const byte = unicodeToByte.get(c);
          if (byte !== undefined) decodedBytes.push(byte);
        }
      }
    }

    setSteps(allSteps);
    setDecodedText(new TextDecoder().decode(new Uint8Array(decodedBytes)));
  };

  const groupedBySegment = steps.reduce((acc, step) => {
    if (!acc[step.segment]) acc[step.segment] = [];
    acc[step.segment].push(step);
    return acc;
  }, {} as Record<string, Step[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        GPT-2 分词器编码与解码演示（分段显示）
      </h2>

      <textarea
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          handleEncode(e.target.value);
        }}
        placeholder="请输入文本"
        className="w-full resize-none rounded-md border p-2 outline-none"
        rows={3}
      />

      {segmentsPreview.length > 0 && (
        <div className="rounded bg-ctp-surface0 p-3 text-sm">
          <strong className="text-ctp-subtext1">正则匹配结果：</strong>
          <div className="mt-2 flex flex-wrap gap-1">
            {segmentsPreview.map((seg, i) => (
              <span
                key={i}
                className={`rounded px-2 py-1 text-xs text-ctp-base ${
                  COLORS[i % COLORS.length]
                }`}
              >
                {`${Array.from(new TextEncoder().encode(seg))
                  .map((b) => byteEncoder.get(b) ?? "?")
                  .join("")} - (${seg})`}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedBySegment).map(([segment, steps]) => (
          <div
            key={segment}
            className="rounded-md border bg-ctp-base p-4 text-ctp-text"
          >
            <h3 className="mb-2 font-semibold text-ctp-flamingo">
              {`分段："${segment}"`}
            </h3>
            <div className="flex gap-4">
              <div className="h-[420px] max-h-full flex-1 overflow-auto scrollbar-thin scrollbar-track-ctp-base scrollbar-thumb-ctp-base hover:scrollbar-thumb-ctp-flamingo">
                {steps.map((step, index) => (
                  <div key={index} className="mb-4 border-b pb-4">
                    <div className="mb-2 text-sm font-semibold text-ctp-subtext0">
                      Step {step.step}：{step.reason}
                    </div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {step.tokens.map((id, i) => (
                        <span
                          key={i}
                          className="rounded border border-ctp-surface2 bg-ctp-surface1 px-2 py-1 text-xs"
                        >
                          <strong>{id}</strong> (
                          {tokenIdToString.get(id) ??
                            byteEncoder.get(id) ??
                            "?"}
                          )
                        </span>
                      ))}
                    </div>
                    {step.merged && (
                      <div className="text-sm text-ctp-green">
                        合并操作：{step.merged}
                      </div>
                    )}
                    {step.nextHint && (
                      <div className="text-sm text-ctp-sky">
                        下一步提示：{step.nextHint}
                      </div>
                    )}
                    <div className="text-sm text-ctp-overlay1">
                      <strong>当前可合并对频率统计：</strong>
                      <table className="mt-2 w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="pr-4">Pair</th>
                            <th className="pr-4">Merged</th>
                            <th className="pr-4">可合并</th>
                            <th className="pr-4">优先级 (Index)</th>
                            <th className="pr-4">频率</th>
                          </tr>
                        </thead>
                        <tbody>
                          {step.pairStats.map(
                            ({
                              key,
                              pair,
                              freq,
                              mergedStr,
                              canMerge,
                              vocabIndex,
                            }) => (
                              <tr key={key} className="border-b">
                                <td>{`${pair[0]}_${pair[1]}`}</td>
                                <td>{mergedStr}</td>
                                <td>{canMerge ? "✅" : "❌"}</td>
                                <td>{canMerge ? vocabIndex : "-"}</td>
                                <td>{freq}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-[400px] max-w-full">
                <TokenViewer
                  isFetching={false}
                  data={{
                    name: segment,
                    tokens: steps[steps.length - 1]?.tokens ?? [],
                    count: steps[steps.length - 1]?.tokens.length ?? 0,
                    segments:
                      steps[steps.length - 1]?.tokens.map((id, idx) => ({
                        text: decodeBpeTokenString(
                          tokenIdToString.get(id) || "?",
                          unicodeToByte
                        ),
                        tokens: [{ id, idx }],
                      })) ?? [],
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-2 text-sm">
        <strong>解码结果：</strong>
        <div className="mt-1 whitespace-pre-wrap text-ctp-sky">
          {decodedText}
        </div>
      </div>
    </div>
  );
}
