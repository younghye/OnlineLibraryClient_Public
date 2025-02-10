import { Component, ErrorInfo, ReactNode } from "react";
import { getErrorData } from "./getErrorData";
import { useAuthStore } from "hooks/store/useAuthStore";
import * as Sentry from "@sentry/react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

// when Sentry.ErrorBoundary doesn't use
class ErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: "",
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  public componentDidCatch(error: any, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setLevel("error");
      scope.setExtra("componentStack", errorInfo);
      Sentry.captureException(error);
    });

    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const errorData = getErrorData(this.state.error);
    const isLogin = useAuthStore.getState().isLogin;

    if (this.state.hasError) {
      return (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="text-center">
            <h1 className="display-1 fw-bold">{errorData?.code}</h1>
            <p className="fs-3">
              <span className="text-danger">Opps!</span> Something went wrong.
            </p>
            <p className="lead">{errorData?.message}</p>
            <a
              className="btn btn-primary"
              href={errorData.requireLogin || !isLogin ? "/access" : "/home"}
            >
              Go Home
            </a>
          </div>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
