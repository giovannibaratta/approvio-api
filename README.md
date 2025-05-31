# Approvio API

This repository contains the OpenAPI specification for the Approvio backend and the tooling to generate the TypeScript API client.

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

To publish this package to an NPM registry:

1.  Ensure you are logged in to the correct NPM registry:

    ```bash
    yarn login
    ```

1.  Run `yarn publish`:

    ```bash
    yarn publish --access public
    ```
