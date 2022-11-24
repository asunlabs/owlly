import { useState } from 'react';

export default function useHover(_info: string) {
  const info = _info.toLowerCase();

  const [githubModal, setGithubModal] = useState('');
  const [linkedinModal, setLinkedinModal] = useState('');
  const [gmailModal, setGmailModal] = useState('');

  let modalText = {
    github: '',
    linkedin: '',
    gmail: '',
    default: '',
  };

  switch (info) {
    case 'github':
      modalText.github = 'https://github.com/asunlabs/owlly';
      setGithubModal(modalText.github);
      break;
    case 'linkedin':
      modalText.linkedin = 'https://www.linkedin.com/in/jakesung';
      setLinkedinModal(modalText.linkedin);
      break;
    case 'gmail':
      modalText.gmail = 'nellow1102@gmail.com';
      setGmailModal(modalText.gmail);
      break;
    default:
      break;
  }
}
