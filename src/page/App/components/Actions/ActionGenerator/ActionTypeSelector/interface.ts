import { ResourceDataItem } from "../config"

export type ActionTypeCategory = "databases" | "apis" | "jsTransformer"

export interface ActionTypeSelectorProps {
  onSelect?: (item: ActionTypeInfo) => void
  resourceOnly?: boolean
}

export interface ActionTypeSelectorCardProps extends ResourceDataItem {
  onSelect?: (item: ActionTypeInfo) => void
  category: ActionTypeCategory
}

export interface ActionTypeInfo {
  actionType: string
  category?: ActionTypeCategory
}