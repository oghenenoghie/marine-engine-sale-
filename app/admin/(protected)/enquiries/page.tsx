import { getAllEnquiries } from "@/lib/data/enquiries";
import { getAllStock } from "@/lib/data/stock";
import { EnquiriesDashboard } from "@/components/admin/enquiries-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const [enquiries, stock] = await Promise.all([getAllEnquiries(), getAllStock()]);

  return (
    <div className="p-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-hull">Enquiries</h1>
      <p className="text-[12px] text-steel">RFQ and sell-to-us submissions.</p>

      <div className="mt-6">
        <EnquiriesDashboard initialEnquiries={enquiries} stock={stock} />
      </div>
    </div>
  );
}
