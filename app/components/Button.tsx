import { cx } from "../lib/cx";
import { ToolTip } from "./Tooltip";

type ReactButtonProps = React.ComponentProps<"button">;
type ReactAnchorProps = React.ComponentProps<"a">;

type ButtonProps = ReactAnchorProps | ReactButtonProps;

const isAnchor = (props: ButtonProps): props is ReactAnchorProps => {
  return "href" in props;
};

export const Button = (props: ButtonProps) => {
  if (isAnchor(props)) {
    return <a {...props} />;
  } else {
    return <button type="button" {...props} />;
  }
};

type IconButtonProps = ButtonProps & {
  size?: "small" | "medium";
  tooltipText: string;
};

export const IconButton = ({
  className,
  size = "medium",
  tooltipText,
  ...props
}: IconButtonProps) => (
  <ToolTip text={tooltipText}>
    <Button
      type="button"
      className={cx(
        "rounded-full outline-none hover:bg-gray-100 focus-visible:bg-gray-100",
        size === "medium" ? "p-1.5" : "p-1",
        className
      )}
      {...props}
    />
  </ToolTip>
);
