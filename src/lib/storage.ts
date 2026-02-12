"use server"

import { Post } from '@prisma/client';
import { prisma } from './prisma';
import { filterBadWords } from './filter-badwords';
import { postRateLimiter, commentRateLimiter, loveRateLimiter } from './rate-limiter';

interface NewPost {
  from: string;
  to: string;
  message: string;
}

interface NewComment {
  from: string;
  text: string;
}

// Helper to get client IP address (supports various proxy headers)
function getClientIp(): string {
  // Default fallback IP
  return "unknown-ip";
}

// Get unique identifier for rate limiting (IP + user agent)
function getRateLimitIdentifier(): string {
  return getClientIp();
}

export async function getPosts(
  skip = 0,
  take = 12,
  search = "",
  sort: "newest" | "oldest" | "most_loved" | "most_commented" = "newest"
) {
  const where = search
    ? {
        OR: [
          { message: { contains: search, mode: "insensitive" as const } },
          { from: { contains: search, mode: "insensitive" as const } },
          { to: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  let orderBy: Record<string, string> | Record<string, string>[] = { timestamp: "desc" };

  if (sort === "oldest") {
    orderBy = { timestamp: "asc" };
  } else if (sort === "most_loved") {
    orderBy = { loveCount: "desc" };
  } else if (sort === "most_commented") {
    // Sort by comment count requires a different approach
    orderBy = { timestamp: "desc" };
  }

  const posts = await prisma.post.findMany({
    include: { comments: true },
    where,
    orderBy,
    skip,
    take,
  });

  if (sort === "most_commented") {
    posts.sort((a, b) => b.comments.length - a.comments.length);
  }

  return posts;
}

export async function getPostCount(search = "") {
  const where = search
    ? {
        OR: [
          { message: { contains: search, mode: "insensitive" as const } },
          { from: { contains: search, mode: "insensitive" as const } },
          { to: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  return await prisma.post.count({ where });
}

export async function savePost(post: NewPost) {
  // Rate limiting check
  const identifier = getRateLimitIdentifier();
  const rateLimitCheck = postRateLimiter(identifier);
  
  if (!rateLimitCheck.allowed) {
    const resetIn = Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000);
    throw new Error(`Sabar ya, tunggu ${resetIn} detik sebelum posting lagi.`);
  }

  const existingPost = await prisma.post.findFirst({
    where: {
      message: post.message,
      from: post.from || 'Anonim', 
    },
  });

  if (existingPost) {
    throw new Error('Dilarang spam ya');
  }

  const filteredFrom = filterBadWords(post.from || 'Anonim');
  const filteredTo = filterBadWords(post.to || '');
  const filteredMessage = filterBadWords(post.message);

  return await prisma.post.create({
    data: {
      from: filteredFrom,
      to: filteredTo,
      message: filteredMessage,
      timestamp: new Date(),
      loveCount: 0,
    },
  });
}

export async function updatePost(updatedPost: Post) {
  return await prisma.post.update({
    where: { id: updatedPost.id },
    data: updatedPost,
  });
}

export async function addComment(postId: string, comment: NewComment) {
  // Rate limiting check
  const identifier = getRateLimitIdentifier();
  const rateLimitCheck = commentRateLimiter(identifier);
  
  if (!rateLimitCheck.allowed) {
    const resetIn = Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000);
    throw new Error(`Sabar ya, tunggu ${resetIn} detik sebelum komentar lagi.`);
  }

  const existingComment = await prisma.comment.findFirst({
    where: {
      text: comment.text,
      from: comment.from || 'Anonim', 
      postId: postId,
    },
  });

  if (existingComment) {
    throw new Error('Sekali aja ya, jangan spam.');
  }

  const filteredFrom = filterBadWords(comment.from || 'Anonim');
  const filteredText = filterBadWords(comment.text);

  return await prisma.comment.create({
    data: {
      from: filteredFrom,
      text: filteredText,
      postId,
      timestamp: new Date(),
    },
  });;
}

export async function toggleLove(postId: string) {
  // Rate limiting check (prevent rapid clicking)
  const identifier = getRateLimitIdentifier();
  const rateLimitCheck = loveRateLimiter(identifier);
  
  if (!rateLimitCheck.allowed) {
    throw new Error('Jangan melesat, pelan-pelan ya.');
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (post) {
    return await prisma.post.update({
      where: { id: postId },
      data: { loveCount: post.loveCount + 1 },
    });
  }
}
