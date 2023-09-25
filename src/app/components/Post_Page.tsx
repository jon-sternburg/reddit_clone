"use client";
import { Fragment, useState, useEffect } from "react";
import styles from "../css/post_container_styles.module.css";
import Post from "./Post";
import Mobile_Post from "./Mobile_Post";
import Comments from "./Comments";
import get_relative_time from "../utils/get_relative_time";
import { Thread } from "../types/post_types";

type Posts = Thread[] | null;

type PP_Props = {
  fetch_url: string;
  token: string;
  posts: Posts;
  after: string | null;
  width: number;
  height: number;
};

export default function Post_Page(props: PP_Props): JSX.Element {
  const [loading, set_loading] = useState<boolean>(true);
  const [post_data, set_post_data] = useState<Thread | null>(null);

  useEffect(() => {
    if (props.posts !== null) {
      let data__ = props.posts.map((x) => {
        var d = new Date(x.data.created_utc * 1000);
        var now = new Date(new Date().getTime());
        let posted_time = get_relative_time(d, now);
        if (posted_time !== undefined) {
          return { ...x, posted_time: posted_time.replace(" ago", "") };
        } else {
          return { ...x, posted_time: null };
        }
      });

      set_post_data(data__[0]);
      set_loading(false);
    }
  }, [props.posts]);

  return (
    <div className={styles.post_frame}>
      {loading ? (
        <div className={styles.skeleton_loader}></div>
      ) : (
        <Fragment>
          {post_data !== null && (
            <Fragment>
              {props.width <= 800 ? (
                <Mobile_Post
                  clicked={true}
                  i={0}
                  h_={props.height}
                  w_={props.width}
                  post={post_data}
                />
              ) : (
                <Post
                  clicked={true}
                  i={0}
                  h_={props.height}
                  w_={props.width}
                  post={post_data}
                />
              )}
              <Comments
                post={post_data}
                clicked_comment={null}
                original_id={null}
              />
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
}
