default:
    @just --list

# install dependencies
install:
    pnpm install

# run dev server
run:
    pnpm start

# run tests
test:
    pnpm test

# run eslint
lint PARAM="":
    pnpm lint {{PARAM}}

# build app
build:
    pnpm make

# clean temp folders
clean:
    rm -rf .vite out
