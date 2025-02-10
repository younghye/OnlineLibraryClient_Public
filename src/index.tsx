import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import * as Sentry from "@sentry/browser";

Sentry.init({
  environment: "development",
  dsn: "https://be37d0d6376a5108720fb61ec48f4013@o4507543097638912.ingest.us.sentry.io/4507543108452352",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.extraErrorDataIntegration(),
  ],
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
