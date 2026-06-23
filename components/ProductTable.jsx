export default function ProductTable() {

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <table className="w-full">

        <thead>

          <tr>
            <th>Name</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Stock</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td>MR80X</td>
            <td>3500</td>
            <td>3750</td>
            <td>15</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}