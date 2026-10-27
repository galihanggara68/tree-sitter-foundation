; Keywords
[
  "entity"
  "actor"
  "value"
  "enum"
  "event"
  "error"
  "action"
  "scenario"
  "step"
  "let"
  "query"
  "single"
  "many"
  "where"
  "sort"
  "asc"
  "desc"
  "limit"
  "offset"
  "validate"
  "else"
  "emit"
  "return"
  "when"
  "expect"
  "create"
  "update"
  "not"
  "and"
  "or"
] @keyword

; Types
(type_identifier) @type
(parameter type: (type_identifier) @type)
(field_declaration type: (type_identifier) @type)
(action_declaration return_type: (type_identifier) @type)

; Identifiers and names
(entity_declaration name: (type_identifier) @type)
(actor_declaration name: (type_identifier) @type)
(value_declaration name: (type_identifier) @type)
(enum_declaration name: (type_identifier) @type)
(enum_variant name: (identifier) @constant)
(event_declaration name: (type_identifier) @type)
(error_declaration name: (type_identifier) @type)
(action_declaration name: (identifier) @function)
(field_declaration name: (identifier) @property)
(parameter name: (identifier) @variable.parameter)
(field_assignment field: (identifier) @property)

; Traits
(trait "@" @attribute name: (identifier) @attribute)
(trait_argument key: (identifier) @property)

; Literals
(string) @string
(number) @number
(boolean) @boolean
(null) @constant.builtin
(comment) @comment

; Operators & Delimiters
[
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "+"
  "-"
  "*"
  "/"
  "="
  "->"
] @operator

[
  "{"
  "}"
  "("
  ")"
] @punctuation.bracket

[
  ":"
  ","
  "."
] @punctuation.delimiter
