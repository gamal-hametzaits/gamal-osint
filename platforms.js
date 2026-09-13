// Platform definitions for the username sweep.
// method 'status': 200 = exists, 404 = does not (confidence depends on api flag)
// method 'content': fetch page, apply regex rules
// api:true => machine-readable endpoint, result is 'verified' when conclusive
export const PLATFORMS = [
  // --- verified by API / strong signatures ---
  { id:'github',    name:'GitHub',      cat:'קוד',      url:u=>`https://github.com/${u}`, method:'status', api:true, profile:u=>`https://github.com/${u}`, site:'github.com' },
  { id:'gitlab',    name:'GitLab',      cat:'קוד',      url:u=>`https://gitlab.com/api/v4/users?username=${u}`, method:'json-array', api:true, profile:u=>`https://gitlab.com/${u}`, site:'gitlab.com' },
  { id:'reddit',    name:'Reddit',      cat:'קהילות',   url:u=>`https://www.reddit.com/user/${u}/about.json`, method:'status', api:true, profile:u=>`https://www.reddit.com/user/${u}/`, site:'reddit.com' },
  { id:'hackernews',name:'Hacker News', cat:'קהילות',   url:u=>`https://news.ycombinator.com/user?id=${u}`, method:'content', api:true, notFound:/No such user/i, profile:u=>`https://news.ycombinator.com/user?id=${u}`, site:'news.ycombinator.com' },
  { id:'x',         name:'X (Twitter)', cat:'רשתות',    url:u=>`https://x.com/${u}`, method:'status', profile:u=>`https://x.com/${u}`, site:'x.com', fragile:true },
  { id:'npm',       name:'npm',         cat:'קוד',      url:u=>`https://registry.npmjs.org/-/v1/search?text=maintainer:${u}&size=1`, method:'json-npm', api:true, profile:u=>`https://www.npmjs.com/~${u}`, site:'npmjs.com' },
  { id:'pypi',      name:'PyPI',        cat:'קוד',      url:u=>`https://pypi.org/user/${u}/`, method:'content', api:true, blockedIf:/Client Challenge/, profile:u=>`https://pypi.org/user/${u}/`, site:'pypi.org' },
  { id:'gravatar',  name:'Gravatar',    cat:'פרופילים', url:u=>`https://en.gravatar.com/${u}.json`, method:'status', api:true, profile:u=>`https://en.gravatar.com/${u}`, site:'gravatar.com' },
  { id:'keybase',   name:'Keybase',     cat:'פרופילים', url:u=>`https://keybase.io/_/api/1.0/user/lookup.json?username=${u}`, method:'json-keybase', api:true, profile:u=>`https://keybase.io/${u}`, site:'keybase.io' },
  { id:'steam',     name:'Steam',       cat:'גיימינג',  url:u=>`https://steamcommunity.com/id/${u}`, method:'content', api:true, notFound:/The specified profile could not be found|No profile/i, profile:u=>`https://steamcommunity.com/id/${u}`, site:'steamcommunity.com' },
  { id:'telegram',  name:'Telegram',    cat:'מסרים',    url:u=>`https://t.me/${u}`, method:'content', api:false, found:/tgme_page_photo|tgme_page_extra/, profile:u=>`https://t.me/${u}`, site:'t.me' },
  { id:'wikipedia', name:'Wikipedia',   cat:'קהילות',   url:u=>`https://en.wikipedia.org/wiki/User:${u}`, method:'content', api:false, notFound:/does not have a user page|not registered/i, found:/<title>User:/i, profile:u=>`https://en.wikipedia.org/wiki/User:${u}`, site:'wikipedia.org' },

  // --- status-code HTML checks (likely when 200) ---
  { id:'youtube',   name:'YouTube',     cat:'וידאו',    url:u=>`https://www.youtube.com/@${u}`, method:'status', profile:u=>`https://www.youtube.com/@${u}`, site:'youtube.com' },
  { id:'pinterest', name:'Pinterest',   cat:'רשתות',    url:u=>`https://www.pinterest.com/${u}/`, method:'content', notFound:/User not found|Page not found/i, profile:u=>`https://www.pinterest.com/${u}/`, site:'pinterest.com' },
  { id:'vimeo',     name:'Vimeo',       cat:'וידאו',    url:u=>`https://vimeo.com/${u}`, method:'status', profile:u=>`https://vimeo.com/${u}`, site:'vimeo.com' },
  { id:'behance',   name:'Behance',     cat:'עיצוב',    url:u=>`https://www.behance.net/${u}`, method:'status', profile:u=>`https://www.behance.net/${u}`, site:'behance.net' },
  { id:'dribbble',  name:'Dribbble',    cat:'עיצוב',    url:u=>`https://dribbble.com/${u}`, method:'status', profile:u=>`https://dribbble.com/${u}`, site:'dribbble.com' },
  { id:'flickr',    name:'Flickr',      cat:'תמונות',   url:u=>`https://www.flickr.com/people/${u}`, method:'status', profile:u=>`https://www.flickr.com/people/${u}`, site:'flickr.com' },
  { id:'soundcloud',name:'SoundCloud',  cat:'מוזיקה',   url:u=>`https://soundcloud.com/${u}`, method:'status', profile:u=>`https://soundcloud.com/${u}`, site:'soundcloud.com' },
  { id:'medium',    name:'Medium',      cat:'בלוגים',   url:u=>`https://medium.com/@${u}`, method:'status', profile:u=>`https://medium.com/@${u}`, site:'medium.com' },
  { id:'substack',  name:'Substack',    cat:'בלוגים',   url:u=>`https://${u}.substack.com`, method:'status', profile:u=>`https://${u}.substack.com`, site:'substack.com' },
  { id:'tumblr',    name:'Tumblr',      cat:'בלוגים',   url:u=>`https://${u}.tumblr.com`, method:'status', profile:u=>`https://${u}.tumblr.com`, site:'tumblr.com' },
  { id:'wordpress', name:'WordPress',   cat:'בלוגים',   url:u=>`https://${u}.wordpress.com`, method:'status', profile:u=>`https://${u}.wordpress.com`, site:'wordpress.com' },
  { id:'blogspot',  name:'Blogspot',    cat:'בלוגים',   url:u=>`https://${u}.blogspot.com`, method:'status', profile:u=>`https://${u}.blogspot.com`, site:'blogspot.com' },
  { id:'deviantart',name:'DeviantArt',  cat:'עיצוב',    url:u=>`https://www.deviantart.com/${u}`, method:'status', profile:u=>`https://www.deviantart.com/${u}`, site:'deviantart.com' },
  { id:'linktree',  name:'Linktree',    cat:'פרופילים', url:u=>`https://linktr.ee/${u}`, method:'status', profile:u=>`https://linktr.ee/${u}`, site:'linktr.ee' },
  { id:'aboutme',   name:'About.me',    cat:'פרופילים', url:u=>`https://about.me/${u}`, method:'status', profile:u=>`https://about.me/${u}`, site:'about.me' },
  { id:'replit',    name:'Replit',      cat:'קוד',      url:u=>`https://replit.com/@${u}`, method:'status', profile:u=>`https://replit.com/@${u}`, site:'replit.com' },
  { id:'codepen',   name:'CodePen',     cat:'קוד',      url:u=>`https://codepen.io/${u}`, method:'status', profile:u=>`https://codepen.io/${u}`, site:'codepen.io' },
  { id:'kaggle',    name:'Kaggle',      cat:'קוד',      url:u=>`https://www.kaggle.com/${u}`, method:'status', profile:u=>`https://www.kaggle.com/${u}`, site:'kaggle.com', fragile:true },
  { id:'itchio',    name:'itch.io',     cat:'גיימינג',  url:u=>`https://${u}.itch.io`, method:'status', profile:u=>`https://${u}.itch.io`, site:'itch.io' },
  { id:'chess',     name:'Chess.com',   cat:'גיימינג',  url:u=>`https://www.chess.com/member/${u}`, method:'status', profile:u=>`https://www.chess.com/member/${u}`, site:'chess.com' },
  { id:'vk',        name:'VK',          cat:'רשתות',    url:u=>`https://vk.com/${u}`, method:'status', profile:u=>`https://vk.com/${u}`, site:'vk.com' },
  { id:'buymeacoffee',name:'BuyMeACoffee',cat:'פרופילים',url:u=>`https://www.buymeacoffee.com/${u}`, method:'status', profile:u=>`https://www.buymeacoffee.com/${u}`, site:'buymeacoffee.com' },
  { id:'patreon',   name:'Patreon',     cat:'פרופילים', url:u=>`https://www.patreon.com/${u}`, method:'status', profile:u=>`https://www.patreon.com/${u}`, site:'patreon.com' },
  { id:'quora',     name:'Quora',       cat:'קהילות',   url:u=>`https://www.quora.com/profile/${u}`, method:'status', profile:u=>`https://www.quora.com/profile/${u}`, site:'quora.com' },

  // --- usually block datacenter IPs: attempted, honest fallback to manual link ---
  { id:'instagram', name:'Instagram',   cat:'רשתות',    url:u=>`https://www.instagram.com/${u}/`, method:'status', profile:u=>`https://www.instagram.com/${u}/`, site:'instagram.com', fragile:true },
  { id:'tiktok',    name:'TikTok',      cat:'וידאו',    url:u=>`https://www.tiktok.com/@${u}`, method:'status', profile:u=>`https://www.tiktok.com/@${u}`, site:'tiktok.com', fragile:true },
  { id:'facebook',  name:'Facebook',    cat:'רשתות',    url:u=>`https://www.facebook.com/${u}`, method:'status', profile:u=>`https://www.facebook.com/${u}`, site:'facebook.com', fragile:true },
  { id:'threads',   name:'Threads',     cat:'רשתות',    url:u=>`https://www.threads.net/@${u}`, method:'status', profile:u=>`https://www.threads.net/@${u}`, site:'threads.net', fragile:true },
  { id:'linkedin',  name:'LinkedIn',    cat:'רשתות',    url:u=>`https://www.linkedin.com/in/${u}`, method:'status', profile:u=>`https://www.linkedin.com/in/${u}`, site:'linkedin.com', fragile:true },
  { id:'snapchat',  name:'Snapchat',    cat:'רשתות',    url:u=>`https://www.snapchat.com/add/${u}`, method:'status', profile:u=>`https://www.snapchat.com/add/${u}`, site:'snapchat.com', fragile:true },
];
