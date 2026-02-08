export default function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full text-left">
        <thead className="bg-secondary">
          <tr>
            {headers.map((h) => (
              <th key={h} className="p-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
