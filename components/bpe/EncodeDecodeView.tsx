"use client";

import { TokenViewer } from "@/components/bpe/TokenViewer";
import { bytesToUnicode } from "@/utils/bpe";
import classNames from "classnames";
import { useState } from "react";

interface EncodeDecodeViewProps {
  vocab: Map<number, string>;
  encoder: Map<string, number>;
}

interface Step {
  step: number;
  tokens: number[];
  pairStats: Array<{
    pair: [number, number];
    freq: number;
    key: string;
    mergedStr: string;
    inEncoder: boolean;
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
  const [stepIndex, setStepIndex] = useState(0);
  const [decodedText, setDecodedText] = useState("");

  const byteEncoder = bytesToUnicode();
  const unicodeToByte = new Map<string, number>();
  for (const [byte, char] of byteEncoder.entries()) {
    unicodeToByte.set(char, byte);
  }

  const getPairStats = (
    tokens: number[],
    vocab: Map<number, string>
  ): Step["pairStats"] => {
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
        const mergedStr =
          (vocab.get(pair[0]) || "") + (vocab.get(pair[1]) || "");
        const inEncoder = encoder.has(mergedStr);
        return {
          pair,
          freq,
          key: `${pair[0]}_${pair[1]}`,
          mergedStr,
          inEncoder,
        };
      })
      .sort((a, b) => {
        if (a.inEncoder && !b.inEncoder) return -1;
        if (!a.inEncoder && b.inEncoder) return 1;
        return b.freq - a.freq;
      });
  };

  const handleEncode = (input: string) => {
    const textBytes = Array.from(new TextEncoder().encode(input));
    const initTokens = textBytes.map(
      (b) => encoder.get(byteEncoder.get(b)!) ?? b
    );

    let tokens = [...initTokens];
    let step = 0;
    const history: Step[] = [];

    while (true) {
      const pairStats = getPairStats(tokens, vocab);
      const validStats = pairStats.filter(({ inEncoder }) => inEncoder);

      const stepData: Step = {
        step,
        tokens: [...tokens],
        pairStats,
      };

      if (step === 0) {
        stepData.reason =
          "初始化：将每个字节转换为 Unicode 字符并映射为 Token ID。";
      }

      if (validStats.length === 0) {
        stepData.nextHint = "无可合并对，编码完成。";
        history.push(stepData);
        break;
      }

      const best = validStats[0];
      const newId = encoder.get(best.mergedStr)!;

      stepData.merged = `${vocab.get(best.pair[0])} + ${vocab.get(
        best.pair[1]
      )} = ${best.mergedStr}`;
      stepData.newTokenId = newId;
      stepData.reason = `选择频率最高的字符对 '${vocab.get(best.pair[0])}' (${
        best.pair[0]
      }) 与 '${vocab.get(best.pair[1])}' (${best.pair[1]})，合并为 '${
        best.mergedStr
      }'。`;
      stepData.nextHint = `下一步将合并 '${vocab.get(
        best.pair[0]
      )}' 与 '${vocab.get(best.pair[1])}' 为 '${
        best.mergedStr
      }'，对应 ID 为 ${newId}。`;

      history.push(stepData);

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
      <h2 className="text-xl font-semibold">
        🧪 GPT-2 分词器编码与解码演示（基于 Encoder/Vocab）
      </h2>

      <div className="flex gap-4">
        <div className="flex-1 space-y-6 ">
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

                {current.reason && (
                  <div className="text-sm text-gray-700">
                    <strong>操作原因说明：</strong> {current.reason}
                  </div>
                )}

                {current.nextHint && (
                  <div className="text-sm text-blue-700">
                    <strong>下一步提示：</strong> {current.nextHint}
                  </div>
                )}

                {current.pairStats && (
                  <div className="text-sm text-gray-600">
                    <strong>📊 当前可合并对频率统计：</strong>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      {current.pairStats.map(
                        ({ key, pair, freq, mergedStr, inEncoder }) => (
                          <li key={key}>
                            {`'${vocab.get(pair[0])}'_${vocab.get(pair[1])}`} →{" "}
                            {`'${mergedStr}'`}，频率：{freq}
                            {inEncoder ? " ✅" : " ❌"}
                          </li>
                        )
                      )}
                    </ul>
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
        <div className="w-[400px] max-w-full">
          <TokenViewer
            isFetching={false}
            data={{
              name: "Demo",
              tokens: current?.tokens || [],
              count: current?.tokens.length || 0,
              segments: current?.tokens.map((id, idx) => ({
                text: vocab.get(id) ?? "?",
                tokens: [{ id, idx }],
              })),
            }}
          />
        </div>
      </div>
    </div>
  );
}
