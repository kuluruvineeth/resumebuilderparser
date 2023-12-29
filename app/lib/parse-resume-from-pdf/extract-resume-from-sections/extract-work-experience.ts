import { ResumeWorkExperience } from "../../redux/types";
import { isBold } from "../group-lines-into-sections";
import { FeatureSet, ResumeSectionToLines, TextItem } from "../types";
import { hasNumber } from "./extract-profile";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "./lib/bullet-points";
import { DATE_FEATURE_SETS, getHasText } from "./lib/common-features";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";
import { divideSectionIntoSubsections } from "./lib/subsections";

const WORK_EXPERIENCE_KEYWORDS_LOWERCASE = [
  "work",
  "experience",
  "employment",
  "history",
  "job",
];

const JOB_TITLES = [
  "Analyst",
  "Agent",
  "Administrator",
  "Architect",
  "Assistant",
  "Associate",
  "CTO",
];

const hasJobTitle = (item: TextItem) =>
  JOB_TITLES.some((jobTitle) =>
    item.text.split(/\s/).some((word) => word === jobTitle)
  );

const hasMoreThan5Words = (item: TextItem) => item.text.split(/\s/).length > 5;

const JOB_TITLE_FEATURE_LIST: FeatureSet[] = [
  [hasJobTitle, 4],
  [hasNumber, -4],
  [hasMoreThan5Words, -2],
];

export const extractWorkExperience = (sections: ResumeSectionToLines) => {
  const workExperiences: ResumeWorkExperience[] = [];
  const workExperiencesScores = [];
  const lines = getSectionLinesByKeywords(
    sections,
    WORK_EXPERIENCE_KEYWORDS_LOWERCASE
  );
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const descriptionsLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 2;

    const subsectionInfoTextItems = subsectionLines
      .slice(0, descriptionsLineIdx)
      .flat();

    const [date, dateScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      DATE_FEATURE_SETS
    );

    const [jobTitle, jonTitleScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      JOB_TITLE_FEATURE_LIST
    );

    const COMPANY_FEATURE_SET: FeatureSet[] = [
      [isBold, 2],
      [getHasText(date), -4],
      [getHasText(jobTitle), -4],
    ];

    const [company, companyScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      COMPANY_FEATURE_SET,
      false
    );

    const subsectionDescriptionLines =
      subsectionLines.slice(descriptionsLineIdx);
    const descriptions = getBulletPointsFromLines(subsectionDescriptionLines);

    workExperiences.push({ company, jobTitle, date, descriptions });
    workExperiencesScores.push({
      companyScores,
      jonTitleScores,
      dateScores,
    });
  }

  return { workExperiences, workExperiencesScores };
};
