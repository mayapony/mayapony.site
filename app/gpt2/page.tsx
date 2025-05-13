"use client";

import EncodeDecodeView from "@/components/gpt2/EncodeDecodeView";
import TrainView from "@/components/gpt2/TrainView";
import { useState } from "react";

export default function BpePage() {
  const [vocab, setVocab] = useState<Array<[string, string]>>([]);
  const [encoderMap, setEncoderMap] = useState<Map<string, number>>(new Map());

  return (
    <div className="space-y-8 p-6">
      <TrainView
        onMergesReady={(vocab, encoder) => {
          setVocab(vocab);
          setEncoderMap(encoder);
        }}
      />

      {vocab.length > 0 && (
        <div className="border-t pt-8">
          <EncodeDecodeView vocab={vocab} encoder={encoderMap} />
        </div>
      )}
    </div>
  );
}
