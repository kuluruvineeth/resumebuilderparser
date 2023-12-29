import { ResumeProject } from "../../redux/types";
import { isBold } from "../group-lines-into-sections";
import { FeatureSet, ResumeSectionToLines } from "../types";
import {
  getBulletPointsFromLines,
  getDescriptionsLineIdx,
} from "./lib/bullet-points";
import { DATE_FEATURE_SETS, getHasText } from "./lib/common-features";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";
import { divideSectionIntoSubsections } from "./lib/subsections";

export const extractProject = (sections: ResumeSectionToLines) => {
  const projects: ResumeProject[] = [];
  const projectScores = [];
  const lines = getSectionLinesByKeywords(sections, ["project"]);
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const descriptionLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 1;

    const subsectionInfoTextItems = subsectionLines
      .slice(0, descriptionLineIdx)
      .flat();

    const [date, dateScores] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      DATE_FEATURE_SETS
    );

    const PROJECT_FEATURE_SET: FeatureSet[] = [
      [isBold, 2],
      [getHasText(date), -4],
    ];

    const [project, projectScore] = getTextWithHighestFeatureScore(
      subsectionInfoTextItems,
      PROJECT_FEATURE_SET,
      false
    );

    const descriptionsLines = subsectionLines.slice(descriptionLineIdx);
    const descriptions = getBulletPointsFromLines(descriptionsLines);

    projects.push({ project, date, descriptions });
    projectScores.push({
      projectScore,
      dateScores,
    });
  }

  return { projects, projectScores };
};
