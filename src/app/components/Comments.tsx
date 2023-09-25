"use client";
import { Fragment, useState, useEffect } from "react";
import styles from "../css/comments_styles.module.css";
import { getCookie } from "cookies-next";
import BounceLoader from "react-spinners/BounceLoader";
import Comment from "./Comment";
import { Thread, ThreadResult } from "../types/post_types";
import {
  CommentsResult,
  ReplyMoreChildren,
  ReplyRepliesChildren,
  MoreCommentsDataResponse,
  CommentChildData,
} from "../types/comment_types";
import chunk from "lodash.chunk";

type Comments_Props = {
  post: Thread;
  original_id: string | null;
  clicked_comment: CommentType | null;
};

type Comments_State = {
  comments: CommentType[];
  show: boolean;
};

interface CommentType {
  kind: string;
  data: CommentChildData;
  posted_time?: string | null;
}

type MoreCommentsState = {
  fetched: boolean;
  pool: string[][] | [];
  pool_index: number;
  more: ReplyMoreChildren | null;
};

type CommentsAndPostResult = (ThreadResult | CommentsResult)[];

export default function Comments(props: Comments_Props): JSX.Element {
  const [comments, set_comments] = useState<Comments_State>({
    comments: [],
    show: false,
  });
  const [loading, set_loading] = useState<boolean>(true);
  const [more_comments, set_more_comments] = useState<MoreCommentsState>({
    fetched: false,
    pool: [],
    pool_index: 0,
    more: null,
  });
  const [clicked_comment, show_clicked_comment] = useState<boolean>(false);
  const subreddit = props.post.data.subreddit;

  const isMoreReply = (
    content: ReplyMoreChildren | ReplyRepliesChildren
  ): content is ReplyMoreChildren => "more" == content["kind"];
  const isMoreCommentsDataResponse = (
    content: CommentsAndPostResult | MoreCommentsDataResponse
  ): content is MoreCommentsDataResponse => "json" in content;
  const isComment = (
    content: CommentType | ReplyRepliesChildren
  ): content is CommentType => !("depth" in content);

  const post = props.post;
  const post_id = post.data.id;
  const clicked_comment_ = props.clicked_comment;

  useEffect(() => {
    if (!comments.show) {
      new Promise((resolve, reject) =>
        resolve(
          fetchData(
            `https://oauth.reddit.com/r/${subreddit}/comments/${post_id}.json?`
          )
        )
      )
        .then((comments_) => {
          if (comments_ !== null && Array.isArray(comments_)) {
            let more_ = comments_[1].data.children.filter(isMoreReply);

            set_comments({ comments: comments_[1].data.children, show: true });

            set_more_comments({
              fetched: false,
              pool: [],
              pool_index: 0,
              more: more_ && more_.length > 0 ? more_[0] : null,
            });

            if (props.clicked_comment !== null && props.clicked_comment.data) {
              show_clicked_comment(true);
            }
            set_loading(false);
          } else {
            set_loading(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [comments.show, post_id, props.clicked_comment, subreddit]);

  function set_chunk() {
    let comment_ = more_comments.more;

    if (comment_ !== null) {
      if (!more_comments.fetched) {
        let chunked: string[][] = chunk(comment_.data.children, 100);
        let current_chunk = chunked[0];
        let comment_id = current_chunk.join(",");
        get_more_comments(comment_, comment_id);
        set_more_comments({
          ...more_comments,
          fetched: true,
          pool: chunked,
          pool_index: 0,
        });
      } else {
        let current_chunk = more_comments.pool[more_comments.pool_index + 1];
        let comment_id = current_chunk.join(",");
        get_more_comments(comment_, comment_id);

        set_more_comments({
          ...more_comments,
          fetched: true,
          pool: more_comments.pool,
          pool_index: more_comments.pool_index + 1,
        });
      }
    }
  }

  function handle_clicked_comment_toggle() {
    show_clicked_comment(false);
  }

  async function get_more_comments(
    comment_: ReplyMoreChildren,
    comment_id: string
  ) {
    let url_ = `https://oauth.reddit.com/api/morechildren.json?api_type=json&showmore=true&link_id=${comment_.data.parent_id}&children=${comment_id}`;
    const data = await fetchData(url_);
    if (data !== null && isMoreCommentsDataResponse(data)) {
      let new_comments = data.json.data.things;
      let max_depth = Math.max.apply(
        null,
        new_comments.map((o) => o.data.depth)
      );
      var depth = max_depth;

      while (depth >= 1) {
        let child_comments_ = new_comments.filter((x) => x.data.depth == depth);

        child_comments_.map((x) => {
          let parent_comment_id = new_comments.findIndex(
            (y) => y.data.name == x.data.parent_id
          );
          new_comments[parent_comment_id].data.replies = {
            data: { children: [x] },
          };
          let original_index = new_comments.findIndex(
            (y) => y.data.name == x.data.name
          );
          if (original_index > -1) {
            new_comments.splice(original_index, 1);
          }
        });
        depth--;
      }

      let final = comments.comments.concat(new_comments);
      set_comments({ comments: final, show: true });
    }
  }

  return (
    <section className={styles.comment_box}>
      <Fragment>
        {loading ? (
          <div className={styles.skeleton_loader_rings_comments}>
            <BounceLoader
              color={"#b2d7c5"}
              loading={true}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : clicked_comment &&
          clicked_comment_ !== null &&
          isComment(clicked_comment_) ? (
          <Fragment>
            <button
              type="button"
              aria-label="Show all comments"
              onClick={() => handle_clicked_comment_toggle()}
              className={styles.show_all_comments}
            >
              Show all comments
            </button>
            <Comment
              comment={clicked_comment_}
              clicked_id={props.original_id}
              i={0}
              post_id={post_id}
            />
          </Fragment>
        ) : comments.comments.length ? (
          <Fragment>
            {comments.comments.map((comment, i) => {
              return (
                <Fragment key={i}>
                  {comment.kind == "t1" && (
                    <Comment comment={comment} i={i} post_id={post_id} />
                  )}

                  <div className={styles.comment_divider}></div>
                </Fragment>
              );
            })}

            {more_comments.more && more_comments.more !== null && (
              <button
                type="button"
                aria-label="Load more comments"
                className={styles.load_more_comments_button}
                onClick={() => set_chunk()}
              >
                Load more comments
              </button>
            )}
          </Fragment>
        ) : (
          <div className={styles.no_comments}>No comments yet!</div>
        )}
      </Fragment>
    </section>
  );
}

async function fetchData(
  url_: string
): Promise<CommentsAndPostResult | MoreCommentsDataResponse | null> {
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
