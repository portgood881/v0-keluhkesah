"use client";

import { KeluhAdd } from "@/components/keluh-add";
import { KeluhCard } from "@/components/keluh-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { Button } from "@/components/ui/button";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { Navbar } from "@/components/ui/navbar";
import { getPosts } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { MessageSquarePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { KeluhPost } from "./types";

export default function Home() {
  const [posts, setPosts] = useState<KeluhPost[]>([]);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isWibuMode, setIsWibuMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const { ref, inView } = useInView();

  const loadPosts = async (reset = false) => {
    if (!hasMore && !reset) return;

    try {
      const newPosts = await getPosts(reset ? 0 : posts.length, 12);

      if (reset) {
        setPosts(newPosts);
        setPage(1);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }

      setHasMore(newPosts.length === 12);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (inView && !loading) {
      loadPosts();
    }
  }, [inView]);

  return (
    <main className="relative min-h-screen bg-gray-50 dark:bg-zinc-900">
      <InteractiveGridPattern
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)] "
        )}
        width={30}
        height={30}
        squares={[80, 80]}
        squaresClassName="hover:fill-main"
      />
      <Navbar isWibuMode={isWibuMode} setIsWibuMode={setIsWibuMode} />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center space-x-2 justify-center mb-6"></div>
        <div className="flex flex-col items-center mb-12">
          {isWibuMode ? (
            <div className="z-10 mb-7 -mt-2">
              <Image
                src="/keluhkesah.png"
                alt="Keluh Kesah Logo"
                width={320}
                height={320}
                className="w-64 sm:w-80 object-contain"
                unoptimized
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  if (img && img.src.indexOf('keluhkesah.svg') === -1) img.src = '/keluhkesah.svg'
                }}
              />
            </div>
          ) : (
            <div>
              <h1 className="relative z-10 text-4xl font-black text-center mb-4">
                Keluh Kesah
              </h1>
              <p className="relative z-10 text-muted-foreground text-center mb-6">
                Silahkan berkeluh kesah di sini.
              </p>
            </div>
          )}
          <Button
            className="relative z-10"
            size="lg"
            onClick={() => setIsNewPostOpen(true)}
          >
            <MessageSquarePlus className="w-5 h-5" />
            Tambah Keluhan
          </Button>
        </div>

        {loading && posts.length === 0 ? (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {posts.map((post) => (
              <KeluhCard
                key={`post-${post.id}`}
                post={post}
                onUpdate={() => loadPosts(true)}
              />
            ))}

            {hasMore && (
              <div ref={ref} className="col-span-full flex justify-center p-4">
                <div className="loader" />
              </div>
            )}
          </div>
        )}

        <KeluhAdd
          open={isNewPostOpen}
          onOpenChange={setIsNewPostOpen}
          onPostCreated={() => loadPosts(true)}
        />
      </div>
    </main>
  );
}
