import HCaptcha from '@hcaptcha/react-hcaptcha';
import { RefObject } from 'react';

const Captcha = ({ captchaRef, onSetCaptchaToken }: {
    captchaRef: RefObject<HCaptcha | null>,
    onSetCaptchaToken: (token: string) => void;
}) => {
    return (
        <HCaptcha
            ref={captchaRef}
            sitekey="0ede362a-45b2-4c54-90c8-889c7edafdc4"
            onVerify={(token) => {
                onSetCaptchaToken(token);
            }}
        />
    )
}

export default Captcha;