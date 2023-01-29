import { FC } from "react"
import { Popover } from "@illa-design/react"
import { AvatarProps } from "@/page/App/components/Avatar/interface"
import {
  applyUserAvatarStyle,
  getAvatarStyle,
  triggerStyle,
} from "@/page/App/components/Avatar/style"

const AvatarColors = [
  "165DFF",
  "0FC6C2",
  "06DA38",
  "A7D100",
  "F1BE0A",
  "F9773F",
  "FF4ACC",
]

export const Avatar: FC<AvatarProps> = (props) => {
  const { userId, nickname, avatar, showType, type, showTooltips } = props
  const avatarBgColor = AvatarColors[(parseInt(`${userId}`) || 0) % 7]
  const avatarText = nickname?.substring?.(0, 1).toUpperCase() || "U"
  const node = avatar ? (
    <img src={avatar} css={getAvatarStyle(showType, type)} />
  ) : (
    <span css={applyUserAvatarStyle(avatarBgColor, showType, type)}>
      {avatarText}
    </span>
  )
  return (
    <Popover
      trigger="hover"
      content={nickname}
      disabled={!showTooltips}
      hasCloseIcon={false}
      position="top"
      colorScheme="grayBlue"
      _css={triggerStyle}
    >
      {node}
    </Popover>
  )
}
