// ## UI Utils
export const getColorForId = (id: number) => {
  const hue = (id * 47) % 360;
  return `hsl(${hue}, 70%, 80%)`;
};

// ## BPE Utils
export const getStats = (sequences: number[][]): Map<string, number> => {
  const stats = new Map<string, number>();
  for (const seq of sequences) {
    for (let i = 0; i < seq.length - 1; i++) {
      const key = `${seq[i]}_${seq[i + 1]}`;
      stats.set(key, (stats.get(key) || 0) + 1);
    }
  }
  return stats;
};

export const tokenizeWithGpt2Pattern = (text: string): string[] => {
  const regex =
    /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
  return Array.from(text.matchAll(regex)).map((m) => m[0]);
};

export const bytesToUnicode = (): Map<number, string> => {
  const bs: number[] = [];
  const cs: number[] = [];

  for (let i = 33; i <= 126; ++i) bs.push(i);
  for (let i = 161; i <= 172; ++i) bs.push(i);
  for (let i = 174; i <= 255; ++i) bs.push(i);

  cs.push(...bs);
  let n = 0;
  for (let b = 0; b < 256; ++b) {
    if (!bs.includes(b)) {
      bs.push(b);
      cs.push(256 + n);
      n++;
    }
  }

  const map = new Map<number, string>();
  bs.forEach((b, i) => map.set(b, String.fromCharCode(cs[i])));
  return map;
};

export const mergeSequences = (
  sequences: number[][],
  pair: [number, number],
  newId: number
): number[][] => {
  return sequences.map((seq) => {
    const merged: number[] = [];
    let i = 0;
    while (i < seq.length) {
      if (i < seq.length - 1 && seq[i] === pair[0] && seq[i + 1] === pair[1]) {
        merged.push(newId);
        i += 2;
      } else {
        merged.push(seq[i]);
        i += 1;
      }
    }
    return merged;
  });
};
