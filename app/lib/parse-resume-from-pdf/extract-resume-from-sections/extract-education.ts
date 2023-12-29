import { ResumeEducation } from "../../redux/types";
import { hasLetter } from "../group-lines-into-sections";
import { FeatureSet, ResumeSectionToLines, TextItem } from "../types";
import { hasComma, hasNumber } from "./extract-profile";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "./lib/bullet-points";
import { DATE_FEATURE_SETS } from "./lib/common-features";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";
import { divideSectionIntoSubsections } from "./lib/subsections";

const SCHOOLS = ["College", "University", "Institute", "School", "Academy"];
const hasSchool = (item: TextItem) =>
  SCHOOLS.some((school) => item.text.includes(school));

const DEGREES = ["Bachelor", "Master", "PhD", "Ph."];
const hasDegree = (item: TextItem) =>
  DEGREES.some((degree) => item.text.includes(degree)) ||
  /[ABM][A-Z\.]/.test(item.text);

const matchGPA = (item: TextItem) => item.text.match(/[0-4]\.\d{1,2}/);

const matchGrade = (item: TextItem) => {
  const grade = parseFloat(item.text);
  if (Number.isFinite(grade) && grade <= 110) {
    return [String(grade)] as RegExpMatchArray;
  }

  return null;
};

const SCHOOL_FEATURE_SETS: FeatureSet[] = [
  [hasSchool, 4],
  [hasDegree, -4],
  [hasNumber, -4],
];

const DEGREE_FEATURE_SETS: FeatureSet[] = [
  [hasDegree, 4],
  [hasSchool, -4],
  [hasNumber, -3],
];

const GPA_FEATURE_SETS: FeatureSet[] = [
  [matchGPA, 4, true],
  [matchGrade, 3, true],
  [hasComma, -3],
  [hasLetter, -4],
];

export const extractEducation = (sections: ResumeSectionToLines) => {
  const educations: ResumeEducation[] = [];
  const educationScores = [];
  const lines = getSectionLinesByKeywords(sections, ["education"]);
  const subsections = divideSectionIntoSubsections(lines);
  for (const subsectionsLines of subsections) {
    const textItems = subsectionsLines.flat();
    const [school, schoolScores] = getTextWithHighestFeatureScore(
      textItems,
      SCHOOL_FEATURE_SETS
    );
    const [degree, degreeScore] = getTextWithHighestFeatureScore(
      textItems,
      DEGREE_FEATURE_SETS
    );
    const [gpa, gpaScores] = getTextWithHighestFeatureScore(
      textItems,
      GPA_FEATURE_SETS
    );
    const [date, dateScores] = getTextWithHighestFeatureScore(
      textItems,
      DATE_FEATURE_SETS
    );

    let descriptions: string[] = [];
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionsLines);
    if (descriptionsLineIdx !== undefined) {
      const descriptionLines = subsectionsLines.slice(descriptionsLineIdx);
      descriptions = getBulletPointsFromLines(descriptionLines);
    }

    educations.push({ school, degree, gpa, date, descriptions });
    educationScores.push({
      schoolScores,
      degreeScore,
      gpaScores,
      dateScores,
    });
  }

  if (educations.length !== 0) {
    const courseLines = getSectionLinesByKeywords(sections, ["course"]);
    if (courseLines.length !== 0) {
      educations[0].descriptions.push(
        "Courses: " +
          courseLines
            .flat()
            .map((item) => item.text)
            .join(" ")
      );
    }
  }

  return {
    educations,
    educationScores,
  };
};
