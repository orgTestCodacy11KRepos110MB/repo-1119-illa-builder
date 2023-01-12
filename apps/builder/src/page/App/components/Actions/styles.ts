import { css } from "@emotion/react"

export function applyActionEditorStyle(h: number) {
  return css`
    position: relative;
    width: 100%;
    height: ${h}px;
  `
}

export const contentContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 100%;
`
