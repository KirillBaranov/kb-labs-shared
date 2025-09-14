export type DiffLineAdd = { line: number; text: string };
export type DiffLineDel = { line: number; text: string };

export type DiffHunk = {
    header: string;      // e.g. "@@ -10,2 +12,3 @@ ..."
    oldStart: number;
    oldLines?: number;
    newStart: number;
    newLines?: number;
};

export type ParsedDiff = {
    files: string[]; // path without a/ or b/ prefixes
    addedByFile: Record<string, DiffLineAdd[]>;
    removedByFile: Record<string, DiffLineDel[]>;
    hunksByFile: Record<string, DiffHunk[]>;
};