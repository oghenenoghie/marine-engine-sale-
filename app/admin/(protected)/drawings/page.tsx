import Link from "next/link";
import { getAllDrawings } from "@/lib/data/stock";
import { getAllModels } from "@/lib/data/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminDrawingsPage() {
  const [drawings, engineModels] = await Promise.all([getAllDrawings(), getAllModels()]);

  return (
    <div className="p-6">
      <h1 className="font-display text-xl font-extrabold tracking-tight text-hull">Drawings</h1>
      <p className="text-[12px] text-steel">Author hotspots that link exploded diagrams to live stock.</p>

      <div className="mt-6 overflow-hidden rounded-md border border-steel/15 bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-hull/5 text-[11px] uppercase tracking-wider text-steel">
              <th className="px-4 py-2.5 font-semibold">Drawing</th>
              <th className="px-4 py-2.5 font-semibold">Model</th>
              <th className="px-4 py-2.5 font-semibold">Hotspots</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {drawings.map((d) => {
              const model = engineModels.find((m) => m.id === d.modelId);
              return (
                <tr key={d.id} className="border-t border-steel/10">
                  <td className="px-4 py-3 font-medium">{d.title}</td>
                  <td className="px-4 py-3 text-[13px] text-steel">{model?.name}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-steel">{d.hotspots.length}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/drawings/${d.id}`} className="text-[12px] font-semibold text-blueprint">
                      Edit hotspots →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
