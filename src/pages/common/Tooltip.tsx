export default function Tooltip({ value }: any) {
  return (
    <div data-toggle="tooltip" title={value}>
      {value}
    </div>
  );
}
