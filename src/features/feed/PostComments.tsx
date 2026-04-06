"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  getCommentsAction,
  createCommentAction,
  toggleCommentLikeAction,
} from "./feed.actions";

const IMG = "/assets/images";

type CommentAuthor = {
  id: string;
  firstName: string;
  lastName: string;
};

export type CommentNode = {
  id: string;
  content: string;
  createdAt: Date | string;
  author: CommentAuthor;
  replies: CommentNode[];
  _count: { likes: number };
  likes: { userId: string }[];
};

/* ── Tiny SVG icons ── */

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden>
      <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden>
      <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── Comment Composer ── */

function CommentComposer({
  text,
  onChange,
  onSubmit,
  disabled,
  textareaId,
}: {
  text: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  textareaId: string;
}) {
  return (
    <div className="_feed_inner_comment_box">
      <div className="_feed_inner_comment_box_form">
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <img src={`${IMG}/comment_img.png`} alt="" className="_comment_img" />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              id={textareaId}
              className="form-control _comment_textarea"
              placeholder="Write a comment"
              rows={1}
              value={text}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!disabled && text.trim()) onSubmit();
                }
              }}
            />
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon">
          <button type="button" className="_feed_inner_comment_box_icon_btn" aria-label="Voice">
            <MicIcon />
          </button>
          <button type="button" className="_feed_inner_comment_box_icon_btn" aria-label="Photo">
            <ImageIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Single Comment ── */

function CommentItem({
  comment,
  postId,
  depth,
  currentUserId,
}: {
  comment: CommentNode;
  postId: string;
  depth: number;
  currentUserId?: string;
}) {
  const queryClient = useQueryClient();

  /* Reply state */
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  /* Like state – optimistic */
  const isLikedByMe = currentUserId
    ? comment.likes.some((l) => l.userId === currentUserId)
    : false;
  const [liked, setLiked] = useState(isLikedByMe);
  const [likeCount, setLikeCount] = useState(comment._count.likes);

  const replyMutation = useMutation({
    mutationFn: () =>
      createCommentAction({
        postId,
        content: replyText.trim(),
        parentId: comment.id,
      }),
    onSuccess: (res) => {
      if (res.success) {
        setReplyText("");
        setReplyOpen(false);
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      }
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleCommentLikeAction(comment.id),
    onMutate: () => {
      const prevLiked = liked;
      const prevCount = likeCount;
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
      return { prevLiked, prevCount };
    },
    onError: (_err, _v, ctx) => {
      if (ctx) {
        setLiked(ctx.prevLiked);
        setLikeCount(ctx.prevCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const rel = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: false,
  });

  return (
    <div
      className="_comment_main"
      style={depth > 0 ? { marginLeft: Math.min(depth, 4) * 20 } : undefined}
    >
      <div className="_comment_image">
        <Link href="/feed" className="_comment_image_link">
          <img src={`${IMG}/txt_img.png`} alt="" className="_comment_img1" />
        </Link>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <Link href="/feed">
                <h4 className="_comment_name_title">
                  {comment.author.firstName} {comment.author.lastName}
                </h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>

          {/* Reaction badge (thumbs-up + heart + count) — matches design _total_reactions */}
          {likeCount > 0 && (
            <div className="_total_reactions">
              <div className="_total_react">
                <span className="_reaction_like">
                  <ThumbsUpIcon />
                </span>
                <span className="_reaction_heart">
                  <HeartIcon />
                </span>
              </div>
              <span className="_total">{likeCount}</span>
            </div>
          )}
        </div>

        {/* Action links: Like · Reply · Share · time */}
        <div className="_comment_reply">
          <div className="_comment_reply_num">
            <ul className="_comment_reply_list">
              <li>
                <span
                  role="button"
                  tabIndex={0}
                  className={liked ? "_comment_like_active" : undefined}
                  style={liked ? { color: "var(--color5)", fontWeight: 600 } : undefined}
                  onClick={() => {
                    if (currentUserId) likeMutation.mutate();
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && currentUserId) {
                      e.preventDefault();
                      likeMutation.mutate();
                    }
                  }}
                >
                  {liked ? "Liked" : "Like"}.
                </span>
              </li>
              <li>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => depth < 4 && setReplyOpen((o) => !o)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (depth < 4) setReplyOpen((o) => !o);
                    }
                  }}
                >
                  Reply.
                </span>
              </li>
              <li>
                <span>Share</span>
              </li>
              <li>
                <span className="_time_link">· {rel}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reply composer */}
        {replyOpen && depth < 4 && (
          <div className="_feed_inner_comment_box _comment_reply_composer">
            <div className="_feed_inner_comment_box_form">
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src={`${IMG}/comment_img.png`} alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply"
                    rows={1}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (replyText.trim() && !replyMutation.isPending) {
                          replyMutation.mutate();
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button type="button" className="_feed_inner_comment_box_icon_btn" aria-label="Voice">
                  <MicIcon />
                </button>
                <button type="button" className="_feed_inner_comment_box_icon_btn" aria-label="Photo">
                  <ImageIcon />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className="_comment_thread_replies">
            {comment.replies.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                postId={postId}
                depth={depth + 1}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Root component ── */

export default function PostComments({
  postId,
  commentCount,
  currentUserId,
}: {
  postId: string;
  commentCount: number;
  currentUserId?: string;
}) {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const r = await getCommentsAction(postId);
      if (!r.ok) throw new Error(r.error);
      return r.comments;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => createCommentAction({ postId, content: text.trim() }),
    onSuccess: (res) => {
      if (res.success) {
        setText("");
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      }
    },
  });

  const comments = (data ?? []) as CommentNode[];
  const hidden = Math.max(0, commentCount - comments.length);
  const showPrevious = hidden > 0;

  const submitTop = () => {
    if (text.trim() && !createMutation.isPending) createMutation.mutate();
  };

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area" id={`post-comments-${postId}`}>
        <CommentComposer
          textareaId={`comment-top-${postId}`}
          text={text}
          onChange={setText}
          onSubmit={submitTop}
          disabled={!text.trim() || createMutation.isPending}
        />
      </div>

      <div className="_timline_comment_main">
        {isLoading && (
          <p className="_comment_status_text mb-0">Loading comments…</p>
        )}
        {isError && (
          <p className="_comment_status_text mb-0 text-danger">
            {error instanceof Error ? error.message : "Could not load comments."}
          </p>
        )}
        {showPrevious && !isLoading && (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt">
              View {hidden} previous comment{hidden === 1 ? "" : "s"}
            </button>
          </div>
        )}
        {!isLoading &&
          !isError &&
          comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              postId={postId}
              depth={0}
              currentUserId={currentUserId}
            />
          ))}
      </div>
    </>
  );
}
