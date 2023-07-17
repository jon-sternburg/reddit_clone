
import React, { Fragment, Component, useRef, useCallback, useState, useEffect } from 'react'
import styles from '../homepage_styles.module.css'
import {FcMms} from "react-icons/fc"
import _ from 'lodash'
import Link from 'next/link'
import {AiFillCloseCircle} from "react-icons/ai"
import { useRouter } from 'next/router'


export default function Topbar(props) {
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



useEffect(() => {}, [results]);

async function handleSubmit(e) {
e.preventDefault()
let url_ = `https://www.reddit.com/subreddits/search.json?q=${inputEl.current.value}&include_over_18=on`
const res = await fetch(url_)
const data = await res.json()
let subreddits = data.data.children.map(x => x.data.display_name)
set_search_results({content: subreddits, show: true})

}

function handle_search_reddit(subreddit, query) {

set_search_results({content: [], show: false})


props.search_reddit(subreddit, query)
}

function handleInputChange(e) {
inputEl.current.value = e

}
function handleInputChange_username(e) {
username_input_ref.current.value = e

}
function handleInputChange_password(e) {
password_input_ref.current.value = e

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

<div className = {styles.top_bar_frame}>

<div className = {styles.top_bar_frame_left}>

<div className = {styles.banner} onClick = {(e) => handle_logo_click(e)}>
<FcMms className = {styles.banner_icon} />
<div className = {styles.banner_text}>Reddit Clone!</div>
</div>


{props.subreddit  && (
<div className = {styles.subreddit_tag}>

{props.search ? `r/${props.subreddit} search: '${props.query}'` :  `r/${props.subreddit}` }

</div>
  )}


{props.user  && (
<div className = {styles.subreddit_tag}>

u/{props.user}

</div>
  )}



{!props.subreddit  && props.search &&(
<div className = {styles.subreddit_tag}>

{`reddit search: '${props.query}'`}

</div>
  )}

</div>
<div className = {styles.top_bar_frame_center}>
<div className ={styles.search_wrap} >
<div className ={styles.search_wrap} >
<form onSubmit={(e) => handleSubmit(e)}>
<input      
className={styles.search}
placeholder="Search..."  
onChange={(e) => handleInputChange(e.target.value)}
ref={inputEl}
/>
</form>

{results.show && (
<div className = {styles.results_wrap}>
<div className = {styles.results_wrap_inner}>

{props.subreddit && (
<Link key = {props.subreddit + '/' + inputEl.current.value} href={`/${props.subreddit}/search/${inputEl.current.value}`}> 
<div className = {styles.query_wrap} >Search r/{props.subreddit} for {`"${inputEl.current.value}"`}</div>
</Link>
)}

<Link key = {inputEl.current.value} href={`/search/${inputEl.current.value}`}> 
<div className = {styles.query_wrap} >Search reddit for {`"${inputEl.current.value}"`}</div>
</Link>

{results.content.map((x,i) => {

 return <Link key = {i} href={`/${x}`}> <div  className = {styles.results_item}>r/{x}</div></Link>

})}
</div>
</div>
)}
</div>


<AiFillCloseCircle style = {{opacity: results.show ? '1' : '0'}} onClick = {() => cancel_search()} className = {styles.cancel_search_icon} />

</div>
</div>

<div className = {styles.top_bar_frame_right}>
{/*
<div onClick = {() => handle_login()}className = {styles.login_wrap}>GitHub</div>

<div onClick = {() => handle_login()}className = {styles.login_wrap}>Log In</div>

{login_panel.show && (
<div className = {styles.login_panel}>

<div className = {styles.username_wrap}>

<form >
<input      
className={styles.search}
placeholder="Username"  
onChange={(e) => handleInputChange_username(e.target.value)}
ref={username_input_ref}
/>
</form>


</div>

<div className = {styles.password_wrap}>

<form >
<input      
className={styles.search}
placeholder="Password"  
onChange={(e) => handleInputChange_password(e.target.value)}
ref={password_input_ref}
/>
</form>


</div>




</div>
  )}
*/}
</div>

</div>







  )

}