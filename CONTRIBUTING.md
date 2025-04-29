# Contributing to enum-plus

Thank you for your interest in contributing to enum-plus! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the [Issues](https://github.com/shijistar/enum-plus/issues)
- Use the provided bug report template
- Include detailed steps to reproduce the bug
- Add information about your environment (OS, browser, version, etc.)
- Include screenshots if applicable

### Suggesting Features

- Check if the feature has already been suggested in the [Issues](https://github.com/shijistar/enum-plus/issues)
- Use the provided feature request template
- Provide a clear description of the feature
- Explain why this feature would be useful to most users

### Code Contributions

We welcome code contributions through [pull requests](https://github.com/shijistar/enum-plus/pulls).

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/enum-plus.git`
3. Install dependencies: `npm install` (or equivalent)
4. Create a branch for your changes: `git checkout -b feature/your-feature-name`, based on `master` branch.
5. Make your changes
6. Test your changes: `npm test` (or equivalent)
7. Commit your changes: `git commit -m "feat: ..."`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a pull request against the `master` branch of the original repository. Before submitting, ensure:
   - Your branch is up to date with the `master` branch
   - You have resolved any merge conflicts
   - Your pull request is based on the latest `master` branch
10. Fill out the pull request template with details about your changes

## Coding Guidelines

- Follow the existing code style
- Write clear, commented, and testable code
- Keep pull requests focused on a single topic
- Add or update tests for your changes
- Make sure all tests pass

### Style Guide

- Use [ESLint](https://eslint.org)/[Prettier](https://prettier.io) for code formatting
- Follow [conventional commits](https://www.conventionalcommits.org/) for commit messages
- Example formatting rules:
  - Use 2 spaces for indentation
  - Use camelCase for variables and functions
  - Use PascalCase for classes and components

## Pull Request Process

1. Update the README.md or documentation with details of changes if needed
2. Update the tests to reflect your changes
3. Ensure all tests pass: `npm test`
4. Create a pull request against the `master` branch of the original repository. Before submitting, ensure:
   - Your branch is up to date with the `master` branch
   - You have resolved any merge conflicts
   - Your pull request is based on the latest `master` branch
5. Fill out the pull request template with details about your changes
6. Link any relevant issues using keywords like "Fixes #123"

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

type(scope): short description

[optional body]

[optional footer]

Types include:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## Questions?

Feel free to reach out to the maintainers if you have any questions:

- Open an issue, choosing the "Ask a Questions" template
