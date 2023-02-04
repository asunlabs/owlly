import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EVENT_SLACK, SlackContext } from '@owlly/context/DefaultState';
import { ToastNotification } from '@owlly/components/Button';
import { EventsEmit } from '@wailsjs/runtime/runtime';
import { InitEnvBot } from '@wailsjs/go/main/Owlly';

function EnvNotifier() {
  const { slackContext, setSlackContext } = React.useContext(SlackContext);

  // handle multi-input
  function handleSlackConfig(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setSlackContext((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // update slack config
    EventsEmit(
      EVENT_SLACK.update,
      slackContext.triggerName,
      slackContext.botOauthToken,
      slackContext.channelID,
      slackContext.userID,
      slackContext.userName
    );

    // TODO fix multiple toasts
    // execute owlly core
    const ok = await InitEnvBot();

    if (ok) {
      setTimeout(() => {
        toast.success('DM sent!', {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 800,
          icon: '🗨️🦉',
          theme: 'dark',
        });
      }, 1000);
    } else {
      setTimeout(() => {
        toast.success('Owlly failed!', {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 800,
          icon: '🗨️💀',
          theme: 'dark',
        });
      }, 1000);
    }
  }

  return (
    <div>
      <div id="body">
        <div>
          {/* TODO read slack config from DB or SlackContext */}
          {/* TODO refactor using styled-components */}
          <h2>Env bot configuration</h2>
          {/* form submission */}
          <form onSubmit={async (e) => handleSubmit(e)}>
            <fieldset>
              <legend>For Owlly</legend>
              <input
                type="text"
                name="triggerName"
                id="trigger"
                placeholder="trigger name here"
                required={true}
                onChange={(e) => {
                  handleSlackConfig(e);
                }}
              />
            </fieldset>
            <fieldset>
              <legend>For Slack</legend>
              <input
                type="text"
                name="botOauthToken"
                id="token"
                placeholder="slack token here"
                required={true}
                onChange={(e) => {
                  handleSlackConfig(e);
                }}
              />
              <input
                type="text"
                name="channelID"
                id="channelId"
                placeholder="channel id here"
                required={true}
                onChange={(e) => {
                  handleSlackConfig(e);
                }}
              />
              <input
                type="text"
                name="userID"
                id="userId"
                placeholder="user id here"
                required={true}
                onChange={(e) => {
                  handleSlackConfig(e);
                }}
              />
              <input
                type="text"
                name="userName"
                id="username"
                placeholder="username here"
                required={true}
                onChange={(e) => {
                  handleSlackConfig(e);
                }}
              />
            </fieldset>
            <ToastNotification />
          </form>
        </div>
      </div>
    </div>
  );
}

export default EnvNotifier;
