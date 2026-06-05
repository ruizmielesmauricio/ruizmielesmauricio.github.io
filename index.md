---
layout: page
title: Life in Data
---
## Ask My AI Portfolio Assistant

<section style="margin-top: 40px; width: 100%;">

  <p>
    Ask questions about my experience, projects, skills, education, and data analytics work.
  </p>

  <iframe
    src="https://mauricio-ai-cv-assistant.streamlit.app/?embed=true"
    style="width: 100%; min-height: 900px; border: 1px solid #ddd; border-radius: 12px; background: white;"
    frameborder="0"
    scrolling="yes">
  </iframe>
</section>


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

    {% if post.categories %}
      <p style="font-size: 0.85rem;">
        {% for category in post.categories %}
          {{ category }}
        {% endfor %}
      </p>
    {% endif %}

    <p>
      {{ post.excerpt | strip_html | truncate: 140 }}
    </p>

    <p>
      <a href="{{ post.url | relative_url }}">Read more →</a>
    </p>
  </div>
{% endfor %}

</div>
