# Owlly

banner image here

A file-based .env change notifier for your slack team.

## Contents

- [Owlly](#owlly)
  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
  - [Contributor](#contributor)
  - [Reference](#reference)

## Features

- Update synchronization for .env file changes
- Post the updated .env as text to slack channel with metadata(date and directory path)

## Install

Run

```go
go get github.com/asunlabs/owlly
```

## Usage

1. Run Owlly to watch .env changes.

```sh
go run owlly.go
```

1. Update .env as you wish.

```sh
FOO="bar"
```

1. Once done, set OWLLY_DONE variable in your .env. This variable will be a key for Owlly to know if your update is done.

```sh
# length of OWLLY_DONE > 0 ? send a DM : do nothing
OWLLY_DONE="true"
```

## Contributor

Project Created by [developerasun](https://github.com/developerasun)

And is being maintained with the help of

- a list of contributors here

## Reference

- [go-slack](https://pkg.go.dev/github.com/slack-go/slack#section-readme)
- [Codeshifu: sync-dotenv-slack](https://github.com/codeshifu/sync-dotenv-slack)
- [Slack API - message guideline](https://api.slack.com/best-practices/message-guidelines)
