# EnumPlus Testing Guide

## Overview

This document provides guidelines for writing tests using Jest and Playwright in the EnumPlus project. The goal is to ensure that both unit tests and end-to-end (E2E) tests share a common codebase while accommodating the differences between the two testing frameworks.

## Testing Frameworks

- **Jest**: Used for unit testing in a Node.js environment.
- **Playwright**: Used for E2E testing in a browser environment.

## Test Structure

Each test is divided into two main parts: `evaluate` and `assert`.

- **Evaluate**: This part contains the code that runs the actual test logic. It should be serializable and not rely on closures or external state.
- **Assert**: This part contains the assertions that verify the test results. It should also be serializable.

## Guidelines for Writing Tests

1. **Serialization**: Ensure that both `evaluate` and `assert` parts are serializable. Avoid using closures or external state that cannot be serialized.
2. **Avoid Closures**: Minimize the use of closures in the `evaluate` part. If closures are necessary, include them in the return value of the `evaluate` function to ensure they are accessible in the `assert` part.
3. **External Data**: When using external data (e.g., enum-plus, config, data), ensure that it is compatible with the browser environment. This may involve compiling the data into the `e2e` directory.
4. **Consistent API**: Use a consistent API for both Jest and Playwright tests to facilitate code sharing and maintenance.
5. **Test Naming**: Use descriptive names for tests to clearly indicate their purpose and functionality.
6. **Documentation**: Document any specific behaviors or edge cases that the test is designed to cover.
7. **Code Coverage**: Ensure that tests cover critical paths and edge cases in the codebase. Use coverage tools to identify untested code areas. Aim for `100%` code coverage.
