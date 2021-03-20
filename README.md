# Fig Git Fetcher

Easily fetch the git docs for a specific git command and generate the necessary specs.
There still needs to be done some manual work but it works.

## Installation

```bash
# HTTPS
git clone https://github.com/Jubeki/fig-git-fetcher.git

# SSH
git clone git@github.com:Jubeki/fig-git-fetcher.git
```

After downloading the repository you just need to run
```bash
npm install
```

## Usage

```
npm fetch <git command> > output.txt

# Example
npm fetch git pull > git-pull.js
```

Afterwards you need to check the following:
1. Are alle command names correct?
    - Sometimes there are names as `--[no]-includes` which need to be seperated into two seperate objects
    - Are there no special chararcters in the name?
2. Are the args for the option optional or not?
3. Put the spec at the correct position and try to not overwrite existing stuff.

## Disclaimer
I know this tool is not perfect and needs some manual work afterwards, but I think it is a great start for generating fig git specs.