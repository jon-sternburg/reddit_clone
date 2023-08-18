export interface ThreadResult {
  kind: string
  data: ThreadsData
}

export interface ThreadsData {
  modhash: string
  dist: number
  children: Thread[]
  after: string
  before: null
}
 
export interface Thread {
  kind: 't3'
  data: PostChildData
  posted_time?: string | null
}

export interface PostChildData {
  approved_at_utc: null
  subreddit: string
  selftext: string
  author_fullname: string
  saved: boolean
  mod_reason_title: null
  gilded: number
  clicked: boolean
  title: string
  link_flair_richtext: any[]
  subreddit_name_prefixed: string
  hidden: boolean
  pwls: number
  link_flair_css_class: null | string
  downs: number
  thumbnail_height: number | null
  hide_score: boolean
  name: string
  quarantine: boolean
  link_flair_text_color: string
  author_flair_background_color: null | string
  subreddit_type: string
  ups: number
  total_awards_received: number
  media_embed: MediaEmbed
  thumbnail_width: number | null
  author_flair_template_id: null | string
  is_original_content: boolean
  user_reports: any[]
  secure_media: Media | null
  is_reddit_media_domain: boolean
  is_meta: boolean
  category: null
  secure_media_embed: MediaEmbed
  link_flair_text: null | string
  can_mod_post: boolean
  score: number
  approved_by: null
  author_premium: boolean
  thumbnail: string
  edited: boolean
  author_flair_css_class: null | string
  steward_reports: any[]
  author_flair_richtext: any[]
  gildings: Gildings
  content_categories: null
  is_self: boolean
  mod_note: null
  created: number
  link_flair_type: string
  wls: number
  removed_by_category: null
  banned_by: null
  author_flair_type: string
  domain: string
  allow_live_comments: boolean
  selftext_html: null | string
  likes: null
  suggested_sort: null
  banned_at_utc: null
  view_count: null
  archived: boolean
  no_follow: boolean
  is_crosspostable: boolean
  pinned: boolean
  over_18: boolean
  all_awardings: any[]
  awarders: any[]
  media_only: boolean
  link_flair_template_id?: string
  can_gild: boolean
  spoiler: boolean
  locked: boolean
  author_flair_text: null | string
  visited: boolean
  removed_by: null
  num_reports: null
  distinguished: null
  subreddit_id: string
  mod_reason_by: null
  removal_reason: null
  link_flair_background_color: string
  id: string
  is_robot_indexable: boolean
  report_reasons: null
  author: string
  discussion_type: null
  num_comments: number
  send_replies: boolean
  whitelist_status: string
  contest_mode: boolean
  mod_reports: any[]
  author_patreon_flair: boolean
  author_flair_text_color: null | string
  permalink: string
  parent_whitelist_status: string
  stickied: boolean
  url: string
  subreddit_subscribers: number
  created_utc: number
  num_crossposts: number
  media: Media | null
  is_video: boolean
  media_metadata?: object
  post_hint?: string
  preview?: Preview
  sr_detail?: SrDetail
}


export interface SrDetail {
    default_set: boolean
    banner_img: string
    allowed_media_in_comments: [any]
    user_is_banned: null
    free_form_reports: boolean
    community_icon: string
    show_media: boolean
    description: string
    user_is_muted: null
    display_name: string
    header_img: string
    title: string
    previous_names: [any]
    user_is_moderator: null
    over_18: boolean
    icon_size: [number]
    primary_color: string
    icon_img: string
    icon_color: string
    is_chat_post_feature_enabled: boolean
    submit_link_label: string
    header_size: [number]
    restrict_posting: boolean
    restrict_commenting: boolean
    subscribers: number
    submit_text_label: string
    link_flair_position: string
    display_name_prefixed: string
    key_color: string
    name: string
    created: number
    url: string
    quarantine: boolean
    created_utc: number
    banner_size: null
    allow_chat_post_creation: boolean
    user_is_contributor: null
    accept_followers: boolean
    public_description: string
    link_flair_enabled: boolean
    disable_contributor_requests: boolean
    subreddit_type: string
    user_is_subscriber: null

}
export interface Gildings {}

export interface Media {
  type: string
  oembed: Oembed
  reddit_video?: RedditVideo | undefined 
}
export interface RedditVideo {
  bitrate_kbps:number
  dash_url:string
  duration:number
  fallback_url:string
  height: number
  hls_url: string
  is_gif: boolean
  scrubber_media_url: string
  transcoding_status: string
  width: number
}
export interface Oembed {
  provider_url: string
  version: string
  title: string
  type: string
  thumbnail_width: number
  height: number
  width: number
  html: string
  author_name: string
  provider_name: string
  thumbnail_url: string
  thumbnail_height: number
  author_url: string
}

export interface MediaEmbed {
  content?: string
  width?: number
  scrolling?: boolean
  height?: number
  media_domain_url?: string
}

export interface S {
  y: number
  x: number
  u: string
}

export interface Preview {
  images: Image[]
  enabled: boolean
}

export interface Image {
  source: Source
  resolutions: Source[]
  variants: Gildings
  id: string
}

export interface Source {
  url: string
  width: number
  height: number
}