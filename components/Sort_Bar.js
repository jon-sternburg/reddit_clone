import React, {Fragment, useState, useEffect, useCallback, useRef, useMemo } from "react";
import styles from '../posts_container_styles.module.css'
import {AiOutlineFire} from "react-icons/ai"
import {AiOutlineStar} from "react-icons/ai"
import {AiOutlineTrophy} from "react-icons/ai"
import {AiFillCaretDown, AiFillCloseCircle} from "react-icons/ai"


export default function Sort_Bar(props) {

let posts = props.posts

return (
                  <div className = {styles.sort_wrapper}>
                  <button type="button" className = {props.sort == 'hot' ? styles.sort_option_selected : styles.sort_option} onClick = {() => props.set_post_sort('hot')}>
                  <AiOutlineFire className = {styles.hot_icon} />
                  <span className = {styles.sort_inner}>Hot</span>
                  </button>

                  <button type="button"  className = {props.sort == 'new' ? styles.sort_option_selected : styles.sort_option} onClick = {() => props.set_post_sort('new')}>
                  <AiOutlineStar className = {styles.new_icon} />
                  <span className = {styles.sort_inner}>New</span>

                  </button>
                  <button type="button"  className = {props.sort == 'top' ? styles.sort_option_selected : styles.sort_option} onClick = {() => props.set_post_sort('top')}>
                  <AiOutlineTrophy className = {styles.top_icon} />
                  <span className = {styles.sort_inner}>Top</span>

                  </button>
                  {props.sort == 'top' && (
                  <Fragment>
                  <div className = {styles.sort_option_time} >

                  <button type="button"  onClick = {() => props.handle_time_sort('toggle')} className = {styles.sort_inner_wrap}>
                  <span className = {styles.sort_inner}>{props.top_time_sort}</span>
                  <AiFillCaretDown className = {styles.down_icon} />
                  </button>
                  {props.show_time_sort && (
                  <OutsideAlerter handle_time_sort = {(x) => props.handle_time_sort(x)}>
                  <div className = {styles.time_sort_popup}>

                  <button type="button" className = {props.top_time_sort == 'Now' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Now')}>Now</button>
                  <button type="button" className = {props.top_time_sort == 'Today' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Today')}>Today</button>
                  <button type="button" className = {props.top_time_sort == 'Week' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Week')}>Week</button>
                  <button type="button" className = {props.top_time_sort == 'Month' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Month')}>Month</button>
                  <button type="button" className = {props.top_time_sort == 'Year' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Year')}>Year</button>
                  <button type="button" className = {props.top_time_sort == 'All' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('All')}>All</button>
                  </div>
                  </OutsideAlerter>

                    )}


                  </div>


                  </Fragment>
                  )}

                  </div>

)
                }


                
function OutsideAlerter(props) {
  const wrapperRef = useRef(null);

function useOutsideAlerter(ref) {
  useEffect(() => {

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        props.handle_time_sort('toggle')
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

}  useOutsideAlerter(wrapperRef);
  return <div ref={wrapperRef}>{props.children}</div>;
}
