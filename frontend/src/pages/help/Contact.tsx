import { useState } from 'react';
import useHover from '@owlly/hooks/useHover';

export interface IContactProps {}

export function Contact(props: IContactProps) {
  // @dev footer modal local state

  const [githubModal, setGithubModal] = useState('');
  const [linkedinModal, setLinkedinModal] = useState('');
  const [gmailModal, setGmailModal] = useState('');
  return (
    <div>
      Contact
      <ul>
        <li onMouseOver={() => useHover('github', setGithubModal)} onMouseLeave={() => setGithubModal('')}>
          Github
          <span className="footerModal">{githubModal}</span>
        </li>
        <li onMouseOver={() => useHover('linkedin', setLinkedinModal)} onMouseLeave={() => setLinkedinModal('')}>
          Linkedin
          <span className="footerModal">{linkedinModal}</span>
        </li>
        <li onMouseOver={() => useHover('gmail', setGmailModal)} onMouseLeave={() => setGmailModal('')}>
          Gmail
          <span className="footerModal">{gmailModal}</span>
        </li>
      </ul>
    </div>
  );
}
