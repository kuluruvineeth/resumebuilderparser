import { useEffect } from "react";
import { FONT_FAMILIES, getAllFontFamiliesToLoad } from "./constants";
import { Font } from "@react-pdf/renderer";

export const useRegisterReactPDFFont = () => {
  useEffect(() => {
    const allFontFamilies = getAllFontFamiliesToLoad();
    allFontFamilies.forEach((fontFamily) => {
      Font.register({
        family: fontFamily,
        fonts: [
          {
            src: `fonts/${fontFamily}-Regular.ttf`,
          },
          {
            src: `fonts/${fontFamily}-Bold.ttf`,
            fontWeight: "bold",
          },
        ],
      });
    });
  }, []);
};

export const useRegisterReactPDFHypenationCallback = (fontFamily: string) => {
  useEffect(() => {
    if (FONT_FAMILIES.includes(fontFamily as any)) {
      Font.registerHyphenationCallback((word) => [word]);
    } else {
      Font.registerHyphenationCallback((word) =>
        word
          .split("")
          .map((char) => [char, ""])
          .flat()
      );
    }
  }, [fontFamily]);
};
