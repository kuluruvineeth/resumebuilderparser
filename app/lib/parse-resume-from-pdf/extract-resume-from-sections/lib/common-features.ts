export const getHasText = (text: string) => (item: TextItem) =>
  item.text.includes(text);

//Date Features

import { FeatureSet, TextItem } from "../../types";
import { hasComma } from "../extract-profile";

const hasYear = (item: TextItem) => /(?:19|20)\d{2}/.test(item.text);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const hasMonth = (item: TextItem) =>
  MONTHS.some(
    (month) =>
      item.text.includes(month) || item.text.includes(month.slice(0, 4))
  );

const SEASONS = ["Summer", "Fall", "Spring", "Winter"];

const hasSeason = (item: TextItem) =>
  SEASONS.some((season) => item.text.includes(season));

const hasPresent = (item: TextItem) => item.text.includes("Present");

export const DATE_FEATURE_SETS: FeatureSet[] = [
  [hasYear, 1],
  [hasMonth, 1],
  [hasSeason, 1],
  [hasPresent, 1],
  [hasComma, -1],
];
