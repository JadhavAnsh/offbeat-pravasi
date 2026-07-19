# Expo environment setup

The project reads its public runtime configuration from `EXPO_PUBLIC_*` variables. Expo replaces these references while creating the JavaScript bundle, so each build or update keeps the values that existed when it was generated.

## Local development

Keep shared, non-secret defaults in `.env` and machine-specific values in `.env.local`:

```dotenv
EXPO_PUBLIC_API_URL=https://offbeat-dev-api.const-nishant.in/api/v1
EXPO_PUBLIC_API_KEY_HEADER=x-api-key
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_DEMO_DATA=false
EXPO_PUBLIC_API_KEY=<development backend key>
```

Use `EXPO_PUBLIC_DEMO_DATA=true` only when deliberately testing fixtures. The app ignores that flag when `EXPO_PUBLIC_APP_ENV=production`.

Restart Metro with a cleared cache after changing local variables:

```sh
npx expo start --clear
```

## Preview environment on expo.dev

Open [the project's Environment variables page](https://expo.dev/accounts/offbeat-pravasi/projects/offbeat-pravasi-app/environment-variables), select **Preview**, and add:

| Variable | Preview value | Visibility |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | Preview/development API URL ending in `/api/v1` | Plain text |
| `EXPO_PUBLIC_API_KEY_HEADER` | `x-api-key` | Plain text |
| `EXPO_PUBLIC_API_KEY` | Key accepted by the preview API | Sensitive |
| `EXPO_PUBLIC_APP_ENV` | `staging` | Plain text |
| `EXPO_PUBLIC_DEMO_DATA` | `false` for live validation or `true` for a demo-only preview | Plain text |

The `preview` and `preview-simulator` profiles in `eas.json` already select the EAS `preview` environment. After saving variables, create a new preview build or update; an existing artifact cannot receive changed values retroactively.

For a live-data preview, configure the API key and keep demo data off. For a demo-only preview, enable demo data; the app validates the fixtures locally and does not call the trek catalog API.

## Where the values are distributed

- iOS and Android: values are embedded in the JavaScript bundle shipped inside the EAS build or update.
- Web: values are embedded in the exported client JavaScript files.
- `app.config.ts`: the same values are copied into Expo `extra`, which is also client-readable configuration.
- Backend: no value is sent there automatically. The API URL selects the backend and the API client explicitly sends the configured key header on requests.

Because client bundles can be inspected, `EXPO_PUBLIC_API_KEY` is an access identifier, not a secure server secret. Sensitive authorization must still be enforced with user authentication and server-side permissions.
