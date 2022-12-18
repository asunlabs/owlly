export default function useHover(_info: string, callback: React.Dispatch<React.SetStateAction<string>>) {
  const info = _info.toLowerCase();

  let modalText = {
    github: '',
    linkedin: '',
    gmail: '',
    default: '',
  };

  switch (info) {
    case 'github':
      modalText.github = 'https://github.com/asunlabs/owlly';
      callback(modalText.github);
      break;
    case 'linkedin':
      modalText.linkedin = 'https://www.linkedin.com/in/jakesung';
      callback(modalText.linkedin);
      break;
    case 'gmail':
      modalText.gmail = 'nellow1102@gmail.com';
      callback(modalText.gmail);
      break;
    default:
      break;
  }
}
