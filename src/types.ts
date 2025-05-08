export type FilterValue =
  | string
  | number
  | (string | number)[]
  | null
  | undefined

export type ParamValue =
  | string
  | number
  | Date
  | (string | number)[]
  | null
  | undefined

export type Params = Record<string, ParamValue>

export type FilterFunction = (
  value: FilterValue,
  ...args: string[]
) => FilterValue

export interface CompiledFilter {
  function: FilterFunction
  args?: string[]
}

export interface CompiledSegment {
  key?: string | null
  param: string | null
  filters?: CompiledFilter[]
  optional?: boolean
  explode?: boolean
}

export type CompiledTemplateList = (string | CompiledSegment | null)[]

export type CompiledTemplate = (
  | string
  | CompiledSegment
  | CompiledTemplateList
  | null
)[]
