import { A4_HEIGHT_PX, LETTER_HEIGHT_PX } from "@/app/lib/constants";
import { useEffect, useState } from "react";

export const getPxPerRem = () => {
  const bodyComputedStyle = getComputedStyle(
    document.querySelector("body")!
  ) as any;
  return parseFloat(bodyComputedStyle["font-size"]) || 16;
};

export const CSS_VARIABLES = {
  "--top-nav-bar-height": "3.5rem",
  "--resume-control-bar-height": "3rem",
  "--resume-padding": "1.5rem",
} as const;

export const useSetDefaultScale = ({
  setScale,
  documentSize,
}: {
  setScale: (scale: number) => void;
  documentSize: string;
}) => {
  const [scaleOnResize, setScaleOnResize] = useState(true);

  useEffect(() => {
    const getDefaultScale = () => {
      const screenHeightPx = window.innerHeight;
      const PX_PER_REM = getPxPerRem();
      const screenHeightRem = screenHeightPx / PX_PER_REM;
      const topNavBarHeightRem = parseFloat(
        CSS_VARIABLES["--top-nav-bar-height"]
      );
      const resumeControlBarHeight = parseFloat(
        CSS_VARIABLES["--resume-control-bar-height"]
      );
      const resumePadding = parseFloat(CSS_VARIABLES["--resume-padding"]);
      const topAndBottomResumePadding = resumePadding * 2;
      const defaultResumeHeightRem =
        screenHeightRem -
        topNavBarHeightRem -
        resumeControlBarHeight -
        topAndBottomResumePadding;
      const resumeHeightPx = defaultResumeHeightRem * PX_PER_REM;
      const height = documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
      const defaultScale = Math.round((resumeHeightPx / height) * 100) / 100;
      return defaultScale;
    };

    const setDaultScale = () => {
      const defaultScale = getDefaultScale();
      setScale(defaultScale);
    };

    if (scaleOnResize) {
      setDaultScale();
      window.addEventListener("resize", setDaultScale);
    }

    return () => {
      window.removeEventListener("resize", setDaultScale);
    };
  }, [setScale, scaleOnResize, documentSize]);

  return { scaleOnResize, setScaleOnResize };
};
