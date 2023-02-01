import {
  Completion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete"
import { capitalize } from "lodash"
import {
  AutocompleteDataType,
  checkCursorInBinding,
} from "@/components/NewCodeEditor/CodeMirror/extensions/completionSources/TernServer"
import {
  CODE_LANG,
  CODE_TYPE,
} from "@/components/NewCodeEditor/CodeMirror/extensions/interface"
import { isFunction, isObject } from "@/utils/typeHelper"

const formatUtils = (data: unknown) => {
  if (isObject(data)) {
    return "#Object#"
  } else if (Array.isArray(data)) {
    return "#Array#"
  } else if (typeof data === "string") {
    return `"${data.length > 50 ? data.slice(0, 50) + "..." : data}"`
  } else if (typeof data === "number" || typeof data === "boolean") {
    return data
  } else if (typeof data === "function") {
    return "#Function#"
  } else if (data === null) {
    return "null"
  } else if (data === undefined) {
    return "undefined"
  } else {
    return "#Unknown#"
  }
}

const formatEvaluate = (data: any) => {
  let format = ""
  if (Array.isArray(data)) {
    if (data.length > 0) {
      format = "[<br/>"
      data.forEach((item) => {
        const showStr = formatUtils(item)
        format += `  ${showStr},<br/>`
      })
    } else {
      format = "["
    }
    format += "]"
  }
  if (isObject(data)) {
    format = "Object {<br/>"
    Object.keys(data).forEach((key) => {
      const showStr = formatUtils(data[key])
      format += `  ${key}: ${showStr},<br/>`
    })
    format += "}"
  }
  return format
}

export function getDataInfo(data: Record<string, unknown>, path: string) {
  let currentData: any = data
  let offset: number = 0
  for (let i = 0; i < path.length; ++i) {
    switch (path[i]) {
      case ".":
      case "[":
      case "]":
        if (offset < i) {
          currentData = currentData[path.slice(offset, i).trim()]
          if (!currentData || typeof currentData !== "object") {
            return
          }
        }
        offset = i + 1
        if (path[i] === "." && Array.isArray(currentData)) {
          return
        }
        if (path[i] === "[" && !Array.isArray(currentData)) {
          return
        }
        break
    }
  }
  return [currentData, offset, path.slice(offset)]
}

export const buildIllaContextCompletionSource = (
  lang: CODE_LANG,
  codeType: CODE_TYPE,
  executionResult: Record<string, unknown>,
): ((
  context: CompletionContext,
) => CompletionResult | Promise<CompletionResult | null> | null) => {
  const isFunction = codeType === CODE_TYPE.FUNCTION
  return (context: CompletionContext) => {
    const isCursorInBinding = checkCursorInBinding(context, isFunction)
    if (!isCursorInBinding) {
      return null
    }
    const matchPath = context.matchBefore(/(\w+(\[\s*\d+\s*\])*\.)*\w*/)
    if (!matchPath) {
      return null
    }
    if (
      matchPath.text.length === 0 &&
      (isFunction || context.matchBefore(/\{\{\s*/) === null)
    ) {
      return null
    }
    const info = getDataInfo(executionResult, matchPath.text)
    if (!info) {
      return null
    }
    const [currentData, offset, prefix] = info
    const keys = Object.keys(currentData).filter((key) =>
      key.startsWith(prefix),
    )
    const options = keys.map((key) => {
      const dataType = getDataType(currentData[key])
      const result: Completion = {
        type: dataType,
        label: key,
        detail: capitalize(dataType),
        boost: 1,
      }
      if (isFunction || lang !== CODE_LANG.JAVASCRIPT) {
        result.info = (complete: Completion) => {
          let dom = document.createElement("span")
          dom.innerHTML = `<div class="completionInfoCardTitle">
        <span class="cardTitle">${key}</span>
      </div>
      <p class="completionInfoType">${dataType}</p>
      <p class="completionInfoEvaluatesTitle">Evaluates to</p>
${getDataEvaluatesToDom(currentData[key], dataType)}`
          return dom
        }
      }
      return result
    })
    const completions = {
      from: matchPath.from + offset,
      validFor: /^\w*$/,
      options: options,
    }
    return completions
  }
}

function getDataType(data: unknown): AutocompleteDataType {
  const type = typeof data
  if (type === "number") return AutocompleteDataType.NUMBER
  else if (type === "string") return AutocompleteDataType.STRING
  else if (type === "boolean") return AutocompleteDataType.BOOLEAN
  else if (Array.isArray(data)) return AutocompleteDataType.ARRAY
  else if (isFunction(data)) return AutocompleteDataType.FUNCTION
  else if (type === "undefined") return AutocompleteDataType.UNKNOWN
  return AutocompleteDataType.OBJECT
}

function getDataEvaluatesToDom(data: unknown, dataType: AutocompleteDataType) {
  switch (dataType) {
    case AutocompleteDataType.STRING:
      return `<span class="evaluatesResult">"${data}"</span>`
    case AutocompleteDataType.NUMBER:
    case AutocompleteDataType.BOOLEAN:
      return `<span class="evaluatesResult">${data}</span>`
    case AutocompleteDataType.ARRAY:
      return `<span class="evaluatesResult">[ ... ]${getEvaluatesTooltipDOM(
        data as unknown[],
      )}</span>`
    case AutocompleteDataType.OBJECT:
      return `<span class="evaluatesResult">{ ... } ${getEvaluatesTooltipDOM(
        data as Object,
      )}</span>`
    default:
      return `<span class="evaluatesResult">null</span>`
  }
}

const getEvaluatesTooltipDOM = (data: Object | unknown[]) => {
  return `<div class="evaluatesTooltips">${formatEvaluate(data)}</div>`
}