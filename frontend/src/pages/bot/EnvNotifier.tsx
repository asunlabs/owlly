import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import './EnvNotifier.css';
import banner from '@assets/images/banner.png';
import { EventsEmit } from '../../../wailsjs/runtime/runtime';
import { Init } from '../../../wailsjs/go/main/StartOwlly';
import { slackContext } from '../../context/DefaultState';
import useHover from '../../hooks/useHover';

function EnvNotifier() {
  // @dev footer modal local state
  const [githubModal, setGithubModal] = useState('');
  const [linkedinModal, setLinkedinModal] = useState('');
  const [gmailModal, setGmailModal] = useState('');

  // @dev owlly config local state
  const [triggerName, setTriggerName] = useState('');
  const [slackBotOauthToken, setSlackBotOauthToken] = useState('');
  const [slackChannelID, setSlackChannelID] = useState('');
  const [slackUserID, setSlackUserID] = useState('');
  const [slackUserName, setSlackUserName] = useState('');

  const getSlackContext = React.useContext(slackContext);
  // @dev get user input
  function handleTriggerName(e: React.ChangeEvent<HTMLInputElement>) {
    setTriggerName(e.target.value);
  }
  function handleSlackBotOauthToken(e: React.ChangeEvent<HTMLInputElement>) {
    setSlackBotOauthToken(e.target.value);
  }
  function handleSlackChannelID(e: React.ChangeEvent<HTMLInputElement>) {
    setSlackChannelID(e.target.value);
  }
  function handleSlackUserID(e: React.ChangeEvent<HTMLInputElement>) {
    setSlackUserID(e.target.value);
  }
  function handleSlackUserName(e: React.ChangeEvent<HTMLInputElement>) {
    setSlackUserName(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    EventsEmit(
      'form_submit',
      triggerName,
      slackBotOauthToken,
      slackChannelID,
      slackUserID,
      slackUserName
    );

    // execute owlly core
    const ok = await Init();

    if (ok) {
      setTimeout(() => {
        toast.success('🦉✉️ DM sent!', {
          position: toast.POSITION.TOP_LEFT,
          autoClose: 800,
        });
      }, 1000);
    }
  }

  function ToastNotification() {
    const notify = () => {
      toast.info('🦉✉️ DM processing!', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
      });
    };
    return (
      <>
        <button onClick={notify} type="submit" id="sendButton">
          Send DM
        </button>
        <ToastContainer theme="dark" />
      </>
    );
  }

  return (
    <div id="app">
      <div id="owlly">
        <img src={banner} alt="banner" id="frontBanner" />
      </div>

      <div id="body">
        <div id="userConfig">
          <h2>Let owlly take over your chores!</h2>
          {/* form submission */}
          <form onSubmit={async (e) => handleSubmit(e)}>
            <fieldset>
              <legend>Owlly</legend>
              <input
                type="text"
                name="trigger"
                id="trigger"
                placeholder="trigger name here"
                required={true}
                onChange={(e) => {
                  handleTriggerName(e);
                }}
              />
            </fieldset>
            <fieldset>
              <legend>Slack</legend>
              <input
                type="text"
                name="token"
                id="token"
                placeholder="slack token here"
                required={true}
                onChange={(e) => {
                  handleSlackBotOauthToken(e);
                }}
              />
              <input
                type="text"
                name="channelId"
                id="channelId"
                placeholder="channel id here"
                required={true}
                onChange={(e) => {
                  handleSlackChannelID(e);
                }}
              />
              <input
                type="text"
                name="userId"
                id="userId"
                placeholder="user id here"
                required={true}
                onChange={(e) => {
                  handleSlackUserID(e);
                }}
              />
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username here"
                required={true}
                onChange={(e) => {
                  handleSlackUserName(e);
                }}
              />
            </fieldset>
            <ToastNotification />
          </form>
        </div>

        <div id="welcomePanel">
          <h2>Welcome to owlly :)</h2>
          <p>Let your teammate know .env changes instantly with Owlly.</p>
        </div>
      </div>

      <ul id="footer">
        <li
          onMouseOver={() => useHover('github')}
          onMouseLeave={() => setGithubModal('')}
        >
          Github
          <span className="footerModal">{githubModal}</span>
        </li>
        <li
          onMouseOver={() => useHover('linkedin')}
          onMouseLeave={() => setLinkedinModal('')}
        >
          Linkedin
          <span className="footerModal">{linkedinModal}</span>
        </li>
        <li
          onMouseOver={() => useHover('gmail')}
          onMouseLeave={() => setGmailModal('')}
        >
          Gmail
          <span className="footerModal">{gmailModal}</span>
        </li>
      </ul>
    </div>
  );
}

export default EnvNotifier;
