export type FilterFunction = (value: unknown, ...args: string[]) => unknown

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
