export default function Loading() {
  return (
    <div
      className="row justify-content-center align-items-center"
      style={{ height: "73vh" }}
    >
      <div
        className="spinner-border"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      />
    </div>
  );
}
