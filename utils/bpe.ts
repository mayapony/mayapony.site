// ## UI Utils
const colorCache = new Map<number, string>();

export const getColorForId = (id: number): string => {
  if (!colorCache.has(id)) {
    const hue = (id * 137) % 360; // 137 是质数，能避免颜色聚集
    const saturation = 60 + ((id * 13) % 30); // 在 60~90% 饱和度之间波动
    const lightness = 60 + ((id * 29) % 20); // 在 60~80% 亮度之间波动
    const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colorCache.set(id, hsl);
  }
  return colorCache.get(id)!;
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

export function decodeBpeTokenString(
  tokenStr: string,
  byteDecoder: Map<string, number>
): string {
  const bytes: number[] = [];

  for (const ch of tokenStr) {
    const byte = byteDecoder.get(ch);
    if (byte !== undefined) {
      bytes.push(byte);
    } else {
      return tokenStr;
    }
  }

  try {
    const decoded = new TextDecoder().decode(new Uint8Array(bytes));
    return decoded.includes("�") ? tokenStr : decoded;
  } catch {
    return tokenStr;
  }
}

export const bytesToUnicode = (): Map<number, string> => {
  const bs: number[] = [];
  const cs: number[] = [];

  // 添加 ASCII 字符范围
  for (let i = 33; i <= 126; i++) bs.push(i); // "!" 到 "~"
  for (let i = 161; i <= 172; i++) bs.push(i); // "¡" 到 "¬"
  for (let i = 174; i <= 255; i++) bs.push(i); // "®" 到 "ÿ"

  // 复制 bs 到 cs
  cs.push(...bs);

  let n = 0;
  for (let b = 0; b < 256; b++) {
    if (!bs.includes(b)) {
      bs.push(b);
      cs.push(256 + n);
      n++;
    }
  }

  // 构建字典：byte -> unicode_char
  const byteToUnicodeMap: Map<number, string> = new Map();
  for (let i = 0; i < bs.length; i++) {
    byteToUnicodeMap.set(bs[i], String.fromCharCode(cs[i]));
  }

  return byteToUnicodeMap;
};

export const unicodeToBytes = (): Map<string, number> => {
  const bs: number[] = [];
  const cs: number[] = [];

  // 添加 ASCII 字符范围
  for (let i = 33; i <= 126; i++) bs.push(i); // "!" 到 "~"
  for (let i = 161; i <= 172; i++) bs.push(i); // "¡" 到 "¬"
  for (let i = 174; i <= 255; i++) bs.push(i); // "®" 到 "ÿ"

  // 复制 bs 到 cs
  cs.push(...bs);

  let n = 0;
  for (let b = 0; b < 256; b++) {
    if (!bs.includes(b)) {
      bs.push(b);
      cs.push(256 + n);
      n++;
    }
  }

  // 构建字典：byte -> unicode_char
  const unicodeToBytesMap: Map<string, number> = new Map();
  for (let i = 0; i < bs.length; i++) {
    unicodeToBytesMap.set(String.fromCharCode(cs[i]), bs[i]);
  }

  return unicodeToBytesMap;
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
