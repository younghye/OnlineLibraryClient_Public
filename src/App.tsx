import "./assets/styles/App.css";
import { BrowserRouter } from "react-router-dom";
import Routes from "./components/router/Routes";
import Header from "./pages/common/Header";
import Footer from "./pages/common/Footer";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { queryClient } from "./components/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ErrorBoundary>
          {/* <Sentry.ErrorBoundary
          fallback={({ error, resetError }) => (
            <ErrorFallback error={error} resetError={resetError} />
          )}
        > */}
          <ToastContainer autoClose={false} />
          <QueryClientProvider client={queryClient}>
            <Header />
            <Routes />
            <Footer />
          </QueryClientProvider>
          {/* </Sentry.ErrorBoundary> */}
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
