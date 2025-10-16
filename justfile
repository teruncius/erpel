default:
    @just --list

# install dependencies
install:
    pnpm install

# run dev server
run:
    pnpm run start

# run tests
test:
    pnpm run test

# run tsc
tsc:
    pnpm run tsc

# run eslint
lint PARAM="":
    pnpm run lint {{PARAM}}

# build app
build:
    pnpm make

# clean temp folders
clean:
    rm -rf .vite out
