"use client";

import { bytesToUnicode } from "@/utils/bpe";
import classNames from "classnames";
import { useState } from "react";

interface EncodeDecodeViewProps {
  vocab: Map<number, string>;
  encoder: Map<string, number>;
  mergePairs: Array<[number, number, number]>;
}

interface Step {
  step: number;
  tokens: number[];
  merged?: string;
  pair?: [number, number];
  newTokenId?: number;
  reason?: string;
  context?: {
    previousTokens: number[];
    matchedPositions: number[];
    vocabPreview: string;
  };
}

export default function EncodeDecodeView({
  vocab,
  encoder,
  mergePairs,
}: EncodeDecodeViewProps) {
  const [inputText, setInputText] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [decodedText, setDecodedText] = useState("");

  const byteEncoder = bytesToUnicode();
  const unicodeToByte = new Map<string, number>();
  for (const [byte, char] of byteEncoder.entries()) {
    unicodeToByte.set(char, byte);
  }

  const handleEncode = () => {
    const textBytes = Array.from(new TextEncoder().encode(inputText));
    const initTokens = textBytes.map(
      (b) => encoder.get(byteEncoder.get(b)!) ?? b
    );

    const history: Step[] = [
      {
        step: 0,
        tokens: [...initTokens],
        reason: "初始化：将每个 UTF-8 字节映射为初始 Token",
      },
    ];

    let tokens = [...initTokens];
    let step = 1;

    for (const [a, b, newId] of mergePairs) {
      const newTokens: number[] = [];
      let changed = false;
      const matchedPositions: number[] = [];

      for (let i = 0; i < tokens.length; ) {
        if (i < tokens.length - 1 && tokens[i] === a && tokens[i + 1] === b) {
          newTokens.push(newId);
          matchedPositions.push(i);
          i += 2;
          changed = true;
        } else {
          newTokens.push(tokens[i]);
          i++;
        }
      }

      if (!changed) continue;

      const vocabPreview = `${vocab.get(a)} + ${vocab.get(b)} → ${vocab.get(
        newId
      )}`;

      tokens = [...newTokens];
      history.push({
        step,
        tokens: [...tokens],
        merged: vocabPreview,
        pair: [a, b],
        newTokenId: newId,
        reason: `在当前 token 序列中发现 (${a}, ${b})，表示为 '${vocab.get(
          a
        )}${vocab.get(b)}'，执行 BPE 合并生成新 token ID ${newId}。`,
        context: {
          previousTokens: [...history[history.length - 1].tokens],
          matchedPositions,
          vocabPreview,
        },
      });

      step++;
    }

    setSteps(history);
    setStepIndex(0);

    const decodedBytes: number[] = [];
    for (const id of tokens) {
      const chars = vocab.get(id) ?? "";
      for (const c of chars) {
        const byte = unicodeToByte.get(c);
        if (byte !== undefined) decodedBytes.push(byte);
      }
    }

    const result = new TextDecoder().decode(new Uint8Array(decodedBytes));
    setDecodedText(result);
  };

  const current = steps[stepIndex];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">🧪 GPT-2 分词器编码与解码演示</h2>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="请输入文本"
        className="w-full rounded border p-2"
        rows={3}
      />

      <button
        onClick={handleEncode}
        className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
      >
        开始编码与解码
      </button>

      {steps.length > 0 && (
        <>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
              disabled={stepIndex === 0}
              className="rounded border px-2 py-1 disabled:opacity-50"
            >
              ← 上一步
            </button>
            <div>
              Step {stepIndex} / {steps.length - 1}
            </div>
            <button
              onClick={() =>
                setStepIndex((s) => Math.min(steps.length - 1, s + 1))
              }
              disabled={stepIndex === steps.length - 1}
              className="rounded border px-2 py-1 disabled:opacity-50"
            >
              下一步 →
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <strong>当前 Token 序列：</strong>
              <div className="mt-1 flex flex-wrap gap-2">
                {current.tokens.map((id, i) => (
                  <span
                    key={i}
                    className={classNames(
                      "rounded border px-2 py-1 text-xs",
                      "bg-gray-50 hover:bg-yellow-100"
                    )}
                  >
                    <strong>{id}</strong> ({vocab.get(id) ?? "?"})
                  </span>
                ))}
              </div>
            </div>

            {current.merged && (
              <div className="text-green-700">
                ✅ 合并操作：{current.merged}
              </div>
            )}

            {current.reason && (
              <div className="space-y-1 text-sm text-gray-700">
                <div>
                  📌 <strong>操作原因说明：</strong> {current.reason}
                </div>
                {current.context && (
                  <>
                    <div>
                      🔍 <strong>依赖状态：</strong>
                    </div>
                    <ul className="ml-4 list-disc space-y-1 text-xs text-gray-600">
                      <li>
                        上一步 Token 序列为：
                        <span className="ml-1">
                          {current.context.previousTokens
                            .map((id) => `${id}(${vocab.get(id)})`)
                            .join(" ")}
                        </span>
                      </li>
                      <li>
                        合并目标位置：[
                        {current.context.matchedPositions.join(", ")}]
                      </li>
                      <li>字符合并预览：{current.context.vocabPreview}</li>
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-t pt-2 text-sm">
            <strong>解码结果：</strong>
            <div className="mt-1 whitespace-pre-wrap text-blue-600">
              {decodedText}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
