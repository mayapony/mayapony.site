// components/TrainView.tsx
"use client";

import {
  bytesToUnicode,
  decodeBpeTokenString,
  getColorForId,
  getStats,
  mergeSequences,
} from "@/utils/bpe";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useState } from "react";

interface MergeStep {
  step: number;
  pair: [number, number];
  frequency: number;
  newTokenId: number;
  updatedSequences: number[][];
  pairStats: Map<string, number>;
  mergePairsText: Array<[string, string]>;
}

type TrainViewProps = {
  onMergesReady?: (
    vocab: Array<[string, string]>,
    encoderMap: Map<string, number>
  ) => void;
};

export default function TrainView({ onMergesReady }: TrainViewProps) {
  const [inputText, setInputText] = useState("");
  const [numMerges, setNumMerges] = useState(10);
  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [hoveredPair, setHoveredPair] = useState<string | null>(null);

  const [encoderMap, setEncoderMap] = useState<Map<string, number>>(new Map());
  const [vocab, setVocab] = useState<Array<[string, string]>>([]);

  const [initialEncoderEntries, setInitialEncoderEntries] = useState<
    [string, number][]
  >([]);

  const byteEncoder = bytesToUnicode();
  const byteDecoder = new Map<string, number>();
  for (const [b, c] of byteEncoder.entries()) {
    byteDecoder.set(c, b);
  }
  const decoderMap = new Map<number, string>();
  for (const [c, b] of encoderMap.entries()) {
    decoderMap.set(b, c);
  }

  const runBPETraining = () => {
    const byteEncoder = bytesToUnicode();

    const decoder = new Map<number, string>();
    const encoder = new Map<string, number>();
    const mergePairsText: Array<[string, string]> = [];

    for (const [b, c] of byteEncoder.entries()) {
      encoder.set(c, b);
      decoder.set(b, c);
    }

    const newSteps: MergeStep[] = [];

    const lines = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const sequences: number[][] = [];

    for (const line of lines) {
      const lineBytes = Array.from(new TextEncoder().encode(line));

      const lineIds: number[] = [];

      for (let i = 0; i < lineBytes.length; i++) {
        const b = lineBytes[i];
        const ch = byteEncoder.get(b)!;

        if (!encoder.has(ch)) {
          encoder.set(ch, b);
          decoder.set(b, ch);
        }

        lineIds.push(encoder.get(ch)!);
      }

      sequences.push(lineIds);
    }

    const initialEncoderEntries: [string, number][] = Array.from(
      encoder.entries()
    );
    setInitialEncoderEntries(initialEncoderEntries);

    const initialStep: MergeStep = {
      step: 0,
      pair: [-1, -1],
      frequency: 0,
      newTokenId: -1,
      updatedSequences: JSON.parse(JSON.stringify(sequences)),
      pairStats: getStats(sequences),
      mergePairsText: [],
    };
    newSteps.push(initialStep);

    let nextId = 256;

    for (let step = 0; step < numMerges; step++) {
      const pairStats = getStats(sequences);
      if (pairStats.size === 0) break;

      const [bestPairKey, freq] = Array.from(pairStats.entries()).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max),
        ["", 0]
      );
      const [a, b] = bestPairKey.split("_").map(Number);

      const mergedStr = decoder.get(a)! + decoder.get(b)!;
      mergePairsText.push([decoder.get(a)!, decoder.get(b)!]);

      decoder.set(nextId, mergedStr);
      encoder.set(mergedStr, nextId);

      const newSeq = mergeSequences(sequences, [a, b], nextId);

      newSteps.push({
        step: step + 1,
        pair: [a, b],
        frequency: freq,
        newTokenId: nextId,
        updatedSequences: newSeq,
        pairStats: new Map(pairStats),
        mergePairsText: [...mergePairsText],
      });

      sequences.length = 0;
      for (const seq of newSeq) sequences.push(seq);
      nextId++;
    }

    setSteps(newSteps);
    setStepIndex(0);
    setEncoderMap(encoder);
    setVocab(mergePairsText);

    if (onMergesReady) {
      onMergesReady(mergePairsText, encoder);
    }
  };

  const currentStep = steps[stepIndex];
  const hoveredPairKey = hoveredPair;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="col-span-2">
        <h2 className="mb-2 text-xl font-semibold">BPE 合并训练器</h2>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入训练文本，每行一句"
          className="mb-2 w-full resize-none rounded border p-2"
          rows={4}
        />

        <div className="mb-4 flex items-center gap-4">
          <label>合并步数:</label>
          <input
            type="number"
            value={numMerges}
            onChange={(e) => setNumMerges(Number(e.target.value))}
            className="w-20 resize-none rounded border p-1"
          />
          <button
            onClick={runBPETraining}
            className="rounded bg-ctp-flamingo px-4 py-1 text-white hover:bg-ctp-pink"
          >
            开始训练
          </button>
        </div>

        {steps.length > 0 && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
              className="rounded border px-3 py-1 hover:bg-gray-100"
            >
              ← 上一步
            </button>
            <div className="mt-1 text-sm">
              Step {stepIndex} / {steps.length - 1}
            </div>
            <button
              onClick={() =>
                setStepIndex(Math.min(steps.length - 1, stepIndex + 1))
              }
              className="rounded border px-3 py-1 hover:bg-gray-100"
            >
              下一步 →
            </button>
          </div>
        )}

        {currentStep && (
          <div className="space-y-3">
            <div className="text-sm">
              <strong>当前序列：</strong>
              {currentStep.updatedSequences.map((seq, idx) => (
                <div key={idx} className="my-1 flex flex-wrap gap-1">
                  {seq.map((id, i, arr) => {
                    const prev = arr[i - 1];
                    const next = arr[i + 1];
                    const isHovered =
                      hoveredPairKey &&
                      ((prev !== undefined &&
                        `${prev}_${id}` === hoveredPairKey) ||
                        (next !== undefined &&
                          `${id}_${next}` === hoveredPairKey));

                    const tokenStr = decoderMap.get(id) ?? "<?>";

                    // 查找来源：此 token 是不是某一步的合并产物
                    const mergedFrom = steps
                      .find((s) => s.newTokenId === id)
                      ?.pair?.join(", ");

                    const isJustMerged =
                      currentStep.newTokenId === id && stepIndex > 0;

                    return (
                      <motion.div
                        key={`${idx}-${i}`}
                        className={classNames(
                          "group relative z-10 cursor-default rounded px-2 py-0.5 text-xs",
                          !isHovered && "border-2 border-white",
                          isHovered && "border-2 border-black",
                          isJustMerged && "ring-2 ring-black ring-offset-1"
                        )}
                        style={{
                          backgroundColor: getColorForId(id),
                        }}
                      >
                        <span>
                          <strong>{id}</strong>{" "}
                          <span className="text-gray-600">({tokenStr})</span>
                        </span>
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                          Token ID: {id}
                          <br />
                          解码结果:{" "}
                          {`'${decodeBpeTokenString(tokenStr, byteDecoder)}'`}
                          {mergedFrom && (
                            <>
                              <br />
                              合并自: ({mergedFrom})
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="border-t pt-2 text-sm">
              <strong>统计信息：</strong>
              <div>
                唯一 Token 数量：
                {new Set(currentStep.updatedSequences.flat()).size}
              </div>
              <div>
                总 Token 数量：
                {currentStep.updatedSequences.reduce(
                  (sum, s) => sum + s.length,
                  0
                )}
              </div>
              {stepIndex < steps.length - 1 && (
                <div className="mt-1">
                  下一步合并：({steps[stepIndex + 1].pair[0]},{" "}
                  {steps[stepIndex + 1].pair[1]}) →
                  <span className="font-semibold text-blue-600">
                    ID {steps[stepIndex + 1].newTokenId}
                  </span>
                  ，频率：{steps[stepIndex + 1].frequency}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {currentStep && (
        <div className="border-l pl-4 text-sm">
          <h3 className="mb-2 font-semibold">当前 Pair 频率表</h3>
          <div className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-ctp-base scrollbar-thumb-ctp-base hover:scrollbar-thumb-ctp-flamingo">
            {[...getStats(currentStep.updatedSequences).entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([key, freq]) => {
                const [a, b] = key.split("_").map(Number);
                const tokenA = decoderMap.get(a) ?? "?";
                const tokenB = decoderMap.get(b) ?? "?";
                const preview = tokenA + tokenB;
                const decoded = decodeBpeTokenString(preview, byteDecoder);

                return (
                  <div
                    key={key}
                    className={classNames(
                      "cursor-pointer rounded px-2 py-1 hover:bg-blue-100",
                      key === hoveredPairKey && "bg-blue-200"
                    )}
                    onMouseEnter={() => setHoveredPair(key)}
                    onMouseLeave={() => setHoveredPair(null)}
                  >
                    <div className="flex justify-between font-mono">
                      <span>{`(${a} '${tokenA}', ${b} '${tokenB}')`}</span>
                      <span>频率: {freq}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {`→ 合并预览: '${preview}'`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {`→ 解码预览: '${decoded}'`}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <div className="col-span-3 mt-8 border-t pt-4 text-sm">
          <h3 className="mb-4 text-lg font-semibold">
            当前 Step {stepIndex} 的编码与词汇表状态
          </h3>
          <div className="flex gap-6">
            {/* Encoder */}
            <div className="max-h-[300px] w-1/2 overflow-y-auto rounded-md pr-2 scrollbar-thin scrollbar-track-ctp-base scrollbar-thumb-ctp-base hover:scrollbar-thumb-ctp-flamingo">
              <h4 className="mb-2 font-semibold text-blue-700">
                Encoder 映射表
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {(stepIndex === 0
                  ? initialEncoderEntries
                  : [...encoderMap.entries()].filter(([, id]) => {
                      const currentMaxId = steps
                        .slice(0, stepIndex + 1)
                        .map((s) => s.newTokenId)
                        .filter((id) => id !== -1);
                      return (
                        currentMaxId.length === 0 ||
                        id <= Math.max(...currentMaxId)
                      );
                    })
                )
                  .sort(([, aId], [, bId]) => aId - bId)
                  .map(([token, id]) => (
                    <div
                      key={`enc-${id}`}
                      className="flex justify-between rounded border p-2 hover:bg-gray-50"
                    >
                      <span className="text-gray-700">
                        <code>{`${token} - (${decodeBpeTokenString(
                          token,
                          byteDecoder
                        )})`}</code>{" "}
                        → <strong>{id}</strong>
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Vocab */}
            <div className="max-h-[300px] w-1/3 overflow-y-auto rounded-md pr-2 scrollbar-thin scrollbar-track-ctp-base scrollbar-thumb-ctp-base hover:scrollbar-thumb-ctp-flamingo">
              <h4 className="mb-2 font-semibold text-green-700">
                Vocab 表（合并规则）
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {steps[stepIndex].mergePairsText.map(([left, right], idx) => (
                  <div
                    key={`merge-rule-${idx}`}
                    className="flex justify-between rounded border p-2 hover:bg-gray-50"
                  >
                    <span>
                      <code>{left}</code> + <code>{right}</code>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
