'use client'
import React, { useRef, useState, useEffect, SyntheticEvent, MouseEvent, FormEvent, RefObject, useMemo, ChangeEvent} from 'react'
import styles from '../homepage_styles.module.css'
import {BsReddit} from "react-icons/bs"
import Link from 'next/link'
import {AiFillCloseCircle} from "react-icons/ai"
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getCookie } from 'cookies-next';
import {SubredditSearchResult, Subreddit} from '../types/subreddit_types'
import debouce from "lodash.debounce";

type Results = {
  content: Subreddit[]
  show: boolean
}

type OA_Props = {
  cancel_search: () => void
  children: JSX.Element | JSX.Element[] 
  }
  
type FetchNewData = SubredditSearchResult;

export default function Top_Bar():JSX.Element {
const router = useRouter()
const params = useParams()
const subreddit = params.r ? params.r.toString() : false
const query = params.s ? params.s.toString() : false
const inputEl = useRef<HTMLInputElement | null>(null);

const [results, set_search_results] = useState<Results>({content: [], show: false})


const debouncedResults = useMemo(() => {
  return debouce(handleSearchChange, 300);
  }, []);


async function fetch_subreddits(url_:string):Promise<FetchNewData | null>{

 
  const token_ = getCookie('access_token')
  return await fetch("/api/fetch_data", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: url_, token: token_})
    })
  .then((res) => res.json())
  .then((data) => data)
  .catch(err => {
  console.log(err); 
  return null
  })
  }

async function handleSubmit(e:SyntheticEvent) {
e.preventDefault()
if (inputEl.current !== null) { 
let url_ = `https://oauth.reddit.com/subreddits/search.json?q=${inputEl.current.value}&include_over_18=on`
const data = await fetch_subreddits(url_)

if (data !== null) { set_search_results({content: data.data.children, show: true})}

}
}


async function handleSearchChange(e:ChangeEvent<HTMLInputElement>) {

  let kv = e.target.value

  if (kv !== null && kv.length > 0) { 
    let url_ = `https://oauth.reddit.com/subreddits/search.json?q=${kv}&include_over_18=on`
    const data = await fetch_subreddits(url_)
    
    if (data !== null) { set_search_results({content: data.data.children, show: true})}
    
    }


}


function cancel_search():void {
  if (inputEl.current !== null) { 
inputEl.current.value = ''
set_search_results({content: [], show: false}) 
  }
}


function handle_logo_click(e: MouseEvent<HTMLButtonElement>): void{
    e.preventDefault()
    router.push('/')
}

return (

<nav className = {styles.top_bar_frame}>

<div className = {styles.top_bar_frame_left}>

<button type = {"button"} className = {styles.banner} onClick = {(e) => handle_logo_click(e)}>
<BsReddit className = {styles.banner_icon} />
<span className = {styles.banner_text}>Reddit Clone!</span>
</button>


{subreddit  && (
<div className = {styles.subreddit_tag}>

{query ? `r/${subreddit  } search: '${query}'` :  `r/${subreddit}` }

</div>
  )}


{params.u && (
<div className = {styles.subreddit_tag}>

u/{params.u}

</div>
  )}



{!subreddit   && query &&(
<div className = {styles.subreddit_tag}>

{`reddit search: '${query}'`}

</div>
  )}

</div>
<div className = {styles.top_bar_frame_center}>
<div className ={styles.search_wrap} >
<div className ={styles.search_wrap} >
<form  onSubmit={(e) => e.preventDefault()}  role="search" id ="search_bar_form">
<input      
className={styles.search}
placeholder="Search..."  
onChange={debouncedResults}
ref={inputEl}
type={"search"}
name={"search_bar_input"}
id = "search_bar_input"
/>
</form>

{results.show && (
     

<OutsideAlerter cancel_search = {cancel_search}>
<div className = {styles.results_wrap_inner}>

{subreddit && inputEl.current !== null &&(
<Link key = {subreddit + '/' + inputEl.current.value} href={`/r/${subreddit}/search/${inputEl.current.value}`}> 
<span className = {styles.query_wrap} >Search r/{subreddit} for {`"${inputEl.current.value}"`}</span>
</Link>
)}
{inputEl.current !== null &&(
<Link key = {inputEl.current.value} href={`/search/${inputEl.current.value}`}> 
<span className = {styles.query_wrap} >Search reddit for {`"${inputEl.current.value}"`}</span>
</Link>
)}

{results.content.length > 0 ? 

results.content.map((x,i) => {

 return <Link key = {i} href={`/r/${x.data.display_name}`} className = {styles.results_item}> 
{x.data && x.data.icon_img && (<img alt = {"subreddit icon image"} height = {20} width = {20} src = {x.data.icon_img} className = {styles.icon_img} />)}
<span>r/{x.data.display_name}</span>
 </Link>

})
:
<div className = {styles.no_search_results}>No subreddit results! Try searching for something else.</div>

}


</div>
</OutsideAlerter>



)}
</div>


<AiFillCloseCircle style = {{opacity: results.show ? '1' : '0'}} onClick = {() => cancel_search()} className = {styles.cancel_search_icon} />

</div>
</div>

<div className = {styles.top_bar_frame_right}>

</div>

</nav>







  )

}


function OutsideAlerter(props: OA_Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

function useOutsideAlerter(ref: RefObject<HTMLElement>) {
  useEffect(() => {

    function handleClickOutside(event: Event) {
      const target = event.target as HTMLElement
      if (ref.current && !ref.current.contains(target)) {
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

