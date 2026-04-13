type PtSpan = { _type?: string; text?: string };
type PtBlock = { _type?: string; children?: PtSpan[] };

/** Разбивает portable text на абзацы (каждый block — отдельная строка). */
export function blocksToParagraphs(blocks: PtBlock[] | null | undefined): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => {
      const children = b.children;
      if (!Array.isArray(children)) return "";
      return children.map((c) => (typeof c.text === "string" ? c.text : "")).join("");
    })
    .map((s) => s.trim())
    .filter(Boolean);
}

export function blocksToPlainText(blocks: PtBlock[] | null | undefined): string {
  return blocksToParagraphs(blocks).join("\n\n");
}
