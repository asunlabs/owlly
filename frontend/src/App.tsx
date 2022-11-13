import { FormEventHandler, useState } from "react";
import banner from "./assets/images/banner.png";
import "./App.css";
import owllyConfig from "../../owlly.json";

// TODO add dynamic input value for owlly config
function App() {
  // @dev footer modal local state
  const [githubModal, setGithubModal] = useState("");
  const [linkedinModal, setLinkedinModal] = useState("");
  const [gmailModal, setGmailModal] = useState("");

  // @dev owlly config local state
  const [triggerName, setTriggerName] = useState(owllyConfig.triggerName);

  function handleTriggerName(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.value;
    setTriggerName(e.target.value);
  }

  function useHover(_info: string) {
    const info = _info.toLowerCase();

    let modalText = {
      github: "",
      linkedin: "",
      gmail: "",
      default: "",
    };

    switch (info) {
      case "github":
        modalText.github = "https://github.com/asunlabs/owlly";
        setGithubModal(modalText.github);
        break;
      case "linkedin":
        modalText.linkedin = "https://www.linkedin.com/in/jakesung";
        setLinkedinModal(modalText.linkedin);
        break;
      case "gmail":
        modalText.gmail = "nellow1102@gmail.com";
        setGmailModal(modalText.gmail);
        break;
      default:
        break;
    }
  }
  return (
    <div id="app">
      <div id="owlly">
        <img src={banner} alt="banner" id="frontBanner" />
      </div>
      <div id="body">
        <div id="userConfig">
          <h2>Let owlly take over your chores!</h2>
          <form>
            <fieldset>
              <legend>Owlly</legend>
              <input
                type="text"
                name="trigger"
                id="trigger"
                placeholder="trigger name here"
                value={triggerName}
                onChange={(e) => handleTriggerName(e)}
              />
            </fieldset>

            <fieldset>
              <legend>Slack</legend>
              <input
                type="text"
                name="token"
                id="token"
                placeholder="oauth token here"
                value={owllyConfig.slackBotOauthToken}
              />
              <input
                type="text"
                name="channelId"
                id="channelId"
                placeholder="channel id here"
                value={owllyConfig.slackChannelID}
              />
              <input
                type="text"
                name="userId"
                id="userId"
                placeholder="user id here"
                value={owllyConfig.slackUserID}
              />
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username here"
                value={owllyConfig.slackUserName}
              />
            </fieldset>
            <input type="submit" id="sendDMButton" value="Send DM" />
          </form>
        </div>
        <div id="welcomePanel">
          <h2>Welcome to owlly :)</h2>
          <p>Let your teammate know .env changes instantly with Owlly.</p>
        </div>
      </div>

      <ul id="footer">
        <li
          onMouseOver={() => useHover("github")}
          onMouseLeave={() => setGithubModal("")}
        >
          Github
          <span className="footerModal">{githubModal}</span>
        </li>
        <li
          onMouseOver={() => useHover("linkedin")}
          onMouseLeave={() => setLinkedinModal("")}
        >
          Linkedin
          <span className="footerModal">{linkedinModal}</span>
        </li>
        <li
          onMouseOver={() => useHover("gmail")}
          onMouseLeave={() => setGmailModal("")}
        >
          Gmail
          <span className="footerModal">{gmailModal}</span>
        </li>
      </ul>
    </div>
  );
}

export default App;
