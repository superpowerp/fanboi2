<%namespace name="formatters" module="fanboi2.helpers.formatters" />
<header class="panel panel--inverse">
    <div class="container">
        <h2 class="panel__item panel__item--inset"><a class="util-text-gray" href="${request.route_path('board', board=board.slug)}">${board.title}</a></h2>
        <p class="panel__item util-text-gray-light">${board.description}</p>
        <div class="panel__item panel__item--inset">
            <ul class="links links--horizontal links--tabs">
                <li class="links__item${' links__item--current' if request.route_name == 'board' else ''}"><a href="${request.route_path('board', board=board.slug)}">Recent topics</a></li>
                <li class="links__item${' links__item--current' if request.route_name == 'board_all' else ''}"><a href="${request.route_path('board_all', board=board.slug)}">All topics</a></li>
                % if board.status == 'open':
                    <li class="links__item${' links__item--current' if request.route_name == 'board_new' else ''}"><a href="${request.route_path('board_new', board=board.slug)}">New topic</a></li>
                % endif
            </ul>
        </div>
    </div>
</header>
