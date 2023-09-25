"use client";
import { Fragment, useState, useEffect, MouseEvent } from "react";
import styles from "../css/mobile_post_styles.module.css";
import Link from "next/link";
import { BiSolidUpvote } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Thread, PostChildData } from "../types/post_types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

type Post_Props = {
  h_: number;
  i: number;
  post: Thread;
  w_: number;
  clicked: boolean;
  prev?: string;
};

type MediaSize = {
  w: number | null;
  h: number | null;
};

type Post_Inner_Props = {
  handle_link_click: (e: MouseEvent<HTMLAnchorElement>, url: string) => void;
  height: number;
  data: PostChildData;
  width: number;
  clicked: boolean;
};

type Text_Inner_Props = {
  height: number;
  data: PostChildData;
  clicked: boolean;
};

export default function Mobile_Post(props: Post_Props): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { post, h_ } = props;
  const sub_icon =
    post.data.sr_detail && post.data.sr_detail.icon_img.length > 0
      ? post.data.sr_detail.icon_img
      : post.data.sr_detail && post.data.sr_detail.community_icon
      ? post.data.sr_detail.community_icon.replace("amp;", "")
      : null;
  const type_ =
    post.data.is_video ||
    (post.data.post_hint && post.data.post_hint.includes("video")) ? (
      <Video_
        clicked={props.clicked}
        handle_link_click={handle_link_click}
        width={props.w_}
        height={h_}
        data={post.data}
      />
    ) : post.data.is_self ? (
      <Text_ clicked={props.clicked} data={post.data} height={h_} />
    ) : (
      <Image_
        clicked={props.clicked}
        handle_link_click={handle_link_click}
        height={h_}
        data={post.data}
        width={props.w_}
      />
    );

  function handle_link_click(e: MouseEvent<HTMLAnchorElement>, url: string) {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank");
  }

  function handle_post_box_click(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handle_post_click() {
    localStorage.setItem(
      "clicked_post",
      JSON.stringify({
        post: post,
        comment: null,
        original_id: null,
        prev: pathname,
      })
    );
    router.push(`/post/${post.data.name}`);
  }

  return (
    <article
      className={styles.post_box_mobile}
      onClick={() => handle_post_click()}
    >
      <header className={styles.post_box_top_wrapper_mobile}>
        <div
          className={styles.post_box_subreddit_mobile}
          onClick={(e) => handle_post_box_click(e)}
        >
          <Link href={`/r/${post.data.subreddit}`}>
            {post.data.sr_detail && sub_icon !== null ? (
              <img
                alt={"subreddit icon image"}
                height={20}
                width={20}
                style={{ marginRight: "5px", borderRadius: "100%" }}
                src={sub_icon}
                className={styles.icon_img}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className={styles.generic_icon}
              >
                <path d="M16.5,2.924,11.264,15.551H9.91L15.461,2.139h.074a9.721,9.721,0,1,0,.967.785ZM8.475,8.435a1.635,1.635,0,0,0-.233.868v4.2H6.629V6.2H8.174v.93h.041a2.927,2.927,0,0,1,1.008-.745,3.384,3.384,0,0,1,1.453-.294,3.244,3.244,0,0,1,.7.068,1.931,1.931,0,0,1,.458.151l-.656,1.558a2.174,2.174,0,0,0-1.067-.246,2.159,2.159,0,0,0-.981.215A1.59,1.59,0,0,0,8.475,8.435Z"></path>
              </svg>
            )}
            <span>r/{post.data.subreddit}</span>
          </Link>
        </div>

        <div className={styles.post_box_title_wrap_mobile}>
          <h3 className={styles.post_box_title}>{post.data.title}</h3>
        </div>
      </header>

      <div className={styles.post_box_inner_mobile}>{type_}</div>
      {props.clicked && (
        <div
          className={styles.post_box_author_mobile}
          onClick={(e) => handle_post_box_click(e)}
        >
          {post.data.author == "[deleted]" ? (
            <div>
              Posted by {post.data.author}
              <span style={{ marginLeft: "2px" }}>
                {" "}
                {String.fromCharCode(183)}
                {` ${post.posted_time}`}
              </span>
            </div>
          ) : (
            <Link href={`/u/${post.data.author}`}>
              Posted by {post.data.author}
              <span style={{ marginLeft: "2px" }}>
                {" "}
                {String.fromCharCode(183)}
                {` ${post.posted_time}`}
              </span>
            </Link>
          )}
        </div>
      )}
      <div className={styles.post_box_bottom_wrap_mobile}>
        <div className={styles.post_box_score}>
          <BiSolidUpvote className={styles.upvote_icon} />
          <span className={styles.post_box_score}>{post.data.score}</span>
        </div>

        <div className={styles.post_box_comments}>
          <FaRegComment className={styles.comments_icon} />
          <span>{post.data.num_comments}</span>
        </div>
      </div>
    </article>
  );
}

