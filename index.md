---
title: Strona Główna
layout: default
---

# {{ page.title }}

Conasdasdasdasdin [Markdown](https://learnxinyminutes.com/docs/markdown/). Plain text format allows you to focus on your **content**.
SPRAWDŹ TO JOŁ

<ul class="w3-ul">
{% for post in site.categories.post %}
	<li class="w3-padding-24 w3-border-light-grey">
	<a href="{{ post.url }}" class=""><h2>{{ post.title}}</h2></a>		
	<span class="postDate">{{ post.date | date: "%b %-d, %Y" }}</span>
	</li>
{% endfor %}
</ul>
