import devPromo from '@owlly/assets/video/dev.promo.v0.3.0.mp4';
import { ActionAreaCard } from '@owlly/components/Card';
import styled from 'styled-components';
import { breakpoints } from '../../context/constants';

export const WrapperActionAreaCard = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  @media screen and (min-width: ${breakpoints.device.tablet}) {
    flex-flow: row;
  }
`;

export function Contact() {
  return (
    <div id="contact" style={{ padding: '2rem' }}>
      <video width="80%" controls>
        <source src={devPromo} type="video/mp4" />
      </video>
      <WrapperActionAreaCard>
        <ActionAreaCard
          title="Linkedin"
          description="Check my job experience and follow insightful articles"
          src="https://user-images.githubusercontent.com/83855174/215321562-f4ea3788-408a-426f-9ddc-3e88f7e451f3.png"
        />
        <ActionAreaCard
          title="ENS"
          description="Check my Ethereum transactions if you are interested in blockchain/dapp"
          src="https://user-images.githubusercontent.com/83855174/215321609-5b45e414-ca9f-4215-a9ee-df12f500a1a9.png"
        />
        <ActionAreaCard
          title="Slack"
          description="Reach out to me on Slack if you have any inquiries"
          src="https://user-images.githubusercontent.com/83855174/216966708-9f5dd08c-80cd-48e0-9e38-3a2206d3b1fc.png"
        />
      </WrapperActionAreaCard>
    </div>
  );
}
