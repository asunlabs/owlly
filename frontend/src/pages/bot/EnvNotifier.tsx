import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useHover from '@owlly/hooks/useHover';
import { slackContext } from '@owlly/context/DefaultState';
import { ToastNotification } from '@owlly/components/Button';
import { EventsEmit } from '@wailsjs/runtime/runtime';
import { InitEnvBot } from '@wailsjs/go/main/Owlly';

function EnvNotifier() {
  // @dev footer modal local state
  const [githubModal, setGithubModal] = useState('');
  const [linkedinModal, setLinkedinModal] = useState('');
  const [gmailModal, setGmailModal] = useState('');

  const getSlackContext = React.useContext(slackContext);
  const [slackConfig, setSlackConfig] = useState(getSlackContext);

  // handle multi-input
  function handleSlackConfig(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setSlackConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    EventsEmit(
      'form_submit',
      slackConfig.triggerName,
      slackConfig.botOauthToken,
      slackConfig.channelID,
      slackConfig.userID,
      slackConfig.userName
    );

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
        <div id="userConfig">
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

      <ul id="footer">
        <li onMouseOver={() => useHover('github', setGithubModal)} onMouseLeave={() => setGithubModal('')}>
          Github
          <span className="footerModal">{githubModal}</span>
        </li>
        <li onMouseOver={() => useHover('linkedin', setLinkedinModal)} onMouseLeave={() => setLinkedinModal('')}>
          Linkedin
          <span className="footerModal">{linkedinModal}</span>
        </li>
        <li onMouseOver={() => useHover('gmail', setGmailModal)} onMouseLeave={() => setGmailModal('')}>
          {/* ! fix gmail useHover error */}
          Gmail
          <span className="footerModal">{gmailModal}</span>
        </li>
      </ul>
    </div>
  );
}

export default EnvNotifier;
