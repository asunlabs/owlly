import { useMediaQuery } from '@mui/material';
import { MUI_BREAKPOINTS } from '@owlly/context/constants';
import * as React from 'react';
import { useTheme } from 'styled-components';
import { v4 } from 'uuid';
import { WrapperFooter } from './Wrapper';

interface IFooterSectionProps {
  title: string;
  items: string[];
}

function FooterSection({ title, items }: IFooterSectionProps) {
  return (
    <div className="footerSection">
      <span>{title}</span>
      <ul>
        {items.map((item) => {
          return <li key={v4()}>{item}</li>;
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <WrapperFooter>
      <FooterSection title="AsunLabs" items={['pawcon-monorepo', 'learn-blockchain', 'courses', 'my-assets']} />
      <FooterSection
        title="Contact"
        items={['Gmail nellow1102@gmail.com', 'Phone +82.010.2985.2984', 'Linkedin @jakesung']}
      />
      <FooterSection title="Copyright ©" items={['2023 DEVELOPERASUN All rights reserved']} />
    </WrapperFooter>
  );
}
