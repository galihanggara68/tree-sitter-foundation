# tree-sitter-foundation

Tree-sitter grammar and parser for [Foundation](https://github.com/galihanggara68/foundation) `.fdn` Blueprint files.

## Features
- **Complete Foundation DSL syntax**: Entities, Actors, Values, Enums, Events, Errors, Actions, Scenarios.
- **Traits & Arguments**: `@table`, `@route`, `@version`, `@event_handler`, `@cron`, `@lock`, `@audit`, `@idempotency`.
- **Query & Mutation Pipelines**: `query single`, `query many`, `where`, `sort`, `limit`, `offset`, `create`, `update`, `validate`, `emit`, `return`.
- **Editor Integration**: Highlights, indents, brackets, and code folding queries for **Zed**, **Neovim**, and **Helix**.

## Building & Testing

```bash
# Generate C parser
npx tree-sitter-cli generate

# Run corpus test suite
npx tree-sitter-cli test
```

## License

Licensed under the Apache License, Version 2.0 (the "License").
Copyright 2026 Foundation Authors.
