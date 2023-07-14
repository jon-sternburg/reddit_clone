import React, {Fragment, useState, useEffect, useCallback, useRef, useMemo } from "react";
import styles from '../posts_container_styles.module.css'
import {AiFillFire} from "react-icons/ai"
import {AiFillClockCircle} from "react-icons/ai"
import {AiFillTrophy} from "react-icons/ai"
import {AiFillCaretDown, AiFillCloseCircle} from "react-icons/ai"


export default function Sort_Bar(props) {






let posts = props.posts






return (
                  <div className = {styles.sort_wrapper}>
                  <div className = {props.sort == 'hot' ? styles.sort_option_selected : styles.sort_option} onClick = {() => props.set_post_sort('hot')}>
                  <AiFillFire className = {styles.hot_icon} />
                  <div className = {styles.sort_inner}>Hot</div>
                  </div>

                  <div className = {props.sort == 'new' ? styles.sort_option_selected : styles.sort_option} onClick = {() => props.set_post_sort('new')}>
                  <AiFillClockCircle className = {styles.new_icon} />
                  <div className = {styles.sort_inner}>New</div>

                  </div>
                  <div className = {props.sort == 'top' ? styles.sort_option_selected : styles.sort_option} onClick = {() => props.set_post_sort('top')}>
                  <AiFillTrophy className = {styles.top_icon} />
                  <div className = {styles.sort_inner}>Top</div>

                  </div>
                  {props.sort == 'top' && (
                  <Fragment>
                  <div className = {styles.sort_option_time} >

                  <div onClick = {() => props.handle_time_sort('toggle')} className = {styles.sort_inner_wrap}>
                  <div className = {styles.sort_inner}>{props.top_time_sort}</div>
                  <AiFillCaretDown className = {styles.down_icon} />
                  </div>
                  {props.show_time_sort && (
                  <OutsideAlerter handle_time_sort = {(x) => props.handle_time_sort(x)}>
                  <div className = {styles.time_sort_popup}>

                  <div className = {props.top_time_sort == 'Now' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Now')}>Now</div>
                  <div className = {props.top_time_sort == 'Today' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Today')}>Today</div>
                  <div className = {props.top_time_sort == 'Week' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Week')}>Week</div>
                  <div className = {props.top_time_sort == 'Month' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Month')}>Month</div>
                  <div className = {props.top_time_sort == 'Year' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('Year')}>Year</div>
                  <div className = {props.top_time_sort == 'All' ? styles.time_sort_option_selected : styles.time_sort_option} onClick = {() => props.handle_time_sort('All')}>All</div>
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