function Image_(props: Post_Inner_Props): JSX.Element {
  const [img_error, set_img_error] = useState<boolean>(false);
  const [dim, set_dim] = useState<MediaSize>({ w: null, h: null });
  let src_ = props.data.url;
  let styles_ = props.clicked
    ? { maxHeight: props.height * 0.7 }
    : { maxHeight: props.height * 0.5 };
  function onError() {
    set_img_error(true);
  }

  useEffect(() => {
    function getMediaSize(iw: number, ih: number): MediaSize {
      let r_ = props.width <= 800 ? 0.9 : 0.4;
      let max_h = props.clicked ? props.height * 0.7 : props.height * 0.6;
      let max_w = props.width * r_;

      let widthPercent = max_w / iw;
      let heightPercent = max_h / ih;
      let smallestPercent = Math.min(widthPercent, heightPercent);

      return {
        w: iw * smallestPercent,
        h: ih * smallestPercent,
      };
    }
    if (
      !props.data.url.includes(".gifv") &&
      !props.data.url.includes("gallery") &&
      props.data.preview
    ) {
      let prev_h = props.data.preview.images[0].source.height;
      let prev_w = props.data.preview.images[0].source.width;
      let dim = getMediaSize(prev_w, prev_h);
      set_dim(dim);
    }
  }, [
    props.width,
    props.height,
    props.data.preview,
    props.data.url,
    props.clicked,
  ]);

  return (
    <Fragment>
      {props.data.url.includes("imgur") && props.data.url.includes(".gifv") ? (
        <video
          autoPlay
          loop
          muted
          style={styles_}
          controls
          preload={"auto"}
          className={styles.video_post}
          src={props.data.url.replace(".gifv", ".mp4")}
        />
      ) : props.data.domain.includes("redd") ||
        props.data.domain.includes("imgur") ? (
        <Fragment>
          {img_error || props.data.url.includes("gallery") ? (
            <a
              onClick={(e) => props.handle_link_click(e, props.data.url)}
              href={props.data.url}
              target="_blank"
              className={styles.img_link_wrap}
            >
              <GoLinkExternal className={styles.img_link_icon} />
              <span>{props.data.url}</span>
            </a>
          ) : (
            <Fragment>
              {dim.w && dim.h && (
                <img
                  alt={"post image"}
                  className={
                    props.clicked ? styles.img_post_clicked : styles.img_post
                  }
                  src={src_}
                  loading={"lazy"}
                  width={dim.w}
                  height={dim.h}
                  onError={onError}
                />
              )}
            </Fragment>
          )}
        </Fragment>
      ) : (
        <a
          onClick={(e) => props.handle_link_click(e, props.data.url)}
          href={props.data.url}
          target="_blank"
          className={styles.img_link_wrap}
        >
          <GoLinkExternal className={styles.img_link_icon} />
          <span>{props.data.url}</span>
        </a>
      )}
    </Fragment>
  );
}

function Text_(props: Text_Inner_Props): JSX.Element | undefined {
  if (props.data.selftext && props.data.selftext.length > 0) {
    let self_text_ = props.data.selftext.replace(/&amp;#x200B;/g, "");
    let styles_ = props.clicked ? {} : { maxHeight: props.height * 0.3 };
    return (
      <div
        className={
          props.clicked ? styles.selftext_box : styles.selftext_box_feed
        }
        style={styles_}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{self_text_}</ReactMarkdown>
      </div>
    );
  }
}

function Video_(props: Post_Inner_Props): JSX.Element {
  let type_ =
    props.data.url.includes("youtube") || props.data.url.includes("youtu.be")
      ? "youtube"
      : props.data.url.includes("redgifs")
      ? "redgifs"
      : props.data.url.includes("gfy")
      ? "gfy"
      : props.data.url.includes("stream")
      ? "streamable"
      : "video";

  let src_ =
    type_ == "youtube" || type_ == "redgifs" || type_ == "gfy"
      ? props.data.secure_media_embed.media_domain_url
      : props.data.secure_media &&
        props.data.secure_media.reddit_video &&
        props.data.secure_media.reddit_video.fallback_url
      ? props.data.secure_media.reddit_video.fallback_url
      : props.data.url;

  let styles_ = props.clicked
    ? { maxHeight: props.height }
    : { maxHeight: props.height * 0.5 };
  return (
    <Fragment>
      {type_ == "youtube" || type_ == "redgifs" || type_ == "gfy" ? (
        <a
          onClick={(e) => props.handle_link_click(e, props.data.url)}
          href={props.data.url}
          target="_blank"
          className={styles.img_link_wrap}
        >
          <GoLinkExternal className={styles.img_link_icon} />
          <span>{props.data.url}</span>
        </a>
      ) : type_ == "streamable" ? (
        <div className={styles.img_link_wrap}>
          <a
            onClick={(e) => props.handle_link_click(e, props.data.url)}
            href={props.data.url}
            target="_blank"
            className={styles.img_link_wrap}
          >
            <GoLinkExternal className={styles.img_link_icon} />
            <span>{props.data.url}</span>
          </a>
        </div>
      ) : (
        <video
          autoPlay
          loop
          muted
          style={styles_}
          controls
          preload={"none"}
          className={styles.video_post}
          src={src_}
        />
      )}
    </Fragment>
  );
}
