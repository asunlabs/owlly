# 🦉Owlly

<img src="https://img.shields.io/badge/version-v0.1.4-red" alt="version 0.1.4" /> [![wakatime](https://wakatime.com/badge/user/e56daee8-7aae-4b0e-814c-b6bb7f5f841c/project/c15254fd-0a5e-4b66-b897-5ed473191817.svg)](https://wakatime.com/badge/user/e56daee8-7aae-4b0e-814c-b6bb7f5f841c/project/c15254fd-0a5e-4b66-b897-5ed473191817)

A file-based .env change notifier for your slack team.

<img src="https://user-images.githubusercontent.com/83855174/200312951-eec9e105-1772-4afa-b0ae-233d5fbda28d.gif" alt="demo" width="100%" />

## Table of Contents

- [Owlly](#owlly)
  - [Features](#features)
  - [Install](#install)
  - [Prerequisite](#prerequisite)
  - [Usage](#usage)
  - [Maintainer](#maintainer)
  - [Reference](#reference)

## Features

- Auto-sync .env file changes
- Watch multiple .env files
- Auto-post the update to slack channel as attachment
- Basic metadata supported: timestamp, .env directory
- Cross platform supported: Windows, Mac OS(intel, m1 chip)
- Got a cool hand-drawn logo thanks to @HaidiYJ

  ![owlly-logo-resized](https://user-images.githubusercontent.com/83855174/201008428-7545fafb-bd55-46dc-ab41-46c1c5d5180c.jpg)


## Install

Clone this repo and compile it. Go supports cross-compile.

```sh
git clone https://github.com/asunlabs/owlly.git

# from Windows(Powershell) to Mac OS
$env:GOOS = "darwin"
$env:GOARCH = "amd64"
go build -o ./bin/owlly-for-mac owlly.go

# for Windows
go build -o ./bin/owlly-for-window.exe owlly.go
```

Or, simply download binaries from [release](https://github.com/asunlabs/owlly/releases) and execute it.

## Prerequisite

### Assumption

Owlly will check if below files exist in your project root and sync if exist.

```go
	envList  = []string{
		".env",
		".env.test",
		".env.development",
		".env.production",
		".env.dev",
		".env.prod",
	}
```

### Slack

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
# OWLLY_DONE="true" // add this line when update is done
```

## Usage

1. Update .env files as you wish.

```sh
FOO="bar"
```

2. Once done, set OWLLY_DONE variable in your .env. This variable will be a key for Owlly to know if your update is done.

```sh
# length of OWLLY_DONE > 0 ? send a DM : do nothing
OWLLY_DONE="true"
```

3. Run Owlly

```sh
# if you cloned a repo,
go run owlly.go

# if you executes binaries,
./owlly-for-windows.exe
./owlly-for-mac
./owlly-for-mac-m1
```

Check your slack channel if the message is sent. Result will look like below.

<img src="https://user-images.githubusercontent.com/83855174/200310048-48d918c4-2478-4d60-a68a-906202b1a8db.png" alt="owlly banner" width="50%" />

**Note**

- Owlly ver 0.1.4 does not support hot-reload yet. It means that you have to re-start Owlly in the situation where 1) you sent DM already 2) but updated it again 3) and want to send it again.

## Maintainer

Project Created by [developerasun](https://github.com/developerasun)

## Reference

- [go-slack](https://pkg.go.dev/github.com/slack-go/slack#section-readme)
- [Codeshifu: sync-dotenv-slack](https://github.com/codeshifu/sync-dotenv-slack)
- [Slack API - message guideline](https://api.slack.com/best-practices/message-guidelines)
- [KOR | 토스ㅣSimplicity 21 - 우리가 효율적으로 일할 수 있는 이유](https://youtu.be/6OgMe0h9bJ8)
