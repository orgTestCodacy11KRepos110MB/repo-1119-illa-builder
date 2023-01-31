import { TextAreaProps } from "@illa-design/react"
import { ValidateMessageOldProps } from "@/widgetLibrary/PublicSector/InvalidMessage/interface"
import LabelProps from "@/widgetLibrary/PublicSector/Label/interface"
import { TooltipWrapperProps } from "@/widgetLibrary/PublicSector/TooltipWrapper/interface"
import { BaseWidgetProps } from "@/widgetLibrary/interface"

export interface WrappedTextareaProps
  extends Pick<
      TextAreaProps,
      "placeholder" | "disabled" | "readOnly" | "maxLength" | "minLength"
    >,
    BaseWidgetProps {
  showCharacterCount?: TextAreaProps["showCount"]
  value?: string
  colorScheme?: TextAreaProps["borderColor"]
  allowClear?: TextAreaProps["allowClear"]
  handleOnChange?: () => void
  handleOnFocus?: () => void
  handleOnBlur?: () => void
  heightType?: string
  minHeight?: string
  handleUpdateMultiExecutionResult: (
    updateSlice: {
      displayName: string
      value: Record<string, any>
    }[],
  ) => void
  getValidateMessage: (value: string) => string
}

export interface TextareaWidgetProps
  extends WrappedTextareaProps,
    BaseWidgetProps,
    LabelProps,
    TooltipWrapperProps,
    ValidateMessageOldProps {
  validateMessage: string
}
