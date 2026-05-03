---
layout: page
title: Life in Data
---


Welcome to my data analytics portfolio.

Here I share short articles about data analytics projects, technical methods, and key findings.

---

## Latest Posts

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 24px;">

{% for post in site.posts %}
  <div style="border: 1px solid #ddd; border-radius: 12px; padding: 20px;">
    <h3 style="margin-top: 0;">
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h3>

    <p style="font-size: 0.9rem; color: #666;">
      {{ post.date | date: "%d %B %Y" }}
    </p>

    <p>
      {{ post.excerpt | strip_html | truncate: 140 }}
    </p>

    <p>
      <a href="{{ post.url | relative_url }}">Read more →</a>
    </p>
  </div>
{% endfor %}

</div>
