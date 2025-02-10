import { useAuthStore } from "hooks/store/useAuthStore";
import { getErrorData } from "./getErrorData";
import { useNavigate } from "react-router-dom";

interface Props {
  resetError: () => void;
  error: any;
}

export default function ErrorFallback({ error, resetError }: Props) {
  const errorData = getErrorData(error);
  const navigate = useNavigate();
  const isLogin = useAuthStore.getState().isLogin;

  const onClickHandler = () => {
    resetError();
    if (errorData.requireLogin || !isLogin) {
      navigate("/access");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">{errorData?.code}</h1>
        <p className="fs-3">
          <span className="text-danger">Opps!</span> Something went wrong.
        </p>
        <p className="lead">{errorData?.message}</p>
        <a className="btn btn-primary" onClick={onClickHandler}>
          Go Home
        </a>
      </div>
    </div>
  );
}
