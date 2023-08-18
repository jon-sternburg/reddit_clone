



export interface CommentsResult {
  kind: string
  data: CommentsData
}

export interface CommentsData {
  modhash: string
  dist: number
  children: Comment[]
  after: string

  before: null
}

export interface Comment {
  kind: string
  data: CommentChildData
  posted_time?: string | null
}

export interface CommentChildData {
  awarders: any[]
  total_awards_received: number
  approved_at_utc: null
  link_title: string
  mod_reason_by: null
  banned_by: null
  author_flair_type: string
  removal_reason: null
  link_id: string
  author_flair_template_id: null | string
  likes: null
  replies: CommentRepliesDataExists | string
  user_reports: any[]
  saved: boolean
  id: string
  banned_at_utc: null
  mod_reason_title: null
  gilded: number
  archived: boolean
  no_follow: boolean
  author: string
  num_comments: number
  can_mod_post: boolean
  created_utc: number
  send_replies: boolean
  parent_id: string
  score: number
  author_fullname: string
  over_18: boolean
  approved_by: null
  mod_note: null
  all_awardings: any[]
  subreddit_id: string
  body: string
  edited: boolean
  author_flair_css_class: null | string
  name: string
  steward_reports: any[]
  author_patreon_flair: boolean
  downs: number
  author_flair_richtext: any[]
  is_submitter: boolean
  body_html: string
  gildings: Gildings
  collapsed_reason: null
  distinguished: null
  associated_award: null
  stickied: boolean
  author_premium: boolean
  can_gild: boolean
  subreddit: string
  author_flair_text_color: null | string
  score_hidden: boolean
  permalink: string
  num_reports: null
  link_permalink: string
  report_reasons: null
  link_author: string
  author_flair_text: null | string
  link_url: string
  created: number
  collapsed: boolean
  subreddit_name_prefixed: string
  controversiality: number
  locked: boolean
  author_flair_background_color: null | string
  collapsed_because_crowd_control: null
  }
export interface Gildings {}


export interface RepliesInner {
data: RepliesData
kind: string
}

export interface RepliesData {
  children: CommentRepliesData[]

}


  export interface ReplyChildData {
      subreddit_id:string
      approved_at_utc:null
      author_is_blocked:boolean
      comment_type:null
      edited:boolean
      mod_reason_by:null
      banned_by:null
      ups:number
      num_reports:null
      author_flair_type:string
      total_awards_received:number
      subreddit:string
      author_flair_template_id:null
      likes:null
      replies: CommentRepliesResult | CommentRepliesDataChildren | string
      user_reports:[any]
      saved:boolean
      id:string
      banned_at_utc:null
      mod_reason_title:null
      gilded:number
      archived:boolean
      collapsed_reason_code:null
      no_follow:boolean
      author:string
      can_mod_post:boolean
      created_utc:number
      send_replies:true
      parent_id:string
      score:number
      author_fullname:string
      report_reasons:null
      approved_by:null
      all_awardings:[any]
      collapsed:boolean
      body:string
      awarders:[any]
      top_awarded_type:null
      author_flair_css_class:null
      author_patreon_flair:boolean
      downs:number
      author_flair_richtext:[any]
      is_submitter:boolean
      body_html:string
      removal_reason:null
      collapsed_reason:null
      associated_award:null
      stickied:boolean
      author_premium:boolean
      can_gild:true
      gildings:any
      unrepliable_reason:null
      author_flair_text_color:null
      score_hidden:boolean
      permalink:string
      subreddit_type:string
      locked:boolean
      name:string
      created:number
      author_flair_text:null
      treatment_tags:[any]
      link_id:string
      subreddit_name_prefixed:string
      controversiality:number
      depth:number
      author_flair_background_color:null
      collapsed_because_crowd_control:null
      mod_reports:[any]
      mod_note:null
      distinguished:null
  

  }


  export interface CommentRepliesResult {
kind: string
data: CommentRepliesData 

  }


export interface ReplyReplies {
  data: {
    children: [ReplyRepliesChildren]
  }
}
export interface ReplyRepliesChildren {
  //kind: 't1'
  kind: string
  data: CommentRepliesData

}


export interface ReplyMore {
data: {
  children: [ReplyMoreChildren]
}
}



export interface ReplyMoreChildren {
    kind: string
    //kind: 'more'
    data: {
      children: [string]
      count: number
      depth: number
      id: string
      name: string
      parent_id: string   
}

}
  export interface CommentRepliesData {
    subreddit_id: string
    approved_at_utc: null
    author_is_blocked: boolean
    comment_type: null
    awarders: [any]
    mod_reason_by: null
    banned_by: null
    author_flair_type: string
    total_awards_received: number
    subreddit: string
    author_flair_template_id: null
    likes: null
    replies: ReplyReplies | ReplyMore | string
    user_reports: [any]
    saved: boolean
    id: string
    banned_at_utc: null
    mod_reason_title: null
    gilded: number
    archived: boolean
    collapsed_reason_code: null
    no_follow: boolean
    author: string
    can_mod_post: boolean
    created_utc: number
    send_replies: true
    parent_id: string
    score: number
    author_fullname: string
    removal_reason: null
    approved_by: null
    mod_note: null
    all_awardings: [any]
    body: string
    edited: boolean
    top_awarded_type: null
    author_flair_css_class: null
    name: string
    is_submitter: boolean
    downs: number
    author_flair_richtext: [any]
    author_patreon_flair: boolean
    body_html:  string
    gildings: Gildings
    collapsed_reason: null
    distinguished: null
    associated_award: null
    stickied: boolean
    author_premium: boolean
    can_gild: true
    link_id: string
    unrepliable_reason: null
    author_flair_text_color: null
    score_hidden: boolean
    permalink: string
    subreddit_type: string
    locked: boolean
    report_reasons: null
    created: number
    author_flair_text: null
    treatment_tags: [any]
    collapsed: boolean
    subreddit_name_prefixed: string
    controversiality: number
    depth: number
    author_flair_background_color: null
    collapsed_because_crowd_control: null
    mod_reports: [any]
    num_reports: null
    ups: number
  }


  export interface  ReplyMoreArg {
    kind: 'more'
    data: {
  children: [string]
  count: number
  depth: number
  id: string
  name: string
  parent_id: string
    }
  }


  export interface CommentRepliesNewReplies {
    data: {
      children: [
        {data: {
          children: [CommentRepliesResult]
          count: number
          depth: number
          id: string
          name: string
          parent_id: string
        }}
      ]
    }
    }

export interface CommentRepliesMore {
data: {
  children: [
    {data: {
      children: [string]
      count: number
      depth: number
      id: string
      name: string
      parent_id: string
    }}
  ]
}
}
export interface CommentRepliesDataExists {

  data: {
    after: null
    before: null
    children: (ReplyRepliesChildren | ReplyMoreChildren)[]
    dist: null
    geo_filter: string
    modhash: string
  }


}

export interface CommentRepliesDataChildren {

    kind: string
    data: {
      after: null
      dist: null
      modhash: string
      geo_filter: string
      children: CommentRepliesDataChildrenMORE[]
      before: null
    }
  
}

export interface CommentRepliesDataChildrenMORE {
  kind: string
  data: {
    count: number
    name: string
    id: string
    parent_id: string
    depth: number
    children: [string]
  }
}




interface MoreCommentsDataResponse {
  json:{
      data:{
          things: (CommentTResult | CommentMoreResult)[]
      }
  }
}

interface CommentTResult {

  kind: string
  data: CommentChildData

}