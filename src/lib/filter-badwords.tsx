const badWords = [
    "anjing",
    "babi",
    "bangsat",
    "goblok",
    "tolol",
    "bajingan",
    "kampret",
    "brengsek",
    "tai",
    "bodoh",
    "kontol",
    "memek",
    "jancuk",
    "asu",
    "laknat",
    "bejad",
    "perek",
    "lonte",
    "bangke",
    "ngentot",
    "tetek",
    "pantek",
    "pepek",
    "jembut",
    "jembud",
    "coli",
    "bego",
    "puki",
    "pukimak",
    "kimak",
    "pantat",
    "ngewe",
    "dongo",
    "jancok",
    "tempek",
    "peler",
    "peju",
    "pejuh",
    "silit",
    "porn",
    "jav",
    "onlyfans",
    "tocil",
    "tobrut",
    "jembot",
    "sex",
    "seks",
    "ewe",
    "ewean",
    "eue",
  ];

  function normalizeWord(word: string): string {
    return word.toLowerCase().replace(/(.)\1+/g, '$1');
  }

export function filterBadWords(text: string): string {
  let filteredText = text;

  const normalizedBadWords = badWords.map(word => ({
    original: word,
    normalized: normalizeWord(word)
  }));

  normalizedBadWords.forEach(({ normalized }) => {
    const pattern = normalized.split('').join('[\\s]*');
    const regex = new RegExp(`\\b[\\s]*${pattern}[\\s]*\\b`, 'gi');
    
    filteredText = filteredText.replace(regex, (match) => '*'.repeat(match.length));
  });

  return filteredText;
}