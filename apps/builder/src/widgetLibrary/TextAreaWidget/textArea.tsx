import {
  FC,
  SyntheticEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react"
import { TextArea } from "@illa-design/react"
import { InvalidMessage } from "@/widgetLibrary/PublicSector/InvalidMessage"
import { handleValidateCheck } from "@/widgetLibrary/PublicSector/InvalidMessage/utils"
import { Label } from "@/widgetLibrary/PublicSector/Label"
import { TooltipWrapper } from "@/widgetLibrary/PublicSector/TooltipWrapper"
import {
  applyLabelAndComponentWrapperStyle,
  applyValidateMessageWrapperStyle,
} from "@/widgetLibrary/PublicSector/TransformWidgetWrapper/style"
import {
  TextareaWidgetProps,
  WrappedTextareaProps,
} from "@/widgetLibrary/TextAreaWidget/interface"

export const WrappedTextarea = forwardRef<
  HTMLTextAreaElement,
  WrappedTextareaProps
>((props, ref) => {
  const {
    displayName,
    value,
    minHeight,
    heightType,
    placeholder,
    disabled,
    readOnly,
    showCharacterCount,
    colorScheme,
    handleUpdateDsl,
    handleOnChange,
    handleOnFocus,
    handleOnBlur,
    allowClear,
    maxLength,
    minLength,
    handleUpdateMultiExecutionResult,
    getValidateMessage,
  } = props

  const handleClear = () => handleUpdateDsl({ value: "" })

  return (
    <TextArea
      autoSize={heightType === "Auto"}
      minH={`${minHeight}px`}
      w="100%"
      textAreaRef={ref}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      maxLength={maxLength}
      minLength={minLength}
      showCount={showCharacterCount}
      borderColor={colorScheme}
      allowClear={allowClear}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      onChange={(event) => {
        const value = event.currentTarget.value
        new Promise((resolve) => {
          const message = getValidateMessage(value)
          handleUpdateMultiExecutionResult([
            {
              displayName,
              value: {
                value: value || "",
                validateMessage: message,
              },
            },
          ])
          resolve(true)
        }).then(() => {
          handleOnChange?.()
        })
      }}
      onClear={handleClear}
    />
  )
})

WrappedTextarea.displayName = "WrappedTextarea"

export const TextareaWidget: FC<TextareaWidgetProps> = (props) => {
  const {
    value,
    placeholder,
    disabled,
    readOnly,
    showCharacterCount,
    colorScheme,
    displayName,
    handleUpdateDsl,
    handleUpdateGlobalData,
    handleDeleteGlobalData,
    allowClear,
    heightType,
    minHeight,
    minLength,
    maxLength,
    labelPosition,
    labelFull,
    label,
    labelAlign,
    labelWidth = 33,
    labelCaption,
    labelWidthUnit,
    required,
    labelHidden,
    tooltipText,
    pattern,
    regex,
    customRule,
    hideValidationMessage,
    updateComponentHeight,
    validateMessage,
  } = props

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textareaWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaWrapperRef.current) {
      updateComponentHeight(textareaWrapperRef.current?.clientHeight)
    }
  }, [validateMessage, labelPosition, updateComponentHeight])

  const getValidateMessage = useCallback(
    (value?: string) => {
      if (!hideValidationMessage) {
        const message = handleValidateCheck({
          value,
          pattern,
          regex,
          minLength,
          maxLength,
          required,
          customRule,
        })
        const showMessage = message && message.length > 0
        return showMessage ? message : ""
      }
      return ""
    },
    [
      customRule,
      hideValidationMessage,
      maxLength,
      minLength,
      pattern,
      regex,
      required,
    ],
  )

  const handleValidate = useCallback(
    (value?: string) => {
      const message = getValidateMessage(value)
      handleUpdateDsl({
        validateMessage: message,
      })
      return message
    },
    [getValidateMessage, handleUpdateDsl],
  )

  useEffect(() => {
    handleUpdateGlobalData?.(displayName, {
      value,
      placeholder,
      disabled,
      readOnly,
      showCharacterCount,
      colorScheme,
      allowClear,
      heightType,
      minHeight,
      minLength,
      maxLength,
      focus: () => {
        textareaRef.current?.focus()
      },
      setValue: (value: boolean | string | number | void) => {
        handleUpdateDsl({ value })
      },
      clearValue: () => {
        handleUpdateDsl({ value: undefined })
      },
      validate: () => {
        return handleValidate(value)
      },
      clearValidation: () => {
        handleUpdateDsl({
          validateMessage: "",
        })
      },
    })
    return () => {
      handleDeleteGlobalData(displayName)
    }
  }, [
    value,
    placeholder,
    disabled,
    readOnly,
    showCharacterCount,
    colorScheme,
    displayName,
    heightType,
    minHeight,
    allowClear,
    minLength,
    maxLength,
    handleUpdateGlobalData,
    handleUpdateDsl,
    handleDeleteGlobalData,
    handleValidate,
  ])

  return (
    <div ref={textareaWrapperRef}>
      <TooltipWrapper tooltipText={tooltipText} tooltipDisabled={!tooltipText}>
        <div css={applyLabelAndComponentWrapperStyle(labelPosition)}>
          <Label
            labelFull={labelFull}
            label={label}
            labelAlign={labelAlign}
            labelWidth={labelWidth}
            labelCaption={labelCaption}
            labelWidthUnit={labelWidthUnit}
            labelPosition={labelPosition}
            required={required}
            labelHidden={labelHidden}
            hasTooltip={!!tooltipText}
          />
          <WrappedTextarea
            {...props}
            ref={textareaRef}
            getValidateMessage={getValidateMessage}
          />
        </div>
      </TooltipWrapper>
      <div
        css={applyValidateMessageWrapperStyle(
          labelWidth,
          labelPosition,
          labelHidden || !label,
        )}
      >
        <InvalidMessage validateMessage={validateMessage} />
      </div>
    </div>
  )
}

WrappedTextarea.displayName = "WrappedTextarea"
