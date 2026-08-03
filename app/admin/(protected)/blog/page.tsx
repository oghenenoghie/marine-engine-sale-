import { BlogDashboard } from "@/components/admin/blog-dashboard";
import { getAllBlogPostsAdmin } from "@/lib/data/blog";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPostsAdmin();
  return (
    <div className="p-6">
      <BlogDashboard initialPosts={posts} />
    </div>
  );
}
