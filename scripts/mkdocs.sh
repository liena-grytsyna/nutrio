#!/bin/sh

set -eu

if [ ! -x ".venv/bin/mkdocs" ]; then
  echo "MkDocs is not installed in .venv."
  echo "Run:"
  echo "  python3 -m venv .venv"
  echo "  ./.venv/bin/pip install -r requirements-docs.txt"
  exit 1
fi

exec ./.venv/bin/mkdocs "$@"
