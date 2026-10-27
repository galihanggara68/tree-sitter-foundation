module.exports = grammar({
  name: 'foundation',

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
      $.action_declaration,
      $.scenario_declaration,
    ),

    comment: $ => token(seq('#', /.*/)),

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
      '{',
      repeat(choice($.field_declaration, $.comment)),
      '}'
    ),

    // Value
    value_declaration: $ => seq(
      'value',
      field('name', $.type_identifier),
      '{',
      repeat(choice($.field_declaration, $.comment)),
      '}'
    ),

    // Enum
    enum_declaration: $ => seq(
      'enum',
      field('name', $.type_identifier),
      '{',
      repeat(choice($.enum_variant, $.comment)),
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

    // Field declaration
    field_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type_identifier),
      repeat($.trait)
    ),

    // Action declaration
    action_declaration: $ => seq(
      'action',
      field('name', $.identifier),
      optional($.parameter_list),
      optional(seq('->', field('return_type', $.type_identifier))),
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
      field('type', $.type_identifier)
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
      $.query_statement,
      $.validate_statement,
      $.emit_statement,
      $.return_statement,
      $.step_statement,
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

    query_statement: $ => seq(
      'query',
      field('name', $.identifier),
      '=',
      choice('single', 'many'),
      field('entity', $.type_identifier),
      optional(seq('where', field('predicate', $._expression))),
      optional(seq('sort', commaSep1($.sort_field))),
      optional(seq('limit', field('limit', $._expression))),
      optional(seq('offset', field('offset', $._expression)))
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

    when_statement: $ => seq(
      'when',
      field('action', $.identifier),
      '(',
      commaSep($._expression),
      ')'
    ),

    expect_statement: $ => seq(
      'expect',
      field('condition', $._expression)
    ),

    expression_statement: $ => $._expression,

    // Expressions
    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.member_expression,
      $.create_expression,
      $.update_expression,
      $.record_literal,
      $.identifier,
      $.string,
      $.number,
      $.boolean,
      $.null,
      $.parenthesized_expression,
    ),

    binary_expression: $ => prec.left(1, seq(
      field('left', $._expression),
      field('operator', choice('==', '!=', '<', '<=', '>', '>=', 'and', 'or', '+', '-', '*', '/')),
      field('right', $._expression)
    )),

    unary_expression: $ => prec(2, seq(
      field('operator', choice('not', '!')),
      field('argument', $._expression)
    )),

    call_expression: $ => prec(3, seq(
      field('function', $.identifier),
      '(',
      commaSep($._expression),
      ')'
    )),

    member_expression: $ => prec(4, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier)
    )),

    create_expression: $ => seq(
      'create',
      field('entity', $.type_identifier),
      $.record_literal
    ),

    update_expression: $ => seq(
      'update',
      field('entity', $.identifier),
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
