<%namespace name='datetime' file='../partials/_datetime.mako' />
<%inherit file='../partials/_layout.mako' />
<%include file='_subheader.mako' />
<%def name='title()'>All topics - ${board.title}</%def>
<div class="container">
    % for topic in topics:
        <div class="panel panel--bordered panel--unit-link">
            <h2 class="panel__item util-text-normal"><a class="panel__link" href="${request.route_path('topic_scoped', board=board.slug, topic=topic.id, query='recent')}">${topic.title}</a></h2>
            <p class="panel__item">Last posted ${datetime.render_datetime(topic.meta.posted_at)}</p>
            <p class="panel__item">Total of ${topic.meta.post_count} posts</p>
        </div>
    % endfor
</div>
