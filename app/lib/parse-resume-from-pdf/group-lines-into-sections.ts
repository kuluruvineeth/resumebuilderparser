import { ResumeKey } from "../redux/types";
import { Line, Lines, ResumeSectionToLines, TextItem } from "./types";

export const PROFILE_SECTION: ResumeKey = "profile";

const SECTION_TITLE_PRIMARY_KEYWORDS = [
  "experience",
  "education",
  "project",
  "skill",
];

const SECTION_TITLE_SECONDARY_KEYWORDS = [
  "job",
  "course",
  "extracurricular",
  "objective",
  "summary",
  "award",
  "honor",
  "project",
];

const SECTION_TITLE_KEYWORDS = [
  ...SECTION_TITLE_PRIMARY_KEYWORDS,
  ...SECTION_TITLE_SECONDARY_KEYWORDS,
];

export const groupLinesIntoSections = (lines: Lines) => {
  let sections: ResumeSectionToLines = {};
  let sectionName: string = PROFILE_SECTION;
  let sectionLines: any = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const text = line[0]?.text.trim();
    if (isSectionTitle(line, i)) {
      sections[sectionName] = [...sectionLines];
      sectionName = text;
      sectionLines = [];
    } else {
      sectionLines.push(line);
    }
  }
  if (sectionLines.length > 0) {
    sections[sectionName] = [...sectionLines];
  }
  return sections;
};

const isSectionTitle = (line: Line, lineNumber: number) => {
  const isFirstTwoLines = lineNumber < 2;
  const hasMoreThanOneItemInLine = line.length > 1;
  const hasNoItemInLine = line.length === 0;
  if (isFirstTwoLines || hasMoreThanOneItemInLine || hasNoItemInLine) {
    return false;
  }

  const textItem = line[0];

  if (isBold(textItem) && hasLetterAndIsAllUpperCase(textItem)) {
    return true;
  }

  const text = textItem.text.trim();

  const textHasAtMost2Words =
    text.split(" ").filter((s) => s !== "&").length <= 2;
  const startsWithCapitalLetter = /[A-Z]/.test(text.slice(0, 1));

  if (
    textHasAtMost2Words &&
    hasOnlyLettersSpacesAmpersands(textItem) &&
    startsWithCapitalLetter &&
    SECTION_TITLE_KEYWORDS.some((keyword) =>
      text.toLowerCase().includes(keyword)
    )
  ) {
    return true;
  }

  return false;
};

export const isBold = (item: TextItem) => isTextItemBold(item.fontName);

const isTextItemBold = (fontName: string) =>
  fontName.toLowerCase().includes("bold");

export const hasLetter = (item: TextItem) => /[a-zA-Z]/.test(item.text);

export const hasLetterAndIsAllUpperCase = (item: TextItem) =>
  hasLetter(item) && item.text.toUpperCase() === item.text;

export const hasOnlyLettersSpacesAmpersands = (item: TextItem) =>
  /^[A-Za-z\s&]+$/.test(item.text);
