import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";

export default function ProductsPage() {
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Product Management
      </h1>

      <ProductForm />

      <div className="mt-8">
        <ProductTable />
      </div>

    </div>
  );
}