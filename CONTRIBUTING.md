# Contributing Guide

Thanks for considering a contribution to **KB Labs Shared**!  
This guide will help you get started with contributing to our shared utilities and libraries.

## 🚀 Development Setup

### Prerequisites

- **Node.js:** >= 18.18.0
- **pnpm:** >= 9.0.0

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/kirill-baranov/kb-labs-shared.git
cd kb-labs-shared

# Install dependencies
pnpm install

# Start development mode
pnpm dev
```

## 📋 Development Guidelines

### Code Style

- Follow **ESLint** and **Prettier** rules configured in the project
- Use **TypeScript strict mode** for all new code
- Run `pnpm lint` before committing changes
- Use `pnpm lint:fix` to automatically fix formatting issues

### Testing

- Write tests for all new functionality using **Vitest**
- Maintain or improve test coverage
- Run `pnpm test` to execute all tests
- Use `pnpm test:watch` for development

### Package Development

- Each package in `packages/` should be self-contained
- Follow the existing package structure and naming conventions
- Update package README files when adding new functionality
- Ensure all packages build successfully with `pnpm build`

### Commit Messages

Use clear, conventional commit messages:

```bash
feat: add new text normalization function
fix: correct boundary checking logic
docs: update package README
test: add unit tests for diff parser
refactor: simplify profile resolution
```

### Architecture Decisions

- For significant architectural changes, create an **ADR** (Architecture Decision Record) in `docs/adr/`
- Follow the existing ADR format and numbering scheme
- Document the decision rationale and alternatives considered

## 🔄 Pull Request Process

### Before Submitting

1. **Fork** the repository and create a feature branch
2. **Make your changes** following the guidelines above
3. **Run quality checks:**
   ```bash
   pnpm check  # Runs lint + type-check + tests
   ```
4. **Update documentation** if needed (README files, inline comments)
5. **Test your changes** thoroughly

### Submitting the PR

1. **Push** your changes to your fork
2. **Create a Pull Request** with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Reference any related issues
   - Screenshots or examples if applicable

### Review Process

- All PRs require review before merging
- Address feedback promptly and professionally
- Keep PRs focused and reasonably sized
- Update your branch if the main branch has moved forward

## 🐛 Reporting Issues

When reporting bugs or requesting features:

1. **Check existing issues** to avoid duplicates
2. **Provide clear reproduction steps** for bugs
3. **Include environment details** (Node.js version, OS, etc.)
4. **Use appropriate labels** and templates

## 📚 Additional Resources

- [Architecture Decision Records](./docs/adr/) - Project architecture decisions
- [Package Documentation](./packages/) - Individual package README files
- [Development Scripts](./README.md#-available-scripts) - Available npm scripts

---

Thank you for contributing to KB Labs Shared! 🎉
