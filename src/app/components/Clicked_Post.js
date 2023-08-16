'use client'
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
import {MdQuestionAnswer} from "react-icons/md"
var qs = require('qs');

export default function Clicked_Post(props) {

const {post, h_, i}  = props

const sub_icon = post.data.sr_detail && post.data.sr_detail.icon_img.length > 0 ? post.data.sr_detail.icon_img : post.data.sr_detail && post.data.sr_detail.community_icon ? post.data.sr_detail.community_icon.replace('amp;', '') : null
const type_ = (post.data.is_video)|| (post.data.post_hint && post.data.post_hint.includes('video')) ? <Video_ handle_link_click = {handle_link_click} width = {props.w_} height = {h_} data = {post.data} /> : 
                                                                                post.data.is_self ? <Text_ handle_link_click = {handle_link_click} data = {post.data}  height = {h_} />  : 
                                                                                <Image_ handle_link_click = {handle_link_click} height = {h_} data = {post.data} /> 

const no_selftext = post.data.is_self && (!post.data.selftext || !post.data.selftext.length || post.data.selftext.length == 0)

function handle_link_click(e, url) {
e.preventDefault()
e.stopPropagation()

  window.open(url, '_blank');
}
function handle_post_box_click(e) {
e.preventDefault()
e.stopPropagation()


}

useEffect(() => {

document.title = post.data.title


if (props.prev) { 
let title_ = props.prev.includes('/search/') ? `search results for ${props.prev.replace('/search/', '').split('/')[0]}` : props.prev.replace('/r/', '').replace('/u/', '').split('/')[0]
return () => document.title = title_ && title_.length > 0 ? title_ : 'Reddit Clone!'


}

}, [])


return (

<article className = {styles.post_box} onClick = {() => props.handle_post_click(post)}>
 
<header className = {styles.post_box_top_wrapper} >

<div className = {styles.post_box_title_wrap_clicked_post}>
<h3 className = {styles.post_box_title}>{post.data.title}</h3>
<div className = {styles.post_info_wrapper}>
<div className = {styles.post_box_subreddit} onClick = {(e) => handle_post_box_click(e)}>
<Link href={`/r/${post.data.subreddit}`}>
{post.data.sr_detail && sub_icon !== null ? <img alt = {"subreddit icon image"} height = {20} width = {20} style= {{marginRight: '5px', borderRadius: '100%'}} src = {sub_icon} className = {styles.icon_img} />
:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className = {styles.generic_icon} >
<path d="M16.5,2.924,11.264,15.551H9.91L15.461,2.139h.074a9.721,9.721,0,1,0,.967.785ZM8.475,8.435a1.635,1.635,0,0,0-.233.868v4.2H6.629V6.2H8.174v.93h.041a2.927,2.927,0,0,1,1.008-.745,3.384,3.384,0,0,1,1.453-.294,3.244,3.244,0,0,1,.7.068,1.931,1.931,0,0,1,.458.151l-.656,1.558a2.174,2.174,0,0,0-1.067-.246,2.159,2.159,0,0,0-.981.215A1.59,1.59,0,0,0,8.475,8.435Z"></path>
</svg>

}
<span>r/{post.data.subreddit}</span>
</Link>
</div>

<div className = {styles.post_box_score}>
<BiSolidUpvote className = {styles.upvote_icon}/>
<span className = {styles.post_box_score}>{post.data.score}</span>
</div>

{no_selftext && (
<Fragment>
<div className = {styles.post_box_comments}>
<FaRegComment className = {styles.comments_icon} /> 
<span>{post.data.num_comments}</span>
</div>
<div className = {styles.post_box_author} onClick = {(e) => handle_post_box_click(e)}>


{post.data.author == '[deleted]' ? 

<div>u/{post.data.author}<span style = {{marginLeft: '2px'}}> {String.fromCharCode(183)}{` ${post.posted_time}`}</span></div>

:

<Link href={`/u/${post.data.author}`}>u/{post.data.author}<span style = {{marginLeft: '2px'}}> {String.fromCharCode(183)}{` ${post.posted_time}`}</span></Link>

}



</div>
</Fragment>

  )}




</div>
</div>
</header>
<div className = {styles.post_box_inner}>
{type_}
</div>

{!no_selftext && (

<footer className = {styles.post_box_bottom_wrap}>
<div className = {styles.post_box_comments}>
<FaRegComment className = {styles.comments_icon} /> 
<span>{post.data.num_comments}</span>
</div>
<div className = {styles.post_box_author} onClick = {(e) => handle_post_box_click(e)}>



{post.data.author == '[deleted]' ? 

<div>u/{post.data.author}<span style = {{marginLeft: '2px'}}> {String.fromCharCode(183)}{` ${post.posted_time}`}</span></div>

:

<Link href={`/u/${post.data.author}`}>u/{post.data.author}<span style = {{marginLeft: '2px'}}> {String.fromCharCode(183)}{` ${post.posted_time}`}</span></Link>

}

</div>
</footer>
)}



</article>


	)





}

function Image_(props) {
const [img_error, set_img_error] = useState(false);

let src_ = props.data.domain.includes('redd') || props.data.domain.includes('imgur') ? props.data.url : props.data.thumbnail



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


 } /*else {


  return (
<div className = {styles.read_icon_wrap}><MdQuestionAnswer className = {styles.read_icon} /></div>
    )
}
*/



  }

function Video_(props) {

let type_ = props.data.url.includes('youtube') || props.data.url.includes('youtu.be') ? 'youtube' : props.data.url.includes('redgifs') ? 'redgifs'  : 
props.data.url.includes('gfy') ? 'gfy' : 'video'


let src_ = type_ == 'youtube' || type_ == 'redgifs'  || type_ == 'gfy' ? props.data.secure_media_embed.media_domain_url : props.data.secure_media && props.data.secure_media.reddit_video && props.data.secure_media.reddit_video.fallback_url ?
props.data.secure_media.reddit_video.fallback_url : props.data.secure_media.reddit_video ?  props.data.secure_media.reddit_video : props.data.url


  return (
    <Fragment>

    { type_ == 'youtube' || type_ == 'redgifs' || type_ == 'gfy'?  <a onClick = {(e) => props.handle_link_click(e, props.data.url)} href={props.data.url} target="_blank"  className = {styles.img_link_wrap}>
<GoLinkExternal className = {styles.img_link_icon} />
<span>{props.data.url}</span>
</a> : 
    <video 
    autoPlay 
    loop 
    muted
    style = {{maxHeight: props.height}}
    controls
    preload = {'auto'} 
    className = {styles.video_post} 
    src = {src_} />}
    </Fragment>
    )
  }