"use client";

import { KeluhPost } from "@/app/types";
import { useToast } from "@/hooks/use-toast";
import { filterBadWords } from "@/lib/filter-badwords";
import { addComment, toggleLove } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

interface KeluhCardProps {
  post: KeluhPost;
  onUpdate: () => void;
}

export function KeluhCard({ post, onUpdate }: KeluhCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { toast } = useToast();
  const [isLoved, setIsLoved] = useState(false);

  const commentRef = useRef<HTMLInputElement>(null);
  const commentFromRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lovedPosts = JSON.parse(localStorage.getItem("lovedPosts") || "[]");
    setIsLoved(lovedPosts.includes(post.id));
  }, [post.id]);

  const handleLove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoved) return;

    try {
    await toggleLove(post.id);
    
    const lovedPosts = JSON.parse(localStorage.getItem("lovedPosts") || "[]");
    lovedPosts.push(post.id);
    localStorage.setItem("lovedPosts", JSON.stringify(lovedPosts));
    
    setIsLoved(true);
    onUpdate();
  } catch (error) {
    toast({
      description: error instanceof Error ? error.message : "Terjadi masalah, coba lagi.",
      variant: "destructive"
    });
  }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    const comment = commentRef.current?.value.trim();
    const commentFrom = commentFromRef.current?.value.trim() || "Anonim";

    if (!comment) return;

    setIsCommentLoading(true);
    try {
      const filteredComment = filterBadWords(comment);
      const filteredCommentFrom = filterBadWords(commentFrom);

      await addComment(post.id, {
        text: filteredComment,
        from: filteredCommentFrom,
      });
      if (commentRef.current) commentRef.current.value = "";
      if (commentFromRef.current) commentFromRef.current.value = "";

      onUpdate();
      toast({ description: "Komentar berhasil ditambahkan" });
    } catch (error) {
      if (error instanceof Error) {
        toast({ description: error.message, variant: "destructive" });
      } else {
        toast({
          description: "Terjadi masalah, coba lagi.",
          variant: "destructive",
        });
      }
    } finally {
      setIsCommentLoading(false);
      setCooldown(5);
    }
  };

  const date = new Date(post.timestamp);
  const formattedDateTime = date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <Card
        className="p-5 bg-bg cursor-pointer hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Dari: {post.from}</p>
            <p className="text-xs font-medium text-primary text-text">
              Untuk: {post.to}
            </p>
          </div>
          <div className="text-xs text-gray-400">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="w-3" />
              <span>{formattedDateTime}</span>
            </div>
          </div>
        </div>

        <div className="h-8 overflow-hidden">
          <p className="text-base line-clamp-1 text-text">{post.message}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="noShadow"
            size="sm"
            className="flex items-center gap-2 bg-neutral hover:bg-main dark:bg-bw"
            onClick={handleLove}
          >
            <Heart
              className={cn("w-4 h-4 text-text", {
                "fill-red-500 text-red-500": isLoved,
              })}
            />
            <span className="text-sm text-text">{post.loveCount}</span>
          </Button>
          <Button
            variant="noShadow"
            size="sm"
            className="flex items-center gap-2 bg-neutral hover:bg-main dark:bg-bw"
          >
            <MessageCircle className="w-4 h-4 text-text" />
            <span className="text-sm text-text">{post.comments.length}</span>
          </Button>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[70vh] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Untuk: {post.to}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Dari: {post.from}</p>
              <div className="text-sm text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formattedDateTime}</span>
              </div>
            </div>

            <p className="text-sm whitespace-pre-wrap">{post.message}</p>

            <div className="flex items-center gap-4">
              <Button
                variant="noShadow"
                size="sm"
                className="flex items-center gap-2 bg-neutral hover:bg-main dark:bg-bw"
                onClick={handleLove}
              >
                <Heart
                  className={cn("w-5 h-5 text-text", {
                    "fill-red-500 text-red-500": isLoved,
                  })}
                />
                <span className="text-text">{post.loveCount}</span>
              </Button>

              <Button
                variant="noShadow"
                size="sm"
                className="flex items-center gap-2 bg-neutral hover:bg-main dark:bg-bw"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-5 h-5 text-text " />
                <span className="text-text">
                  {post.comments.length} Komentar
                </span>
              </Button>
            </div>

            {showComments && (
              <div className="space-y-4">
                <form onSubmit={handleComment} className="flex gap-2">
                  <Input
                    placeholder="Dari (Opsional)"
                    ref={commentFromRef}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Tambahkan komentar..."
                    ref={commentRef}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isCommentLoading || cooldown > 0}
                  >
                    {isCommentLoading ? (
                      <span className="loader border-t-transparent border-white border-2 border-t-2 rounded-full w-4 h-4 animate-spin"></span>
                    ) : (
                      "Kirim"
                    )}
                  </Button>
                </form>

                <div className="space-y-3">
                  {post.comments.map((comment) => {
                    const commentDate = new Date(comment.timestamp);
                    const formattedCommentDate = commentDate.toLocaleString(
                      [],
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );
                    return (
                      <div
                        key={comment.id}
                        className="flex justify-between items-start"
                      >
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{comment.from}</p>
                          <p className="text-gray-600 dark:text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {formattedCommentDate}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
