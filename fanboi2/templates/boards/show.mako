<%namespace name='datetime' file='../partials/_datetime.mako' />
<%namespace name='post' file='../partials/_post.mako' />
<%include file='_subheader.mako' />
<%inherit file='../partials/_layout.mako' />
<%def name='title()'>${board.title}</%def>
% for topic in topics:
    <div data-topic="${topic.id}">
        <div class="panel panel--bordered util-padded">
            <div class="container">
                <h3 class="panel__item util-text-normal"><a href="${request.route_path('topic_scoped', board=board.slug, topic=topic.id, query='recent')}">${topic.title}</a></h3>
                <p class="panel__item">Last posted ${datetime.render_datetime(topic.meta.posted_at)}</p>
                <p class="panel__item">Total of ${topic.meta.post_count} posts</p>
            </div>
        </div>
        % for p in topic.recent_posts(5):
            ${post.render_post(topic, p, shorten=500)}
        % endfor
        <div class="panel panel--bordered panel--tint util-padded">
            <div class="container">
                <ul class="panel__item links">
                    <li class="links__item"><a class="button action" href="${request.route_path('topic_scoped', board=board.slug, topic=topic.id, query='recent')}">Recent posts</a></li>
                    <li class="links__item"><a class="button action" href="${request.route_path('topic', board=board.slug, topic=topic.id)}">All posts</a></li>
                    <li class="links__item"><a class="button green" href="${request.route_path('topic_scoped', board=board.slug, topic=topic.id, query='recent')}#reply">Reply</a></li>
                </ul>
            </div>
        </div>
    </div>
% endfor
