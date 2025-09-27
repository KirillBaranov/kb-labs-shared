/** Levenshtein distance (iterative DP, O(n*m)) */
export function levenshtein(a: string, b: string): number {
    const n = a.length, m = b.length;
    if (n === 0) {return m;}
    if (m === 0) {return n;}

    const dp = new Array(m + 1);
    for (let j = 0; j <= m; j++) {dp[j] = j;}

    for (let i = 1; i <= n; i++) {
        let prev = dp[0];
        dp[0] = i;
        for (let j = 1; j <= m; j++) {
            const tmp = dp[j];
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[j] = Math.min(
                dp[j] + 1,      // deletion
                dp[j - 1] + 1,  // insertion
                prev + cost     // substitution
            );
            prev = tmp;
        }
    }
    return dp[m];
}

/** Similarity in [0,1], 1 when strings are equal. */
export function similarity(a: string, b: string): number {
    if (!a && !b) {return 1;}
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen ? 1 - dist / maxLen : 1;
}

/** Longest common substring (returns the substring, not subsequence) */
export function longestCommonSubstr(a: string, b: string): string {
    const n = a.length, m = b.length;
    if (!n || !m) {return "";}
    const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
    let best = 0, end = 0;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp![i]![j] = dp![i - 1]![j - 1]! + 1;
                if (dp![i]![j]! > best) { best = dp![i]![j]!; end = i; }
            }
        }
    }
    return a.slice(end - best, end);
}