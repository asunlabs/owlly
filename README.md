# 🦉Owlly

<img src="https://img.shields.io/badge/version-v0.2.0-red" alt="version" /> [![wakatime](https://wakatime.com/badge/user/e56daee8-7aae-4b0e-814c-b6bb7f5f841c/project/c15254fd-0a5e-4b66-b897-5ed473191817.svg)](https://wakatime.com/badge/user/e56daee8-7aae-4b0e-814c-b6bb7f5f841c/project/c15254fd-0a5e-4b66-b897-5ed473191817)

A file-based .env change notifier for your slack team.

<img src="https://user-images.githubusercontent.com/83855174/202204929-9eff7a48-84bc-4673-b721-f3b81403ee83.gif" alt="demo" width="100%" />

## Table of Contents

- [Owlly](#owlly)
  - [Features](#features)
  - [Install](#install)
  - [Prerequisite](#prerequisite)
  - [Usage](#usage)
  - [Contribution](#contribution)
  - [Star history](#star-history)
  - [Reference](#reference)

## Features

- Auto-sync .env file changes
- Watch multiple .env files
- Provide a clean and intuitive UI
- Auto-post the update to slack channel as attachment
- Basic metadata supported: timestamp, .env directory
- Cross platform supported: Windows, Mac OS(intel, m1 chip)
- Got a cool hand-drawn logo thanks to [@HaidiYJ](https://github.com/HaidiYJ)

<img src="https://user-images.githubusercontent.com/83855174/201008428-7545fafb-bd55-46dc-ab41-46c1c5d5180c.jpg" alt="logo" width="30%" />

## Install

### Stable

Download stable release [here](https://github.com/asunlabs/owlly/releases/tag/stable). This is the almost same version with the above GIF demonstration(toast notification added)

### Latest

Owlly is under active development. If you want to explore the latest feature and changes, follow below install guide.

Clone this repo. Make sure to install all dependencies.

```sh
git clone https://github.com/asunlabs/owlly.git
```

Look over with development mode.

```sh
wails dev
```

Build it with Wails. This will conveniently compile the project based on your OS and architecture.

```sh
wails build
```

Execute binary.

```sh
owlly
```

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
		".env.stage",
		".env.prod",
		".env.local",
		".env.development.local",
		".env.test.local",
		".env.production.local",
	}
```

Owlly ver 0.3.1 is event-based. When form value is submitted in react client side, the value is tossed to go backend by wails. Owlly takes the value and uses for its configuration under the hood.

### Slack

In order to use Owlly, you have to

1. Create a slack bot [here](https://api.slack.com/apps)
2. Install the bot to your slack workspace
3. Issue bot user oauth token and get channel ID to use the bot.

Make sure your bot has proper configuration/privileges to for sending DM. Refer below to set up a permission scope.

![bot-permission-scope](https://user-images.githubusercontent.com/83855174/204130558-8c4e6759-c2b8-43ae-877e-4d8c9eed4790.png)

## Usage

1. Run Owlly

```sh
./owlly-for-windows.exe
./owlly-for-mac
./owlly-for-mac-m1
```

2. Update .env files as you wish.

```sh
FOO="bar"
```

3. Once done, set owlly trigger in your .env. This variable will be a key for Owlly to know if your update is done. So your .env will look like,

```sh
AUTHOR="developerasun"
FOO="bar"

# length of OWLLY_DONE > 0 ? send a DM : do nothing
# OWLLY_DONE="true" // add this line when update is done
```

4. Click send button. Check your slack channel if the message is sent. Result will look like below.

<img src="https://user-images.githubusercontent.com/83855174/202205966-bd345933-1842-4779-ad10-ab21152cce1b.png" alt="owlly banner" width="70%" />

## Contribution

Owlly is a open sourc project. Feel free to open a pull request and suggest changes / improvement.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=asunlabs/owlly&type=Date)](https://star-history.com/#asunlabs/owlly&Date)

## Reference

- [go-slack](https://pkg.go.dev/github.com/slack-go/slack#section-readme)
- [Codeshifu: sync-dotenv-slack](https://github.com/codeshifu/sync-dotenv-slack)
- [Slack API - message guideline](https://api.slack.com/best-practices/message-guidelines)
- [KOR | 토스ㅣSimplicity 21 - 우리가 효율적으로 일할 수 있는 이유](https://youtu.be/6OgMe0h9bJ8)
