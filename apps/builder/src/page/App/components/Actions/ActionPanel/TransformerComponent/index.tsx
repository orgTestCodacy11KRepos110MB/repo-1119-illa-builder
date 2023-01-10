import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { RadioGroup } from "@illa-design/react"
import { CodeEditor } from "@/components/CodeEditor"
import { TransformComponentProps } from "@/page/App/components/Actions/ActionPanel/TransformerComponent/interface"
import {
  codeMirrorStyle,
  getCodeMirrorContainerStyle,
  transformRadioStyle,
  transformSpaceStyle,
  transformTitle,
  transformTitleStyle,
} from "@/page/App/components/Actions/ActionPanel/TransformerComponent/style"
import { PanelLabel } from "@/page/App/components/InspectPanel/label"
import {
  getCachedAction,
  getSelectedAction,
} from "@/redux/config/configSelector"
import { configActions } from "@/redux/config/configSlice"
import {
  Transformer,
  TransformerInitial,
  TransformerInitialTrue,
} from "@/redux/currentApp/action/actionState"
import { VALIDATION_TYPES } from "@/utils/validationFactory"

export const TransformerComponent: FC<TransformComponentProps> = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { mysqlLike } = props
  const cachedAction = useSelector(getCachedAction)
  const selectedAction = useSelector(getSelectedAction)

  return (
    <>
      {cachedAction && (
        <div css={transformTitleStyle}>
          {mysqlLike ? (
            <PanelLabel
              labelName={t("editor.action.panel.label.transformer")}
            />
          ) : (
            <span css={transformTitle}>
              {t("editor.action.panel.label.transformer")}
            </span>
          )}
          <div css={transformSpaceStyle} />
          <RadioGroup
            css={transformRadioStyle}
            size="small"
            colorScheme="gray"
            value={cachedAction.transformer.enable}
            type="button"
            options={[
              {
                value: false,
                label: t("editor.action.panel.btn.disable"),
              },
              {
                value: true,
                label: t("editor.action.panel.btn.enable"),
              },
            ]}
            onChange={(value) => {
              let transformer: Transformer = TransformerInitial
              if (selectedAction.transformer.enable === value) {
                transformer = selectedAction.transformer
              } else {
                if (value) {
                  transformer = TransformerInitialTrue
                }
              }
              dispatch(
                configActions.updateCachedAction({
                  ...cachedAction,
                  transformer: transformer,
                }),
              )
            }}
          />
        </div>
      )}
      {cachedAction && cachedAction.transformer.enable && (
        <div css={getCodeMirrorContainerStyle(!!mysqlLike)}>
          {mysqlLike ? null : <span css={transformTitle}></span>}
          <CodeEditor
            value={cachedAction.transformer.rawData}
            css={codeMirrorStyle}
            lineNumbers
            height="88px"
            expectedType={VALIDATION_TYPES.STRING}
            mode="JAVASCRIPT"
            onChange={(value) => {
              dispatch(
                configActions.updateCachedAction({
                  ...cachedAction,
                  transformer: {
                    ...cachedAction.transformer,
                    rawData: value,
                  },
                }),
              )
            }}
          />
        </div>
      )}
    </>
  )
}

TransformerComponent.displayName = "TransformerComponent"
