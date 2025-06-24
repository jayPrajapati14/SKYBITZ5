# Nextgen - SkyBitz

Nextgen is a modern web application developed for SkyBitz, designed to provide an efficient and user-friendly interface for asset management and monitoring.

## Documentation

For detailed documentation about the project, please refer to our [Documentation Guide](./docs/DOCS.md).

## Key Features

- **Yard Check**: Allows users to view and manage assets in the yard.
- **Accrued Distance**: Displays information about the distance traveled by assets.
- **Reports**: Generates and manages reports on assets and their performance.

## Technologies Used

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- Tailwind CSS
- React Router
- Zustand (for state management)
- Zod (for schema validation)

## Project Setup

This project uses Vite as a build and development tool. To get started:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev:mock
   ```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run dev:demo`: Starts the development server in demo mode with custom host and port.
- `npm run dev:mock`: Starts the development server with mock data.
- `npm run types:watch`: Watches for TypeScript type changes.
- `npm run test`: Runs tests with coverage.
- `npm run test:e2e`: Runs end-to-end tests.
- `npm run test:e2e:ui`: Runs end-to-end tests with UI mode.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs the linter on project files.
- `npm run preview`: Previews the production version locally.
- `npm run format`: Formats TypeScript files using Prettier.
- `npm run prepare`: Sets up Husky.
- `npm run precommit`: Runs lint-staged checks.
- `npm run prepush`: Runs TypeScript build check.

## Project Structure

The project follows a modular structure, with reusable components and separate views for each main functionality.

- `src/components`: Reusable components.
- `src/views`: Main application views.
- `src/domain`: Domain logic and utilities.
- `src/styles`: Global styles and theme configuration.
- `src/infrastructure`: Infrastructure code (e.g., API services, data stores).
- `src/mock`: Mock data and API.

See more details about the project architecture in the [ARCHITECTURE.md](./src/docs/ARCHITECTURE.md) file.

## E2E Testing

The project uses Playwright for end-to-end testing. To run the tests:

1. Run all tests:
   ```bash
   npx playwright test
   ```

2. Run tests with UI mode:
   To run tests in UI Mode, you need to install specific browsers. Refer to [Browsers](https://playwright.dev/docs/browsers) for more details.
   ```bash
   npx playwright test --ui
   ```

3. Run a specific test file:
   ```bash
   npx playwright test tests/navigation.spec.ts
   ```

4. Run tests in headed mode:
   ```bash
   npx playwright test --headed
   ```

Tests can be run directly from VS Code using the [Playwright Test For VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) Extension.

Test files are located in `src/e2e` and follow the naming convention `*.spec.ts`.

You can view test reports after running the tests in the `playwright-report` directory.

## API - How to access the DB and APIs for development

### Initial Setup

1. Install [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
2. Configure AWS profiles:
   - **Mac or Linux**: `~/.aws/config`
   - **Windows**: `C:\Users\USERNAME\.aws\config`

   Open the file in the editor of your choice. **If the file doesn’t exist, create a new one.**

   Copy the following content into the file:
   ```ini
   # Fleets dev account
   [profile fleets-dev]
   sso_start_url = https://telular.awsapps.com/start
   sso_region = us-east-1
   sso_account_id = 269996367243
   sso_role_name = Fleet-Devpoweruseraccess
   region = us-east-1
   ```

3. Log into AWS from the terminal using SSO:

   > Make sure you’re logged into Ametek’s Microsoft account in your default browser.

   ```bash
   aws sso login --profile fleets-dev
   ```

   This will open a browser window where you can authenticate. Follow the steps and click **Allow**. After successful authentication, you'll be able to access AWS resources using the configured profile, and you can close the browser tab.

   Check you can start using AWS CLI by running:
   ```bash
   aws sts get-caller-identity --profile fleets-dev
   ```

4. Install [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/#kubectl).

   Skip the instructions to verify Kubectl configuration for now, otherwise you will see the following error when running:
   ```bash
   kubectl cluster-info
   ```

   ```
   The connection to the server <server-name:port> was refused - did you specify the right host or port?
   ```

5. Configure Kubernetes for your EKS cluster:
   ```bash
   aws eks --region us-east-1 update-kubeconfig --name fleets-dev --profile fleets-dev
   ```

   Verify the cluster is set:
   ```bash
   kubectl cluster-info
   ```

6. Validate

   ```bash
    kubectl get namespaces
   ```
7. Port forwarding:

   ```bash
   kubectl port-forward svc/fleets-backend 8080:8080 -n fleets
   ``` 
### UI Setup

   > Make sure you are using Ametek global secure VPN before continue

   Open the old Skybitz to get the cookies. URL and credentials can be found [here](https://share.1password.com/s#pUnnusrRHdKPQ0nVvneHe5iO64KfhBxjYeTESMvSu-s)

## Environment Variables

The project uses the following environment variables for configuration. Create a `.env` file in the project root with these variables:

### Available Variables

- `VITE_MOCK_API`: Enables/disables API mocking
  - `true`: Uses mock data
  - `false`: Uses real API
  ```env
  VITE_MOCK_API=true
  ```

- `VITE_API_URL`: Sets the base URL for API requests
  ```env
  VITE_API_URL=http://localhost:8080
  ```

### Environment Configuration

#### Local Development - with mock API (.env.mock.local)
```env
VITE_MOCK_API=true
VITE_API_URL=https://nextgen-api
```

#### Demo (.env.local)
```env
VITE_MOCK_API=false
VITE_API_URL=http://yardcheck.skybitz.com:9015
```

#### Production (.env.production) - To Be Defined
```env
VITE_MOCK_API=false
VITE_API_URL=https://api.skybitz.com
```

### Usage

1. Create a `.env` file in the project root
2. Copy the required variables according to the environment
3. The `.env` file is included in `.gitignore` to avoid sharing sensitive configurations

### Code Usage Examples

Environment variables are accessed in the code using `import.meta.env`:

```typescript
if (import.meta.env.VITE_MOCK_API === "true") {
  // Mock mode code
}

const apiUrl = import.meta.env.VITE_API_URL;
```

### Feature Flags 
Feature flags allow you to enable or disable specific features dynamically based on a configuration file.
You can enable feature flags using either a custom hook or a component.

#### Usage
1. Using the `useFeature` Hook
The `useFeature` hook allows you to check whether a feature is enabled:
```
import useFeature from "@/use-feature.hook";
const isFeatureEnabled = useFeature("quick-search");
```
The `isFeatureEnabled` variable will return a boolean value based on the feature flag configuration defined in the `feature-flags.json` file.

2. Using the `Feature` Component
The `Feature` component conditionally renders its children based on the feature flag:
```
import { Feature } from "@/components/feature-flag";
<Feature flag="quick-search">
   <QuickSearch />
</Feature>
```
If the `quick-search` feature flag is enabled, the `<QuickSearch />` component will be rendered.
