<%namespace name="datetime" file="../partials/_datetime.mako" />
<header class="panel panel--inverse panel--shadowed util-padded-bottom">
    <div class="container">
        <h2 class="panel__item"><a class="util-text-gray" href="${request.route_path('topic', board=board.slug, topic=topic.id)}">${topic.title}</a></h2>
        <p class="panel__item">Last posted ${datetime.render_datetime(topic.meta.posted_at)}</p>
        <p class="panel__item">Total of ${topic.meta.post_count} posts</p>
    </div>
</header>
