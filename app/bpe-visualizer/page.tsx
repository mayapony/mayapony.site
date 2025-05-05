"use client";

import EncodeDecodeView from "@/components/bpe/EncodeDecodeView";
import TrainView from "@/components/bpe/TrainView";
import { useState } from "react";

export default function BpePage() {
  const [merges, setMerges] = useState<Map<string, number>>(new Map());

  return (
    <div className="space-y-8 p-6">
      <TrainView onMergesReady={setMerges} />

      {merges.size > 0 && (
        <div className="border-t pt-8">
          <EncodeDecodeView merges={merges} />
        </div>
      )}
    </div>
  );
}
