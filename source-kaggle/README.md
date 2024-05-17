<!-- # Setting environment

Following variables need to be set in `.env` file:

```
SUPABASE_URL=<Supabase url (local one for instance)>
SUPABASE_KEY=<Supabase key (needs write access)>
KAGGLE_USERNAME=<Kaggle username>
KAGGLE_KEY=<Kaggle key>
```

If running Supabase locally, you might need to set a specific Supabase URL to work with Docker (as `http://localhost:54321` will not work from the container). In `.env.docker`, set :

```
SUPABASE_URL=http://host.docker.internal:54321
```

# How to run/develop locally

## Create and activate the conda environment

```bash
conda env create -f environment.yml
conda activate storytrends-source-service
```

> Note: this environment contains only the basic dependencies, i.e. python and poetry - the rest will be managed by poetry using the pyproject.toml

## Install project dependencies

```bash
poetry install
```

## Run in dev (watch) mode

```bash
docker compose watch
```

## Build & run

```bash
docker compose up --build -d
```

# Notes

- make sure the python and poetry versions in environment.yml and Dockerfile are aligned -->
