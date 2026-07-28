export function SpecTable({ specs }: { specs: Record<string, string> }) {
  const rows = Object.entries(specs);
  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-sm border border-steel/15 bg-white">
      <table className="w-full border-collapse text-left">
        <tbody>
          {rows.map(([key, value], i) => (
            <tr key={key} className={i > 0 ? "border-t border-steel/10" : ""}>
              <th scope="row" className="label w-1/3 px-4 py-2.5 font-medium text-steel">
                {key}
              </th>
              <td className="data px-4 py-2.5 text-hull">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
