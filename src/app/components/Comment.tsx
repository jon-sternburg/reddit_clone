"use client";
import { Fragment, useState, useEffect, MouseEvent } from "react";
import styles from "../css/comments_styles.module.css";
import Link from "next/link";
import { BiExpandAlt } from "react-icons/bi";
import get_relative_time from "../utils/get_relative_time";
import { getCookie } from "cookies-next";
import {
  Comment,
  CommentRepliesResult,
  ReplyRepliesChildren,
  ReplyMoreChildren,
} from "../types/comment_types";

type Comment_Props = {
  comment: Comment | ReplyRepliesChildren;
  clicked_id?: string | null;
  i?: number;
  post_id: string;
};

type Replies = {
  replies: (ReplyRepliesChildren | ReplyMoreChildren)[];
  show: boolean;
};

type NewReplies = {
  json: {
    data: {
      things: CommentRepliesResult[];
    };
    errors: [any];
  };
};

export default function Comment(props: Comment_Props): JSX.Element {
  const comment = props.comment;
  const replies_ =
    comment.data.replies &&
    typeof comment.data.replies !== "string" &&
    comment.data.replies.data
      ? comment.data.replies.data.children
      : [];
  const [replies, set_replies] = useState<Replies>({
    replies: replies_,
    show: true,
  });
  const [posted_time, set_posted_time] = useState<string | null>(null);

  const isTReply = (
    content: ReplyMoreChildren | ReplyRepliesChildren
  ): content is ReplyRepliesChildren => "t1" == content["kind"];
  const isMoreReply = (
    content: ReplyMoreChildren | ReplyRepliesChildren
  ): content is ReplyMoreChildren => "more" == content["kind"];

  function toggle_replies() {
    set_replies({ ...replies, show: !replies.show });
  }

  useEffect(() => {
    if (posted_time == null) {
      var d = new Date(comment.data.created_utc * 1000);
      var now = new Date(new Date().getTime());
      let posted_time = get_relative_time(d, now);
      if (posted_time !== undefined) {
        set_posted_time(posted_time.replace(" ago", ""));
      }
    }
  }, [posted_time, comment.data.created_utc]);

  function handle_comment_box_click(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  async function get_more_replies(reply_: ReplyMoreChildren) {
    let comment_id = reply_.data.children.join(",");
    let link_id =
      comment && comment.data && comment.data.link_id
        ? comment.data.link_id
        : reply_.data.parent_id;
    let url_ = `https://oauth.reddit.com/api/morechildren.json?api_type=json&showmore=true&link_id=${link_id}&children=${comment_id}`;

    const data = await fetchData(url_);

    if (data !== null) {
      let new_replies = data.json.data.things;

      let max_depth = Math.max.apply(
        null,
        new_replies.map((o) => o.data.depth)
      );

      var depth = max_depth;

      while (depth >= 1) {
        let child_comments_ = new_replies.filter((x) => x.data.depth == depth);

        child_comments_.map((x) => {
          let parent_comment_id = new_replies.findIndex(
            (y) => y.data.name == x.data.parent_id
          );

          if (new_replies[parent_comment_id]) {
            new_replies[parent_comment_id].data.replies = {
              data: { children: [x] },
            };

            let original_index = new_replies.findIndex(
              (y) => y.data.name == x.data.name
            );
            if (original_index > -1) {
              new_replies.splice(original_index, 1);
            }
          }
        });
        depth--;
      }

      let cr = replies.replies.filter((x) => x.kind !== "more");
      let final = cr.concat(new_replies);

      set_replies({ replies: final, show: true });
    }
  }

  return (
    <article className={styles.comment_wrap}>
      <div className={styles.thread_line_wrap} onClick={() => toggle_replies()}>
        <div className={styles.thread_line} />
      </div>

      <header
        className={styles.comment_wrap_inner}
        onClick={() => toggle_replies()}
      >
        <div className={styles.expand_icon_wrap}>
          <BiExpandAlt className={styles.expand_icon} />{" "}
        </div>
        <div className={styles.comment_score}>{comment.data.score}</div>
        <div onClick={(e) => handle_comment_box_click(e)}>
          {comment.data.author == "[deleted]" ? (
            <div className={styles.comment_author}>u/{comment.data.author}</div>
          ) : (
            <Link
              href={`/u/${comment.data.author}`}
              className={styles.comment_author}
            >
              u/{comment.data.author}
            </Link>
          )}
        </div>

        {posted_time && (
          <div className={styles.comment_posted_time}>{posted_time}</div>
        )}
      </header>

      {replies.show && (
        <Fragment>
          <p
            className={
              comment.data.id == props.clicked_id
                ? styles.clicked_comment_body
                : styles.comment_body
            }
            onClick={() => toggle_replies()}
          >
            {comment.data.body}
          </p>

          {replies.replies.map((reply, i) => {
            return (
              <Fragment key={i}>
                {reply &&
                  reply.data &&
                  reply.kind == "t1" &&
                  isTReply(reply) && (
                    <Comment
                      clicked_id={props.clicked_id}
                      comment={reply}
                      post_id={props.post_id}
                    />
                  )}

                {reply.data &&
                  reply.kind == "more" &&
                  isMoreReply(reply) &&
                  reply.data.children.length > 0 && (
                    <button
                      type="button"
                      aria-label="Load more replies"
                      onClick={() => get_more_replies(reply)}
                      className={styles.load_more_replies}
                    >
                      {reply.data.children.length} more{" "}
                      {reply.data.children.length == 1 ? "reply" : "replies"}
                    </button>
                  )}
              </Fragment>
            );
          })}
        </Fragment>
      )}
    </article>
  );
}

async function fetchData(url_: string): Promise<NewReplies | null> {
  let token_ = getCookie("access_token");
  return await fetch("/api/fetch_data", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url_, token: token_ }),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => {
      console.log(err);
      return null;
    });
}
