export default function Access() {
  return (
    <div className="background access-background">
      <div className="d-flex row justify-content-center align-items-center h-100">
        <div className="container">
          <h1 className="text-white mb-4">Library Management System</h1>
          <a href="/login" className="btn btn-dark me-3">
            Login
          </a>
          <a href="/signUp" className="btn btn-light">
            Sign-up
          </a>
        </div>
      </div>
    </div>
  );
}
