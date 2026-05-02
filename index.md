---
layout: default
title: Life in Data
---

# Life in Data

Hi, I’m Mauricio. This is my data analytics portfolio and blog.

## Blog posts

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url | relative_url }}) — {{ post.date | date: "%d %B %Y" }}
{% endfor %}

## Projects

- More projects coming soon.
