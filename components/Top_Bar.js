
import React, { Fragment, Component, useRef, useCallback, useState, useEffect } from 'react'
import styles from '../homepage_styles.module.css'
import {FcMms} from "react-icons/fc"
import _ from 'lodash'
import Link from 'next/link'
import {AiFillCloseCircle} from "react-icons/ai"
import { useRouter } from 'next/router'


export default function Top_Bar(props) {
const router = useRouter()
const inputEl = useRef(null);
const username_input_ref = useRef(null);
const password_input_ref = useRef(null);
const [results, set_search_results] = useState({content: [], show: false})
const [login_panel, set_login_panel] = useState({show: false})

//const handle_input_debounced = useCallback(_.debounce(handleSearchChange, 500), []);

function handle_login() {
set_login_panel({show: !login_panel.show})
}


async function handleSubmit(e) {
e.preventDefault()
let url_ = `https://www.reddit.com/subreddits/search.json?q=${inputEl.current.value}&include_over_18=on`
const res = await fetch(url_)
const data = await res.json()
let subreddits = data.data.children//.map(x => x.data.display_name)

set_search_results({content: subreddits, show: true})

}

function handle_search_reddit(subreddit, query) {

set_search_results({content: [], show: false})


props.search_reddit(subreddit, query)
}

function handleInputChange(e) {
inputEl.current.value = e

}


function cancel_search() {
inputEl.current.value = ''
set_search_results({content: [], show: false}) 
}


function handle_logo_click(e) {
    e.preventDefault()
    router.push('/')
}

return (

<header className = {styles.top_bar_frame}>

<div className = {styles.top_bar_frame_left}>

<div className = {styles.banner} onClick = {(e) => handle_logo_click(e)}>
<FcMms className = {styles.banner_icon} />
<div className = {styles.banner_text}>Reddit Clone!</div>
</div>


{router.query.r  && (
<div className = {styles.subreddit_tag}>

{router.query.s ? `r/${router.query.r } search: '${router.query.s}'` :  `r/${router.query.r }` }

</div>
  )}


{router.query.u  && (
<div className = {styles.subreddit_tag}>

u/{router.query.u}

</div>
  )}



{!router.query.r  && router.query.s &&(
<div className = {styles.subreddit_tag}>

{`reddit search: '${router.query.s}'`}

</div>
  )}

</div>
<div className = {styles.top_bar_frame_center}>
<div className ={styles.search_wrap} >
<div className ={styles.search_wrap} >
<form onSubmit={(e) => handleSubmit(e)} id ="search bar form">
<input      
className={styles.search}
placeholder="Search..."  
onChange={(e) => handleInputChange(e.target.value)}
ref={inputEl}
id = "search bar input"
/>
</form>

{results.show && (
     

<OutsideAlerter cancel_search = {cancel_search}>
<div className = {styles.results_wrap_inner}>

{router.query.r && (
<Link key = {router.query.r + '/' + inputEl.current.value} href={`/${router.query.r}/search/${inputEl.current.value}`}> 
<div className = {styles.query_wrap} >Search r/{router.query.r} for {`"${inputEl.current.value}"`}</div>
</Link>
)}

<Link key = {inputEl.current.value} href={`/search/${inputEl.current.value}`}> 
<div className = {styles.query_wrap} >Search reddit for {`"${inputEl.current.value}"`}</div>
</Link>

{results.content.map((x,i) => {

 return <Link key = {i} href={`/${x.data.display_name}`}> 

<div className = {styles.results_item}>
{x.data && x.data.icon_img && (<img alt = {"subreddit icon image"} height = {20} width = {20} src = {x.data.icon_img} className = {styles.icon_img} />)}
<span>r/{x.data.display_name}</span>
</div>

 </Link>

})}
</div>
</OutsideAlerter>



)}
</div>


<AiFillCloseCircle style = {{opacity: results.show ? '1' : '0'}} onClick = {() => cancel_search()} className = {styles.cancel_search_icon} />

</div>
</div>

<div className = {styles.top_bar_frame_right}>

</div>

</header>







  )

}


function OutsideAlerter(props) {
  const wrapperRef = useRef(null);

function useOutsideAlerter(ref) {
  useEffect(() => {

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        props.cancel_search()
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

}  useOutsideAlerter(wrapperRef);
  return <div ref={wrapperRef} className = {styles.results_wrap}>{props.children}</div>;
}
