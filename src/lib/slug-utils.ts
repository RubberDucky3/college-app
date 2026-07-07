export function slugToProgram(
  slug: string,
  programs: string[]
): string | undefined {
  return programs.find(
    (p) => p.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );
}
