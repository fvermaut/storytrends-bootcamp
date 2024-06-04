ARG PYTHON_VERSION=3.10.13

# Base builder image, using Poetry

FROM python:${PYTHON_VERSION}-bullseye as builder-base

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    POETRY_REQUESTS_TIMEOUT=300

ENV VIRTUAL_ENV=/app/st-module/.venv \
    PATH="/app/st-module/.venv/bin:$PATH"

RUN mkdir -p /app/st-module

RUN pip install poetry==1.7.1

# App builder

FROM builder-base as builder

WORKDIR /app/st-module

COPY ./pyproject.toml ./poetry.lock ./
RUN touch README.md

RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry install --no-root

# Build final image, starting from a fresh image (without the build dependencies), 
# and copying the .env and tested sources from the previous stage

FROM python:${PYTHON_VERSION}-slim-bullseye as runtime 

ENV VIRTUAL_ENV=/app/st-module/.venv \
    PATH="/app/st-module/.venv/bin:$PATH"

COPY --from=builder /app ./app

WORKDIR /app/st-module

COPY ./st_module ./st_module

ENTRYPOINT ["python", "-m", "st_module.start"]