import {
  ResumeCustom,
  ResumeSkills,
  ResumeWorkExperience,
} from "@/app/lib/redux/types";
import {
  ResumeFeaturedSkill,
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
} from "./common";
import { View } from "@react-pdf/renderer";
import { spacing, styles } from "./styles";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const { descriptions } = custom;

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions}
          showBulletPoints={showBulletPoints}
        />
      </View>
    </ResumePDFSection>
  );
};
