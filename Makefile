LDFLAGS := "-L/usr/local/lib"
CFLAGS  := "-I/usr/local/include"

# ----------------------------------------------------------------------
# Prod
# ----------------------------------------------------------------------

.PHONY: all setup

all: setup assets

setup:
	pip install pipenv --upgrade
	env \
		LDFLAGS=$(LDFLAGS) \
		CFLAGS=$(CFLAGS) \
	pipenv install $(ARGS)

# ----------------------------------------------------------------------
# Development
# ----------------------------------------------------------------------

.PHONY: develop devsetup devhook devserver

develop: devsetup assets

devsetup:
	pip install pipenv --upgrade
	env \
		LDFLAGS=$(LDFLAGS) \
		CFLAGS=$(CFLAGS) \
	pipenv install --dev $(ARGS)

devhook:
	pipenv run pre-commit install $(ARGS)

devserver:
	pipenv run honcho start -f Procfile.dev $(ARGS)

# ----------------------------------------------------------------------
# Assets
# ----------------------------------------------------------------------

.PHONY: assets

assets:
	yarn install
	yarn run gulp

# ----------------------------------------------------------------------
# Testing
# ----------------------------------------------------------------------

.PHONY: test

test:
	pipenv run nosetests $(ARGS)

# ----------------------------------------------------------------------
# Misc
# ----------------------------------------------------------------------

.PHONY: migrate

migrate:
	pipenv run alembic upgrade head $(ARGS)
