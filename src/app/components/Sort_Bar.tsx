'use client'
import React, {Fragment, useState, useRef, useEffect, MouseEvent, RefObject} from "react";
import styles from '../posts_container_styles.module.css'
import {AiOutlineFire} from "react-icons/ai"
import {AiOutlineStar} from "react-icons/ai"
import {AiOutlineTrophy} from "react-icons/ai"
import {AiFillCaretDown} from "react-icons/ai"
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'



type OA_Props = {
handle_time_sort: () => void
children: JSX.Element | JSX.Element[] 

}

export default function Sort_Bar():JSX.Element {
const pathname = usePathname()
const params = useParams()
const [show_time_sort, toggle_time_sort] = useState<boolean>(false);


function handle_time_sort():void {
toggle_time_sort(!show_time_sort)
}

const sort = params.sort ? params.sort.toString() : false

return (
                  <div className = {styles.sort_wrapper}>
                  <Link 
                  href = {sort ? `${pathname.replace(sort, 'hot')}`: params.s ? `${pathname}/hot/` : !params.r ? `/hot/` : `${pathname}/hot/`}
                  key = {"hot"}
                  className = {sort == 'hot' || !sort ? styles.sort_option_selected : styles.sort_option}>
                  <AiOutlineFire className = {styles.hot_icon} />
                  <span className = {styles.sort_inner}>Hot</span>
                  </Link>

                  <Link 
                  href = {sort ? `${pathname.replace(sort, 'new')}`: params.s ? `${pathname}/new/` : !params.r ? `/new/` : `${pathname}/new/`}
                    key = {"new"}
                  
                  className = {sort == 'new' ? styles.sort_option_selected : styles.sort_option}>
                  <AiOutlineStar className = {styles.new_icon} />
                  <span className = {styles.sort_inner}>New</span>
                  </Link>

                  <Link 
                  href = {sort ? `${pathname.replace(sort, 'top_day')}`: params.s ? `${pathname}/top_day/` : !params.r ? `/top_day/` : `${pathname}/top_day/`}
                    key = {"top_day"}
                  className = {sort == 'top' ? styles.sort_option_selected : styles.sort_option}>
                  <AiOutlineTrophy className = {styles.top_icon} />
                  <span className = {styles.sort_inner}>Top</span>
                  </Link>

                  {sort && sort.includes('top') && (
                  <Fragment>
                  <div className = {styles.sort_option_time} >

                  <button type="button"  onClick = {() => handle_time_sort()} className = {styles.sort_inner_wrap}>
                  <span className = {styles.sort_inner}>{sort.replace('top_', '')}</span>
                  <AiFillCaretDown className = {styles.down_icon} />
                  </button>
                  {show_time_sort && (
                  <OutsideAlerter handle_time_sort = {handle_time_sort}>
                  <div className = {styles.time_sort_popup}>

                  <Link 
                  href = {sort ? `${pathname.replace(sort, 'top_hour')}`: params.s ? `${pathname}/top_hour/` : !params.r ? `/top_hour/` : `${pathname}/top_hour/`}
                   key = {"top_hour"}
                  className = {pathname.includes('top_hour') ? styles.time_sort_option_selected : styles.time_sort_option} >
                 <span>Now</span>
                  </Link>

                                    <Link 
                  href = {sort ? `${pathname.replace(sort, 'top_day')}`: params.s ? `${pathname}/top_day/` : !params.r ? `/top_day/` : `${pathname}/top_day/`}
                      key = {"top_day_from menu"}
                  className = {pathname.includes('top_day') ? styles.time_sort_option_selected : styles.time_sort_option} >
                  <span>Today</span>
                  </Link>

                                    <Link 
                  href = {sort ? `${pathname.replace(sort, 'top_week')}`: params.s ? `${pathname}/top_week/` : !params.r ? `/top_week/` : `${pathname}/top_week/`}
                   key = {"top_week"}
                  className = {pathname.includes('top_week') ? styles.time_sort_option_selected : styles.time_sort_option} >
                  <span>Week</span>
                  </Link>

                                    <Link 
                  href = {sort ? `${pathname.replace(sort, 'top_month')}`: params.s ? `${pathname}/top_month/` : !params.r ? `/top_month/` : `${pathname}/top_month/`}
                        key = {"top_month"}
                  className = {pathname.includes('top_month') ? styles.time_sort_option_selected : styles.time_sort_option} >
                  <span>Month</span>
                  </Link>

                                                      <Link 
                  href = {sort ? `${pathname.replace(sort, 'top_year')}`: params.s ? `${pathname}/top_year/` : !params.r ? `/top_year/` : `${pathname}/top_year/`}
                        key = {"top_year"}
                  className = {pathname.includes('top_year') ? styles.time_sort_option_selected : styles.time_sort_option} >
                  <span>Year</span>
                  </Link>

                                                      <Link 
                  href = {sort ? `${pathname.replace(sort, 'top_all')}`: params.s ? `${pathname}/top_all/` : !params.r ? `/top_all/` : `${pathname}/top_all/`}
                        key = {"top_all"}
                  className = {pathname.includes('top_all') ? styles.time_sort_option_selected : styles.time_sort_option} >
                  <span>All</span>
                  </Link>

                  </div>
                  </OutsideAlerter>

                    )}


                  </div>


                  </Fragment>
                  )}

                  </div>

)
                }


                
function OutsideAlerter(props: OA_Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

function useOutsideAlerter(ref: RefObject<HTMLDivElement>) {
  useEffect(() => {

    function handleClickOutside(event: Event) {
      const target = event.target as HTMLDivElement
      if (ref.current && !ref.current.contains(target)) {
        props.handle_time_sort()
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
