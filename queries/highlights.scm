; Keywords
[
  "entity"
  "actor"
  "value"
  "enum"
  "event"
  "error"
  "policy"
  "slot"
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
  "require"
  "else"
  "emit"
  "return"
  "given"
  "with"
  "when"
  "expect"
  "returns"
  "throws"
  "stored"
  "not_stored"
  "emitted"
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
(slot_declaration name: (type_identifier) @type)
(slot_method_declaration return_type: (type_identifier) @type)
(slot_method_declaration error: (type_identifier) @type)
(slot_call_statement slot: (type_identifier) @type)
(given_slot slot: (type_identifier) @type)
(given_slot error: (type_identifier) @type)
(given_entity entity: (type_identifier) @type)
(typed_record_literal type: (type_identifier) @type)
(expect_statement error: (type_identifier) @type)
(expect_statement event: (type_identifier) @type)
(expect_statement entity: (type_identifier) @type)

; Identifiers and names
(entity_declaration name: (type_identifier) @type)
(actor_declaration name: (type_identifier) @type)
(value_declaration name: (type_identifier) @type)
(enum_declaration name: (type_identifier) @type)
(enum_variant name: (identifier) @constant)
(event_declaration name: (type_identifier) @type)
(error_declaration name: (type_identifier) @type)
(policy_declaration name: (identifier) @function)
(action_declaration name: (identifier) @function)
(slot_method_declaration name: (identifier) @function)
(slot_call_statement method: (identifier) @function)
(slot_call_statement variable: (identifier) @variable)
(given_slot method: (identifier) @function)
(require_statement policy: (identifier) @function)
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
