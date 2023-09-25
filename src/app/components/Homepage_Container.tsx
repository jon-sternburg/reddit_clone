"use client";
import { Fragment, useState, useEffect, useRef } from "react";
import styles from "../css/homepage_styles.module.css";
import Posts_Container from "./Posts_Container";
import User_Container from "./User_Container";
import Post_Page from "./Post_Page";
import Top_Bar from "./Top_Bar";
import { useParams } from "next/navigation";
import { Thread } from "../types/post_types";

type Posts = Thread[] | null;
type Size_ = {
  width: number;
  height: number;
};
type HC_Props = {
  fetch_url: string;
  token: string;
  posts: Posts;
  after: string | null;
  post_page?: boolean;
};

export default function Homepage_Container(props: HC_Props): JSX.Element {
  const params = useParams();
  const [size, set_dim] = useState<Size_>({ width: 0, height: 0 });

  useEffect(() => {
    document.title = params.r
      ? params.r.toString()
      : params.u
      ? params.u.toString()
      : params.s
      ? `search results for ${params.s.toString()}`
      : "Reddit Clone!";

    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, [params.r, params.s, params.u]);

  function updateDimensions() {
    set_dim({ width: window.innerWidth, height: window.innerHeight });
  }

  return (
    <main className={styles.homepage_frame}>
      {size.height > 0 && (
        <Fragment>
          <Top_Bar />

          {params.u ? (
            <User_Container
              fetch_url={props.fetch_url}
              token={props.token}
              posts={props.posts}
              after={props.after}
              width={size.width}
              height={size.height}
            />
          ) : props.post_page ? (
            <Post_Page
              fetch_url={props.fetch_url}
              token={props.token}
              posts={props.posts}
              after={props.after}
              width={size.width}
              height={size.height}
            />
          ) : (
            <Posts_Container
              fetch_url={props.fetch_url}
              token={props.token}
              posts={props.posts}
              after={props.after}
              width={size.width}
              height={size.height}
            />
          )}
        </Fragment>
      )}
    </main>
  );
}
