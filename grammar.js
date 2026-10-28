module.exports = grammar({
  name: 'foundation',

  conflicts: $ => [
    [$._expression, $.type_identifier],
    [$.query_statement],
    [$.query_many_expression],
  ],

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._declaration),

    _declaration: $ => choice(
      $.entity_declaration,
      $.actor_declaration,
      $.value_declaration,
      $.enum_declaration,
      $.event_declaration,
      $.error_declaration,
      $.policy_declaration,
      $.slot_declaration,
      $.action_declaration,
      $.scenario_declaration,
    ),

    comment: $ => token(seq(choice('//', '#'), /.*/)),

    // Entity
    entity_declaration: $ => seq(
      'entity',
      field('name', $.type_identifier),
      repeat($.trait),
      '{',
      repeat(choice($.field_declaration, $.comment)),
      '}'
    ),

    // Actor
    actor_declaration: $ => seq(
      'actor',
      field('name', $.type_identifier),
      repeat($.trait),
      '{',
      repeat(choice($.field_declaration, $.comment)),
      '}'
    ),

    // Value
    value_declaration: $ => seq(
      'value',
      field('name', $.type_identifier),
      repeat($.trait),
      '{',
      repeat(choice($.field_declaration, $.comment)),
      '}'
    ),

    // Enum
    enum_declaration: $ => seq(
      'enum',
      field('name', $.type_identifier),
      '{',
      repeat(choice($.enum_variant, ',', $.comment)),
      '}'
    ),

    enum_variant: $ => field('name', $.identifier),

    // Event
    event_declaration: $ => seq(
      'event',
      field('name', $.type_identifier),
      repeat($.trait),
      '{',
      repeat(choice($.field_declaration, $.comment)),
      '}'
    ),

    // Error
    error_declaration: $ => seq(
      'error',
      field('name', $.type_identifier),
      '{',
      repeat(choice($.field_declaration, $.comment)),
      '}'
    ),

    // Policy
    policy_declaration: $ => seq(
      'policy',
      field('name', $.identifier),
      $.parameter_list,
      optional(seq('->', field('return_type', $._type))),
      field('body', $.block)
    ),

    // Slot
    slot_declaration: $ => seq(
      'slot',
      field('name', $.type_identifier),
      repeat($.trait),
      '{',
      repeat(choice($.slot_method_declaration, $.comment)),
      '}'
    ),

    slot_method_declaration: $ => seq(
      repeat($.trait),
      field('name', $.identifier),
      $.parameter_list,
      optional(seq('->', field('return_type', $._type))),
      optional(seq('throws', commaSep1(field('error', $.type_identifier)))),
    ),

    // Field declaration
    field_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', choice($._type, $.string)),
      optional('?'),
      repeat($.trait),
      optional(seq('=', field('default', $._expression)))
    ),

    // Types
    _type: $ => choice(
      $.list_type,
      $.parameterized_type,
      $.type_identifier,
    ),

    // List type, e.g. []uuid
    list_type: $ => seq('[', ']', choice($.parameterized_type, $.type_identifier)),

    // Parameterized type, e.g. decimal(12, 2)
    parameterized_type: $ => seq(
      field('name', $.type_identifier),
      '(',
      commaSep1($._expression),
      ')'
    ),

    // Action declaration
    action_declaration: $ => seq(
      'action',
      field('name', $.identifier),
      optional($.parameter_list),
      optional(seq('->', field('return_type', $._type))),
      repeat($.trait),
      field('body', $.block)
    ),

    parameter_list: $ => seq(
      '(',
      commaSep($.parameter),
      ')'
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type)
    ),

    // Scenario declaration
    scenario_declaration: $ => seq(
      'scenario',
      field('name', $.string),
      '{',
      repeat(choice($._statement, $.comment)),
      '}'
    ),

    // Block
    block: $ => seq(
      '{',
      repeat(choice($._statement, $.comment)),
      '}'
    ),

    // Statements
    _statement: $ => choice(
      $.let_statement,
      $.slot_call_statement,
      $.query_statement,
      $.validate_statement,
      $.guard_statement,
      $.require_statement,
      $.delete_statement,
      $.if_statement,
      $.match_statement,
      $.for_statement,
      $.while_statement,
      $.emit_statement,
      $.return_statement,
      $.step_statement,
      $.given_statement,
      $.when_statement,
      $.expect_statement,
      $.expression_statement,
    ),

    let_statement: $ => seq(
      'let',
      field('name', $.identifier),
      '=',
      field('value', $._expression)
    ),

    slot_call_statement: $ => seq(
      optional(seq('let', field('variable', $.identifier), '=')),
      'slot',
      field('slot', $.type_identifier),
      '.',
      field('method', $.identifier),
      '(',
      commaSep($._expression),
      ')',
      optional(seq('else', field('error', choice($.identifier, $.string))))
    ),

    query_statement: $ => seq(
      'query',
      field('name', $.identifier),
      '=',
      choice('one', 'single', 'many'),
      field('entity', $.type_identifier),
      optional(seq('where', field('predicate', $._expression))),
      optional(seq('sort', commaSep1($.sort_field))),
      optional(seq('limit', field('limit', $._expression))),
      optional(seq('offset', field('offset', $._expression)))
    ),

    query_expression: $ => seq(
      'query',
      field('mode', choice('one', 'single')),
      field('entity', $.type_identifier),
      optional(seq('where', field('predicate', $._expression))),
      'else',
      field('error', choice($.identifier, $.string))
    ),

    query_many_expression: $ => seq(
      'query',
      'many',
      field('entity', $.type_identifier),
      optional(seq('where', field('predicate', $._expression))),
      optional(seq('order_by', field('order_by', $.identifier), optional(choice('asc', 'desc')))),
      optional(seq('limit', field('limit', $._expression))),
      optional(seq('cursor', field('cursor', $._expression)))
    ),

    sort_field: $ => seq(
      $.identifier,
      optional(choice('asc', 'desc'))
    ),

    validate_statement: $ => seq(
      'validate',
      field('condition', $._expression),
      optional(seq('else', field('error', choice($.identifier, $.string))))
    ),

    guard_statement: $ => seq(
      'guard',
      field('condition', $._expression),
      optional(seq('else', field('error', choice($.identifier, $.string))))
    ),

    require_statement: $ => seq(
      'require',
      field('policy', $.identifier),
      '(',
      commaSep($._expression),
      ')',
      optional(seq('else', field('error', choice($.identifier, $.string))))
    ),

    delete_statement: $ => seq(
      'delete',
      field('entity', $.identifier),
      'where',
      field('predicate', $._expression)
    ),

    if_statement: $ => seq(
      'if',
      field('condition', $._expression),
      field('consequence', $.block),
      optional(seq('else', field('alternative', choice($.if_statement, $.block))))
    ),

    match_statement: $ => seq(
      'match',
      field('value', $._expression),
      '{',
      repeat(choice($.match_arm, ',', $.comment)),
      '}'
    ),

    match_arm: $ => seq(
      '.',
      field('variant', $.identifier),
      '=>',
      field('body', choice($.block, $._statement))
    ),

    for_statement: $ => seq(
      'for',
      field('variable', $.identifier),
      'in',
      field('collection', $._expression),
      field('body', $.block)
    ),

    while_statement: $ => seq(
      'while',
      field('condition', $._expression),
      field('body', $.block)
    ),

    emit_statement: $ => seq(
      'emit',
      field('event', $.type_identifier),
      field('payload', $.record_literal)
    ),

    return_statement: $ => seq(
      'return',
      field('value', $._expression)
    ),

    step_statement: $ => seq(
      'step',
      optional(field('name', $.string)),
      $.block
    ),

    given_statement: $ => seq(
      'given',
      choice(
        $.given_slot,
        $.given_entity,
      )
    ),

    given_slot: $ => seq(
      'slot',
      field('slot', $.type_identifier),
      '.',
      field('method', $.identifier),
      optional(seq(
        '(',
        commaSep($._expression),
        ')'
      )),
      choice(
        seq('returns', field('return_value', $._expression)),
        seq('throws', field('error', $.type_identifier))
      )
    ),

    given_entity: $ => seq(
      field('entity', $.type_identifier),
      optional('with'),
      field('fields', $.record_literal)
    ),

    when_statement: $ => seq(
      'when',
      field('action', $.identifier),
      '(',
      commaSep($._expression),
      ')'
    ),

    expect_statement: $ => seq(
      'expect',
      choice(
        seq('error', field('error', $.type_identifier)),
        seq('emitted', field('event', $.type_identifier), optional(field('payload', $.record_literal))),
        seq(choice('stored', 'not_stored'), field('entity', $.type_identifier), 'where', field('predicate', $._expression), optional(field('fields', $.record_literal))),
        field('condition', $._expression)
      )
    ),

    expression_statement: $ => $._expression,

    // Expressions
    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.arrow_function,
      $.call_expression,
      $.member_expression,
      $.query_expression,
      $.query_many_expression,
      $.create_expression,
      $.update_expression,
      $.typed_record_literal,
      $.list_literal,
      $.enum_literal,
      $.identifier,
      $.string,
      $.number,
      $.boolean,
      $.null,
      $.parenthesized_expression,
    ),

    typed_record_literal: $ => prec(1, seq(
      field('type', $.type_identifier),
      field('value', $.record_literal)
    )),

    binary_expression: $ => prec.left(1, seq(
      field('left', $._expression),
      field('operator', choice('==', '!=', '<', '<=', '>', '>=', 'and', 'or', '&&', '||', '+', '-', '*', '/')),
      field('right', $._expression)
    )),

    unary_expression: $ => prec(2, seq(
      field('operator', choice('not', '!')),
      field('argument', $._expression)
    )),

    arrow_function: $ => prec.right(-1, seq(
      field('parameter', $.identifier),
      '=>',
      field('body', $._expression)
    )),

    call_expression: $ => prec(3, seq(
      field('function', choice($.identifier, $.member_expression)),
      '(',
      commaSep($._expression),
      ')'
    )),

    member_expression: $ => prec(4, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier)
    )),

    enum_literal: $ => seq(
      '.',
      field('variant', $.identifier)
    ),

    list_literal: $ => seq(
      '[',
      commaSep($._expression),
      ']'
    ),

    create_expression: $ => seq(
      'create',
      field('entity', $.type_identifier),
      $.record_literal
    ),

    update_expression: $ => seq(
      'update',
      field('entity', $.identifier),
      optional(seq('where', field('predicate', $._expression))),
      'set',
      $.record_literal
    ),

    record_literal: $ => seq(
      '{',
      commaSep(choice($.field_assignment, $.comment)),
      '}'
    ),

    field_assignment: $ => seq(
      field('field', $.identifier),
      ':',
      field('value', $._expression)
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    // Trait syntax: @table, @version, @route(post: "/path")
    trait: $ => seq(
      '@',
      field('name', $.identifier),
      optional(seq('(', commaSep($.trait_argument), ')'))
    ),

    trait_argument: $ => choice(
      seq(
        field('key', $.identifier),
        choice(':', '='),
        field('value', $._expression)
      ),
      field('value', $._expression)
    ),

    // Primitives
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    type_identifier: $ => alias($.identifier, 'type_identifier'),
    string: $ => token(seq('"', /([^"\\]|\\.)*/, '"')),
    number: $ => token(/\d+(\.\d+)?/),
    boolean: $ => choice('true', 'false'),
    null: $ => 'null',
  }
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
