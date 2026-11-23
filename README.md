# SINQ Mobile

Scientific inquiry client for the SINQ Django server. Runs in a browser, iOS/iPadOS, and Android through current Apache Cordova.

## Container

```sh
docker build -t sinq-mobile .
docker run --rm -p 127.0.0.1:8080:8080 sinq-mobile
```

The Node.js 24 image serves the active client as an unprivileged user with no third-party runtime JavaScript dependencies. It uses the same local API URL as the native apps. Prefer the parent repository's Docker Compose setup to start the API and client together. Xcode and Android emulator builds run on the host.

## Browser

Requires Node.js 24+, and the server running on port 8000.

```sh
npm ci
npm start
```

Open <http://localhost:8080/>. Ask questions, attach photos, connect explanations, and create investigations with numbered steps. Data persists in the server's database. Use the parent repository `ah-cog/sinq` to set up and run the full system.

## Native apps

```sh
npm ci
npx cordova platform add ios
npm run run:ios

npx cordova platform add android
npm run run:android
```

The checked-in `config.xml`, root `www/`, and `package-lock.json` are authoritative. Native projects under `platforms/` are generated and ignored. Cordova injects the current native bridge; the browser preview supplies an empty bridge script.

- iOS requires Xcode with first-launch components and a simulator runtime installed. Deployment target: iOS 15+.
- Android requires JDK 17, Android SDK platform 36/build tools 36.0.0, a compatible Gradle installation, and an emulator. Set `JAVA_HOME` and `ANDROID_HOME` for your installation.
- Default API server: `http://localhost:8000`; Android emulator: `http://10.0.2.2:8000`. The Server connection control switches among local addresses. Local HTTP permissions and CSP are scoped to this development workflow. Physical-device/hosted deployments need their own API origin, CSP, Cordova access, and server CORS configuration.

## Verification

With the backend and browser preview running:

```sh
npx playwright install chromium
npm test
```

The mobile-sized browser integration test creates a question with a photo, connects an explanation and investigation, reloads the client, and verifies persistence and filtering. A separate test checks server-error feedback.

## Migration

The original 2012 Cordova 2.1 Xcode project and jQuery Mobile app remain under `legacy/ios/` as historical sources. Build from the root configuration above. The active `www/` client uses browser APIs rather than discontinued jQuery Mobile/Isotope dependencies, and retains the question, cause/effect, investigation, relationship, and photo workflows. There is no hardcoded external university API server in the active client.

The lockfile pins current Cordova platforms and overrides the CLI’s transitive `glob` and `minimatch` dependencies to patched releases. These dependencies are build tools; the browser container has no npm runtime dependencies.
