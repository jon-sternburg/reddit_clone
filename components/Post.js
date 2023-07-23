import React, {Fragment, useState, useEffect } from "react";
import styles from '../posts_container_styles.module.css'
import { useIntersectionObserverRef } from "rooks";
import Link from 'next/link'
import {BiSolidUpvote} from "react-icons/bi"
import {FaRegComment} from "react-icons/fa"
import {BiSolidDownvote} from "react-icons/bi"
import {GoLinkExternal} from "react-icons/go"
import { marked } from 'marked';
import parse from 'html-react-parser';

import {MdQuestionAnswer} from "react-icons/md"

export default function Post(props) {

let post = props.post
let h_ = props.h_
let i = props.i

let type_ = (post.data.is_video)|| (post.data.post_hint && post.data.post_hint.includes('video')) ? <Video_ handle_link_click = {handle_link_click} width = {props.w_} height = {h_} data = {post.data} /> : 
                                                                                post.data.is_self ? <Text_ handle_link_click = {handle_link_click} data = {post.data}  height = {h_} />  : 
                                                                                <Image_ handle_link_click = {handle_link_click} height = {h_} data = {post.data} width = {props.w_} /> 
function handle_link_click(e, url) {
e.preventDefault()
e.stopPropagation()

  window.open(url, '_blank');
}

function handle_post_box_click(e) {
e.preventDefault()
e.stopPropagation()


}


return (


<div className = {styles.post_box} onClick = {() => props.handle_post_click(post)}>
 
<div className = {styles.post_box_top_wrapper} >

<div className = {styles.post_box_title_wrap}>
<h3 className = {styles.post_box_title}>{post.data.title}</h3>
<div className = {styles.post_info_wrapper}>


<div className = {styles.post_box_subreddit} onClick = {(e) => handle_post_box_click(e)}>
<Link href={`/${post.data.subreddit}`}>
{post.data.sr_detail && post.data.sr_detail.icon_img && (<img alt = {"subreddit icon image"} height = {20} width = {20} style= {{marginRight: '5px', borderRadius: '100%'}} src = {post.data.sr_detail.icon_img} className = {styles.icon_img} />)}
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

)}

function Image_(props) {
const [img_error, set_img_error] = useState(false);
const [dim, set_dim] = useState({w: null, h: null})
let src_ =  props.data.url 

function onError() {
console.log('error => ', props)
set_img_error(true)
}


  useEffect(() => {

if (!props.data.url.includes('.gifv') && !props.data.url.includes('gallery') && props.data.preview) {

let prev_h = props.data.preview.images[0].source.height
let prev_w = props.data.preview.images[0].source.width
let dim = getMediaSize(prev_w, prev_h)
set_dim(dim)
} 
//else {set_dim({w: 'auto', h: 'auto'})}


}, [props.width, props.height])




function getMediaSize(iw, ih) {
let r_ = props.width <= 800 ? .7 : .4
let max_h = props.height * .7
let max_w = props.width * r_



let widthPercent = max_w / iw;
let heightPercent = max_h / ih;
let smallestPercent = Math.min(widthPercent, heightPercent);

return {
    w: iw * smallestPercent,
    h: ih * smallestPercent
}

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
<Fragment>
{dim.w && dim.h && (
 <img alt = {'post image'} 
 className = {styles.img_post} 
 src = {src_} 
 loading = {"lazy"}
 width = {dim.w}
 height = {dim.h}
 onError={onError}/> 
)}
</Fragment>

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
<div className = {styles.selftext_box_feed} style = {{maxHeight: props.height * .7}} >
  {html_}
</div>
  )}

</Fragment>
    
    )
} /*else {


  return (
<div className = {styles.read_icon_wrap}><MdQuestionAnswer className = {styles.read_icon} /></div>
    )
}
*/
}

function Video_(props) {

let type_ = props.data.url.includes('youtube') || props.data.url.includes('youtu.be') ? 'youtube' : props.data.url.includes('redgifs') ? 'redgifs'  : 
props.data.url.includes('gfy') ? 'gfy' : props.data.url.includes('stream') ? 'streamable' : 'video'


let src_ = type_ == 'youtube' || type_ == 'redgifs'  || type_ == 'gfy' ? props.data.secure_media_embed.media_domain_url : props.data.secure_media && props.data.secure_media.reddit_video && props.data.secure_media.reddit_video.fallback_url ?
props.data.secure_media.reddit_video.fallback_url : props.data.secure_media.reddit_video ?  props.data.secure_media.reddit_video : props.data.url




  return (
    <Fragment>

    { type_ == 'youtube' || type_ == 'redgifs' || type_ == 'gfy'? <a onClick = {(e) => props.handle_link_click(e, props.data.url)} href={props.data.url} target="_blank"  className = {styles.img_link_wrap}>
<GoLinkExternal className = {styles.img_link_icon} />
<span>{props.data.url}</span>
</a>
                                                          :  type_ == 'streamable' ? <div className = {styles.img_link_wrapper}>
<a onClick = {(e) => props.handle_link_click(e, props.data.url)} href={props.data.url} target="_blank"  className = {styles.img_link_wrap}>
<GoLinkExternal className = {styles.img_link_icon} />
<span>{props.data.url}</span>
</a>
</div> : 
    <video 
    autoPlay 
    loop 
    loading = {"lazy"}
    muted
    style = {{maxHeight: props.height * .7}}
    controls
    preload = {'auto'} 
    className = {styles.video_post} 
    src = {src_} />}
    </Fragment>
    )
  }