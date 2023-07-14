import React, {Fragment, useState, useEffect, useCallback, useRef, useMemo } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import {AiOutlineCaretUp} from "react-icons/ai"
import {AiOutlineCaretDown} from "react-icons/ai"


import { marked } from 'marked';
import parse from 'html-react-parser';

export default function Clicked_Post(props) {


let post = props.post
let h_ = props.h_
let i = props.i

let type_ = (post.data.is_video)|| (post.data.post_hint && post.data.post_hint.includes('video')) ? <Video_ width = {props.w_} height = {h_} data = {post.data} /> : 
                                                                                post.data.is_self ? <Text_ data = {post.data}  height = {h_} />  : <Image_ height = {h_} data = {post.data} /> 



return (
<div className = {styles.post_box} >
 
<div className = {styles.post_box_top_wrapper} onClick = {() => props.handle_post_click(post)}>

<div className = {styles.score_wrapper}>
<AiOutlineCaretUp className = {styles.upvote_icon}/>
<div className = {styles.post_box_score}>{post.data.score}</div>
<AiOutlineCaretDown className = {styles.downvote_icon}/>
</div>



<div className = {styles.post_box_title}>{post.data.title}</div>
</div>
<div className = {styles.post_info_wrapper}>
<Link href={`/${post.data.subreddit}`}>
<div className = {styles.post_box_subreddit}>r/{post.data.subreddit}</div>
</Link>
<Link href={`/u/${post.data.author}`}>
<div className = {styles.post_box_author}>u/{post.data.author}</div>
</Link>
<div className = {styles.post_box_comments} >Posted {post.posted_time}</div>
<div className = {styles.post_box_comments} onClick = {() => props.handle_post_click(post)}>{post.data.num_comments} comments</div>
</div>

<div className = {styles.post_box_inner}>
{type_}
</div>
</div>
  




	)





}

function Image_(props) {
const [img_error, set_img_error] = useState(false);

let src_ = props.data.domain.includes('redd') || props.data.domain.includes('imgur') ? props.data.url : props.data.thumbnail
let height_ = props.data.thumbnail_height
let width_ = props.data.thumbnail_width


function onError() {
set_img_error(true)
}


  return (
<Fragment>
{props.data.url.includes('imgur') && props.data.url.includes('.gifv') ?

    <video 
    autoPlay 
    loop 
    muted
    style = {{maxHeight: props.height * .7}}
    controls
   // poster = {props.data.thumbnail} 
    preload = {'auto'} 
    className = {styles.video_post} 
    src = {props.data.url.replace('.gifv', '.mp4')} />

    : props.data.domain.includes('redd') || props.data.domain.includes('imgur') ? 
<Fragment>

{img_error || props.data.url.includes('gallery') ? 

<div className = {styles.img_link_wrapper}>
<form action = {props.data.url} method = 'get' target="_blank">
<button type = 'submit' className = {styles.img_link_wrap}>
<span className = {styles.img_link}>{props.data.url}</span>
</button>
</form>
</div>
:
 <img alt = {'post image'} className = {styles.img_post_clicked} src = {src_} style = {{maxHeight: props.height}} onError={onError}/> 

}
</Fragment>
:
<div className = {styles.img_link_wrapper}>
<form action = {props.data.url} method = 'get' target="_blank">
<button type = 'submit' className = {styles.img_link_wrap}>
<span className = {styles.img_link}>{props.data.url}</span>
</button>
</form>
</div>
}
</Fragment>

    )
  }

  function Text_(props) {

if (props.data.selftext && props.data.selftext.length > 0) { 
let text = marked.parse(props.data.selftext,  {mangle: false, headerIds: false})
let html_ = parse(text)


  return (
<Fragment>

{html_ && html_.length > 0 && (
<div className = {styles.selftext_box}  >
  {html_}
</div>
  )}

</Fragment>
    
    )


 } else {


return(

<Fragment>
</Fragment>
  )

 }




  }

function Video_(props) {

let type_ = props.data.url.includes('youtube') || props.data.url.includes('youtu.be') ? 'youtube' : props.data.url.includes('redgifs') ? 'redgifs'  : 
props.data.url.includes('gfy') ? 'gfy' : 'video'


let src_ = type_ == 'youtube' || type_ == 'redgifs'  || type_ == 'gfy' ? props.data.secure_media_embed.media_domain_url : props.data.secure_media && props.data.secure_media.reddit_video && props.data.secure_media.reddit_video.fallback_url ?
props.data.secure_media.reddit_video.fallback_url : props.data.secure_media.reddit_video ?  props.data.secure_media.reddit_video : props.data.url


  return (
    <Fragment>

    { type_ == 'youtube' || type_ == 'redgifs' || type_ == 'gfy'?  <iframe width = {props.data.secure_media_embed.width } 
                                                                          //height = {type_ == 'youtube' ? '' : props.height}

                                                                          height = {props.data.secure_media_embed.height + 5} 
                                                                          className = {styles.video_post} src = {src_} /> : 
    <video 
    autoPlay 
    loop 
    muted
    style = {{maxHeight: props.height}}
    controls
   // poster = {props.data.thumbnail} 
    preload = {'auto'} 
    className = {styles.video_post} 
    src = {src_} />}
    </Fragment>
    )
  }