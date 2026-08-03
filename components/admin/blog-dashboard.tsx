"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, PenLine, Plus, Trash2, X } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlogCoverUploader } from "@/components/admin/blog-cover-uploader";
import { saveBlogPostAction, deleteBlogPostAction } from "@/lib/actions/blog";
import type { BlogPost } from "@/types";

const uid = () => (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Math.random()).slice(2));

/**
 * Admin CRUD for blog posts — same SlideOver/ConfirmDelete pattern as
 * components/admin/brands-dashboard.tsx.
 */
export function BlogDashboard({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState<BlogPost | Partial<BlogPost> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePost = async (post: BlogPost) => {
    setSaving(true);
    setError(null);
    const result = await saveBlogPostAction(post);
    if (result.ok) {
      setPosts((prev) =>
        prev.some((p) => p.id === post.id)
          ? prev.map((p) => (p.id === post.id ? post : p))
          : [post, ...prev],
      );
      setEditing(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  const removePost = async (id: string) => {
    setSaving(true);
    setError(null);
    const result = await deleteBlogPostAction(id);
    if (result.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteTarget(null);
    } else {
      setError(result.error);
    }
    setSaving(false);
  };

  return (
    <div className="text-[14px] text-hull">
      {error && <div className="mb-4 rounded-sm border border-hull/30 bg-hull/5 px-4 py-2 text-[12px] font-medium text-hull">{error}</div>}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="font-display text-xl font-extrabold tracking-tight">Blog</div>
          <div className="text-[12px] text-steel">Manage blog posts</div>
        </div>
        <Button onClick={() => setEditing({})}>
          <Plus size={16} /> New post
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <div key={post.id} className="rounded-sm border border-steel/15 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {post.coverImage && (
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm">
                    <Image src={post.coverImage} alt="" fill unoptimized className="object-cover" />
                  </div>
                )}
                <div>
                  <div className="font-display text-base font-bold text-hull">{post.title}</div>
                  <p className="mt-1 line-clamp-2 text-[12px] text-steel">{post.excerpt}</p>
                  <span
                    className={cn(
                      "label mt-1.5 inline-flex items-center gap-1 text-[10px]",
                      post.published ? "text-hull" : "text-steel",
                    )}
                  >
                    <span className={cn("h-1 w-1 rounded-full", post.published ? "bg-hull" : "border border-steel bg-transparent")} />
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <IconBtn onClick={() => setEditing(post)} title="Edit post">
                  <PenLine size={14} />
                </IconBtn>
                <IconBtn onClick={() => setDeleteTarget(post)} title="Delete post" danger>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-[13px] text-steel">No blog posts yet.</p>}
      </div>

      {editing !== null && (
        <PostForm initial={editing} saving={saving} onClose={() => setEditing(null)} onSave={savePost} />
      )}
      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.title}
          saving={saving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => removePost(deleteTarget.id)}
        />
      )}
    </div>
  );
}

function PostForm({
  initial,
  saving,
  onClose,
  onSave,
}: {
  initial: BlogPost | Partial<BlogPost>;
  saving: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
}) {
  const isNew = !initial.id;
  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [body, setBody] = useState(initial.body ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(initial.coverImage ?? null);
  const [published, setPublished] = useState(initial.published ?? false);
  const canSave = title.trim().length > 0 && excerpt.trim().length > 0 && body.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: initial.id ?? uid(),
      slug: slug.trim() || slugify(title),
      title: title.trim(),
      excerpt: excerpt.trim(),
      body: body.trim(),
      coverImage: coverImage ?? undefined,
      published,
      publishedAt: initial.publishedAt,
      createdAt: initial.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <SlideOver title={isNew ? "New post" : "Edit post"} onClose={onClose}>
      <Field label="Cover image">
        <BlogCoverUploader value={coverImage} onChange={setCoverImage} />
      </Field>
      <Field label="Title">
        <TextInput value={title} onChange={setTitle} placeholder="Sourcing genuine marine diesel parts" />
      </Field>
      <Field label="Slug">
        <TextInput value={slug} onChange={setSlug} placeholder={slugify(title) || "post-slug"} mono />
      </Field>
      <Field label="Excerpt">
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull"
          placeholder="One or two sentences shown in the post list"
        />
      </Field>
      <Field label="Body">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] leading-relaxed outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull"
          placeholder="Post content (plain text, one paragraph per line)"
        />
      </Field>
      <label className="flex items-center gap-2 text-[13px] text-hull">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded-sm border-steel/40 accent-hull"
        />
        Published (visible on the public site)
      </label>
      <SaveBar saving={saving} disabled={!canSave} isNew={isNew} onClose={onClose} onSave={handleSave} />
    </SlideOver>
  );
}

// ---- shared small pieces (mirrors components/admin/brands-dashboard.tsx) ----

function SlideOver({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-hull/45" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-steel/15 px-5 py-4">
          <div className="font-display text-lg font-extrabold tracking-tight">{title}</div>
          <IconBtn onClick={onClose} title="Close">
            <X size={16} />
          </IconBtn>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

function SaveBar({
  saving,
  disabled,
  isNew,
  onClose,
  onSave,
}: {
  saving: boolean;
  disabled: boolean;
  isNew: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-steel/15 pt-4">
      <button onClick={onClose} className="rounded-sm border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel transition-colors hover:border-hull hover:text-hull">
        Cancel
      </button>
      <Button onClick={onSave} disabled={disabled || saving} variant="dark">
        <Check size={15} /> {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label mb-1 text-steel">{label}</div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-sm border border-steel/25 bg-white px-3 py-2 text-[13px] outline-none transition-colors focus:border-hull focus:ring-2 focus:ring-hull",
        mono && "font-mono",
      )}
    />
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-sm border border-steel/25 transition-colors hover:bg-black/5",
        danger ? "text-hull" : "text-steel",
      )}
    >
      {children}
    </button>
  );
}

function ConfirmDelete({
  label,
  saving,
  onCancel,
  onConfirm,
}: {
  label: string;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-hull/50 p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-sm bg-paper p-5 shadow-2xl">
        <div className="mb-1 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-hull/10 text-hull">
            <Trash2 size={16} />
          </div>
          <div className="font-display text-base font-extrabold">Delete?</div>
        </div>
        <p className="mt-2 text-[13px] text-steel">{label}. This can&apos;t be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-sm border border-steel/25 px-4 py-2 text-[13px] font-medium text-steel transition-colors hover:border-hull hover:text-hull">
            Cancel
          </button>
          <Button variant="primary" onClick={onConfirm} disabled={saving}>
            {saving ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
