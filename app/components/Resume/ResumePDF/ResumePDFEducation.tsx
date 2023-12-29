import { ResumeEducation, ResumeWorkExperience } from "@/app/lib/redux/types";
import { ResumePDFBulletList, ResumePDFSection, ResumePDFText } from "./common";
import { View } from "@react-pdf/renderer";
import { spacing, styles } from "./styles";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  educations: ResumeEducation[];
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
        const hideScoolName = idx > 0 && school === educations[idx - 1].school;

        const showDescriptions = descriptions.join() !== "";

        return (
          <View key={idx}>
            {!hideScoolName && (
              <ResumePDFText bold={true}>{school}</ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideScoolName ? "-" + spacing["1"] : spacing["1.5"],
              }}
            >
              <ResumePDFText>{`${
                gpa ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}` : degree
              }`}</ResumePDFText>
              <ResumePDFText>{date}</ResumePDFText>
            </View>
            {showDescriptions && (
              <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                <ResumePDFBulletList
                  items={descriptions}
                  showBulletPoints={showBulletPoints}
                />
              </View>
            )}
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
