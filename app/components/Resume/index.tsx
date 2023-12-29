"use client";

import { useAppSelector } from "@/app/lib/redux/hooks";
import { selectResume } from "@/app/lib/redux/resumeSlice";
import { selectSettings } from "@/app/lib/redux/settingsSlice";
import { useMemo, useState } from "react";
import { FlexboxSpacer } from "../FlexboxSpacer";
import { ResumeIFrameCSR } from "./ResumeIFrame";
import { ResumePDFProfile } from "./ResumePDF/ResumePDFProfile";
import { ResumePDF } from "./ResumePDF";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHypenationCallback,
} from "../fonts/hooks";
import { ResumeControlBarCSR } from "./ResumeControlBar";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  useRegisterReactPDFFont();
  useRegisterReactPDFHypenationCallback(settings.fontFamily);

  return (
    <>
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative">
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            <ResumeIFrameCSR
              documentSize={settings.documentSize}
              scale={scale}
              enablePDFViewer={false}
            >
              <ResumePDF resume={resume} settings={settings} isPDF={false} />
            </ResumeIFrameCSR>
          </section>
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={document}
            fileName={resume.profile.name + " - Resume"}
          />
        </div>
      </div>
    </>
  );
};
