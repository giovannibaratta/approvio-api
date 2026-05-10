# Approvio API

This repository contains the OpenAPI specification for the Approvio backend, the tooling to generate the TypeScript API client, and TypeScript validators for the generated models using `fp-ts`.

## Project Structure

- `openapi.yaml`: Main entry point for the OpenAPI 3.0 specification.
- `openapi/`: Directory containing split OpenAPI specification files referenced by the main `openapi.yaml`.
- `src/`: Source code directory.
  - `src/validators/`: TypeScript validators for the generated OpenAPI models using `fp-ts/Either`.
  - `src/utils/`: Utility functions, including custom Jest matchers for testing validators.
- `test/`: Test directory containing unit tests for the validators.
- `generated/`: Auto-generated output directory containing the TypeScript API client models and code.

## Getting Started

1.  **Install Dependencies:**

    ```bash
    yarn install
    ```

2.  **Generate API Client:**

    This command will generate the TypeScript API client in the `generated/openapi` directory.

    ```bash
    yarn generate:api
    ```

## Usage

The generated API client can be consumed by other TypeScript/JavaScript projects.

### Linting the OpenAPI Specification

To lint the `openapi.yaml` file and check for adherence to best practices and defined rules:

```bash
yarn lint:api
```

## Linking and Publishing

### Linking for Local Development

To link this package for local development in another project (e.g., `approvio-frontend`):

1.  Navigate to your consuming project (e.g., `approvio-frontend`):

    ```bash
    cd ../approvio-frontend
    ```

1.  Link the `approvio-api` package:

    ```bash
    yarn link "<path-to-approvio-api>"
    ```

Now, your consuming project will use the locally linked version of `@approvio/api`.

### Publishing to NPM

This package is automatically published to NPM when the version in `package.json` is incremented and merged into the `main` branch.

#### Automatic Publishing

The [GitHub Workflow](.github/workflows/publish.yml) performs the following steps:

1. Detects changes in the `main` branch.
2. Compares the version in `package.json` with the latest version published on NPM.
3. If the version is newer, it builds the project and publishes it automatically.

#### Manual Publishing

If you need to publish manually:

1.  Ensure you are logged in to NPM: `npm login`
2.  Run the publish command: `npm publish --access public`
