<img src="https://img.shields.io/badge/version-v0.1.0-red" alt="version 0.1.0" />

# Owlly

A file-based .env change notifier for your slack team.

![owlly-intro](https://user-images.githubusercontent.com/83855174/198875029-f20bba16-66e6-48d2-9d06-9feaea8fe175.gif)

![owlly-result](https://user-images.githubusercontent.com/83855174/198875580-ba52d111-907a-43bf-8937-23b5558378a4.png)

## Contents

- [Owlly](#owlly)
  - [Features](#features)
  - [Install](#install)
  - [Prerequisite](#prerequisite)
  - [Usage](#usage)
  - [Contributor](#contributor)
  - [Reference](#reference)

## Features

- Update synchronization for .env file changes
- Auto-post the updated .env as attachment to slack channel
- Basic metadata supported: timestamp, .env directory

## Install

Run

```go
go get github.com/asunlabs/owlly
```

## Prerequisite

In order to use Owlly, you have to

1. Create a slack bot
2. Install the bot to your slack workspace
3. Issue bot user oauth token and get channel ID to use the bot.

So your .env will look like,

```sh
AUTHOR="developerasun"
FOO="bar"
SLACK_BOT_USER_OAUTH_TOKEN="xoxb-some-value-here"
SLACK_CHANNEL_ID="channel-id-here"
# OWLLY_DONE="true" # when update is done
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

Check your slack channel if the message is sent.

**Note**

Owlly ver 0.1.0 does not support hot-reload yet. It means that you have to re-start Owlly where 1) you sent DM already 2) but updated it again 3) and want to send it again.

## Contributor

Project Created by [developerasun](https://github.com/developerasun)

And is being maintained with the help of

- a list of contributors here

## Reference

- [go-slack](https://pkg.go.dev/github.com/slack-go/slack#section-readme)
- [Codeshifu: sync-dotenv-slack](https://github.com/codeshifu/sync-dotenv-slack)
- [Slack API - message guideline](https://api.slack.com/best-practices/message-guidelines)
- [KOR | 토스ㅣSimplicity 21 - 우리가 효율적으로 일할 수 있는 이유](https://youtu.be/6OgMe0h9bJ8)
