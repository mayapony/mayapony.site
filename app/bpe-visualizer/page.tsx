"use client";

import EncodeDecodeView from "@/components/bpe/EncodeDecodeView";
import TrainView from "@/components/bpe/TrainView";
import { useState } from "react";

export default function BpePage() {
  const [vocabMap, setVocabMap] = useState<Map<number, string>>(new Map());
  const [encoderMap, setEncoderMap] = useState<Map<string, number>>(new Map());
  const [mergePairs, setMergePairs] = useState<Array<[number, number, number]>>(
    []
  );

  return (
    <div className="space-y-8 p-6">
      <TrainView
        onMergesReady={(vocab, encoder, mergePairs) => {
          setVocabMap(vocab);
          setEncoderMap(encoder);
          setMergePairs(mergePairs);
        }}
      />

      {vocabMap.size > 0 && (
        <div className="border-t pt-8">
          <EncodeDecodeView
            vocab={vocabMap}
            encoder={encoderMap}
            mergePairs={mergePairs}
          />
        </div>
      )}
    </div>
  );
}
