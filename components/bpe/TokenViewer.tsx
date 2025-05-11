"use client";

export type Segment = {
  text: string;
  tokens: { id: number; idx: number }[];
};

export interface TokenizerResult {
  name: string;
  // Array<{ text: string; tokens: { id: number; idx: number }[] }> ?
  tokens: number[];
  segments?: Segment[];
  count: number;
}
import { Fragment, useState } from "react";

const COLORS = [
  "bg-sky-200",
  "bg-amber-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-orange-200",
  "bg-cyan-200",
  "bg-gray-200",
  "bg-purple-200",
  "bg-indigo-200",
  "bg-lime-200",
  "bg-rose-200",
  "bg-violet-200",
  "bg-yellow-200",
  "bg-emerald-200",
  "bg-zinc-200",
  "bg-red-200",
  "bg-fuchsia-200",
  "bg-pink-200",
  "bg-teal-200",
];

function encodeWhitespace(str: string) {
  return str
    .replaceAll(" ", "⋅")
    .replaceAll("\t", "→")
    .replaceAll("\f", "\\f\f")
    .replaceAll("\b", "\\b\b")
    .replaceAll("\v", "\\v\v")
    .replaceAll("\r", "\\r\r")
    .replaceAll("\n", "\\n\n")
    .replaceAll("\\r\r\\n\n", "\\r\\n\r\n");
}

export function TokenViewer(props: {
  isFetching: boolean;
  model?: string;
  data?: TokenizerResult;
}) {
  const [indexHover, setIndexHover] = useState<number | null>(null);
  const [showWhitespace, setShowWhitespace] = useState(false);

  const tokenCount = props.data?.tokens?.length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-grow rounded-md border bg-white p-4 shadow-sm">
          <p className="text-sm">Token count</p>
          <p className="text-lg">{tokenCount}</p>
        </div>
      </div>

      <pre className="min-h-[128px] max-w-[100vw] overflow-auto whitespace-pre-wrap break-all rounded-md border bg-white p-4 shadow-sm">
        {props.data?.segments?.map(({ text }, idx) => (
          <span
            key={idx}
            onMouseEnter={() => setIndexHover(idx)}
            onMouseLeave={() => setIndexHover(null)}
            className={
              indexHover == null || indexHover === idx
                ? COLORS[idx % COLORS.length]
                : ""
            }
          >
            {showWhitespace || indexHover === idx
              ? encodeWhitespace(text)
              : text}
          </span>
        ))}
      </pre>

      <pre className="min-h-[128px] max-w-[100vw] overflow-auto whitespace-pre-wrap break-all rounded-md border bg-white p-4 shadow-sm">
        {props.data && tokenCount > 0 && (
          <span className={props.isFetching ? "opacity-50" : ""}>
            {props.data.segments?.map((segment, segmentIdx) => (
              <Fragment key={segmentIdx}>
                {segment.tokens.map((token) => (
                  <Fragment key={token.idx}>
                    <span
                      onMouseEnter={() => setIndexHover(segmentIdx)}
                      onMouseLeave={() => setIndexHover(null)}
                      className={
                        indexHover === segmentIdx
                          ? COLORS[segmentIdx % COLORS.length]
                          : ""
                      }
                    >
                      {token.id}
                    </span>
                    <span className="last-of-type:hidden">, </span>
                  </Fragment>
                ))}
              </Fragment>
            ))}
          </span>
        )}
      </pre>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showWhitespace}
          onChange={() => setShowWhitespace((v) => !v)}
        />
        <label className="text-sm font-medium leading-none">
          Show whitespace
        </label>
      </div>
    </div>
  );
}
