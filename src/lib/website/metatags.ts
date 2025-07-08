export const titleLookup: Record<string, string> = {
  "/": "bookemoji",
};

export const descriptionLookup: Record<string, string> = {
  "/": "A component workshop for sveltekit",
  "/docs": "Documentation for bookemoji",
  "/books": "A showcase of bookemoji",
  "/blog": "A blog containing musings from the bookemoji team",
  "/blog/bookemoji-vs-storybook": "An article discussing the difference between bookemoji and StoryBook",
  "/blog/bookemoji-vs-histoire": "An article discussing the difference between bookemoji and histoire",
  "/roadmap": "A development roadmap of bookemoji",
};

export const capitalizeWord = (word: string) => {
  const [first, ...rest] = word.split("");

  return [first.toUpperCase(), ...rest].join("");
};

export const capitalize = (title: string): string => {
  return title
    .split(" ")
    .map((word) => capitalizeWord(word))
    .join(" ");
};

export const titlify = (pathname: string) => {
  const detemplate = pathname
    // replace the leading "/"
    .replace("/", "")
    .replaceAll("-", " ")
    .replaceAll("/", " › ");

  return titleLookup[pathname] ?? capitalize(detemplate);
};
