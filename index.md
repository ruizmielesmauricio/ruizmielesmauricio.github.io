---
layout: grid
title: Life in Data
---

Welcome to my data analytics portfolio.

Here I share short articles about data analytics projects, technical methods, and key findings.

---

## Latest Posts

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url | relative_url }})  
  <small>{{ post.date | date: "%d %B %Y" }}</small>
{% endfor %}
