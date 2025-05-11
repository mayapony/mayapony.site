// components/TrainView.tsx
"use client";

import {
  bytesToUnicode,
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
}

type TrainViewProps = {
  onMergesReady?: (merges: Map<string, number>) => void;
};

export default function TrainView({ onMergesReady }: TrainViewProps) {
  const [inputText, setInputText] = useState("");
  const [numMerges, setNumMerges] = useState(10);
  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [hoveredPair, setHoveredPair] = useState<string | null>(null);

  const [vocabMap, setVocabMap] = useState<Map<number, string>>(new Map());
  const [encoderMap, setEncoderMap] = useState<Map<string, number>>(new Map());

  const runBPETraining = () => {
    const byteEncoder = bytesToUnicode(); // 关键点

    const vocab = new Map<number, string>();
    const encoder = new Map<string, number>();
    const newSteps: MergeStep[] = [];

    let nextId = 0;
    // 初始化 vocab: 所有单字符 token（GPT-2 是字符级，而不是 byte）
    const lines = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const sequences: number[][] = [];

    for (const line of lines) {
      const lineBytes = Array.from(new TextEncoder().encode(line));
      const lineChars = lineBytes.map((b) => byteEncoder.get(b)!); // byte → unicode 字符
      const lineIds: number[] = [];
      for (const ch of lineChars) {
        if (!encoder.has(ch)) {
          encoder.set(ch, nextId);
          vocab.set(nextId, ch);
          nextId++;
        }
        lineIds.push(encoder.get(ch)!);
      }
      sequences.push(lineIds);
    }

    // Step 0（初始状态）
    const initialStep: MergeStep = {
      step: 0,
      pair: [-1, -1],
      frequency: 0,
      newTokenId: -1,
      updatedSequences: JSON.parse(JSON.stringify(sequences)),
      pairStats: getStats(sequences),
    };
    newSteps.push(initialStep);

    // 执行 BPE 合并
    for (let step = 0; step < numMerges; step++) {
      const pairStats = getStats(sequences);
      if (pairStats.size === 0) break;

      const [bestPairKey, freq] = Array.from(pairStats.entries()).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max),
        ["", 0]
      );
      const [a, b] = bestPairKey.split("_").map(Number);

      const mergedStr = vocab.get(a)! + vocab.get(b)!;
      vocab.set(nextId, mergedStr);
      encoder.set(mergedStr, nextId);

      const newSeq = mergeSequences(sequences, [a, b], nextId);

      newSteps.push({
        step: step + 1,
        pair: [a, b],
        frequency: freq,
        newTokenId: nextId,
        updatedSequences: newSeq,
        pairStats: new Map(pairStats),
      });

      sequences.length = 0;
      for (const seq of newSeq) sequences.push(seq);
      nextId++;
    }

    setSteps(newSteps);
    setStepIndex(0);
    setVocabMap(vocab);
    setEncoderMap(encoder);

    if (onMergesReady) {
      const mergeMap = new Map<string, number>();
      newSteps.forEach((step) => {
        if (step.pair[0] !== -1 && step.pair[1] !== -1) {
          mergeMap.set(`${step.pair[0]}_${step.pair[1]}`, step.newTokenId);
        }
      });
      onMergesReady(mergeMap);
    }
  };

  const currentStep = steps[stepIndex];
  const isNewToken = (id: number) => id >= 257;
  const hoveredPairKey = hoveredPair;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="col-span-2">
        <h2 className="mb-2 text-xl font-semibold">BPE 合并训练器</h2>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入训练文本，每行一句"
          className="mb-2 w-full rounded border p-2"
          rows={4}
        />

        <div className="mb-4 flex items-center gap-4">
          <label>合并步数:</label>
          <input
            type="number"
            value={numMerges}
            onChange={(e) => setNumMerges(Number(e.target.value))}
            className="w-20 rounded border p-1"
          />
          <button
            onClick={runBPETraining}
            className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700"
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

                    const tokenStr = vocabMap.get(id) ?? "<?>";

                    // 查找来源：此 token 是不是某一步的合并产物
                    const mergedFrom = steps
                      .find((s) => s.newTokenId === id)
                      ?.pair?.join(", ");

                    return (
                      <motion.div
                        key={`${idx}-${i}`}
                        className={classNames(
                          "group relative z-10 cursor-default rounded px-2 py-0.5 text-xs",
                          isHovered && "border border-blue-500",
                          !isNewToken(id) && "bg-gray-200 text-gray-700"
                        )}
                        style={{
                          backgroundColor: isNewToken(id)
                            ? getColorForId(id)
                            : undefined,
                        }}
                      >
                        <span>
                          <strong>{id}</strong>{" "}
                          <span className="text-gray-600">({tokenStr})</span>
                        </span>
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                          Token ID: {id}
                          <br />
                          Value: {`'${tokenStr}'`}
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
          <div className="h-[400px] overflow-y-auto pr-2">
            {[...getStats(currentStep.updatedSequences).entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([key, freq]) => {
                const [a, b] = key.split("_").map(Number);
                return (
                  <div
                    key={key}
                    className={classNames(
                      "flex cursor-pointer justify-between rounded px-2 py-1 hover:bg-blue-100",
                      key === hoveredPairKey && "bg-blue-200"
                    )}
                    onMouseEnter={() => setHoveredPair(key)}
                    onMouseLeave={() => setHoveredPair(null)}
                  >
                    <span>
                      ({a}, {b})
                    </span>
                    <span>{freq}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {vocabMap.size > 0 && (
        <div className="mt-8 border-t pt-4 text-sm">
          <h3 className="mb-2 text-lg font-semibold">📘 Encoder 映射表</h3>
          <div className="grid max-h-[300px] grid-cols-1 gap-4 overflow-y-auto pr-2 md:grid-cols-2">
            {[...encoderMap.entries()]
              .sort(([, aId], [, bId]) => aId - bId)
              .map(([token, id]) => (
                <div
                  key={id}
                  className="flex justify-between rounded border p-2 hover:bg-gray-50"
                >
                  <span className="text-gray-700">
                    <code>{token}</code> → <strong>{id}</strong>
                  </span>
                  <span className="text-xs text-gray-500">ID {id}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
