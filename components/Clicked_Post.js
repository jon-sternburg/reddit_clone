import React, {Fragment, useState, useEffect, useCallback, useRef } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import {BiSolidUpvote} from "react-icons/bi"
import {BiSolidDownvote} from "react-icons/bi"
import {GoLinkExternal} from "react-icons/go"
import { marked } from 'marked';
import parse from 'html-react-parser';
import {FaRegComment} from "react-icons/fa"



export default function Clicked_Post(props) {


let post = props.post
let h_ = props.h_
let i = props.i

let type_ = (post.data.is_video)|| (post.data.post_hint && post.data.post_hint.includes('video')) ? <Video_ handle_link_click = {handle_link_click} width = {props.w_} height = {h_} data = {post.data} /> : 
                                                                                post.data.is_self ? <Text_ handle_link_click = {handle_link_click} data = {post.data}  height = {h_} />  : 
                                                                                <Image_ handle_link_click = {handle_link_click} height = {h_} data = {post.data} /> 

function handle_link_click(e, url) {
e.preventDefault()
e.stopPropagation()

  window.open(url, '_blank');
}

return (

<div className = {styles.post_box} onClick = {() => props.handle_post_click(post)}>
 
<div className = {styles.post_box_top_wrapper} >

<div className = {styles.post_box_title_wrap}>
<h3 className = {styles.post_box_title}>{post.data.title}</h3>
<div className = {styles.post_info_wrapper}>


<div className = {styles.post_box_subreddit} onClick = {(e) => handle_post_box_click(e)}>
<Link href={`/${post.data.subreddit}`}>
{post.data.sr_detail && post.data.sr_detail.icon_img && (<img alt = {"subreddit icon image"} height = {20} width = {20} src = {post.data.sr_detail.icon_img} className = {styles.icon_img} />)}
<span>r/{post.data.subreddit}</span>
</Link>
</div>

<div className = {styles.post_box_score}>
<BiSolidUpvote className = {styles.upvote_icon}/>
<div className = {styles.post_box_score}>{post.data.score}</div>
</div>




</div>
</div>


</div>


<div className = {styles.post_box_inner}>
{type_}
</div>
<div className = {styles.post_box_bottom_wrap}>
<div className = {styles.post_box_comments}>
<FaRegComment className = {styles.comments_icon} /> 
{post.data.num_comments}
</div>
<div className = {styles.post_box_author} onClick = {(e) => handle_post_box_click(e)}>
<Link href={`/u/${post.data.author}`}>u/{post.data.author}<span style = {{marginLeft: '2px'}}> {String.fromCharCode(183)}{` ${post.posted_time}`}</span></Link>
</div>
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

<a onClick = {(e) => props.handle_link_click(e, props.data.url)} href={props.data.url} target="_blank"  className = {styles.img_link_wrap}>
<GoLinkExternal className = {styles.img_link_icon} />
<span>{props.data.url}</span>
</a>
:
 <img alt = {'post image'} className = {styles.img_post_clicked} src = {src_} style = {{maxHeight: props.height}} onError={onError}/> 

}
</Fragment>
:
<a onClick = {(e) => props.handle_link_click(e, props.data.url)} href={props.data.url} target="_blank"  className = {styles.img_link_wrap}>
<GoLinkExternal className = {styles.img_link_icon} />
<span>{props.data.url}</span>
</a>
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